#!/bin/bash

# Installation Monitor Script
# This script monitors long-running installations and provides feedback
# Used to prevent silent failures and hanging installations

MONITOR_LOG="monitor.log"
SETUP_LOG="setup.log"
MAX_SILENCE_TIME=120  # 2 minutes of no output before considering it hung
CHECK_INTERVAL=10     # Check every 10 seconds

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_monitor() {
    echo -e "${PURPLE}[MONITOR]${NC} $1" | tee -a "$MONITOR_LOG"
}

print_alert() {
    echo -e "${YELLOW}[ALERT]${NC} $1" | tee -a "$MONITOR_LOG"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$MONITOR_LOG"
}

# Function to monitor a process and its log output
monitor_process() {
    local pid=$1
    local process_name=$2
    local log_file=${3:-"$SETUP_LOG"}
    
    print_monitor "Starting monitoring for $process_name (PID: $pid)"
    echo "$(date): Monitoring started for $process_name" >> "$MONITOR_LOG"
    
    local last_log_time=$(date +%s)
    local last_log_size=0
    local warning_count=0
    
    while kill -0 $pid 2>/dev/null; do
        sleep $CHECK_INTERVAL
        
        # Check if log file exists and has new content
        if [ -f "$log_file" ]; then
            local current_log_size=$(wc -c < "$log_file" 2>/dev/null || echo "0")
            local current_time=$(date +%s)
            
            if [ "$current_log_size" -gt "$last_log_size" ]; then
                # Log file has grown, reset timer
                last_log_time=$current_time
                last_log_size=$current_log_size
                warning_count=0
                print_monitor "$process_name is active (log size: ${current_log_size} bytes)"
                
                # Show last few lines of log
                echo "Recent activity:"
                tail -3 "$log_file" 2>/dev/null | sed 's/^/  | /' || echo "  | No recent log entries"
            else
                # No new log content
                local silence_time=$((current_time - last_log_time))
                
                if [ $silence_time -gt $MAX_SILENCE_TIME ]; then
                    ((warning_count++))
                    print_alert "$process_name has been silent for ${silence_time}s (warning #${warning_count})"
                    
                    if [ $warning_count -ge 3 ]; then
                        print_error "$process_name appears to be hung - terminating"
                        kill -TERM $pid 2>/dev/null || true
                        sleep 5
                        kill -KILL $pid 2>/dev/null || true
                        echo "$(date): Process $pid terminated due to inactivity" >> "$MONITOR_LOG"
                        return 1
                    fi
                else
                    print_monitor "$process_name running (silent for ${silence_time}s)"
                fi
            fi
        else
            print_monitor "$process_name running (no log file yet)"
        fi
    done
    
    # Process has finished
    wait $pid 2>/dev/null
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        print_monitor "$process_name completed successfully"
    else
        print_error "$process_name failed with exit code $exit_code"
    fi
    
    echo "$(date): Monitoring ended for $process_name (exit code: $exit_code)" >> "$MONITOR_LOG"
    return $exit_code
}

# Function to run a command with monitoring
run_monitored() {
    local command="$1"
    local process_name="$2"
    local log_file="${3:-$SETUP_LOG}"
    
    print_monitor "Running monitored command: $command"
    
    # Start the command in background
    eval "$command" >> "$log_file" 2>&1 &
    local cmd_pid=$!
    
    # Monitor the process
    monitor_process $cmd_pid "$process_name" "$log_file"
    return $?
}

# Function to show real-time log tail
show_live_log() {
    local log_file="${1:-$SETUP_LOG}"
    
    if [ -f "$log_file" ]; then
        print_monitor "Showing live log output (Ctrl+C to stop):"
        tail -f "$log_file"
    else
        print_monitor "Log file $log_file not found"
    fi
}

# Main function for interactive monitoring
main() {
    echo "=== Installation Monitor ===" > "$MONITOR_LOG"
    echo "Start time: $(date)" >> "$MONITOR_LOG"
    
    case "${1:-monitor}" in
        "monitor")
            if [ -z "$2" ]; then
                echo "Usage: $0 monitor <PID> [process_name] [log_file]"
                exit 1
            fi
            monitor_process "$2" "${3:-Unknown Process}" "${4:-$SETUP_LOG}"
            ;;
        "run")
            if [ -z "$2" ]; then
                echo "Usage: $0 run <command> [process_name] [log_file]"
                exit 1
            fi
            run_monitored "$2" "${3:-Command}" "${4:-$SETUP_LOG}"
            ;;
        "tail")
            show_live_log "${2:-$SETUP_LOG}"
            ;;
        "help")
            echo "Installation Monitor - Commands:"
            echo "  monitor <PID> [name] [log]  - Monitor existing process"
            echo "  run <cmd> [name] [log]      - Run and monitor command"
            echo "  tail [log_file]             - Show live log output"
            echo "  help                        - Show this help"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
