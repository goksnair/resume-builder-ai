#!/usr/bin/env python3
"""
Context Guardian - Intelligent Auto-Save Assignment
Automatically assigns context preservation tasks to specialized agents
"""

import os
import time
import subprocess
from pathlib import Path
from typing import List, Dict

class ContextGuardian:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.guardian_config = self.repo_root / ".context-guardian.json"
        self.load_config()
    
    def load_config(self):
        """Load guardian configuration"""
        import json
        
        default_config = {
            "triggers": {
                "roadmap_changes": ["ROADMAP", "roadmap", "PHASE", "Phase"],
                "feature_additions": ["FEATURE", "feature", "ADD", "NEW"],
                "implementation_changes": ["IMPLEMENT", "implement", "BUILD", "CREATE"],
                "documentation_updates": ["DOC", "doc", "README", "GUIDE"]
            },
            "agents": {
                "context_saver": "safe-auto-save.py",
                "implementation_updater": "update-implementation-guide.py", 
                "status_tracker": "auto-save-production.py"
            },
            "auto_triggers": True,
            "min_interval": 300
        }
        
        if self.guardian_config.exists():
            try:
                with open(self.guardian_config, 'r') as f:
                    self.config = json.load(f)
            except:
                self.config = default_config
        else:
            self.config = default_config
            self.save_config()
    
    def save_config(self):
        """Save guardian configuration"""
        import json
        try:
            with open(self.guardian_config, 'w') as f:
                json.dump(self.config, f, indent=2)
        except:
            pass
    
    def detect_change_type(self, commit_message: str) -> List[str]:
        """Detect what type of changes were made"""
        detected_types = []
        message_upper = commit_message.upper()
        
        for change_type, keywords in self.config["triggers"].items():
            if any(keyword.upper() in message_upper for keyword in keywords):
                detected_types.append(change_type)
        
        return detected_types
    
    def get_last_commit_message(self) -> str:
        """Get the last commit message"""
        try:
            result = subprocess.run(
                ["git", "log", "-1", "--pretty=format:%s"],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=10
            )
            return result.stdout.strip() if result.returncode == 0 else ""
        except:
            return ""
    
    def should_trigger_auto_save(self) -> bool:
        """Check if auto-save should be triggered"""
        last_commit = self.get_last_commit_message()
        change_types = self.detect_change_type(last_commit)
        
        # Always trigger for major changes
        major_triggers = ["roadmap_changes", "feature_additions", "implementation_changes"]
        return any(ct in major_triggers for ct in change_types)
    
    def assign_agent_task(self, agent_script: str, description: str) -> bool:
        """Assign task to an agent script"""
        script_path = self.repo_root / "scripts" / agent_script
        
        if not script_path.exists():
            print(f"❌ Agent script not found: {agent_script}")
            return False
        
        try:
            print(f"🤖 Assigning task: {description}")
            print(f"🔧 Running: {agent_script}")
            
            result = subprocess.run(
                ["python3", str(script_path)],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                print(f"✅ Task completed successfully")
                return True
            else:
                print(f"❌ Task failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"⏰ Task timed out: {agent_script}")
            return False
        except Exception as e:
            print(f"❌ Task error: {e}")
            return False
    
    def auto_assign_preservation_tasks(self):
        """Automatically assign context preservation tasks based on changes"""
        last_commit = self.get_last_commit_message()
        change_types = self.detect_change_type(last_commit)
        
        print(f"🔍 Analyzing changes: {last_commit}")
        print(f"📊 Detected change types: {change_types}")
        
        tasks_assigned = []
        
        # Always update implementation guide for major changes
        if any(ct in ["roadmap_changes", "feature_additions", "implementation_changes"] for ct in change_types):
            if self.assign_agent_task("update-implementation-guide.py", "Update implementation guide"):
                tasks_assigned.append("implementation_guide")
        
        # Always run safe auto-save for any significant changes
        if change_types:
            if self.assign_agent_task("safe-auto-save.py", "Save context to GitHub"):
                tasks_assigned.append("context_preservation")
        
        return tasks_assigned
    
    def manual_trigger(self, task_type: str = "all"):
        """Manually trigger specific preservation tasks"""
        print(f"🔧 Manual trigger: {task_type}")
        
        if task_type in ["all", "context"]:
            self.assign_agent_task("safe-auto-save.py", "Manual context preservation")
        
        if task_type in ["all", "implementation"]:
            self.assign_agent_task("update-implementation-guide.py", "Manual implementation guide update")
        
        if task_type in ["all", "status"]:
            # Update status manually
            status_file = self.repo_root / "CURRENT_PRODUCTION_STATUS.md"
            if status_file.exists():
                content = status_file.read_text()
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC")
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if line.startswith("*Last Updated:"):
                        lines[i] = f"*Last Updated: {timestamp}*"
                        break
                status_file.write_text('\n'.join(lines))
                print("✅ Updated production status manually")

def main():
    """Main CLI interface"""
    import sys
    
    guardian = ContextGuardian()
    
    if len(sys.argv) < 2:
        print("🛡️ Context Guardian - Intelligent Auto-Save")
        print()
        print("Commands:")
        print("  auto        - Auto-assign based on recent changes")
        print("  trigger     - Manually trigger all preservation tasks")
        print("  context     - Manually trigger context preservation only")
        print("  implementation - Manually trigger implementation guide update")
        print("  status      - Manually update production status")
        print()
        print("Examples:")
        print("  python3 context-guardian.py auto")
        print("  python3 context-guardian.py trigger")
        return
    
    command = sys.argv[1]
    
    if command == "auto":
        guardian.auto_assign_preservation_tasks()
    elif command == "trigger":
        guardian.manual_trigger("all")
    elif command == "context":
        guardian.manual_trigger("context")
    elif command == "implementation":
        guardian.manual_trigger("implementation")
    elif command == "status":
        guardian.manual_trigger("status")
    else:
        print("❌ Invalid command")

if __name__ == "__main__":
    main()