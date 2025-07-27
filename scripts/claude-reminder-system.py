#!/usr/bin/env python3
"""
Claude Reminder System
Automatically reminds Claude to run context preservation scripts
"""

import time
import json
from pathlib import Path
from datetime import datetime, timedelta

class ClaudeReminderSystem:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.reminder_file = self.repo_root / "claude-reminders.json"
        self.load_reminders()
    
    def load_reminders(self):
        """Load existing reminders"""
        if self.reminder_file.exists():
            try:
                with open(self.reminder_file, 'r') as f:
                    self.reminders = json.load(f)
            except:
                self.reminders = {}
        else:
            self.reminders = {}
    
    def save_reminders(self):
        """Save reminders to file"""
        try:
            with open(self.reminder_file, 'w') as f:
                json.dump(self.reminders, f, indent=2)
        except:
            pass
    
    def set_reminder(self, action, interval_minutes=5):
        """Set a reminder for an action"""
        self.reminders[action] = {
            "last_run": datetime.now().isoformat(),
            "interval_minutes": interval_minutes,
            "next_reminder": (datetime.now() + timedelta(minutes=interval_minutes)).isoformat()
        }
        self.save_reminders()
    
    def check_reminders(self):
        """Check if any reminders are due"""
        now = datetime.now()
        due_reminders = []
        
        for action, data in self.reminders.items():
            next_reminder = datetime.fromisoformat(data["next_reminder"])
            if now >= next_reminder:
                due_reminders.append(action)
                # Update next reminder
                self.reminders[action]["next_reminder"] = (
                    now + timedelta(minutes=data["interval_minutes"])
                ).isoformat()
        
        if due_reminders:
            self.save_reminders()
        
        return due_reminders
    
    def generate_reminder_message(self):
        """Generate reminder message for Claude"""
        due_actions = self.check_reminders()
        
        if not due_actions:
            return None
        
        message = "🔔 CLAUDE REMINDER: You should run the following scripts:\n"
        for action in due_actions:
            if action == "context_preservation":
                message += "   • python3 scripts/auto-save-production.py (Save context to GitHub)\n"
            elif action == "implementation_guide":
                message += "   • python3 scripts/update-implementation-guide.py (Update docs)\n"
            elif action == "status_update":
                message += "   • Update CURRENT_PRODUCTION_STATUS.md with latest changes\n"
        
        message += "\n💡 These should run automatically, but manual execution ensures nothing is lost!"
        return message
    
    def create_auto_reminder_comment(self):
        """Create a comment that can be added to code to remind Claude"""
        return """
# 🤖 CLAUDE AUTO-REMINDER SYSTEM ACTIVE 🤖
# 
# Auto-save scripts should run automatically when:
# - Files change significantly  
# - Git commits are made
# - 5+ minutes pass with uncommitted changes
#
# If you notice reminders aren't working, run:
# python3 scripts/claude-auto-hooks.py
"""

def main():
    """Check for due reminders"""
    reminder_system = ClaudeReminderSystem()
    
    # Set up default reminders
    reminder_system.set_reminder("context_preservation", 5)
    reminder_system.set_reminder("implementation_guide", 15)
    reminder_system.set_reminder("status_update", 10)
    
    # Check for due reminders
    message = reminder_system.generate_reminder_message()
    if message:
        print(message)
        return True
    else:
        print("✅ No reminders due")
        return False

if __name__ == "__main__":
    main()