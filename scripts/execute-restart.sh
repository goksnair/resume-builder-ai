#!/bin/bash
PROJECT_ROOT="/Users/gokulnair/Resume Builder"
LOG_DIR="$PROJECT_ROOT/logs"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Automatic restart triggered by scheduled reset" >> "$LOG_DIR/auto-restart.log"
# Add your agent restart logic here
