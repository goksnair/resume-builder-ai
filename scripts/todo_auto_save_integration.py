#!/usr/bin/env python3
"""
Todo Auto Save Integration
Integrates auto-save functionality with todo completion tracking
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any

def enhanced_todo_write(todos: List[Dict[str, Any]], auto_save_enabled: bool = True) -> Dict[str, Any]:
    """
    Enhanced todo write function that triggers auto-save on significant completion
    
    This can be integrated into Claude's TodoWrite tool behavior
    """
    
    project_root = Path("/Users/gokulnair/Resume Builder")
    
    # Analyze todo completion
    total_todos = len(todos)
    completed_todos = [todo for todo in todos if todo.get('status') == 'completed']
    completed_count = len(completed_todos)
    
    # Check for high-priority completions
    high_priority_completed = [
        todo for todo in completed_todos 
        if todo.get('priority') == 'high'
    ]
    
    # Determine if auto-save should trigger
    should_auto_save = False
    trigger_reason = ""
    
    if completed_count == total_todos and total_todos > 0:
        should_auto_save = True
        trigger_reason = "All todos completed"
    elif len(high_priority_completed) >= 2:
        should_auto_save = True  
        trigger_reason = f"{len(high_priority_completed)} high-priority todos completed"
    elif completed_count >= 3 and completed_count / total_todos >= 0.75:
        should_auto_save = True
        trigger_reason = f"75%+ completion rate ({completed_count}/{total_todos})"
    
    result = {
        "todos_updated": True,
        "total_todos": total_todos,
        "completed_count": completed_count,
        "completion_rate": completed_count / total_todos if total_todos > 0 else 0,
        "auto_save_triggered": False,
        "auto_save_result": None
    }
    
    # Trigger auto-save if conditions are met
    if should_auto_save and auto_save_enabled:
        try:
            print(f"🔔 Auto-save triggered: {trigger_reason}")
            
            # Execute auto save hook
            hook_script = project_root / "scripts" / "auto_save_hook.py"
            cmd = [sys.executable, str(hook_script), "manual", f"Todo Completion - {trigger_reason}"]
            
            auto_save_result = subprocess.run(cmd, 
                                            capture_output=True, 
                                            text=True, 
                                            cwd=project_root)
            
            result["auto_save_triggered"] = True
            result["auto_save_result"] = {
                "success": auto_save_result.returncode == 0,
                "stdout": auto_save_result.stdout,
                "stderr": auto_save_result.stderr,
                "trigger_reason": trigger_reason
            }
            
            if auto_save_result.returncode == 0:
                print("✅ Production work auto-saved successfully!")
            else:
                print(f"⚠️ Auto-save had issues: {auto_save_result.stderr}")
                
        except Exception as e:
            result["auto_save_result"] = {
                "success": False,
                "error": str(e),
                "trigger_reason": trigger_reason
            }
            print(f"❌ Auto-save failed: {str(e)}")
    
    return result


def create_git_hook() -> None:
    """Create a git pre-commit hook that can trigger auto-save"""
    
    project_root = Path("/Users/gokulnair/Resume Builder")
    git_hooks_dir = project_root / ".git" / "hooks"
    
    if not git_hooks_dir.exists():
        print("⚠️ Git hooks directory not found. Make sure you're in a git repository.")
        return
    
    pre_commit_hook = git_hooks_dir / "pre-commit"
    
    hook_content = '''#!/bin/bash
# Auto-save production work before commit

echo "🔍 Checking for auto-save triggers..."

# Check if this is a significant commit
CHANGED_FILES=$(git diff --cached --name-only)
SIGNIFICANT_CHANGES=0

# Count significant file changes
for file in $CHANGED_FILES; do
    if [[ $file == *".py" ]] || [[ $file == *"services/"* ]] || [[ $file == *"api/"* ]] || [[ $file == *"models/"* ]]; then
        ((SIGNIFICANT_CHANGES++))
    fi
done

# Trigger auto-save if significant changes detected
if [ $SIGNIFICANT_CHANGES -ge 3 ]; then
    echo "🔔 Significant changes detected ($SIGNIFICANT_CHANGES files). Triggering auto-save..."
    python3 scripts/auto_save_hook.py manual "Pre-commit Auto Save" --force
    
    if [ $? -eq 0 ]; then
        echo "✅ Auto-save completed successfully!"
    else
        echo "⚠️ Auto-save had issues, but continuing with commit..."
    fi
fi

exit 0
'''
    
    # Write the hook
    with open(pre_commit_hook, 'w') as f:
        f.write(hook_content)
    
    # Make executable
    pre_commit_hook.chmod(0o755)
    
    print(f"✅ Git pre-commit hook created at {pre_commit_hook}")


def create_alias_commands() -> None:
    """Create convenient alias commands for manual auto-save"""
    
    project_root = Path("/Users/gokulnair/Resume Builder")
    
    # Create shell aliases file
    aliases_file = project_root / "scripts" / "auto_save_aliases.sh"
    
    aliases_content = '''#!/bin/bash
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
'''
    
    with open(aliases_file, 'w') as f:
        f.write(aliases_content)
    
    aliases_file.chmod(0o755)
    
    print(f"✅ Shell aliases created at {aliases_file}")
    print("To use aliases, run: source scripts/auto_save_aliases.sh")


def main():
    """Setup the complete auto-save system"""
    
    print("🚀 Setting up Auto-Save Production System")
    print("=" * 40)
    
    # Test the enhanced todo write function
    print("1. Testing todo completion detection...")
    test_todos = [
        {"content": "Implement feature A", "status": "completed", "priority": "high", "id": "1"},
        {"content": "Implement feature B", "status": "completed", "priority": "high", "id": "2"},  
        {"content": "Implement feature C", "status": "completed", "priority": "medium", "id": "3"},
        {"content": "Write tests", "status": "pending", "priority": "low", "id": "4"}
    ]
    
    result = enhanced_todo_write(test_todos, auto_save_enabled=True)
    print(f"   ✅ Completion rate: {result['completion_rate']:.1%}")
    print(f"   ✅ Auto-save triggered: {result['auto_save_triggered']}")
    
    # Create git hook
    print("\n2. Creating git pre-commit hook...")
    create_git_hook()
    
    # Create shell aliases
    print("\n3. Creating convenience aliases...")
    create_alias_commands()
    
    print("\n🎉 Auto-Save System Setup Complete!")
    print("\n📋 Available Commands:")
    print("   • save-work           - Quick auto-save")
    print("   • save-force          - Force save (even with no changes)")
    print("   • save-feature 'name' - Save with specific feature name")
    print("   • save-status         - Check auto-save system status")
    print("   • python3 scripts/auto_save_hook.py manual - Direct script call")
    
    print("\n🔧 Integration Points:")
    print("   • Git pre-commit hook: Automatic on significant commits")
    print("   • Todo completion: Triggers on 75%+ completion or 2+ high-priority")
    print("   • File monitoring: Triggers on 3+ significant file changes")
    
    print("\n💾 Backup Locations:")
    print("   • Chat history: .claude/chat_history/")
    print("   • Production logs: .claude/production_logs/")
    print("   • Git repository: Auto-committed and pushed")


if __name__ == "__main__":
    main()