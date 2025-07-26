#!/bin/bash
# Claude CI Startup Script
# Auto-executes when Claude Code is launched

echo "🚀 Claude CI - Session Initialization"
echo "======================================="

# Set project root
PROJECT_ROOT="/Users/gokulnair/Resume Builder"
cd "$PROJECT_ROOT"

# Run Claude CI system
python3 .claude/claude_ci_system.py

# Export environment variables for session
export CLAUDE_CI_PROJECT="resume_builder_ai"
export CLAUDE_CI_SESSION_START=$(date +%Y%m%d_%H%M%S)
export CLAUDE_CI_AUTO_SAVE="enabled"

echo ""
echo "✅ Claude CI ready - Environment configured"
echo "📁 Working directory: $PWD"
echo "🎯 Active project: Resume Builder AI"
echo ""

# Display quick command reference
echo "💡 Quick Commands:"
echo "  save-work              - Quick save current state"
echo "  save-force             - Force save everything"
echo "  save-feature \"name\"    - Save with specific name"
echo "  vscode-handover        - Prepare VS Code Copilot handover"
echo ""