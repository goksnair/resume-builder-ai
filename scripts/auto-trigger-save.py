#!/usr/bin/env python3
"""
Auto-Trigger Save System
Automatically runs auto-save when significant changes are detected
"""

import os
import subprocess
import time
import hashlib
from pathlib import Path
import json

class AutoSaveTrigger:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.last_hash = self.get_current_hash()
        self.save_interval = 300  # 5 minutes
        self.last_save_time = 0
        
    def get_current_hash(self):
        """Get hash of critical files to detect changes"""
        critical_files = [
            "apps/web-app/src/index.jsx",
            "apps/web-app/src/App.jsx", 
            "apps/web-app/src/FunctionalApp.jsx",
            "apps/web-app/src/ExpandedApp.jsx",
            "apps/web-app/src/TestApp.jsx",
            "apps/web-app/src/MinimalApp.jsx",
            "apps/backend/expanded_main.py",
            "apps/backend/minimal_main.py",
            "apps/backend/simple_working_main.py",
            "apps/backend/Procfile",
            "apps/backend/requirements.txt"
        ]
        
        hash_content = ""
        for file_path in critical_files:
            full_path = self.repo_root / file_path
            if full_path.exists():
                try:
                    hash_content += full_path.read_text()
                except:
                    pass
        
        return hashlib.md5(hash_content.encode()).hexdigest()
    
    def should_trigger_save(self):
        """Check if auto-save should be triggered"""
        current_time = time.time()
        current_hash = self.get_current_hash()
        
        # Trigger if files changed
        if current_hash != self.last_hash:
            self.last_hash = current_hash
            return True, "File changes detected"
        
        # Trigger if enough time passed
        if current_time - self.last_save_time > self.save_interval:
            return True, "Time interval reached"
        
        return False, "No trigger conditions met"
    
    def run_auto_save(self):
        """Run the auto-save script"""
        auto_save_script = self.repo_root / "scripts/auto-save-production.py"
        if auto_save_script.exists():
            try:
                result = subprocess.run(
                    ["python3", str(auto_save_script)], 
                    cwd=self.repo_root,
                    capture_output=True,
                    text=True
                )
                self.last_save_time = time.time()
                return True, result.stdout
            except Exception as e:
                return False, str(e)
        return False, "Auto-save script not found"
    
    def create_trigger_log(self, message, success=True):
        """Log trigger events"""
        log_file = self.repo_root / "auto-save-trigger.log"
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        status = "SUCCESS" if success else "FAILED"
        log_entry = f"[{timestamp}] {status}: {message}\n"
        
        try:
            with open(log_file, "a") as f:
                f.write(log_entry)
        except:
            pass
    
    def monitor_and_trigger(self, duration=3600):
        """Monitor for changes and auto-trigger saves"""
        print(f"🔄 Starting auto-save monitoring for {duration} seconds...")
        start_time = time.time()
        
        while time.time() - start_time < duration:
            should_save, reason = self.should_trigger_save()
            
            if should_save:
                print(f"🚨 Trigger detected: {reason}")
                success, result = self.run_auto_save()
                
                if success:
                    print("✅ Auto-save completed successfully")
                    self.create_trigger_log(f"Auto-save triggered: {reason}")
                else:
                    print(f"❌ Auto-save failed: {result}")
                    self.create_trigger_log(f"Auto-save failed: {result}", False)
            
            time.sleep(30)  # Check every 30 seconds
        
        print("🏁 Auto-save monitoring completed")

def main():
    """Main function for manual testing"""
    trigger = AutoSaveTrigger()
    
    # Check if we should trigger now
    should_save, reason = trigger.should_trigger_save()
    if should_save:
        print(f"🚨 Immediate trigger: {reason}")
        success, result = trigger.run_auto_save()
        if success:
            print("✅ Auto-save completed")
        else:
            print(f"❌ Auto-save failed: {result}")
    else:
        print(f"ℹ️  No trigger needed: {reason}")

if __name__ == "__main__":
    main()