#!/usr/bin/env python3
"""
Safe Auto-Save System
Prevents infinite loops while ensuring context preservation
"""

import os
import subprocess
import time
import hashlib
from pathlib import Path
import json
import fcntl

class SafeAutoSave:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.lock_file = self.repo_root / ".auto-save.lock"
        self.last_run_file = self.repo_root / ".last-auto-save"
        self.min_interval = 300  # 5 minutes
        
    def acquire_lock(self):
        """Acquire exclusive lock to prevent concurrent runs"""
        try:
            self.lock_fd = open(self.lock_file, 'w')
            fcntl.flock(self.lock_fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            self.lock_fd.write(str(os.getpid()))
            self.lock_fd.flush()
            return True
        except (IOError, OSError):
            return False
    
    def release_lock(self):
        """Release the lock"""
        try:
            if hasattr(self, 'lock_fd'):
                fcntl.flock(self.lock_fd.fileno(), fcntl.LOCK_UN)
                self.lock_fd.close()
            if self.lock_file.exists():
                self.lock_file.unlink()
        except:
            pass
    
    def should_run(self):
        """Check if enough time has passed since last run"""
        if not self.last_run_file.exists():
            return True
        
        try:
            last_run = float(self.last_run_file.read_text().strip())
            return time.time() - last_run > self.min_interval
        except:
            return True
    
    def update_last_run(self):
        """Update last run timestamp"""
        try:
            self.last_run_file.write_text(str(time.time()))
        except:
            pass
    
    def has_changes(self):
        """Check if there are uncommitted changes"""
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=10
            )
            return result.returncode == 0 and len(result.stdout.strip()) > 0
        except:
            return False
    
    def safe_commit_and_push(self):
        """Safely commit and push without triggering hooks"""
        try:
            # Add files
            subprocess.run(
                ["git", "add", "."],
                cwd=self.repo_root,
                check=True,
                timeout=30
            )
            
            # Commit with --no-verify to skip hooks
            commit_msg = f"🤖 Auto-save: Context preservation - {time.strftime('%Y-%m-%d %H:%M:%S')}"
            subprocess.run(
                ["git", "commit", "-m", commit_msg, "--no-verify"],
                cwd=self.repo_root,
                check=True,
                timeout=30
            )
            
            # Push
            subprocess.run(
                ["git", "push", "origin", "main"],
                cwd=self.repo_root,
                check=True,
                timeout=60
            )
            
            return True, "Successfully committed and pushed"
        except subprocess.TimeoutExpired:
            return False, "Operation timed out"
        except subprocess.CalledProcessError as e:
            return False, f"Git operation failed: {e}"
        except Exception as e:
            return False, f"Unexpected error: {e}"
    
    def update_production_status(self):
        """Update production status document"""
        status_file = self.repo_root / "CURRENT_PRODUCTION_STATUS.md"
        if status_file.exists():
            try:
                content = status_file.read_text()
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC")
                # Update timestamp line
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if line.startswith("*Last Updated:"):
                        lines[i] = f"*Last Updated: {timestamp}*"
                        break
                
                status_file.write_text('\n'.join(lines))
                return True
            except:
                return False
        return False
    
    def run_safe_auto_save(self):
        """Main safe auto-save function"""
        if not self.acquire_lock():
            print("❌ Auto-save already running or locked")
            return False
        
        try:
            if not self.should_run():
                print("⏰ Auto-save skipped: too soon since last run")
                return False
            
            if not self.has_changes():
                print("✅ No changes to save")
                self.update_last_run()
                return True
            
            print("🔄 Starting safe auto-save...")
            
            # Update status document
            if self.update_production_status():
                print("✅ Updated production status")
            
            # Commit and push
            success, message = self.safe_commit_and_push()
            if success:
                print(f"✅ {message}")
                self.update_last_run()
                return True
            else:
                print(f"❌ Auto-save failed: {message}")
                return False
                
        finally:
            self.release_lock()

def main():
    """Main function"""
    auto_save = SafeAutoSave()
    return auto_save.run_safe_auto_save()

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)