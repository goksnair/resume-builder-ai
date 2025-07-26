#!/bin/bash
# Auto Save Production - Convenience Aliases
# Source this file to add aliases to your shell: source scripts/auto_save_aliases.sh

# Quick auto-save command
alias save-work='python3 scripts/auto_save_hook.py manual'

# Force auto-save (even with no changes)
alias save-force='python3 scripts/auto_save_hook.py manual "Manual Force Save" --force'

# Check todo completion and auto-save if needed
alias save-todos='python3 scripts/auto_save_hook.py todo'

# Auto-save on file changes
alias save-files='python3 scripts/auto_save_hook.py files'

# Quick feature completion save
save-feature() {
    if [ $# -eq 0 ]; then
        echo "Usage: save-feature 'Feature Name'"
        return 1
    fi
    python3 scripts/auto_save_hook.py manual "$1" --force
}

# Display auto-save status
save-status() {
    echo "🔍 Auto-Save System Status"
    echo "=========================="
    echo "📍 Project: $(pwd)"
    echo "📋 Git Status:"
    git status --porcelain | head -5
    echo ""
    echo "📊 Recent Commits:"
    git log --oneline -3
    echo ""
    echo "💾 Auto-save files:"
    find .claude/chat_history -name "*.json" -mtime -1 2>/dev/null | wc -l | xargs echo "  Chat histories (last 24h):"
    find .claude/production_logs -name "*.md" -mtime -1 2>/dev/null | wc -l | xargs echo "  Production logs (last 24h):"
}

echo "✅ Auto-save aliases loaded!"
echo "Commands available: save-work, save-force, save-todos, save-files, save-feature, save-status"
