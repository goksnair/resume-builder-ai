#!/usr/bin/env python3
"""
Claude Usage Reset Automation - Automatic Agent Reactivation
Monitors Claude usage limits and automatically restarts agent orchestration
"""

import os
import time
import datetime
import subprocess
import schedule
from pathlib import Path
from typing import Dict, List

class ClaudeUsageResetAutomation:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.automation_config = self.repo_root / ".claude-automation.json"
        self.usage_reset_time = "15:30"  # 3:30 PM daily reset
        self.last_activation_file = self.repo_root / ".context" / "last-agent-activation.json"
        
        # Ensure context directory exists
        (self.repo_root / ".context").mkdir(exist_ok=True)
        
    def log_message(self, message: str):
        """Log messages with timestamp"""
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {message}")
        
        # Also log to file
        log_file = self.repo_root / ".context" / "claude-automation.log"
        with open(log_file, 'a') as f:
            f.write(f"[{timestamp}] {message}\n")
    
    def check_claude_usage_status(self) -> bool:
        """Check if Claude usage has been reset and agents can work"""
        current_time = datetime.datetime.now()
        
        # Check if it's past the reset time (3:30 PM)
        reset_time = datetime.datetime.strptime(self.usage_reset_time, "%H:%M").time()
        current_time_only = current_time.time()
        
        return current_time_only >= reset_time
    
    def get_last_activation_time(self) -> datetime.datetime:
        """Get the last time agents were activated"""
        if not self.last_activation_file.exists():
            # If no previous activation, return yesterday
            return datetime.datetime.now() - datetime.timedelta(days=1)
        
        try:
            import json
            with open(self.last_activation_file, 'r') as f:
                data = json.load(f)
                return datetime.datetime.fromisoformat(data['last_activation'])
        except:
            return datetime.datetime.now() - datetime.timedelta(days=1)
    
    def update_last_activation_time(self):
        """Update the last activation timestamp"""
        import json
        activation_data = {
            'last_activation': datetime.datetime.now().isoformat(),
            'activation_reason': 'Claude usage reset - automatic reactivation',
            'status': 'agents_activated'
        }
        
        with open(self.last_activation_file, 'w') as f:
            json.dump(activation_data, f, indent=2)
    
    def should_activate_agents(self) -> bool:
        """Determine if agents should be activated"""
        current_time = datetime.datetime.now()
        last_activation = self.get_last_activation_time()
        
        # Check if it's been at least 23 hours since last activation
        time_since_activation = current_time - last_activation
        
        # Only activate once per day after usage reset
        if time_since_activation.total_seconds() < 23 * 3600:  # 23 hours
            return False
        
        # Check if usage has been reset (past 3:30 PM)
        return self.check_claude_usage_status()
    
    def run_context_preservation(self) -> bool:
        """Run context preservation before starting agents"""
        try:
            self.log_message("🔄 Running context preservation before agent activation...")
            
            result = subprocess.run(
                ["python3", str(self.repo_root / "scripts" / "safe-auto-save.py")],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                self.log_message("✅ Context preservation completed successfully")
                return True
            else:
                self.log_message(f"❌ Context preservation failed: {result.stderr}")
                return False
                
        except Exception as e:
            self.log_message(f"❌ Error during context preservation: {e}")
            return False
    
    def activate_continuous_agents(self) -> bool:
        """Activate the continuous agent orchestration system"""
        try:
            self.log_message("🚀 Activating continuous agent orchestration...")
            
            # Start the continuous orchestration in background
            orchestration_script = self.repo_root / "scripts" / "continuous-agent-orchestration.py"
            
            # Use nohup to run in background
            cmd = f"cd '{self.repo_root}' && nohup python3 '{orchestration_script}' > .context/agent-orchestration.log 2>&1 &"
            
            result = subprocess.run(
                cmd,
                shell=True,
                cwd=self.repo_root
            )
            
            if result.returncode == 0:
                self.log_message("✅ Continuous agent orchestration activated")
                return True
            else:
                self.log_message("❌ Failed to activate continuous agent orchestration")
                return False
                
        except Exception as e:
            self.log_message(f"❌ Error activating agents: {e}")
            return False
    
    def run_context_optimization(self) -> bool:
        """Run context optimization check"""
        try:
            self.log_message("🧠 Running Context Engineer optimization...")
            
            result = subprocess.run(
                ["python3", str(self.repo_root / "scripts" / "context-optimization-system.py")],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                self.log_message("✅ Context optimization completed")
                return True
            else:
                self.log_message("⚠️ Context optimization had warnings")
                return False
                
        except Exception as e:
            self.log_message(f"❌ Context optimization error: {e}")
            return False
    
    def perform_automatic_activation(self):
        """Perform the complete automatic activation sequence"""
        self.log_message("🔍 Checking if agents should be activated...")
        
        if not self.should_activate_agents():
            self.log_message("⏸️ Agents not ready for activation (too soon or usage not reset)")
            return
        
        self.log_message("🎯 CONDITIONS MET - Starting automatic agent activation sequence")
        
        # Step 1: Context preservation
        if not self.run_context_preservation():
            self.log_message("❌ Context preservation failed - aborting activation")
            return
        
        # Step 2: Context optimization
        self.run_context_optimization()
        
        # Step 3: Activate continuous agents
        if self.activate_continuous_agents():
            # Step 4: Update last activation time
            self.update_last_activation_time()
            
            self.log_message("🎉 AUTOMATIC AGENT ACTIVATION COMPLETED SUCCESSFULLY")
            self.log_message("🤖 All agents are now working continuously")
            self.log_message("📊 Context Engineer is monitoring for optimal performance")
        else:
            self.log_message("❌ Agent activation failed")
    
    def start_monitoring(self):
        """Start the continuous monitoring system"""
        self.log_message("🛡️ Starting Claude Usage Reset Automation")
        self.log_message(f"⏰ Monitoring for usage reset at {self.usage_reset_time} daily")
        
        # Schedule daily activation check at 3:30 PM
        schedule.every().day.at(self.usage_reset_time).do(self.perform_automatic_activation)
        
        # Also check every hour in case we missed the exact time
        schedule.every().hour.do(self.perform_automatic_activation)
        
        self.log_message("📡 Automation system active - will auto-activate agents when usage resets")
        
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                self.log_message("🛑 Automation stopped by user")
                break
            except Exception as e:
                self.log_message(f"❌ Error in monitoring loop: {e}")
                time.sleep(300)  # Wait 5 minutes before retrying

def main():
    """Main function to run the automation"""
    import sys
    
    automation = ClaudeUsageResetAutomation()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "check":
            # Manual check
            if automation.should_activate_agents():
                print("✅ Ready for agent activation")
                automation.perform_automatic_activation()
            else:
                print("⏸️ Not ready for activation")
        elif command == "activate":
            # Force activation
            automation.log_message("🔧 Manual activation requested")
            automation.perform_automatic_activation()
        elif command == "status":
            # Show status
            last_activation = automation.get_last_activation_time()
            current_time = datetime.datetime.now()
            time_since = current_time - last_activation
            
            print(f"⏰ Current time: {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"📅 Last activation: {last_activation.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"⏳ Time since activation: {time_since}")
            print(f"🎯 Usage reset time: {automation.usage_reset_time}")
            print(f"✅ Ready for activation: {automation.should_activate_agents()}")
        else:
            print("❌ Unknown command")
    else:
        # Start continuous monitoring
        automation.start_monitoring()

if __name__ == "__main__":
    main()