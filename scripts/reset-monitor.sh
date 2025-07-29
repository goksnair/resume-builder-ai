#!/bin/bash
while true; do
    if [ -f "/Users/gokulnair/Resume Builder/agent-memory/claude-reset-time.txt" ]; then
        reset_time=$(cat "/Users/gokulnair/Resume Builder/agent-memory/claude-reset-time.txt")
        current_time=$(date '+%s')
        
        if [ "$current_time" -ge "$reset_time" ]; then
            echo "🔄 Reset time reached, executing restart..."
            "/Users/gokulnair/Resume Builder/scripts/auto-restart.sh"
            break
        else
            remaining=$((reset_time - current_time))
            echo "⏳ $(date '+%H:%M:%S') - Reset in $((remaining/60)) minutes"
        fi
    else
        echo "❓ No reset time scheduled"
    fi
    sleep 60
done
