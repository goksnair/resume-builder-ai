#!/usr/bin/env python3
"""
TodoWrite Integration Hook
Automatically triggers auto-save when TodoWrite completion thresholds are met
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any

def analyze_todo_completion(todos: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze todo completion status and determine if auto-save should trigger"""
    
    if not todos:
        return {"should_trigger": False, "reason": "No todos provided"}
    
    # Count completion status
    total = len(todos)
    completed = len([t for t in todos if t.get("status") == "completed"])
    pending = len([t for t in todos if t.get("status") == "pending"])
    in_progress = len([t for t in todos if t.get("status") == "in_progress"])
    
    # Count by priority
    high_priority = [t for t in todos if t.get("priority") == "high"]
    high_completed = [t for t in high_priority if t.get("status") == "completed"]
    
    # Calculate metrics
    completion_rate = completed / total if total > 0 else 0
    high_priority_completion = len(high_completed) / len(high_priority) if high_priority else 0
    
    # Determine trigger conditions
    trigger_conditions = {
        "high_completion_rate": completion_rate >= 0.8,  # 80% overall completion
        "high_priority_complete": len(high_completed) >= 2,  # 2+ high priority completed
        "all_high_priority_done": high_priority_completion >= 1.0,  # All high priority done
        "significant_progress": completed >= 3  # At least 3 tasks completed
    }
    
    should_trigger = any(trigger_conditions.values())
    
    return {
        "should_trigger": should_trigger,
        "completion_rate": completion_rate,
        "completed_count": completed,
        "total_count": total,
        "high_priority_completed": len(high_completed),
        "trigger_conditions": trigger_conditions,
        "trigger_reason": get_trigger_reason(trigger_conditions)
    }

def get_trigger_reason(conditions: Dict[str, bool]) -> str:
    """Get human-readable trigger reason"""
    
    if conditions["all_high_priority_done"]:
        return "All high priority tasks completed"
    elif conditions["high_priority_complete"]:
        return "2+ high priority tasks completed"  
    elif conditions["high_completion_rate"]:
        return "80%+ overall completion rate"
    elif conditions["significant_progress"]:
        return "Significant progress made (3+ tasks)"
    else:
        return "No trigger conditions met"

def trigger_auto_save(analysis: Dict[str, Any], todos: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Trigger auto-save system with todo context"""
    
    project_root = Path("/Users/gokulnair/Resume Builder")
    auto_save_script = project_root / "scripts" / "auto_save_hook.py"
    
    if not auto_save_script.exists():
        return {
            "success": False,
            "error": "Auto-save script not found",
            "script_path": str(auto_save_script)
        }
    
    try:
        # Prepare feature name based on completed todos
        completed_todos = [t for t in todos if t.get("status") == "completed"]
        feature_name = f"TodoWrite Auto-Save - {len(completed_todos)} Tasks Completed"
        
        # Add todo context to environment
        todo_context = {
            "trigger_reason": analysis["trigger_reason"],
            "completion_stats": f"{analysis['completed_count']}/{analysis['total_count']} tasks",
            "completion_rate": f"{analysis['completion_rate']*100:.1f}%",
            "high_priority_done": analysis["high_priority_completed"]
        }
        
        print(f"🔔 TodoWrite Auto-Save Triggered: {analysis['trigger_reason']}")
        print(f"📊 Stats: {todo_context['completion_stats']} ({todo_context['completion_rate']})")
        
        # Execute auto-save hook
        result = subprocess.run([
            sys.executable, str(auto_save_script),
            "todo", feature_name
        ], capture_output=True, text=True, cwd=project_root)
        
        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "feature_name": feature_name,
            "todo_context": todo_context
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "feature_name": feature_name
        }

def check_vscode_handover_conditions(analysis: Dict[str, Any], todos: List[Dict[str, Any]]) -> bool:
    """Check if conditions are met for VS Code Copilot handover"""
    
    # Check if backend-related high priority tasks are complete
    backend_tasks = [
        "database table conflicts",
        "api integration testing", 
        "response quality intelligence",
        "persona session manager"
    ]
    
    completed_todos = [t for t in todos if t.get("status") == "completed"]
    
    backend_completion = any(
        any(keyword in t.get("content", "").lower() for keyword in backend_tasks)
        for t in completed_todos
    )
    
    high_priority_done = analysis["high_priority_completed"] >= 2
    
    return backend_completion and high_priority_done

def todo_completion_monitor(todos: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Main function to monitor TodoWrite completion and trigger actions"""
    
    print("🔍 TodoWrite Completion Monitor - Analyzing...")
    
    # Analyze completion status
    analysis = analyze_todo_completion(todos)
    
    results = {
        "analysis": analysis,
        "auto_save_triggered": False,
        "handover_recommended": False,
        "actions_taken": []
    }
    
    # Check if auto-save should trigger
    if analysis["should_trigger"]:
        print(f"✅ Auto-save conditions met: {analysis['trigger_reason']}")
        
        # Trigger auto-save
        save_result = trigger_auto_save(analysis, todos)
        results["auto_save_triggered"] = save_result["success"]
        results["auto_save_result"] = save_result
        
        if save_result["success"]:
            results["actions_taken"].append("Auto-save completed successfully")
            print("✅ Auto-save completed!")
        else:
            results["actions_taken"].append(f"Auto-save failed: {save_result.get('error')}")
            print(f"❌ Auto-save failed: {save_result.get('error')}")
        
        # Check handover conditions
        if check_vscode_handover_conditions(analysis, todos):
            results["handover_recommended"] = True
            results["actions_taken"].append("VS Code Copilot handover recommended")
            
            print("🤝 VS Code Copilot handover recommended!")
            print("Backend tasks complete - ready for frontend development")
            print("Run: python3 .claude/vscode_copilot_integration.py")
    
    else:
        print(f"⏳ Auto-save conditions not met: {analysis['trigger_reason']}")
        print(f"📊 Progress: {analysis['completed_count']}/{analysis['total_count']} tasks completed")
    
    return results

# Integration function to be called by TodoWrite tool
def on_todo_update(todos: List[Dict[str, Any]]) -> None:
    """Function called by TodoWrite tool when todos are updated"""
    
    try:
        results = todo_completion_monitor(todos)
        
        # Log results for debugging
        log_file = Path("/Users/gokulnair/Resume Builder/.claude/todo_monitor.log")
        
        with open(log_file, 'a') as f:
            import datetime
            timestamp = datetime.datetime.now().isoformat()
            f.write(f"{timestamp}: {json.dumps(results, indent=2)}\n")
    
    except Exception as e:
        print(f"❌ TodoWrite integration error: {e}")

def main():
    """Main function for direct testing"""
    
    # Test with current todos
    test_todos = [
        {"id": "1", "content": "Resolve database table conflicts (SQLAlchemy metadata conflicts)", "status": "completed", "priority": "high"},
        {"id": "2", "content": "Complete API integration testing", "status": "completed", "priority": "high"},
        {"id": "3", "content": "Build persona selection frontend components", "status": "pending", "priority": "medium"},
        {"id": "4", "content": "Implement basic session management UI", "status": "pending", "priority": "medium"},
        {"id": "5", "content": "End-to-end conversation flow testing", "status": "pending", "priority": "medium"}
    ]
    
    print("🧪 Testing TodoWrite Integration Hook")
    print("=" * 50)
    
    results = todo_completion_monitor(test_todos)
    
    print("\n📊 Test Results:")
    print(f"Auto-save triggered: {results['auto_save_triggered']}")
    print(f"Handover recommended: {results['handover_recommended']}")
    print(f"Actions taken: {len(results['actions_taken'])}")
    
    for action in results["actions_taken"]:
        print(f"  • {action}")

if __name__ == "__main__":
    main()