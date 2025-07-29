#!/bin/bash

# 🤖 CLAUDE USAGE RESET DETECTION & AUTO-RESTART SYSTEM
# Monitors Claude conversation logs for usage limit messages and schedules restart accordingly

set -euo pipefail

PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
LOG_DIR="$PROJECT_ROOT/logs"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Configuration
BACKUP_INTERVAL=300  # 5 minutes between backups when approaching limit
CHECK_INTERVAL=30    # 30 seconds between checks for reset messages
RESET_DETECTION_FILE="$MEMORY_DIR/next-reset-time.txt"
USAGE_LOG_FILE="$LOG_DIR/claude-usage.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_monitor() {
    local message="$1"
    echo -e "${BLUE}[RESET-MONITOR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $message"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESET-MONITOR] $message" >> "$USAGE_LOG_FILE"
}

log_warning() {
    local message="$1"
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $message"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [WARNING] $message" >> "$USAGE_LOG_FILE"
}

log_critical() {
    local message="$1"
    echo -e "${RED}[CRITICAL]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $message"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [CRITICAL] $message" >> "$USAGE_LOG_FILE"
}

log_success() {
    local message="$1"
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $message"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [SUCCESS] $message" >> "$USAGE_LOG_FILE"
}

# Function to parse Claude's reset time message
parse_claude_reset_message() {
    local message="$1"
    
    # Pattern: "Your limit will reset at 2:30pm (Asia/Calcutta)"
    if echo "$message" | grep -q "reset at"; then
        # Extract time and timezone - more flexible regex
        local reset_info=$(echo "$message" | sed -n 's/.*reset at \([0-9]*:[0-9]*[ap]m\) (\([^)]*\)).*/\1 \2/p')
        
        if [ -n "$reset_info" ]; then
            local time_part=$(echo "$reset_info" | cut -d' ' -f1)
            local timezone=$(echo "$reset_info" | cut -d' ' -f2-)
            
            # Convert to 24-hour format and get Unix timestamp
            local reset_timestamp=$(parse_claude_time "$time_part" "$timezone")
            echo "$reset_timestamp"
            return 0
        fi
    fi
    
    return 1
}

# Function to convert Claude's time format to Unix timestamp
parse_claude_time() {
    local time_str="$1"    # e.g., "2:30pm"
    local timezone="$2"    # e.g., "Asia/Calcutta"
    
    # Convert 12-hour to 24-hour format
    local hour=$(echo "$time_str" | sed 's/[ap]m//' | cut -d':' -f1)
    local minute=$(echo "$time_str" | sed 's/[ap]m//' | cut -d':' -f2)
    local ampm=$(echo "$time_str" | grep -o '[ap]m')
    
    # Adjust hour for AM/PM
    if [ "$ampm" = "pm" ] && [ "$hour" -ne 12 ]; then
        hour=$((hour + 12))
    elif [ "$ampm" = "am" ] && [ "$hour" -eq 12 ]; then
        hour=0
    fi
    
    # Get today's date in the specified timezone
    local today=$(TZ="$timezone" date '+%Y-%m-%d')
    local reset_datetime="$today $hour:$minute:00"
    
    # Convert to Unix timestamp
    local reset_timestamp=$(TZ="$timezone" date -d "$reset_datetime" '+%s' 2>/dev/null || echo "")
    
    # If the time has already passed today, it must be tomorrow
    local current_timestamp=$(date '+%s')
    if [ -n "$reset_timestamp" ] && [ "$reset_timestamp" -le "$current_timestamp" ]; then
        local tomorrow=$(TZ="$timezone" date -d "$today + 1 day" '+%Y-%m-%d')
        reset_datetime="$tomorrow $hour:$minute:00"
        reset_timestamp=$(TZ="$timezone" date -d "$reset_datetime" '+%s' 2>/dev/null || echo "")
    fi
    
    echo "$reset_timestamp"
}

# Function to log Claude usage limit message
log_claude_usage_message() {
    local message="$1"
    
    log_warning "Claude usage limit message detected: $message"
    
    # Try to parse reset time
    local reset_timestamp=$(parse_claude_reset_message "$message")
    
    if [ -n "$reset_timestamp" ] && [ "$reset_timestamp" -gt 0 ]; then
        local reset_human=$(date -r "$reset_timestamp" '+%Y-%m-%d %H:%M:%S')
        log_success "Parsed reset time: $reset_human"
        
        # Save the reset time
        echo "$reset_timestamp" > "$RESET_DETECTION_FILE"
        
        # Schedule restart
        schedule_restart_at_reset "$reset_timestamp"
        
        # Trigger immediate backup
        save_context_for_reset
        
        return 0
    else
        log_critical "Failed to parse reset time from message: $message"
        return 1
    fi
}

# Function to check if Claude usage limit message appears in logs
detect_claude_usage_message() {
    # Check recent conversation logs, system messages, or any output for usage limit messages
    # This is a placeholder - in practice, you'd monitor wherever Claude's messages appear
    
    # Check if we have a stored next reset time
    if [ -f "$RESET_DETECTION_FILE" ]; then
        local stored_reset=$(cat "$RESET_DETECTION_FILE")
        local current_time=$(date '+%s')
        
        # Check if we've reached the reset time
        if [ "$current_time" -ge "$stored_reset" ]; then
            log_success "Reset time reached! Initiating automatic restart..."
            handle_auto_restart
            
            # Clear the reset time file
            rm -f "$RESET_DETECTION_FILE"
            return 0
        fi
    fi
    
    return 1
}

# Function to manually set next reset time (for testing or manual override)
set_next_reset_time() {
    local reset_message="$1"
    
    log_monitor "Manual reset time setting: $reset_message"
    
    if log_claude_usage_message "$reset_message"; then
        log_success "Reset time set successfully"
    else
        log_critical "Failed to set reset time from message"
        return 1
    fi
}

# Function to schedule restart at specific reset time
schedule_restart_at_reset() {
    local reset_timestamp="$1"
    local reset_human=$(date -r "$reset_timestamp" '+%Y-%m-%d %H:%M:%S %Z')
    local current_time=$(date '+%s')
    local seconds_until_reset=$((reset_timestamp - current_time))
    
    log_monitor "Scheduling restart at Claude usage reset: $reset_human"
    log_monitor "Time until reset: $seconds_until_reset seconds ($(($seconds_until_reset / 60)) minutes)"
    
    # Create restart flag with precise timing
    cat > "$SCRIPTS_DIR/pending-restart.flag" << EOF
{
  "scheduledTime": "$reset_timestamp",
  "scheduledTimeHuman": "$reset_human",
  "reason": "claude_usage_reset_detected",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "restoreFromBackup": true,
  "lastBackupLocation": "$(ls -1t $MEMORY_DIR/context-snapshots/ 2>/dev/null | head -1 || echo 'none')",
  "secondsUntilReset": $seconds_until_reset,
  "detectionMethod": "claude_message_parsing"
}
EOF

    log_success "Restart scheduled for $reset_human"
}

# Function to save context when reset is imminent
save_context_for_reset() {
    log_monitor "Saving context before Claude usage reset..."
    
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local snapshot_dir="$MEMORY_DIR/context-snapshots/pre-reset-$(date +%Y-%m-%d-%H-%M)"
    
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
    
    # Save current project status
    if [ -f "$PROJECT_ROOT/CURRENT_PRODUCTION_STATUS.md" ]; then
        cp "$PROJECT_ROOT/CURRENT_PRODUCTION_STATUS.md" "$snapshot_dir/"
    fi
    
    # Create detailed backup metadata
    local next_reset_time=""
    if [ -f "$RESET_DETECTION_FILE" ]; then
        local reset_timestamp=$(cat "$RESET_DETECTION_FILE")
        next_reset_time=$(date -r "$reset_timestamp" '+%Y-%m-%d %H:%M:%S %Z')
    fi
    
    cat > "$snapshot_dir/backup-metadata.json" << EOF
{
  "timestamp": "$timestamp",
  "reason": "claude_usage_reset_imminent",
  "nextResetTime": "$next_reset_time",
  "activeAgents": ["master-orchestrator", "ui-ux-agent", "backend-agent", "qa-agent", "devops-agent"],
  "backupComplete": true,
  "contextPreservation": "full_system_state",
  "triggerEvent": "claude_usage_limit_detected"
}
EOF

    log_success "Pre-reset context saved to $snapshot_dir"
}

# Function to handle automatic restart after reset
handle_auto_restart() {
    log_monitor "Handling automatic restart after Claude usage reset..."
    
    # Check if restart is pending
    if [ ! -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
        log_warning "No pending restart flag found"
        return 0
    fi
    
    # Read restart info
    local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
    local backup_location=$(echo "$restart_info" | jq -r '.lastBackupLocation // empty')
    
    if [ -n "$backup_location" ] && [ "$backup_location" != "null" ]; then
        backup_location="$MEMORY_DIR/context-snapshots/$backup_location"
        restore_context_after_reset "$backup_location"
    fi
    
    # Restart all agent systems
    restart_agent_coordination
    
    # Remove restart flag
    rm -f "$SCRIPTS_DIR/pending-restart.flag"
    
    log_success "Automatic restart completed after Claude usage reset"
}

# Function to restore context after reset
restore_context_after_reset() {
    local backup_location="$1"
    
    log_monitor "Restoring context after Claude reset from: $backup_location"
    
    if [ ! -d "$backup_location" ]; then
        log_critical "Backup location not found: $backup_location"
        return 1
    fi
    
    # Restore all saved components
    if [ -f "$backup_location/shared-context.json" ]; then
        cp "$backup_location/shared-context.json" "$MEMORY_DIR/"
    fi
    
    if [ -d "$backup_location/agent-states" ]; then
        cp -r "$backup_location/agent-states" "$MEMORY_DIR/"
    fi
    
    if [ -d "$backup_location/task-queues" ]; then
        cp -r "$backup_location/task-queues" "$MEMORY_DIR/"
    fi
    
    # Update restoration timestamp
    if [ -f "$MEMORY_DIR/shared-context.json" ]; then
        local temp_file=$(mktemp)
        local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
        jq --arg timestamp "$timestamp" \
           '.lastRestore = $timestamp | .systemStatus = "restored_after_claude_reset" | .lastResetType = "claude_usage_limit"' \
           "$MEMORY_DIR/shared-context.json" > "$temp_file"
        mv "$temp_file" "$MEMORY_DIR/shared-context.json"
    fi
    
    log_success "Context restored successfully after Claude reset"
}

# Function to restart agent coordination system
restart_agent_coordination() {
    log_monitor "Restarting agent coordination after Claude reset..."
    
    # Ensure memory directories exist
    mkdir -p "$MEMORY_DIR/agent-states"
    mkdir -p "$MEMORY_DIR/task-queues"
    
    # Update all agent states to active
    local agents=("master-orchestrator" "ui-ux-agent" "backend-agent" "qa-agent" "devops-agent")
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    for agent in "${agents[@]}"; do
        local agent_file="$MEMORY_DIR/agent-states/$agent.json"
        
        if [ -f "$agent_file" ]; then
            # Update existing agent state
            local temp_file=$(mktemp)
            jq --arg timestamp "$timestamp" \
               '.status = "active" | .lastActive = $timestamp | .restartedAt = $timestamp | .restartReason = "claude_usage_reset"' \
               "$agent_file" > "$temp_file"
            mv "$temp_file" "$agent_file"
        else
            # Create new agent state
            cat > "$agent_file" << EOF
{
  "agentId": "$agent",
  "status": "active",
  "lastActive": "$timestamp",
  "restartedAt": "$timestamp",
  "restartReason": "claude_usage_reset",
  "currentTask": null,
  "taskQueue": []
}
EOF
        fi
    done
    
    log_success "Agent coordination restarted with all agents active"
}

# Main monitoring loop
main_reset_monitor_loop() {
    log_monitor "Starting Claude reset detection system..."
    log_monitor "Check interval: $CHECK_INTERVAL seconds"
    log_monitor "Monitoring for Claude usage limit messages..."
    
    # Ensure required directories exist
    mkdir -p "$MEMORY_DIR" "$LOG_DIR" "$MEMORY_DIR/context-snapshots" "$MEMORY_DIR/agent-states" "$MEMORY_DIR/task-queues"
    
    while true; do
        # Check for reset time
        if detect_claude_usage_message; then
            # Reset was handled, continue monitoring
            log_monitor "Reset handled, continuing monitoring..."
        fi
        
        # Display current status
        if [ -f "$RESET_DETECTION_FILE" ]; then
            local next_reset=$(cat "$RESET_DETECTION_FILE")
            local current_time=$(date '+%s')
            local time_until_reset=$((next_reset - current_time))
            local reset_human=$(date -r "$next_reset" '+%Y-%m-%d %H:%M:%S %Z')
            
            if [ $time_until_reset -gt 0 ]; then
                log_monitor "Next Claude reset: $reset_human (in $time_until_reset seconds)"
            fi
        else
            log_monitor "No Claude reset time detected yet. Monitoring for usage limit messages..."
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Function to start monitoring in background
start_reset_monitor() {
    log_monitor "Starting Claude reset monitor in background..."
    
    # Ensure log directory exists
    mkdir -p "$LOG_DIR"
    
    # Start main loop and redirect output to log file
    main_reset_monitor_loop >> "$LOG_DIR/claude-reset-monitor.log" 2>&1 &
    
    local monitor_pid=$!
    echo $monitor_pid > "$LOG_DIR/claude-reset-monitor.pid"
    
    log_success "Claude reset monitor started (PID: $monitor_pid)"
}

# Function to stop monitoring
stop_reset_monitor() {
    if [ -f "$LOG_DIR/claude-reset-monitor.pid" ]; then
        local pid=$(cat "$LOG_DIR/claude-reset-monitor.pid")
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            log_success "Claude reset monitor stopped (PID: $pid)"
        else
            log_warning "Claude reset monitor process not running"
        fi
        rm -f "$LOG_DIR/claude-reset-monitor.pid"
    else
        log_warning "No Claude reset monitor PID file found"
    fi
}

# Function to check monitor status
check_reset_monitor_status() {
    echo "🤖 CLAUDE RESET MONITOR STATUS:"
    echo ""
    
    if [ -f "$LOG_DIR/claude-reset-monitor.pid" ]; then
        local pid=$(cat "$LOG_DIR/claude-reset-monitor.pid")
        if kill -0 $pid 2>/dev/null; then
            log_success "Claude reset monitor is running (PID: $pid)"
        else
            log_warning "Claude reset monitor PID file exists but process not running"
        fi
    else
        log_warning "Claude reset monitor is not running"
    fi
    
    echo ""
    
    if [ -f "$RESET_DETECTION_FILE" ]; then
        local next_reset=$(cat "$RESET_DETECTION_FILE")
        local current_time=$(date '+%s')
        local time_until_reset=$((next_reset - current_time))
        local reset_human=$(date -r "$next_reset" '+%Y-%m-%d %H:%M:%S %Z')
        
        echo "📅 Next Claude Reset: $reset_human"
        if [ $time_until_reset -gt 0 ]; then
            echo "⏰ Time Until Reset: $time_until_reset seconds ($(($time_until_reset / 60)) minutes)"
        else
            echo "⚠️  Reset time has passed - restart should have triggered"
        fi
    else
        echo "❓ No Claude reset time detected yet"
    fi
    
    echo ""
    
    if [ -f "$SCRIPTS_DIR/pending-restart.flag" ]; then
        local restart_info=$(cat "$SCRIPTS_DIR/pending-restart.flag")
        local scheduled_time=$(echo "$restart_info" | jq -r '.scheduledTimeHuman // "Unknown"')
        echo "🔄 Restart Scheduled: YES (at $scheduled_time)"
    else
        echo "🔄 Restart Scheduled: NO"
    fi
}

# Script execution based on arguments
case "${1:-}" in
    "start")
        start_reset_monitor
        ;;
    "stop")
        stop_reset_monitor
        ;;
    "status")
        check_reset_monitor_status
        ;;
    "restart")
        stop_reset_monitor
        sleep 2
        start_reset_monitor
        ;;
    "set-reset")
        if [ -z "${2:-}" ]; then
            echo "Usage: $0 set-reset \"Your limit will reset at 2:30pm (Asia/Calcutta)\""
            exit 1
        fi
        set_next_reset_time "$2"
        ;;
    "test-restart")
        log_monitor "Testing restart functionality..."
        handle_auto_restart
        ;;
    *)
        echo "🤖 CLAUDE RESET DETECTION & AUTO-RESTART SYSTEM"
        echo ""
        echo "Usage: $0 {start|stop|status|restart|set-reset|test-restart}"
        echo ""
        echo "Commands:"
        echo "  start              - Start Claude reset monitoring in background"
        echo "  stop               - Stop Claude reset monitoring"  
        echo "  status             - Check monitor status and next reset time"
        echo "  restart            - Restart Claude reset monitoring"
        echo "  set-reset <msg>    - Manually set reset time from Claude message"
        echo "  test-restart       - Test the restart functionality"
        echo ""
        echo "Example:"
        echo "  $0 set-reset \"Your limit will reset at 2:30pm (Asia/Calcutta)\""
        echo ""
        exit 1
        ;;
esac