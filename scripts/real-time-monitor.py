#!/usr/bin/env python3

"""
🎯 REAL-TIME AGENT MONITOR
Live console display of autonomous agent activity and task execution
"""

import os
import json
import time
import asyncio
from pathlib import Path
from datetime import datetime
from typing import Dict, List
import subprocess

class RealTimeMonitor:
    def __init__(self):
        self.project_root = Path("/Users/gokulnair/Resume Builder")
        self.memory_dir = self.project_root / "agent-memory"
        self.log_dir = self.project_root / "logs"
        self.running = True
        
        # Agent colors for display
        self.agent_colors = {
            "boss-cto": "\033[95m",  # Magenta
            "product-manager-cpo": "\033[94m",  # Blue
            "ui-ux-agent": "\033[92m",  # Green
            "backend-agent": "\033[93m",  # Yellow
            "qa-security-engineer": "\033[91m",  # Red
            "devops-agent": "\033[96m",  # Cyan
        }
        self.reset_color = "\033[0m"
        self.bold = "\033[1m"
        
    def clear_screen(self):
        """Clear console screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
        
    def print_header(self):
        """Print monitor header"""
        print(f"{self.bold}🎯 AUTONOMOUS AGENT REAL-TIME MONITOR{self.reset_color}")
        print("=" * 60)
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Project: Resume Builder AI - Elite Development System")
        print("=" * 60)
        
    def get_system_status(self) -> Dict:
        """Get current system status"""
        # Check if autonomous system is running
        try:
            result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
            system_running = 'full-live-system.py' in result.stdout
            
            if system_running:
                # Extract PID
                lines = result.stdout.split('\n')
                pid = None
                for line in lines:
                    if 'full-live-system.py' in line and 'grep' not in line:
                        pid = line.split()[1]
                        break
            else:
                pid = None
                
        except:
            system_running = False
            pid = None
            
        return {
            "running": system_running,
            "pid": pid,
            "uptime": self.get_uptime() if system_running else "Not running"
        }
        
    def get_uptime(self) -> str:
        """Get system uptime"""
        state_file = self.memory_dir / "live-system-state.json"
        if state_file.exists():
            try:
                with open(state_file, 'r') as f:
                    data = json.load(f)
                    return f"{data.get('uptime', 0):.0f}s"
            except:
                pass
        return "Unknown"
        
    def get_agent_status(self) -> Dict:
        """Get status of all agents"""
        agents = {}
        execution_dir = self.memory_dir / "execution-results"
        
        if execution_dir.exists():
            for agent in ["boss-cto", "product-manager-cpo", "ui-ux-agent", 
                         "backend-agent", "qa-security-engineer", "devops-agent"]:
                
                # Find latest execution
                latest_file = None
                latest_time = 0
                
                for file in execution_dir.glob(f"{agent}-*.json"):
                    mtime = file.stat().st_mtime
                    if mtime > latest_time:
                        latest_time = mtime
                        latest_file = file
                
                if latest_file:
                    try:
                        with open(latest_file, 'r') as f:
                            data = json.load(f)
                            agents[agent] = {
                                "last_task": data.get("task", "Unknown")[:40] + "...",
                                "status": "✅ Success" if data.get("result", {}).get("success") else "❌ Failed",
                                "last_run": datetime.fromtimestamp(latest_time).strftime("%H:%M:%S"),
                                "execution_time": data.get("result", {}).get("execution_time", "Unknown")
                            }
                    except:
                        agents[agent] = {
                            "last_task": "Error reading status",
                            "status": "❓ Unknown",
                            "last_run": "Unknown",
                            "execution_time": "Unknown"
                        }
                else:
                    agents[agent] = {
                        "last_task": "No tasks executed",
                        "status": "⏸️ Idle",
                        "last_run": "Never",
                        "execution_time": "N/A"
                    }
        
        return agents
        
    def get_current_tasks(self) -> List[Dict]:
        """Get currently queued or executing tasks"""
        tasks = []
        
        # Check log file for recent activity
        log_file = self.log_dir / "autonomous-system-live.log"
        if log_file.exists():
            try:
                with open(log_file, 'r') as f:
                    lines = f.readlines()[-20:]  # Last 20 lines
                    
                for line in lines:
                    if "📋 Task queued:" in line or "🤖 Executing live task:" in line:
                        # Parse agent and task from log line
                        if ":" in line:
                            parts = line.split(":", 3)
                            if len(parts) >= 4:
                                timestamp = parts[0] + ":" + parts[1] + ":" + parts[2].split()[0]
                                message = parts[3].strip()
                                
                                if "Task queued:" in message:
                                    agent_task = message.split("Task queued: ")[1]
                                    status = "⏳ Queued"
                                elif "Executing live task:" in message:
                                    agent_task = message.split("Executing live task: ")[1]
                                    status = "🔄 Executing"
                                else:
                                    continue
                                    
                                if " - " in agent_task:
                                    agent, task = agent_task.split(" - ", 1)
                                    tasks.append({
                                        "agent": agent,
                                        "task": task[:50] + "..." if len(task) > 50 else task,
                                        "status": status,
                                        "time": timestamp.split()[-1]
                                    })
            except:
                pass
                
        return tasks[-5:]  # Last 5 tasks
        
    def get_product_status(self) -> Dict:
        """Get current product development status"""
        status_file = self.project_root / "CURRENT_PRODUCTION_STATUS.md"
        if status_file.exists():
            try:
                with open(status_file, 'r') as f:
                    content = f.read()
                    
                # Extract key information
                if "READY FOR DEPLOYMENT" in content:
                    stage = "🟡 Ready for Deployment"
                elif "PRODUCTION SCALE" in content:
                    stage = "🟢 Production Scale"
                elif "Elite Resume Comparison Engine" in content:
                    stage = "🚀 Elite Features Complete"
                else:
                    stage = "🔧 Development"
                    
                # Extract URLs
                frontend_url = "https://tranquil-frangipane-ceffd4.netlify.app"
                backend_url = "https://resume-builder-ai-production.up.railway.app"
                
                return {
                    "stage": stage,
                    "frontend": frontend_url,
                    "backend": backend_url,
                    "features": "Elite Resume Engine, ROCKET Framework, AI Dashboard"
                }
            except:
                pass
                
        return {
            "stage": "Unknown",
            "frontend": "Not available",
            "backend": "Not available", 
            "features": "Status not available"
        }
        
    def display_monitor(self):
        """Display the real-time monitor"""
        self.clear_screen()
        self.print_header()
        
        # System Status
        system = self.get_system_status()
        print(f"\n🖥️  SYSTEM STATUS")
        print(f"   Status: {'🟢 RUNNING' if system['running'] else '🔴 STOPPED'}")
        if system['running']:
            print(f"   PID: {system['pid']}")
            print(f"   Uptime: {system['uptime']}")
        
        # Product Development Status
        product = self.get_product_status()
        print(f"\n📊 PRODUCT DEVELOPMENT")
        print(f"   Stage: {product['stage']}")
        print(f"   Features: {product['features']}")
        print(f"   Frontend: {product['frontend']}")
        print(f"   Backend: {product['backend']}")
        
        # Agent Status
        print(f"\n🤖 AGENT STATUS")
        agents = self.get_agent_status()
        for agent, info in agents.items():
            color = self.agent_colors.get(agent, "")
            print(f"   {color}{agent.upper():<20}{self.reset_color} {info['status']:<12} Last: {info['last_run']}")
            print(f"   {'':>20} Task: {info['last_task']}")
        
        # Current Tasks
        print(f"\n📋 RECENT ACTIVITY")
        tasks = self.get_current_tasks()
        if tasks:
            for task in tasks:
                color = self.agent_colors.get(task['agent'], "")
                print(f"   {task['time']} {color}{task['agent']:<15}{self.reset_color} {task['status']} {task['task']}")
        else:
            print("   No recent activity")
            
        # Usage Reset Status
        reset_file = self.memory_dir / "pending-reset.json"
        if reset_file.exists():
            try:
                with open(reset_file, 'r') as f:
                    reset_data = json.load(f)
                    print(f"\n⏰ USAGE RESET SCHEDULED")
                    print(f"   Time: {reset_data.get('reset_time', 'Unknown')}")
                    print(f"   Timezone: {reset_data.get('timezone', 'Unknown')}")
                    print(f"   Status: {reset_data.get('status', 'Unknown')}")
            except:
                pass
        
        print(f"\n🔄 Auto-refresh in 5 seconds... (Ctrl+C to exit)")
        
    async def run_monitor(self):
        """Run the monitor loop"""
        print("🎯 Starting Real-Time Agent Monitor...")
        print("Press Ctrl+C to exit")
        
        try:
            while self.running:
                self.display_monitor()
                await asyncio.sleep(5)
        except KeyboardInterrupt:
            print(f"\n{self.bold}🛑 Monitor stopped{self.reset_color}")
            
    def stop_monitor(self):
        """Stop the monitor"""
        self.running = False

async def main():
    """Main entry point"""
    monitor = RealTimeMonitor()
    await monitor.run_monitor()

if __name__ == "__main__":
    asyncio.run(main())