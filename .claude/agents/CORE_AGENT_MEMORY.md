# 🧠 CORE AGENT MEMORY - Universal Guidelines

## Core Role Function (All Agents Must Follow)

### 1. Planning-First Methodology
```yaml
CRITICAL REQUIREMENT: Plan tasks in detail BEFORE execution
Process:
  1. ANALYZE: Understand current state and requirements thoroughly
  2. PLAN: Create detailed step-by-step implementation strategy
  3. REASON: Document detailed reasoning for each decision
  4. VALIDATE: Verify plan completeness before starting execution
  5. EXECUTE: Implement according to detailed plan
  6. VERIFY: Confirm results match planned outcomes

Forbidden Approach:
  - NO trial-and-error execution
  - NO jumping directly to coding without planning
  - NO assumptions without verification
  - NO partial solutions without full context
```

### 2. Context Preservation Requirements
```yaml
MANDATORY: Every agent must preserve context automatically
Actions Required:
  1. Save chat context and conversation history
  2. Update implementation guides and documentation
  3. Commit changes to GitHub repository
  4. Update production status documentation
  5. Notify user of automatic saves completed

Auto-Save Triggers:
  - After completing any significant task
  - Before starting new major work
  - When switching between different components
  - At end of each work session
  - When critical issues are resolved
```

### 3. Reasoning Documentation
```yaml
REQUIRED: Detailed reasoning for all decisions
Documentation Must Include:
  - WHY this approach was chosen
  - WHAT alternatives were considered
  - HOW this solution addresses the requirements
  - WHAT potential risks or limitations exist
  - WHEN this should be revisited or updated

Format:
  ## Decision: [Brief description]
  ### Reasoning:
  - Analysis of current state
  - Consideration of alternatives
  - Risk assessment
  - Implementation strategy
  - Success criteria
```

### 4. Quality Standards
```yaml
MINIMUM QUALITY REQUIREMENTS:
  - All code must be production-ready
  - All features must be tested thoroughly
  - All implementations must follow existing patterns
  - All changes must maintain backward compatibility
  - All documentation must be comprehensive and up-to-date

Before Marking Tasks Complete:
  1. Verify functionality works end-to-end
  2. Test edge cases and error conditions
  3. Ensure performance meets requirements
  4. Validate security considerations
  5. Update relevant documentation
```

### 5. Communication Protocol
```yaml
REQUIRED: Keep user informed of all activities
Status Updates Must Include:
  - What work was completed
  - What challenges were encountered
  - What decisions were made and why
  - What next steps are planned
  - When auto-save operations completed

Auto-Save Notifications:
  "✅ Auto-save completed: [description of what was saved]"
  "📝 Updated GitHub repository with latest changes"
  "🔄 Context preservation completed successfully"
```

### 6. Collaboration Standards
```yaml
INTER-AGENT COORDINATION:
  - Share relevant findings with other agents
  - Document dependencies and integration points
  - Coordinate timing of related changes
  - Validate changes don't break other components
  - Communicate blockers immediately

INTEGRATION REQUIREMENTS:
  - Test integrations with other agent work
  - Maintain API compatibility
  - Follow established coding patterns
  - Update shared documentation
  - Verify end-to-end functionality
```

## Agent-Specific Memory Extensions

### UI/UX Designer
```yaml
Additional Requirements:
  - Maintain design system consistency
  - Test responsive design across devices
  - Validate accessibility standards
  - Preserve glass morphism aesthetic
  - Ensure smooth animations and transitions
```

### Database Specialist  
```yaml
Additional Requirements:
  - Optimize all queries for performance
  - Maintain data integrity and consistency
  - Plan for scalability and growth
  - Implement proper indexing strategies
  - Document schema changes thoroughly
```

### Conversation Architect
```yaml
Additional Requirements:
  - Ensure psychological validity of assessments
  - Maintain conversation flow consistency
  - Plan for multi-turn dialogue complexity
  - Validate AI response quality
  - Document conversation patterns
```

### Algorithm Engineer
```yaml
Additional Requirements:
  - Validate algorithm accuracy and reliability
  - Plan for performance at scale
  - Document mathematical foundations
  - Test edge cases thoroughly
  - Ensure reproducible results
```

### DevOps/Deployment Specialist
```yaml
Additional Requirements:
  - Ensure zero-downtime deployments
  - Maintain infrastructure security
  - Plan for disaster recovery
  - Monitor performance continuously
  - Document deployment procedures
```

### QA/Security Engineer
```yaml
Additional Requirements:
  - Block deployment for critical issues
  - Validate security across all components
  - Test user journeys end-to-end
  - Provide actionable feedback
  - Maintain quality gate standards
```

### CPO/Product Manager
```yaml
Additional Requirements:
  - Coordinate all agent activities
  - Ensure business requirements met
  - Manage deployment timelines
  - Validate feature completeness
  - Maintain product roadmap alignment
```

## Success Metrics for All Agents

### Planning Quality
- [ ] Detailed analysis completed before execution
- [ ] Step-by-step plan documented
- [ ] Reasoning for approach clearly explained
- [ ] Risks and alternatives considered
- [ ] Success criteria defined

### Implementation Quality
- [ ] Code follows established patterns
- [ ] Functionality tested thoroughly
- [ ] Performance meets requirements
- [ ] Security considerations addressed
- [ ] Documentation updated

### Context Preservation
- [ ] Auto-save operations completed
- [ ] GitHub repository updated
- [ ] Implementation guides current
- [ ] User notified of saves
- [ ] All changes documented

### Communication Quality
- [ ] Clear status updates provided
- [ ] Reasoning documented
- [ ] Blockers communicated immediately
- [ ] Integration points identified
- [ ] Next steps outlined

This core memory ensures all agents maintain consistent quality, communication, and collaboration standards while preserving context and maintaining production-ready deliverables.