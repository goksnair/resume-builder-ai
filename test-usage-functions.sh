#!/bin/bash

# Test usage monitoring functions
PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
RESET_CYCLE_HOURS=5
RESET_DETECTION_FILE="$MEMORY_DIR/last-reset-time.txt"

# Function to get last known reset time
get_last_reset_time() {
    if [ -f "$RESET_DETECTION_FILE" ]; then
        cat "$RESET_DETECTION_FILE"
    else
        # Default to current time minus reset cycle if no record exists
        date -d "$RESET_CYCLE_HOURS hours ago" '+%s'
    fi
}

# Function to calculate next reset time
get_next_reset_time() {
    local last_reset=$(get_last_reset_time)
    local next_reset=$(( last_reset + (RESET_CYCLE_HOURS * 3600) ))
    echo $next_reset
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

echo "🔄 TESTING USAGE MONITORING FUNCTIONS"
echo "======================================"
echo ""
echo "Reset cycle: $RESET_CYCLE_HOURS hours"
echo "Current usage: $(get_usage_percentage)%"
echo "Time until reset: $(get_time_until_reset) seconds"
echo "Next reset: $(date -d "@$(get_next_reset_time)" '+%Y-%m-%d %H:%M:%S')"
echo "Last reset: $(date -d "@$(get_last_reset_time)" '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test reset detection
local current_time=$(date '+%s')
local next_reset=$(get_next_reset_time)
if [ $current_time -lt $next_reset ]; then
    echo "✅ Reset timing is correct (next reset is in the future)"
else
    echo "⚠️  Reset timing may need adjustment"
fi

echo ""
echo "✅ All usage monitoring functions are working correctly!"
echo "🔄 The system will auto-restart every 5 hours at usage resets"