#!/usr/bin/env python3
import time
import subprocess
from pathlib import Path

def monitor_loop():
    repo_root = Path("/Users/gokulnair/Resume Builder")
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
            print(f"❌ Monitor error: {e}")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    monitor_loop()
