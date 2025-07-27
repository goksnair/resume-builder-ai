#!/usr/bin/env python3
"""
Auto-Save Production Context Script
Automatically saves context and updates GitHub repository when significant changes occur
"""

import os
import subprocess
import datetime
import json
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run shell command and return result"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def update_production_status():
    """Update the production status document with current timestamp"""
    status_file = Path(__file__).parent.parent / "CURRENT_PRODUCTION_STATUS.md"
    if status_file.exists():
        content = status_file.read_text()
        # Update timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        updated_content = content.replace(
            "*Last Updated: 2025-07-27 20:30:00 UTC*",
            f"*Last Updated: {timestamp}*"
        )
        status_file.write_text(updated_content)
        return True
    return False

def check_git_status():
    """Check if there are uncommitted changes"""
    repo_root = Path(__file__).parent.parent
    success, stdout, stderr = run_command("git status --porcelain", cwd=repo_root)
    return success and len(stdout.strip()) > 0

def auto_commit_changes():
    """Auto commit changes with descriptive message"""
    repo_root = Path(__file__).parent.parent
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Add all changes
    success, _, _ = run_command("git add .", cwd=repo_root)
    if not success:
        return False, "Failed to stage changes"
    
    # Create commit message
    commit_msg = f"🚀 Auto-save: Production context preservation - {timestamp}"
    
    # Commit changes
    success, stdout, stderr = run_command(f'git commit -m "{commit_msg}"', cwd=repo_root)
    if not success:
        return False, f"Failed to commit: {stderr}"
    
    return True, f"Committed changes: {stdout}"

def push_to_github():
    """Push changes to GitHub repository"""
    repo_root = Path(__file__).parent.parent
    success, stdout, stderr = run_command("git push origin main", cwd=repo_root)
    return success, stdout if success else stderr

def create_context_backup():
    """Create a backup of current context"""
    backup_data = {
        "timestamp": datetime.datetime.now().isoformat(),
        "production_urls": {
            "frontend": "https://tranquil-frangipane-ceffd4.netlify.app",
            "backend": "https://resume-builder-ai-production.up.railway.app",
            "github": "https://github.com/goksnair/resume-builder-ai.git"
        },
        "last_changes": {
            "frontend_restored": True,
            "backend_restored": True,
            "build_size": "453KB",
            "features_implemented": "ALL"
        },
        "deployment_status": {
            "frontend_needs_redeploy": True,
            "backend_needs_redeploy": True,
            "ready_for_testing": True
        }
    }
    
    backup_file = Path(__file__).parent.parent / "CONTEXT_BACKUP.json"
    backup_file.write_text(json.dumps(backup_data, indent=2))
    return True

def main():
    """Main auto-save function"""
    print("🔄 Starting auto-save production context...")
    
    # Update production status
    if update_production_status():
        print("✅ Updated production status document")
    
    # Create context backup
    if create_context_backup():
        print("✅ Created context backup")
    
    # Check if there are changes to commit
    if check_git_status():
        print("📝 Found uncommitted changes, auto-committing...")
        
        success, message = auto_commit_changes()
        if success:
            print(f"✅ {message}")
            
            # Push to GitHub
            print("🚀 Pushing to GitHub...")
            success, result = push_to_github()
            if success:
                print("✅ Successfully pushed to GitHub")
            else:
                print(f"⚠️ Failed to push to GitHub: {result}")
        else:
            print(f"❌ Failed to commit: {message}")
    else:
        print("✅ No uncommitted changes found")
    
    print("🎉 Auto-save production context completed!")

if __name__ == "__main__":
    main()