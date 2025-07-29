#!/bin/bash

# 🤖 CLAUDE USAGE RESET DETECTOR & AUTO-RESTART
# Properly detects Claude's reset messages and schedules restart accordingly

PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Function to set reset time when Claude notifies about limit
set_claude_reset() {
    local reset_time="$1"    # e.g., "2:30pm"
    local timezone="$2"      # e.g., "Asia/Calcutta"
    
    echo "🤖 Claude usage limit detected!"
    echo "📅 Reset scheduled for: $reset_time ($timezone)"
    
    # Calculate actual timestamp (simplified for macOS)
    local hour=$(echo "$reset_time" | sed 's/[ap]m//' | cut -d':' -f1)
    local minute=$(echo "$reset_time" | sed 's/[ap]m//' | cut -d':' -f2)
    local ampm=$(echo "$reset_time" | grep -o '[ap]m')
    
    # Convert to 24-hour
    if [ "$ampm" = "pm" ] && [ "$hour" -ne 12 ]; then
        hour=$((hour + 12))
    elif [ "$ampm" = "am" ] && [ "$hour" -eq 12 ]; then
        hour=0
    fi
    
    # Get tomorrow's date (since current time is past)
    local tomorrow=$(date -v+1d '+%Y-%m-%d')
    local reset_datetime="$tomorrow $(printf "%02d:%02d:00" $hour $minute)"
    
    # Convert to timestamp
    local reset_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "$reset_datetime" '+%s' 2>/dev/null)
    
    if [ -n "$reset_timestamp" ]; then
        # Save the reset time
        echo "$reset_timestamp" > "$MEMORY_DIR/claude-reset-time.txt"
        
        # Save context immediately
        backup_context
        
        # Create restart scheduler
        create_restart_scheduler "$reset_timestamp"
        
        echo "✅ Reset scheduled for $(date -r "$reset_timestamp" '+%Y-%m-%d %H:%M:%S')"
        echo "💾 Context backed up"
        echo "🔄 Auto-restart will trigger at reset time"
    else
        echo "❌ Failed to parse reset time"
        return 1
    fi
}

# Backup current context
backup_context() {
    local backup_dir="$MEMORY_DIR/context-snapshots/pre-reset-$(date +%Y%m%d-%H%M)"
    mkdir -p "$backup_dir"
    
    # Copy all important state
    [ -f "$MEMORY_DIR/shared-context.json" ] && cp "$MEMORY_DIR/shared-context.json" "$backup_dir/"
    [ -d "$MEMORY_DIR/agent-states" ] && cp -r "$MEMORY_DIR/agent-states" "$backup_dir/"
    [ -d "$MEMORY_DIR/task-queues" ] && cp -r "$MEMORY_DIR/task-queues" "$backup_dir/"
    
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$backup_dir/backup-timestamp.txt"
    echo "$(basename $backup_dir)" > "$MEMORY_DIR/latest-backup.txt"
}

# Create restart scheduler
create_restart_scheduler() {
    local reset_timestamp="$1"
    
    cat > "$SCRIPTS_DIR/auto-restart.sh" << 'EOF'
#!/bin/bash
PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"

echo "🤖 $(date '+%Y-%m-%d %H:%M:%S') - Claude usage reset triggered!"

# Restore context
if [ -f "$MEMORY_DIR/latest-backup.txt" ]; then
    backup_name=$(cat "$MEMORY_DIR/latest-backup.txt")
    backup_dir="$MEMORY_DIR/context-snapshots/$backup_name"
    
    if [ -d "$backup_dir" ]; then
        echo "📂 Restoring context from $backup_name"
        
        [ -f "$backup_dir/shared-context.json" ] && cp "$backup_dir/shared-context.json" "$MEMORY_DIR/"
        [ -d "$backup_dir/agent-states" ] && cp -r "$backup_dir/agent-states" "$MEMORY_DIR/"
        [ -d "$backup_dir/task-queues" ] && cp -r "$backup_dir/task-queues" "$MEMORY_DIR/"
        
        echo "✅ Context restored successfully"
    fi
fi

# Start agents (add your agent startup logic here)
echo "🚀 Starting agent systems..."

# Log the restart
echo "$(date '+%Y-%m-%d %H:%M:%S') - Auto-restart completed" >> "$PROJECT_ROOT/logs/auto-restart.log"

# Clean up
rm -f "$MEMORY_DIR/claude-reset-time.txt"
EOF

    chmod +x "$SCRIPTS_DIR/auto-restart.sh"
    
    # Create a simple monitor that checks if reset time is reached
    cat > "$SCRIPTS_DIR/reset-monitor.sh" << EOF
#!/bin/bash
while true; do
    if [ -f "$MEMORY_DIR/claude-reset-time.txt" ]; then
        reset_time=\$(cat "$MEMORY_DIR/claude-reset-time.txt")
        current_time=\$(date '+%s')
        
        if [ "\$current_time" -ge "\$reset_time" ]; then
            echo "🔄 Reset time reached, executing restart..."
            "$SCRIPTS_DIR/auto-restart.sh"
            break
        else
            remaining=\$((reset_time - current_time))
            echo "⏳ \$(date '+%H:%M:%S') - Reset in \$((remaining/60)) minutes"
        fi
    else
        echo "❓ No reset time scheduled"
    fi
    sleep 60
done
EOF

    chmod +x "$SCRIPTS_DIR/reset-monitor.sh"
}

# Check if reset time has been reached
check_reset() {
    if [ -f "$MEMORY_DIR/claude-reset-time.txt" ]; then
        local reset_time=$(cat "$MEMORY_DIR/claude-reset-time.txt")
        local current_time=$(date '+%s')
        
        if [ "$current_time" -ge "$reset_time" ]; then
            echo "🔄 Reset time reached! Executing restart..."
            "$SCRIPTS_DIR/auto-restart.sh"
            return 0
        else
            local remaining=$((reset_time - current_time))
            local reset_human=$(date -r "$reset_time" '+%Y-%m-%d %H:%M:%S')
            echo "⏳ Reset scheduled for: $reset_human (in $((remaining/60)) minutes)"
            return 1
        fi
    else
        echo "❓ No Claude reset time scheduled"
        return 1
    fi
}

# Start monitoring
start_monitor() {
    echo "🤖 Starting Claude reset monitor..."
    "$SCRIPTS_DIR/reset-monitor.sh" &
    echo $! > "$MEMORY_DIR/monitor.pid"
    echo "✅ Monitor started (PID: $(cat $MEMORY_DIR/monitor.pid))"
}

# Stop monitoring
stop_monitor() {
    if [ -f "$MEMORY_DIR/monitor.pid" ]; then
        local pid=$(cat "$MEMORY_DIR/monitor.pid")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            echo "🛑 Monitor stopped"
        fi
        rm -f "$MEMORY_DIR/monitor.pid"
    fi
}

# Main command interface
case "${1:-}" in
    "set-reset")
        if [ -z "${2:-}" ] || [ -z "${3:-}" ]; then
            echo "Usage: $0 set-reset <time> <timezone>"
            echo "Example: $0 set-reset \"2:30pm\" \"Asia/Calcutta\""
            exit 1
        fi
        set_claude_reset "$2" "$3"
        ;;
    "check")
        check_reset
        ;;
    "start")
        start_monitor
        ;;
    "stop")
        stop_monitor
        ;;
    "status")
        if [ -f "$MEMORY_DIR/claude-reset-time.txt" ]; then
            reset_time=$(cat "$MEMORY_DIR/claude-reset-time.txt")
            reset_human=$(date -r "$reset_time" '+%Y-%m-%d %H:%M:%S')
            current_time=$(date '+%s')
            remaining=$((reset_time - current_time))
            
            echo "📅 Next Claude reset: $reset_human"
            if [ $remaining -gt 0 ]; then
                echo "⏳ Time remaining: $((remaining/60)) minutes"
            else
                echo "⚠️  Reset time has passed"
            fi
        else
            echo "❓ No reset scheduled"
        fi
        
        if [ -f "$MEMORY_DIR/monitor.pid" ]; then
            pid=$(cat "$MEMORY_DIR/monitor.pid")
            if kill -0 "$pid" 2>/dev/null; then
                echo "🔄 Monitor is running (PID: $pid)"
            else
                echo "❌ Monitor not running"
            fi
        else
            echo "❌ No monitor running"
        fi
        ;;
    *)
        echo "🤖 CLAUDE USAGE RESET DETECTOR"
        echo ""
        echo "WHEN CLAUDE SAYS: 'Your limit will reset at 2:30pm (Asia/Calcutta)'"
        echo "RUN: $0 set-reset \"2:30pm\" \"Asia/Calcutta\""
        echo ""
        echo "Commands:"
        echo "  set-reset <time> <tz>  - Set reset time from Claude message"
        echo "  start                  - Start monitoring for reset"
        echo "  stop                   - Stop monitoring"
        echo "  check                  - Check if reset time reached"
        echo "  status                 - Show current status"
        echo ""
        echo "Workflow:"
        echo "  1. When Claude shows usage limit, run: set-reset"
        echo "  2. Run: start (to begin monitoring)"
        echo "  3. System will auto-restart at reset time"
        exit 1
        ;;
esac