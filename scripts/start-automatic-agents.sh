#!/bin/bash

# Automatic Agent Activation Script
# Starts the Claude usage reset automation system

echo "🤖 Starting Automatic Agent Activation System"
echo "=============================================="

# Make sure we're in the right directory
cd "/Users/gokulnair/Resume Builder"

# Make the script executable
chmod +x scripts/claude-usage-reset-automation.py

echo "📅 Current time: $(date)"
echo "⏰ Usage reset time: 3:30 PM daily"
echo ""

# Check current status
echo "📊 Current Status:"
python3 scripts/claude-usage-reset-automation.py status
echo ""

# Start the monitoring system in background
echo "🚀 Starting background monitoring..."
nohup python3 scripts/claude-usage-reset-automation.py > .context/automation.log 2>&1 &

# Get the process ID
AUTOMATION_PID=$!
echo "✅ Automation system started with PID: $AUTOMATION_PID"

# Save PID for later management
echo $AUTOMATION_PID > .context/automation.pid

echo ""
echo "🎯 AUTOMATIC AGENT SYSTEM ACTIVE"
echo "================================="
echo "✅ Monitoring for Claude usage reset at 3:30 PM"
echo "✅ Will automatically activate all agents when usage resets"
echo "✅ Context Engineer will ensure optimal performance"
echo "✅ All development will resume without manual intervention"
echo ""
echo "📝 Logs: tail -f .context/automation.log"
echo "🛑 Stop: kill $(cat .context/automation.pid)"
echo ""
echo "🎉 System is now fully automated!"