#!/bin/bash

# 🤖 SIMPLE CLAUDE RESET MONITOR
# Usage: ./simple-reset-monitor.sh "2:30pm" "Asia/Calcutta"

PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
LOG_DIR="$PROJECT_ROOT/logs"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Simple function to convert time to Unix timestamp
convert_to_timestamp() {
    local time_str="$1"    # e.g., "2:30pm"
    local timezone="$2"    # e.g., "Asia/Calcutta"
    
    # Extract hour and minute
    local hour=$(echo "$time_str" | sed 's/[ap]m//' | cut -d':' -f1)
    local minute=$(echo "$time_str" | sed 's/[ap]m//' | cut -d':' -f2)
    local ampm=$(echo "$time_str" | grep -o '[ap]m')
    
    # Convert to 24-hour format
    if [ "$ampm" = "pm" ] && [ "$hour" -ne 12 ]; then
        hour=$((hour + 12))
    elif [ "$ampm" = "am" ] && [ "$hour" -eq 12 ]; then
        hour=0
    fi
    
    # Format hour and minute with leading zeros
    hour=$(printf "%02d" $hour)
    minute=$(printf "%02d" $minute)
    
    # Get today's date
    local today=$(date '+%Y-%m-%d')
    local reset_datetime="$today $hour:$minute:00"
    
    log_info "Converting: $time_str -> $reset_datetime in $timezone"
    
    # Try to get timestamp for today
    local reset_timestamp
    if command -v gdate > /dev/null 2>&1; then
        # Use GNU date if available (via brew install coreutils)
        reset_timestamp=$(TZ="$timezone" gdate -d "$reset_datetime" '+%s' 2>/dev/null)
    else
        # Fallback to system date (less reliable with timezones)
        reset_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "$reset_datetime" '+%s' 2>/dev/null)
    fi
    
    # If parsing failed or time is in the past, try tomorrow
    local current_timestamp=$(date '+%s')
    if [ -z "$reset_timestamp" ] || [ "$reset_timestamp" -le "$current_timestamp" ]; then
        local tomorrow=$(date -v+1d '+%Y-%m-%d')
        reset_datetime="$tomorrow $hour:$minute:00"
        
        log_info "Time is in past, trying tomorrow: $reset_datetime"
        
        if command -v gdate > /dev/null 2>&1; then
            reset_timestamp=$(TZ="$timezone" gdate -d "$reset_datetime" '+%s' 2>/dev/null)
        else
            reset_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "$reset_datetime" '+%s' 2>/dev/null)
        fi
    fi
    
    if [ -n "$reset_timestamp" ] && [ "$reset_timestamp" -gt 0 ]; then
        echo "$reset_timestamp"
        return 0
    else
        log_error "Failed to parse timestamp for: $reset_datetime"
        return 1
    fi
}

# Save context before reset
save_context() {
    log_info "Saving context before reset..."
    
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local snapshot_dir="$MEMORY_DIR/context-snapshots/pre-reset-$(date +%Y-%m-%d-%H-%M)"
    
    mkdir -p "$snapshot_dir"
    
    # Save all important files
    [ -f "$MEMORY_DIR/shared-context.json" ] && cp "$MEMORY_DIR/shared-context.json" "$snapshot_dir/"
    [ -d "$MEMORY_DIR/agent-states" ] && cp -r "$MEMORY_DIR/agent-states" "$snapshot_dir/"
    [ -d "$MEMORY_DIR/task-queues" ] && cp -r "$MEMORY_DIR/task-queues" "$snapshot_dir/"
    [ -f "$PROJECT_ROOT/CURRENT_PRODUCTION_STATUS.md" ] && cp "$PROJECT_ROOT/CURRENT_PRODUCTION_STATUS.md" "$snapshot_dir/"
    
    cat > "$snapshot_dir/backup-metadata.json" << EOF
{
  "timestamp": "$timestamp",
  "reason": "claude_usage_reset_scheduled",
  "backupComplete": true
}
EOF

    log_success "Context saved to $snapshot_dir"
    echo "$snapshot_dir"
}

# Schedule restart
schedule_restart() {
    local reset_timestamp="$1"
    local reset_human=$(date -r "$reset_timestamp" '+%Y-%m-%d %H:%M:%S')
    
    log_info "Scheduling restart at: $reset_human"
    
    # Save context first
    local backup_dir=$(save_context)
    local backup_name=$(basename "$backup_dir")
    
    # Create restart flag
    cat > "$SCRIPTS_DIR/pending-restart.flag" << EOF
{
  "scheduledTime": "$reset_timestamp",
  "scheduledTimeHuman": "$reset_human",
  "reason": "claude_usage_reset_manual",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "restoreFromBackup": true,
  "lastBackupLocation": "$backup_name"
}
EOF

    # Schedule the actual restart using at command (if available)
    if command -v at > /dev/null 2>&1; then
        local restart_script="$SCRIPTS_DIR/execute-restart.sh"
        cat > "$restart_script" << 'EOF'
#!/bin/bash
PROJECT_ROOT="/Users/gokulnair/Resume Builder"
LOG_DIR="$PROJECT_ROOT/logs"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Automatic restart triggered by scheduled reset" >> "$LOG_DIR/auto-restart.log"
# Add your agent restart logic here
EOF
        chmod +x "$restart_script"
        
        # Schedule using at
        echo "$restart_script" | at "$(date -r "$reset_timestamp" '+%H:%M %m/%d/%Y')" 2>/dev/null || log_error "Failed to schedule with 'at' command"
    fi
    
    log_success "Restart scheduled successfully"
}

# Check if it's time to restart
check_and_restart() {
    if [ ! -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
        return 0
    fi
    
    local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
    local scheduled_time=$(echo "$restart_info" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('scheduledTime', '0'))")
    local current_time=$(date '+%s')
    
    if [ "$current_time" -ge "$scheduled_time" ]; then
        log_success "Reset time reached! Executing restart..."
        
        # Your restart logic here
        log_info "Restarting agent systems..."
        
        # Remove the flag
        rm -f "$SCRIPTS_DIR/pending-restart.flag"
        
        log_success "Restart completed"
        return 0
    fi
    
    return 1
}

# Monitor loop
monitor() {
    log_info "Starting simple reset monitor..."
    
    while true; do
        if check_and_restart; then
            log_info "Continuing monitoring..."
        fi
        
        if [ -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
            local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
            local scheduled_time_human=$(echo "$restart_info" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('scheduledTimeHuman', 'Unknown'))")
            log_info "Next restart scheduled: $scheduled_time_human"
        else
            log_info "No restart scheduled. Waiting for reset command..."
        fi
        
        sleep 30
    done
}

# Main script
case "${1:-}" in
    "schedule")
        if [ -z "${2:-}" ] || [ -z "${3:-}" ]; then
            echo "Usage: $0 schedule <time> <timezone>"
            echo "Example: $0 schedule \"2:30pm\" \"Asia/Calcutta\""
            exit 1
        fi
        
        reset_timestamp=$(convert_to_timestamp "$2" "$3")
        if [ $? -eq 0 ]; then
            schedule_restart "$reset_timestamp"
        else
            log_error "Failed to parse time: $2 $3"
            exit 1
        fi
        ;;
    "monitor")
        monitor
        ;;
    "check")
        check_and_restart
        ;;
    "status")
        if [ -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
            echo "Restart scheduled:"
            cat "$SCRIPTS_DIR/pending-restart.flag" | python3 -m json.tool
        else
            echo "No restart scheduled"
        fi
        ;;
    *)
        echo "🤖 SIMPLE CLAUDE RESET MONITOR"
        echo ""
        echo "Usage: $0 {schedule|monitor|check|status}"
        echo ""
        echo "Commands:"
        echo "  schedule <time> <tz>  - Schedule restart (e.g., \"2:30pm\" \"Asia/Calcutta\")"
        echo "  monitor               - Start monitoring loop"
        echo "  check                 - Check if restart time reached"
        echo "  status                - Show scheduled restart info"
        echo ""
        echo "Example workflow:"
        echo "  1. $0 schedule \"2:30pm\" \"Asia/Calcutta\""
        echo "  2. $0 monitor &"
        exit 1
        ;;
esac