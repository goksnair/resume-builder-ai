#!/usr/bin/env python3
"""
Claude Code CLI Agent Manager
Simple commands to manage and interact with agents
"""

import os
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Optional

class AgentManager:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent
        self.agents_dir = self.repo_root / ".claude/agents"
        self.agents_dir.mkdir(parents=True, exist_ok=True)
        
    def discover_agents(self) -> List[Dict]:
        """Discover all available agents"""
        agents = []
        
        # Project-level agents
        if self.agents_dir.exists():
            for agent_file in self.agents_dir.glob("*.md"):
                agent_info = self.parse_agent_file(agent_file, "project")
                if agent_info:
                    agents.append(agent_info)
        
        # Global agents (if they exist)
        global_agents_dir = Path.home() / ".claude/agents"
        if global_agents_dir.exists():
            for agent_file in global_agents_dir.glob("*.md"):
                agent_info = self.parse_agent_file(agent_file, "global")
                if agent_info:
                    agents.append(agent_info)
        
        return agents
    
    def parse_agent_file(self, agent_file: Path, scope: str) -> Optional[Dict]:
        """Parse agent configuration from markdown file"""
        try:
            content = agent_file.read_text()
            
            # Extract YAML frontmatter
            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    yaml_content = parts[1].strip()
                    description = parts[2].strip()
                    
                    # Parse YAML manually (simple approach)
                    agent_info = {"scope": scope, "file": str(agent_file)}
                    for line in yaml_content.split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            agent_info[key.strip()] = value.strip()
                    
                    # Add description
                    agent_info["full_description"] = description
                    return agent_info
        except Exception as e:
            print(f"Error parsing {agent_file}: {e}")
        
        return None
    
    def list_agents(self):
        """List all available agents"""
        agents = self.discover_agents()
        
        if not agents:
            print("❌ No agents found")
            print("💡 Create agents in .claude/agents/ directory")
            return
        
        print("🤖 Available Claude Code CLI Agents:")
        print("=" * 50)
        
        for i, agent in enumerate(agents, 1):
            name = agent.get('name', 'unnamed')
            description = agent.get('description', 'No description')
            scope = agent.get('scope', 'unknown')
            tools = agent.get('tools', 'All tools')
            
            print(f"{i}. 📋 {name} ({scope})")
            print(f"   Description: {description}")
            print(f"   Tools: {tools}")
            print()
    
    def show_agent_details(self, agent_name: str):
        """Show detailed information about a specific agent"""
        agents = self.discover_agents()
        agent = next((a for a in agents if a.get('name') == agent_name), None)
        
        if not agent:
            print(f"❌ Agent '{agent_name}' not found")
            return
        
        print(f"🤖 Agent Details: {agent_name}")
        print("=" * 50)
        print(f"Name: {agent.get('name')}")
        print(f"Scope: {agent.get('scope')}")
        print(f"Description: {agent.get('description')}")
        print(f"Tools: {agent.get('tools')}")
        print(f"File: {agent.get('file')}")
        print()
        print("Full Description:")
        print("-" * 20)
        print(agent.get('full_description', 'No detailed description available'))
    
    def assign_task(self, agent_name: str, task_description: str, task_type: str = "general-purpose"):
        """Assign a task to a specific agent"""
        agents = self.discover_agents()
        agent = next((a for a in agents if a.get('name') == agent_name), None)
        
        if not agent:
            print(f"❌ Agent '{agent_name}' not found")
            return False
        
        # Create the task command
        task_prompt = f"/{agent_name} {task_description}"
        
        print(f"🚀 Assigning task to {agent_name}:")
        print(f"📋 Task: {task_description}")
        print(f"🤖 Agent prompt: {task_prompt}")
        print()
        print("💡 Use this command in Claude Code CLI:")
        print(f'Task(description="{task_description}", prompt="{task_prompt}", subagent_type="{task_type}")')
        print()
        
        return True
    
    def create_agent_assignment_script(self, agent_name: str, task_description: str):
        """Create a script file for easy agent task assignment"""
        script_content = f"""#!/usr/bin/env python3
\"\"\"
Auto-generated agent assignment script
Agent: {agent_name}
Task: {task_description}
\"\"\"

def assign_task():
    task_prompt = "/{agent_name} {task_description}"
    
    print("🤖 Agent Task Assignment")
    print(f"Agent: {agent_name}")
    print(f"Task: {task_description}")
    print()
    print("Claude Code CLI Command:")
    print(f'Task(description="{task_description}", prompt="{task_prompt}", subagent_type="general-purpose")')

if __name__ == "__main__":
    assign_task()
"""
        
        script_file = self.repo_root / f"assign-{agent_name}-task.py"
        script_file.write_text(script_content)
        script_file.chmod(0o755)
        
        print(f"✅ Created assignment script: {script_file}")
        return script_file

def main():
    """Main CLI interface"""
    import sys
    
    manager = AgentManager()
    
    if len(sys.argv) < 2:
        print("🤖 Claude Code CLI Agent Manager")
        print()
        print("Commands:")
        print("  list                           - Show all agents")
        print("  show <agent-name>             - Show agent details")
        print("  assign <agent-name> <task>    - Assign task to agent")
        print("  create-script <agent> <task>  - Create assignment script")
        print()
        print("Examples:")
        print("  python3 agent-manager.py list")
        print("  python3 agent-manager.py show conversation-architect")
        print("  python3 agent-manager.py assign ui-experience-designer 'Create beautiful hero section'")
        return
    
    command = sys.argv[1]
    
    if command == "list":
        manager.list_agents()
    
    elif command == "show" and len(sys.argv) >= 3:
        agent_name = sys.argv[2]
        manager.show_agent_details(agent_name)
    
    elif command == "assign" and len(sys.argv) >= 4:
        agent_name = sys.argv[2]
        task_description = " ".join(sys.argv[3:])
        manager.assign_task(agent_name, task_description)
    
    elif command == "create-script" and len(sys.argv) >= 4:
        agent_name = sys.argv[2]
        task_description = " ".join(sys.argv[3:])
        manager.create_agent_assignment_script(agent_name, task_description)
    
    else:
        print("❌ Invalid command. Use 'python3 agent-manager.py' for help.")

if __name__ == "__main__":
    main()