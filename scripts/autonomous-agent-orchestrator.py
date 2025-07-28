#!/usr/bin/env python3
"""
Autonomous Agent Orchestrator - Intelligent Multi-Agent System
Manages parallel agent execution with smart decision-making and auto-restart
"""

import os
import json
import time
import datetime
import subprocess
import threading
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

class AutonomousAgentOrchestrator:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.context_dir = self.repo_root / ".context"
        self.context_dir.mkdir(exist_ok=True)
        
        # Agent configuration
        self.agents = {
            "ui-experience-designer": {
                "priority": "high",
                "autonomy_level": "high",
                "can_proceed_without_confirmation": True,
                "critical_actions": ["delete_files", "change_core_architecture"]
            },
            "conversation-architect": {
                "priority": "high", 
                "autonomy_level": "high",
                "can_proceed_without_confirmation": True,
                "critical_actions": ["modify_ai_personas", "change_conversation_flow"]
            },
            "algorithm-engineer": {
                "priority": "medium",
                "autonomy_level": "high", 
                "can_proceed_without_confirmation": True,
                "critical_actions": ["modify_scoring_algorithms", "change_data_models"]
            },
            "database-specialist": {
                "priority": "medium",
                "autonomy_level": "medium",
                "can_proceed_without_confirmation": False,
                "critical_actions": ["schema_migrations", "data_deletion", "production_db_changes"]
            },
            "qa-security-engineer": {
                "priority": "high",
                "autonomy_level": "low",
                "can_proceed_without_confirmation": False,
                "critical_actions": ["security_configurations", "access_controls", "production_deployments"]
            },
            "devops-deployment-specialist": {
                "priority": "medium", 
                "autonomy_level": "medium",
                "can_proceed_without_confirmation": True,
                "critical_actions": ["production_deployments", "environment_changes", "security_configs"]
            },
            "cpo-product-manager": {
                "priority": "low",
                "autonomy_level": "high",
                "can_proceed_without_confirmation": True,
                "critical_actions": ["feature_scope_changes", "roadmap_modifications"]
            }
        }
        
        # Usage tracking
        self.last_activation_file = self.context_dir / "last-autonomous-activation.json"
        self.agent_status_file = self.context_dir / "agent-status.json"
        self.task_queue_file = self.context_dir / "autonomous-task-queue.json"
        self.usage_status_file = self.context_dir / "claude-usage-status.json"
        
        # Smart decision making
        self.project_context = self.load_project_context()
        self.user_preferences = self.load_user_preferences()
        
    def log(self, message: str, level: str = "info"):
        """Enhanced logging with levels"""
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        prefix = {
            "info": "ℹ️",
            "success": "✅", 
            "warning": "⚠️",
            "error": "❌",
            "agent": "🤖",
            "system": "🔧"
        }.get(level, "📝")
        
        log_message = f"[{timestamp}] {prefix} {message}"
        print(log_message)
        
        # Log to file
        log_file = self.context_dir / "autonomous-orchestration.log"
        with open(log_file, 'a') as f:
            f.write(log_message + "\n")
    
    def load_project_context(self) -> Dict:
        """Load project context for smart decision making"""
        context = {
            "established_patterns": [
                "ui_enhancements_always_approved",
                "feature_additions_encouraged", 
                "security_fixes_critical",
                "performance_optimizations_welcomed",
                "documentation_updates_automatic"
            ],
            "user_approval_history": {
                "ui_changes": "always_yes",
                "feature_development": "always_yes", 
                "security_improvements": "always_yes",
                "performance_optimizations": "always_yes",
                "deployment_automation": "usually_yes"
            },
            "critical_boundaries": [
                "no_data_deletion",
                "no_security_downgrades", 
                "no_breaking_changes",
                "preserve_user_data"
            ]
        }
        return context
    
    def load_user_preferences(self) -> Dict:
        """Load user preferences from history"""
        prefs_file = self.context_dir / "user-preferences.json"
        
        default_prefs = {
            "autonomous_development": True,
            "auto_approve_ui_changes": True,
            "auto_approve_feature_additions": True,
            "auto_approve_optimizations": True,
            "require_confirmation_for": [
                "production_deployments",
                "database_schema_changes",
                "security_configuration_changes",
                "data_deletion_operations"
            ],
            "parallel_agent_execution": True,
            "max_concurrent_agents": 4,
            "auto_restart_on_usage_reset": True
        }
        
        if prefs_file.exists():
            try:
                with open(prefs_file, 'r') as f:
                    stored_prefs = json.load(f)
                    default_prefs.update(stored_prefs)
            except:
                pass
                
        # Save updated preferences
        with open(prefs_file, 'w') as f:
            json.dump(default_prefs, f, indent=2)
            
        return default_prefs
    
    def can_proceed_autonomously(self, agent: str, task: str, action_type: str) -> Tuple[bool, str]:
        """Intelligent decision making for autonomous execution"""
        agent_config = self.agents.get(agent, {})
        
        # Check if action is in critical list
        critical_actions = agent_config.get("critical_actions", [])
        if any(critical in action_type.lower() for critical in critical_actions):
            return False, "Critical action requires user confirmation"
        
        # Check user preferences
        if not self.user_preferences.get("autonomous_development", True):
            return False, "Autonomous development disabled by user"
        
        # Check agent autonomy level
        autonomy_level = agent_config.get("autonomy_level", "medium")
        if autonomy_level == "low":
            return False, "Agent has low autonomy level"
        
        # Check established patterns
        task_lower = task.lower()
        action_lower = action_type.lower()
        
        # UI/UX changes - almost always approved
        if agent == "ui-experience-designer" and any(term in task_lower for term in ["ui", "interface", "design", "styling"]):
            if self.user_preferences.get("auto_approve_ui_changes", True):
                return True, "UI changes historically approved"
        
        # Feature development - usually approved
        if any(term in task_lower for term in ["feature", "implement", "add", "enhance"]):
            if self.user_preferences.get("auto_approve_feature_additions", True):
                return True, "Feature development historically approved"
        
        # Performance optimizations - usually approved
        if any(term in action_lower for term in ["optimize", "performance", "speed", "efficiency"]):
            if self.user_preferences.get("auto_approve_optimizations", True):
                return True, "Optimizations historically approved"
        
        # Security improvements - always approved
        if any(term in action_lower for term in ["security", "fix", "vulnerability"]):
            return True, "Security improvements always approved"
        
        # Documentation - always autonomous
        if any(term in action_lower for term in ["document", "readme", "guide", "comment"]):
            return True, "Documentation updates are autonomous"
        
        # Default based on agent autonomy
        if agent_config.get("can_proceed_without_confirmation", False):
            return True, f"Agent {agent} has autonomous execution privileges"
        
        return False, "Requires user confirmation"
    
    def create_autonomous_task_queue(self) -> List[Dict]:
        """Create intelligent task queue based on current state"""
        tasks = []
        
        # Check implementation guide for next features
        impl_guide = self.repo_root / "IMPLEMENTATION_GUIDE.md"
        if impl_guide.exists():
            content = impl_guide.read_text()
            
            # Parse for incomplete features
            if "Enhanced UI v2.0" in content and "[ ]" in content:
                tasks.append({
                    "agent": "ui-experience-designer",
                    "task": "Complete Enhanced UI v2.0 implementation",
                    "action_type": "ui_enhancement", 
                    "priority": "high",
                    "autonomous": True
                })
            
            if "Advanced Analytics Dashboard" in content and "[ ]" in content:
                tasks.append({
                    "agent": "ui-experience-designer",
                    "task": "Implement Advanced Analytics Dashboard",
                    "action_type": "feature_development",
                    "priority": "medium", 
                    "autonomous": True
                })
        
        # Check for pending security fixes
        qa_audit = self.repo_root / "QA_SECURITY_AUDIT_REPORT.md"
        if qa_audit.exists():
            tasks.append({
                "agent": "qa-security-engineer",
                "task": "Validate security fixes in production",
                "action_type": "security_validation",
                "priority": "high",
                "autonomous": False  # Security requires confirmation
            })
        
        # Check for deployment needs
        if (self.repo_root / "apps" / "web-app" / "dist").exists():
            tasks.append({
                "agent": "devops-deployment-specialist", 
                "task": "Deploy Enhanced UI v2.0 to production",
                "action_type": "deployment",
                "priority": "medium",
                "autonomous": True  # Non-critical deployment
            })
        
        # Context optimization - always autonomous
        tasks.append({
            "agent": "context-engineer",
            "task": "Run context optimization and monitoring",
            "action_type": "optimization",
            "priority": "low",
            "autonomous": True
        })
        
        return tasks
    
    def execute_agent_task(self, agent: str, task: str, action_type: str) -> Dict:
        """Execute a single agent task"""
        start_time = time.time()
        
        self.log(f"Starting task for {agent}: {task[:50]}...", "agent")
        
        # Check if can proceed autonomously
        can_proceed, reason = self.can_proceed_autonomously(agent, task, action_type)
        
        if not can_proceed:
            self.log(f"Task paused for {agent}: {reason}", "warning")
            return {
                "agent": agent,
                "task": task,
                "status": "paused_for_confirmation",
                "reason": reason,
                "duration": 0
            }
        
        try:
            # Execute via Claude Code agent assignment
            cmd = [
                "claude", "chat", 
                f"./agent assign {agent} '{task}'"
            ]
            
            result = subprocess.run(
                cmd,
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                timeout=600  # 10 minute timeout per task
            )
            
            duration = time.time() - start_time
            
            if result.returncode == 0:
                self.log(f"Completed task for {agent} in {duration:.1f}s", "success")
                return {
                    "agent": agent,
                    "task": task,
                    "status": "completed",
                    "duration": duration,
                    "output": result.stdout[:500]  # Truncate long output
                }
            else:
                self.log(f"Task failed for {agent}: {result.stderr[:100]}", "error")
                return {
                    "agent": agent,
                    "task": task, 
                    "status": "failed",
                    "duration": duration,
                    "error": result.stderr[:200]
                }
                
        except subprocess.TimeoutExpired:
            self.log(f"Task timeout for {agent}", "warning")
            return {
                "agent": agent,
                "task": task,
                "status": "timeout", 
                "duration": 600
            }
        except Exception as e:
            self.log(f"Task error for {agent}: {str(e)}", "error")
            return {
                "agent": agent,
                "task": task,
                "status": "error",
                "duration": time.time() - start_time,
                "error": str(e)
            }
    
    def execute_parallel_agents(self, tasks: List[Dict]) -> List[Dict]:
        """Execute multiple agent tasks in parallel"""
        max_workers = min(self.user_preferences.get("max_concurrent_agents", 4), len(tasks))
        
        self.log(f"Starting parallel execution with {max_workers} agents", "system")
        
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all autonomous tasks
            future_to_task = {}
            for task in tasks:
                if task.get("autonomous", True):
                    future = executor.submit(
                        self.execute_agent_task,
                        task["agent"], 
                        task["task"],
                        task["action_type"]
                    )
                    future_to_task[future] = task
                else:
                    # Add non-autonomous tasks to results as paused
                    results.append({
                        "agent": task["agent"],
                        "task": task["task"],
                        "status": "requires_confirmation",
                        "reason": "Manual confirmation required"
                    })
            
            # Collect results as they complete
            for future in as_completed(future_to_task):
                result = future.result()
                results.append(result)
        
        return results
    
    def detect_claude_usage_reset(self) -> Tuple[bool, str]:
        """Detect if Claude usage has been reset by testing API availability"""
        try:
            # Test if Claude is available by running a simple command
            result = subprocess.run(
                ["claude", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            current_time = datetime.datetime.now()
            
            # If command succeeds, Claude is available
            if result.returncode == 0:
                # Check if we were previously in a usage-limited state
                if self.was_usage_limited():
                    self.log("🎉 Claude usage reset detected - API is now available!", "success")
                    self.clear_usage_limited_flag()
                    return True, "usage_reset_detected"
                else:
                    return False, "already_available"
            else:
                # Claude is not available - likely usage limited
                self.set_usage_limited_flag()
                return False, "usage_limited"
                
        except subprocess.TimeoutExpired:
            self.set_usage_limited_flag()
            return False, "timeout_likely_usage_limited"
        except Exception as e:
            self.log(f"Error detecting Claude status: {e}", "warning")
            return False, "detection_error"
    
    def was_usage_limited(self) -> bool:
        """Check if we were previously in usage-limited state"""
        if not self.usage_status_file.exists():
            return False
        
        try:
            with open(self.usage_status_file, 'r') as f:
                status = json.load(f)
                return status.get("usage_limited", False)
        except:
            return False
    
    def set_usage_limited_flag(self):
        """Mark that Claude is currently usage limited"""
        status_data = {
            "usage_limited": True,
            "limited_since": datetime.datetime.now().isoformat(),
            "last_check": datetime.datetime.now().isoformat()
        }
        
        with open(self.usage_status_file, 'w') as f:
            json.dump(status_data, f, indent=2)
    
    def clear_usage_limited_flag(self):
        """Clear the usage limited flag"""
        status_data = {
            "usage_limited": False,
            "reset_detected_at": datetime.datetime.now().isoformat(),
            "last_check": datetime.datetime.now().isoformat()
        }
        
        with open(self.usage_status_file, 'w') as f:
            json.dump(status_data, f, indent=2)
    
    def should_auto_restart(self) -> Tuple[bool, str]:
        """Check if system should auto-restart after usage reset"""
        if not self.user_preferences.get("auto_restart_on_usage_reset", True):
            return False, "auto_restart_disabled"
        
        # Check if Claude usage has been reset
        usage_reset, reason = self.detect_claude_usage_reset()
        if not usage_reset:
            return False, reason
        
        # Check if enough time has passed since last activation (minimum 30 minutes)
        current_time = datetime.datetime.now()
        last_activation = self.get_last_activation_time()
        time_since_activation = current_time - last_activation
        
        if time_since_activation.total_seconds() < 30 * 60:  # 30 minutes
            return False, "too_soon_since_last_activation"
        
        return True, "ready_for_activation"
    
    def get_last_activation_time(self) -> datetime.datetime:
        """Get last activation timestamp"""
        if not self.last_activation_file.exists():
            return datetime.datetime.now() - datetime.timedelta(days=1)
        
        try:
            with open(self.last_activation_file, 'r') as f:
                data = json.load(f)
                return datetime.datetime.fromisoformat(data['timestamp'])
        except:
            return datetime.datetime.now() - datetime.timedelta(days=1)
    
    def update_activation_time(self):
        """Update last activation timestamp"""
        activation_data = {
            "timestamp": datetime.datetime.now().isoformat(),
            "trigger": "auto_restart_on_usage_reset",
            "agents_activated": list(self.agents.keys())
        }
        
        with open(self.last_activation_file, 'w') as f:
            json.dump(activation_data, f, indent=2)
    
    def run_autonomous_cycle(self):
        """Run a complete autonomous development cycle"""
        self.log("🚀 Starting Autonomous Development Cycle", "system")
        
        # Context preservation
        self.log("💾 Running context preservation", "info")
        subprocess.run(["python3", "scripts/safe-auto-save.py"], cwd=self.repo_root)
        
        # Context optimization
        self.log("🧠 Running context optimization", "info") 
        subprocess.run(["python3", "scripts/context-optimization-system.py"], cwd=self.repo_root)
        
        # Create task queue
        tasks = self.create_autonomous_task_queue()
        self.log(f"📋 Created task queue with {len(tasks)} tasks", "info")
        
        # Execute tasks in parallel
        results = self.execute_parallel_agents(tasks)
        
        # Report results
        completed = len([r for r in results if r["status"] == "completed"])
        paused = len([r for r in results if "paused" in r["status"] or "requires" in r["status"]])
        failed = len([r for r in results if r["status"] in ["failed", "error", "timeout"]])
        
        self.log(f"📊 Cycle complete: {completed} completed, {paused} paused, {failed} failed", "success")
        
        # Save results
        results_file = self.context_dir / f"cycle-results-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        return results
    
    def start_autonomous_monitoring(self):
        """Start the autonomous monitoring and restart system"""
        self.log("🛡️ Starting Autonomous Agent Monitoring", "system")
        self.log("⚡ Real-time usage reset detection - will activate agents ANYTIME usage resets", "info")
        
        check_interval = 60  # Check every minute initially
        usage_limited_interval = 300  # Check every 5 minutes when usage limited
        
        while True:
            try:
                should_restart, reason = self.should_auto_restart()
                
                if should_restart:
                    self.log("🎯 Claude usage reset detected - starting autonomous cycle!", "success")
                    self.update_activation_time()
                    self.run_autonomous_cycle()
                    check_interval = 60  # Reset to normal checking
                elif reason == "usage_limited":
                    if check_interval == 60:  # Just became limited
                        self.log("⏸️ Claude usage limited - monitoring for reset...", "warning")
                    check_interval = usage_limited_interval  # Check less frequently when limited
                elif reason == "already_available":
                    check_interval = 60  # Normal monitoring
                else:
                    # Other reasons (too soon, disabled, etc.)
                    check_interval = 60
                
                # Log status every 30 minutes when usage limited
                if reason == "usage_limited" and int(time.time()) % 1800 == 0:
                    self.log("🔍 Still monitoring for Claude usage reset...", "info")
                
                time.sleep(check_interval)
                
            except KeyboardInterrupt:
                self.log("🛑 Autonomous monitoring stopped by user", "warning")
                break
            except Exception as e:
                self.log(f"❌ Error in monitoring: {e}", "error")
                time.sleep(60)  # Wait 1 minute before retrying

def main():
    orchestrator = AutonomousAgentOrchestrator()
    
    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "run":
            orchestrator.run_autonomous_cycle()
        elif command == "monitor": 
            orchestrator.start_autonomous_monitoring()
        elif command == "status":
            last_activation = orchestrator.get_last_activation_time()
            print(f"⏰ Last activation: {last_activation}")
            print(f"🎯 Auto-restart ready: {orchestrator.should_auto_restart()}")
        else:
            print("Usage: python autonomous-agent-orchestrator.py [run|monitor|status]")
    else:
        # Default to monitoring
        orchestrator.start_autonomous_monitoring()

if __name__ == "__main__":
    main()