#!/bin/bash

# 🔄 USAGE MONITORING & AUTO-RESTART SYSTEM
# Monitors Claude usage limits and handles automatic restart at reset times

set -euo pipefail

PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
LOG_DIR="$PROJECT_ROOT/logs"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Configuration
USAGE_THRESHOLD=90  # Percentage threshold to trigger backup
RESET_CYCLE_HOURS=5  # Claude usage resets every 5 hours
BACKUP_INTERVAL=300  # 5 minutes between backups when approaching limit
CHECK_INTERVAL=60   # 1 minute between usage checks
RESET_DETECTION_FILE="$MEMORY_DIR/last-reset-time.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_monitor() {
    echo -e "${BLUE}[MONITOR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_critical() {
    echo -e "${RED}[CRITICAL]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to get last known reset time
get_last_reset_time() {
    if [ -f "$RESET_DETECTION_FILE" ]; then
        cat "$RESET_DETECTION_FILE"
    else
        # Default to current time minus reset cycle if no record exists
        date -v-${RESET_CYCLE_HOURS}H '+%s'
    fi
}

# Function to set last reset time
set_last_reset_time() {
    local reset_time=$1
    echo "$reset_time" > "$RESET_DETECTION_FILE"
    log_monitor "Last reset time updated: $(date -r "$reset_time" '+%Y-%m-%d %H:%M:%S')"
}

# Function to calculate next reset time
get_next_reset_time() {
    local last_reset=$(get_last_reset_time)
    local next_reset=$(( last_reset + (RESET_CYCLE_HOURS * 3600) ))
    echo $next_reset
}

# Function to detect if a reset has occurred
detect_usage_reset() {
    local current_time=$(date '+%s')
    local next_expected_reset=$(get_next_reset_time)
    
    # Check if we've passed the expected reset time
    if [ $current_time -ge $next_expected_reset ]; then
        # Round to nearest 5-hour boundary for more accurate reset detection
        local hours_since_epoch=$(( current_time / 3600 ))
        local reset_boundary=$(( (hours_since_epoch / RESET_CYCLE_HOURS) * RESET_CYCLE_HOURS * 3600 ))
        
        # Update last reset time to the detected boundary
        set_last_reset_time $reset_boundary
        return 0  # Reset detected
    fi
    
    return 1  # No reset
}

# Function to get current usage percentage
get_usage_percentage() {
    local current_time=$(date '+%s')
    local last_reset=$(get_last_reset_time)
    local time_since_reset=$(( current_time - last_reset ))
    local reset_cycle_seconds=$(( RESET_CYCLE_HOURS * 3600 ))
    
    # Calculate usage percentage based on time since last reset
    local usage_percentage=$(( (time_since_reset * 100) / reset_cycle_seconds ))
    
    # Cap at 100%
    if [ $usage_percentage -gt 100 ]; then
        usage_percentage=100
    fi
    
    # Ensure non-negative
    if [ $usage_percentage -lt 0 ]; then
        usage_percentage=0
    fi
    
    echo $usage_percentage
}

# Function to get time until next reset
get_time_until_reset() {
    local current_time=$(date '+%s')
    local next_reset=$(get_next_reset_time)
    local seconds_until_reset=$(( next_reset - current_time ))
    
    if [ $seconds_until_reset -lt 0 ]; then
        echo "0"
    else
        echo $seconds_until_reset
    fi
}

# Function to save current context and agent states
save_context() {
    log_monitor "Saving context and agent states..."
    
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local snapshot_dir="$MEMORY_DIR/context-snapshots/$(date +%Y-%m-%d-%H-%M)"
    
    mkdir -p "$snapshot_dir"
    
    # Save shared context
    if [ -f "$MEMORY_DIR/shared-context.json" ]; then
        cp "$MEMORY_DIR/shared-context.json" "$snapshot_dir/"
    fi
    
    # Save agent states
    if [ -d "$MEMORY_DIR/agent-states" ]; then
        cp -r "$MEMORY_DIR/agent-states" "$snapshot_dir/"
    fi
    
    # Save task queues
    if [ -d "$MEMORY_DIR/task-queues" ]; then
        cp -r "$MEMORY_DIR/task-queues" "$snapshot_dir/"
    fi
    
    # Create context backup metadata
    cat > "$snapshot_dir/backup-metadata.json" << EOF
{
  "timestamp": "$timestamp",
  "reason": "usage_limit_approaching",
  "usagePercentage": $(get_usage_percentage),
  "nextResetTime": "$(date -d 'tomorrow 15:30' '+%Y-%m-%d %H:%M:%S')",
  "activeAgents": ["master-orchestrator", "ui-ux-agent", "backend-agent", "qa-agent", "devops-agent"],
  "backupComplete": true
}
EOF

    # Update shared context with backup info
    if [ -f "$MEMORY_DIR/shared-context.json" ]; then
        local temp_file=$(mktemp)
        jq --arg timestamp "$timestamp" --arg snapshot "$snapshot_dir" \
           '.lastBackup = $timestamp | .lastBackupLocation = $snapshot' \
           "$MEMORY_DIR/shared-context.json" > "$temp_file"
        mv "$temp_file" "$MEMORY_DIR/shared-context.json"
    fi
    
    log_success "Context saved to $snapshot_dir"
}

# Function to check if it's time for reset (now checks for dynamic reset cycles)
is_reset_time() {
    detect_usage_reset
}

# Function to schedule restart at next reset time
schedule_restart() {
    local next_reset=$(get_next_reset_time)
    local next_reset_human=$(date -r "$next_reset" '+%Y-%m-%d %H:%M:%S')
    
    log_monitor "Scheduling restart at next reset: $next_reset_human"
    
    # Create restart flag with dynamic timing
    cat > "$SCRIPTS_DIR/pending-restart.flag" << EOF
{
  "scheduledTime": "$next_reset",
  "scheduledTimeHuman": "$next_reset_human",
  "reason": "usage_reset_5hour_cycle",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "restoreFromBackup": true,
  "lastBackupLocation": "$(ls -1t $MEMORY_DIR/context-snapshots/ 2>/dev/null | head -1 || echo 'none')",
  "resetCycleHours": $RESET_CYCLE_HOURS
}
EOF

    log_success "Restart scheduled for $next_reset_human ($(get_time_until_reset) seconds)"
}

# Function to restore context from backup
restore_context() {
    local backup_location=$1
    
    log_monitor "Restoring context from backup: $backup_location"
    
    if [ ! -d "$backup_location" ]; then
        log_critical "Backup location not found: $backup_location"
        return 1
    fi
    
    # Restore shared context
    if [ -f "$backup_location/shared-context.json" ]; then
        cp "$backup_location/shared-context.json" "$MEMORY_DIR/"
    fi
    
    # Restore agent states
    if [ -d "$backup_location/agent-states" ]; then
        cp -r "$backup_location/agent-states" "$MEMORY_DIR/"
    fi
    
    # Restore task queues
    if [ -d "$backup_location/task-queues" ]; then
        cp -r "$backup_location/task-queues" "$MEMORY_DIR/"
    fi
    
    # Update restore timestamp
    if [ -f "$MEMORY_DIR/shared-context.json" ]; then
        local temp_file=$(mktemp)
        local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
        jq --arg timestamp "$timestamp" \
           '.lastRestore = $timestamp | .systemStatus = "restored"' \
           "$MEMORY_DIR/shared-context.json" > "$temp_file"
        mv "$temp_file" "$MEMORY_DIR/shared-context.json"
    fi
    
    log_success "Context restored successfully"
}

# Function to handle automatic restart
handle_auto_restart() {
    log_monitor "Handling automatic restart at usage reset..."
    
    # Check if restart is pending
    if [ ! -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
        return 0
    fi
    
    # Read restart info
    local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
    local backup_location=$(echo "$restart_info" | jq -r '.lastBackupLocation')
    
    if [ "$backup_location" != "null" ] && [ "$backup_location" != "" ]; then
        backup_location="$MEMORY_DIR/context-snapshots/$backup_location"
        restore_context "$backup_location"
    fi
    
    # Restart agent coordination
    log_monitor "Restarting agent coordination..."
    
    # Update agent states to active
    local agents=("master-orchestrator" "ui-ux-agent" "backend-agent" "qa-agent" "devops-agent")
    for agent in "${agents[@]}"; do
        if [ -f "$MEMORY_DIR/agent-states/$agent.json" ]; then
            local temp_file=$(mktemp)
            local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
            jq --arg timestamp "$timestamp" \
               '.status = "active" | .lastActive = $timestamp | .restartedAt = $timestamp' \
               "$MEMORY_DIR/agent-states/$agent.json" > "$temp_file"
            mv "$temp_file" "$MEMORY_DIR/agent-states/$agent.json"
        fi
    done
    
    # Remove restart flag
    rm -f "$SCRIPTS_DIR/pending-restart.flag"
    
    log_success "Automatic restart completed successfully"
}

# Main monitoring loop
main_monitor_loop() {
    log_monitor "Starting usage monitoring system..."
    log_monitor "Usage threshold: $USAGE_THRESHOLD%"
    log_monitor "Reset cycle: Every $RESET_CYCLE_HOURS hours"
    log_monitor "Check interval: $CHECK_INTERVAL seconds"
    
    # Initialize last reset time if not exists
    if [ ! -f "$RESET_DETECTION_FILE" ]; then
        local current_time=$(date '+%s')
        set_last_reset_time $current_time
        log_monitor "Initialized reset tracking from current time"
    fi
    
    while true; do
        local current_usage=$(get_usage_percentage)
        local time_until_reset=$(get_time_until_reset)
        local next_reset_human=$(date -r "$(get_next_reset_time)" '+%H:%M:%S')
        
        # Check if it's reset time and handle restart
        if is_reset_time; then
            log_success "Usage reset detected! Initiating automatic restart..."
            handle_auto_restart
        fi
        
        # Monitor usage and take action
        if [ $current_usage -ge $USAGE_THRESHOLD ]; then
            log_warning "Usage at $current_usage% - threshold reached! Next reset: $next_reset_human"
            
            # Save context more frequently
            save_context
            
            # Schedule restart if not already scheduled
            if [ ! -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
                schedule_restart
            fi
            
            # Shorter check interval when approaching limit
            sleep $BACKUP_INTERVAL
        else
            log_monitor "Usage: $current_usage% | Next reset: $next_reset_human (in ${time_until_reset}s)"
            sleep $CHECK_INTERVAL
        fi
    done
}

# Function to start monitoring in background
start_monitor() {
    log_monitor "Starting usage monitor in background..."
    
    # Ensure log directory exists
    mkdir -p "$LOG_DIR"
    
    # Start main loop and redirect output to log file
    main_monitor_loop >> "$LOG_DIR/usage-monitor.log" 2>&1 &
    
    local monitor_pid=$!
    echo $monitor_pid > "$LOG_DIR/usage-monitor.pid"
    
    log_success "Usage monitor started (PID: $monitor_pid)"
}

# Function to stop monitoring
stop_monitor() {
    if [ -f "$LOG_DIR/usage-monitor.pid" ]; then
        local pid=$(cat "$LOG_DIR/usage-monitor.pid")
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            log_success "Usage monitor stopped (PID: $pid)"
        else
            log_warning "Usage monitor process not running"
        fi
        rm -f "$LOG_DIR/usage-monitor.pid"
    else
        log_warning "No usage monitor PID file found"
    fi
}

# Function to check monitor status
check_status() {
    if [ -f "$LOG_DIR/usage-monitor.pid" ]; then
        local pid=$(cat "$LOG_DIR/usage-monitor.pid")
        if kill -0 $pid 2>/dev/null; then
            log_success "Usage monitor is running (PID: $pid)"
            local current_usage=$(get_usage_percentage)
            local time_until_reset=$(get_time_until_reset)
            local next_reset_time=$(get_next_reset_time)
            local next_reset_human=$(date -r "$next_reset_time" '+%Y-%m-%d %H:%M:%S')
            local last_reset_human=$(date -r "$(get_last_reset_time)" '+%Y-%m-%d %H:%M:%S')
            
            echo ""
            echo "📊 USAGE MONITORING STATUS:"
            echo "   Current usage: $current_usage%"
            echo "   Reset cycle: Every $RESET_CYCLE_HOURS hours"
            echo "   Last reset: $last_reset_human"
            echo "   Next reset: $next_reset_human"
            echo "   Time until reset: ${time_until_reset} seconds"
            echo ""
            
            if [ -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
                local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
                local scheduled_time=$(echo "$restart_info" | jq -r '.scheduledTimeHuman')
                echo "🔄 Restart scheduled: YES (at $scheduled_time)"
            else
                echo "🔄 Restart scheduled: NO"
            fi
        else
            log_warning "Usage monitor PID file exists but process not running"
        fi
    else
        log_warning "Usage monitor is not running"
    fi
}

# Script execution based on arguments
case "${1:-}" in
    "start")
        start_monitor
        ;;
    "stop")
        stop_monitor
        ;;
    "status")
        check_status
        ;;
    "restart")
        stop_monitor
        sleep 2
        start_monitor
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        echo ""
        echo "Commands:"
        echo "  start   - Start usage monitoring in background"
        echo "  stop    - Stop usage monitoring"  
        echo "  status  - Check monitor status and current usage"
        echo "  restart - Restart usage monitoring"
        exit 1
        ;;
esac