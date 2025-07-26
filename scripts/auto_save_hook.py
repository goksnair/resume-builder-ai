#!/usr/bin/env python3
"""
Auto Save Hook System
Automatically triggers production save after feature completion or todo updates
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any

class AutoSaveHook:
    """Hook system that monitors for completion triggers and auto-saves work"""
    
    def __init__(self, project_root: str = "/Users/gokulnair/Resume Builder"):
        self.project_root = Path(project_root)
        self.scripts_dir = self.project_root / "scripts"
        self.auto_save_script = self.scripts_dir / "auto_save_production.py"
        
    def trigger_auto_save(self, trigger_reason: str, **kwargs) -> Dict[str, Any]:
        """Trigger the auto save production script"""
        
        print(f"🔔 Auto Save Hook Triggered: {trigger_reason}")
        
        try:
            # Prepare command
            cmd = [sys.executable, str(self.auto_save_script)]
            
            # Add feature name if provided
            feature_name = kwargs.get('feature_name', f'Auto Save - {trigger_reason}')
            cmd.append(feature_name)
            
            # Add force flag if needed
            if kwargs.get('force', False):
                cmd.append('--force')
            
            # Execute auto save script
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=self.project_root)
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "trigger_reason": trigger_reason
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "trigger_reason": trigger_reason
            }
    
    def check_todo_completion(self, todo_list: List[Dict[str, Any]]) -> bool:
        """Check if significant todos have been completed"""
        
        if not todo_list:
            return False
        
        completed_todos = [todo for todo in todo_list if todo.get('status') == 'completed']
        total_todos = len(todo_list)
        
        # Trigger if 80% or more todos are completed, or if high priority todos are done
        completion_rate = len(completed_todos) / total_todos if total_todos > 0 else 0
        high_priority_completed = any(
            todo.get('status') == 'completed' and todo.get('priority') == 'high' 
            for todo in todo_list
        )
        
        return completion_rate >= 0.8 or high_priority_completed
    
    def monitor_file_changes(self) -> bool:
        """Monitor for significant file changes that indicate feature completion"""
        
        try:
            os.chdir(self.project_root)
            
            # Check for staged files
            staged_result = subprocess.run(['git', 'diff', '--cached', '--name-only'], 
                                         capture_output=True, text=True)
            
            # Check for unstaged files
            unstaged_result = subprocess.run(['git', 'diff', '--name-only'], 
                                           capture_output=True, text=True)
            
            staged_files = staged_result.stdout.strip().split('\n') if staged_result.stdout.strip() else []
            unstaged_files = unstaged_result.stdout.strip().split('\n') if unstaged_result.stdout.strip() else []
            
            all_changed_files = staged_files + unstaged_files
            
            # Look for significant file patterns
            significant_patterns = [
                'services/',
                'api/',
                'models/',
                '.py',
                '.md',
                'requirements',
                'config'
            ]
            
            significant_changes = any(
                any(pattern in file_path for pattern in significant_patterns)
                for file_path in all_changed_files
            )
            
            return significant_changes and len(all_changed_files) >= 3
            
        except Exception:
            return False


# Hook Functions for Different Triggers

def todo_completion_hook(todo_list: List[Dict[str, Any]]) -> None:
    """Hook triggered when todos are completed"""
    
    hook = AutoSaveHook()
    
    if hook.check_todo_completion(todo_list):
        completed_count = len([t for t in todo_list if t.get('status') == 'completed'])
        total_count = len(todo_list)
        
        result = hook.trigger_auto_save(
            f"Todo Completion ({completed_count}/{total_count})",
            feature_name=f"Feature Implementation - {completed_count} Tasks Completed"
        )
        
        if result["success"]:
            print("✅ Auto save completed successfully!")
        else:
            print(f"❌ Auto save failed: {result.get('error', 'Unknown error')}")


def file_change_hook() -> None:
    """Hook triggered when significant file changes are detected"""
    
    hook = AutoSaveHook()
    
    if hook.monitor_file_changes():
        result = hook.trigger_auto_save(
            "Significant File Changes Detected",
            feature_name="Development Session - File Changes"
        )
        
        if result["success"]:
            print("✅ Auto save completed due to file changes!")
        else:
            print(f"❌ Auto save failed: {result.get('error', 'Unknown error')}")


def manual_save_hook(feature_name: str = None, force: bool = False) -> None:
    """Manual trigger for auto save"""
    
    hook = AutoSaveHook()
    
    result = hook.trigger_auto_save(
        "Manual Save Triggered",
        feature_name=feature_name or "Manual Save Session",
        force=force
    )
    
    if result["success"]:
        print("✅ Manual auto save completed!")
        print(result["stdout"])
    else:
        print(f"❌ Manual auto save failed: {result.get('error', 'Unknown error')}")
        if result.get("stderr"):
            print(f"Error details: {result['stderr']}")


def main():
    """Main function for direct script execution"""
    
    if len(sys.argv) < 2:
        print("Usage: python auto_save_hook.py <trigger_type> [options]")
        print("Trigger types: todo, files, manual")
        sys.exit(1)
    
    trigger_type = sys.argv[1].lower()
    
    if trigger_type == "todo":
        # Mock todo list for testing
        mock_todos = [
            {"status": "completed", "priority": "high", "content": "Database conflicts resolved"},
            {"status": "completed", "priority": "high", "content": "Psychology service enhanced"},
            {"status": "completed", "priority": "medium", "content": "API layer created"},
            {"status": "pending", "priority": "low", "content": "Documentation review"}
        ]
        todo_completion_hook(mock_todos)
        
    elif trigger_type == "files":
        file_change_hook()
        
    elif trigger_type == "manual":
        feature_name = sys.argv[2] if len(sys.argv) > 2 else None
        force = "--force" in sys.argv
        manual_save_hook(feature_name, force)
        
    else:
        print(f"Unknown trigger type: {trigger_type}")
        sys.exit(1)


if __name__ == "__main__":
    main()