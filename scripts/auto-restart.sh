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
