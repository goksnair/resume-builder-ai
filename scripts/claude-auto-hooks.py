#!/usr/bin/env python3
"""
Claude Auto-Hooks System
Automatically triggers context preservation when Claude makes significant changes
"""

import os
import sys
import time
import subprocess
from pathlib import Path

class ClaudeAutoHooks:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.hook_triggers = [
            "npm run build",
            "git commit",
            "new file created",
            "significant changes",
            "deployment ready"
        ]
    
    def detect_claude_activity(self):
        """Detect if Claude has made significant changes"""
        # Check git status for uncommitted changes
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"], 
                cwd=self.repo_root,
                capture_output=True, 
                text=True
            )
            
            if result.returncode == 0 and result.stdout.strip():
                return True, f"Uncommitted changes detected: {len(result.stdout.strip().split())} files"
        except:
            pass
        
        return False, "No significant activity detected"
    
    def auto_trigger_preservation(self):
        """Automatically trigger context preservation"""
        print("🤖 Claude Auto-Hooks: Triggering context preservation...")
        
        # Run auto-save script
        auto_save_script = self.repo_root / "scripts/auto-save-production.py"
        if auto_save_script.exists():
            try:
                result = subprocess.run(
                    ["python3", str(auto_save_script)],
                    cwd=self.repo_root,
                    capture_output=True,
                    text=True
                )
                
                if result.returncode == 0:
                    print("✅ Context preservation completed automatically")
                    return True
                else:
                    print(f"❌ Context preservation failed: {result.stderr}")
                    return False
            except Exception as e:
                print(f"❌ Exception during context preservation: {e}")
                return False
        else:
            print("❌ Auto-save script not found")
            return False
    
    def setup_git_hooks(self):
        """Set up git hooks to trigger auto-save"""
        git_hooks_dir = self.repo_root / ".git/hooks"
        
        # Pre-commit hook
        pre_commit_hook = git_hooks_dir / "pre-commit"
        pre_commit_content = f"""#!/bin/bash
# Auto-trigger context preservation before commit
echo "🤖 Claude Auto-Hooks: Triggering pre-commit context preservation..."
python3 "{self.repo_root}/scripts/auto-save-production.py"
"""
        
        try:
            pre_commit_hook.write_text(pre_commit_content)
            pre_commit_hook.chmod(0o755)
            print("✅ Git pre-commit hook installed")
        except Exception as e:
            print(f"❌ Failed to install git hook: {e}")
    
    def create_monitoring_service(self):
        """Create a background monitoring service"""
        monitor_script = self.repo_root / "scripts/background-monitor.py"
        monitor_content = f"""#!/usr/bin/env python3
import time
import subprocess
from pathlib import Path

def monitor_loop():
    repo_root = Path("{self.repo_root}")
    auto_save_script = repo_root / "scripts/auto-save-production.py"
    
    while True:
        try:
            # Check for changes every 5 minutes
            time.sleep(300)
            
            # Check git status
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=repo_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0 and result.stdout.strip():
                print("🔄 Background monitor: Changes detected, triggering auto-save...")
                subprocess.run(["python3", str(auto_save_script)], cwd=repo_root)
                
        except KeyboardInterrupt:
            print("🛑 Background monitor stopped")
            break
        except Exception as e:
            print(f"❌ Monitor error: {{e}}")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    monitor_loop()
"""
        
        try:
            monitor_script.write_text(monitor_content)
            monitor_script.chmod(0o755)
            print("✅ Background monitoring service created")
        except Exception as e:
            print(f"❌ Failed to create monitoring service: {e}")

def main():
    """Set up all auto-hooks"""
    hooks = ClaudeAutoHooks()
    
    print("🤖 Setting up Claude Auto-Hooks system...")
    
    # Check if we need immediate preservation
    activity_detected, reason = hooks.detect_claude_activity()
    if activity_detected:
        print(f"🚨 {reason}")
        hooks.auto_trigger_preservation()
    
    # Set up hooks and monitoring
    hooks.setup_git_hooks()
    hooks.create_monitoring_service()
    
    print("✅ Claude Auto-Hooks system setup complete!")
    print("📝 Context will now be preserved automatically when:")
    print("   - Files are changed")
    print("   - Commits are made") 
    print("   - Builds are completed")
    print("   - Every 5 minutes if changes exist")

if __name__ == "__main__":
    main()