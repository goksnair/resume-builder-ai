# ROCKET Framework API Specifications - VS Code Copilot Handover

## Overview
This document provides comprehensive API specifications for the ROCKET Framework backend integration, designed specifically for seamless handover to VS Code Copilot for frontend development.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Currently using basic session-based authentication. Enhanced authentication can be implemented as needed.

---

## Core API Endpoints

### 1. Unified Conversation Processing

#### POST `/conversation/process`
**Primary endpoint for all conversation interactions with intelligent routing**

**Request Body:**
```json
{
  "session_id": "string (required)",
  "user_input": "string (required)",
  "mode": "integrated_coaching | rocket_standard | psychology_enhanced | multi_persona",
  "persona_preference": "string (optional)",
  "enable_quality_analysis": true,
  "enable_achievement_mining": true
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "ai_response": "string",
    "rocket_insights": {...},
    "psychological_insights": [...],
    "persona_recommendations": [...],
    "alternative_responses": [...],
    "progress_data": {...},
    "mode": "string",
    "confidence_score": 0.85,
    "next_steps": [...]
  },
  "session_state": {
    "session_id": "string",
    "current_phase": "string",
    "conversation_state": {...},
    "message_count": 5,
    "created_at": "ISO timestamp",
    "updated_at": "ISO timestamp"
  },
  "processing_mode": "integrated_coaching",
  "enhanced_analysis": {
    "quality_analysis": {
      "clarity_score": 0.8,
      "specificity_score": 0.7,
      "achievement_density": 0.6,
      "quantification_score": 0.5,
      "overall_score": 0.65,
      "quality_level": "good",
      "improvement_suggestions": [...]
    },
    "achievement_mining": {
      "achievements_found": 3,
      "achievements": [
        {
          "context": "string",
          "action": "string", 
          "result": "string",
          "quantification": "string",
          "impact_level": "high | medium | low",
          "confidence_score": 0.85
        }
      ],
      "high_confidence_count": 2
    },
    "follow_up_intelligence": {
      "follow_up_questions": [...],
      "quality_insights": {...},
      "achievement_potential": {...}
    }
  },
  "api_version": "v1_enhanced",
  "processing_time": "sub_500ms"
}
```

---

### 2. Quality Analysis

#### POST `/conversation/quality-analysis`
**Standalone response quality analysis**

**Request Body:**
```json
{
  "user_response": "string (required)",
  "conversation_context": {
    "session_id": "string",
    "previous_responses": [...],
    "user_profile": {...}
  }
}
```

**Response:**
```json
{
  "success": true,
  "quality_analysis": {
    "clarity_score": 0.8,
    "specificity_score": 0.7,
    "achievement_density": 0.6,
    "quantification_score": 0.5,
    "overall_score": 0.65,
    "quality_level": "good | excellent | adequate | poor",
    "improvement_suggestions": [
      "Include specific company names, project titles, technologies, and timeframes",
      "Add specific numbers, percentages, dollar amounts, or measurable outcomes"
    ]
  },
  "analysis_timestamp": "ISO timestamp"
}
```

---

### 3. Achievement Mining

#### POST `/conversation/mine-achievements`
**Extract structured achievements from user responses**

**Request Body:**
```json
{
  "user_response": "string (required)",
  "context": {
    "session_id": "string",
    "career_stage": "string",
    "industry": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "achievement_mining": {
    "achievements_found": 3,
    "achievements": [
      {
        "context": "Led a cross-functional team during Q3 2023",
        "action": "Implemented new customer onboarding process",
        "result": "Reduced customer churn by 25%",
        "quantification": "25%",
        "impact_level": "high",
        "confidence_score": 0.85,
        "raw_text": "Led a cross-functional team during Q3 2023 to implement new customer onboarding process that reduced customer churn by 25%"
      }
    ],
    "high_confidence_count": 2,
    "quantified_achievements": 1
  },
  "analysis_timestamp": "ISO timestamp"
}
```

---

### 4. Multi-Persona System

#### GET `/personas/available`
**Get all available AI coaching personas**

**Response:**
```json
{
  "success": true,
  "personas": [
    {
      "persona_type": "career_psychologist",
      "name": "Dr. Maya Insight",
      "title": "Career & Organizational Psychologist",
      "expertise_areas": ["Personality Analysis", "Work Style Assessment", "Career Alignment"],
      "session_objectives": ["Understand personality", "Identify strengths", "Career guidance"],
      "communication_style": "Analytical and evidence-based"
    }
  ],
  "total_count": 7
}
```

#### POST `/personas/session/start`
**Start a persona-specific coaching session**

**Request Body:**
```json
{
  "user_id": "string (required)",
  "persona_type": "career_psychologist",
  "session_objectives": ["Understand work style", "Career guidance"],
  "conversation_session_id": "string (optional)"
}
```

#### POST `/personas/session/{session_id}/respond`
**Process response within persona context**

**Request Body:**
```json
{
  "user_response": "string (required)"
}
```

---

### 5. Conversation Mode Management

#### GET `/conversation/modes`
**Get available conversation modes**

**Response:**
```json
{
  "success": true,
  "available_modes": {
    "rocket_standard": {
      "name": "ROCKET Standard",
      "description": "Focus on Results-Optimized Career Knowledge Enhancement Toolkit",
      "features": ["CAR Framework", "Achievement Mining", "Quantification Focus"],
      "best_for": ["Resume building", "Interview preparation", "Achievement articulation"]
    },
    "psychology_enhanced": {
      "name": "Psychology Enhanced",
      "description": "Dr. Maya Insight persona with psychological analysis",
      "features": ["Personality Analysis", "Work Style Assessment", "Motivation Mapping"],
      "best_for": ["Career guidance", "Self-awareness", "Role alignment"]
    },
    "multi_persona": {
      "name": "Multi-Persona",
      "description": "Switch between different AI coaching personas",
      "features": ["7 Specialized Coaches", "Expert Perspectives", "Targeted Advice"],
      "best_for": ["Specific expertise", "Specialized guidance", "Multiple viewpoints"]
    },
    "integrated_coaching": {
      "name": "Integrated Coaching",
      "description": "Full integration of all coaching approaches",
      "features": ["Complete Analysis", "Multiple Perspectives", "Comprehensive Insights"],
      "best_for": ["Complete career development", "In-depth analysis", "Maximum value"]
    }
  },
  "default_mode": "integrated_coaching"
}
```

#### POST `/conversation/change-mode`
**Change conversation mode for existing session**

**Request Body:**
```json
{
  "session_id": "string (required)",
  "new_mode": "integrated_coaching",
  "reason": "User requested more comprehensive analysis"
}
```

---

### 6. Session Analytics

#### GET `/conversation/session/{session_id}/analytics`
**Get comprehensive session analytics**

**Response:**
```json
{
  "success": true,
  "analytics": {
    "session_summary": {
      "session_id": "string",
      "total_messages": 10,
      "user_messages": 5,
      "ai_messages": 5,
      "current_phase": "deep_dive",
      "conversation_state": {...}
    },
    "user_engagement": {
      "avg_response_length": 45.2,
      "total_words": 226,
      "response_frequency": 5
    },
    "conversation_progress": {
      "session_duration_messages": 10,
      "phases_completed": ["introduction", "exploration"],
      "quality_trend": "improving"
    }
  }
}
```

---

## Frontend Integration Guidelines

### 1. **Session Management**
- Use `session_id` to maintain conversation continuity
- Store session state locally for optimal UX
- Handle session creation and retrieval gracefully

### 2. **Real-time Quality Feedback**
- Display quality scores in real-time as user types
- Show improvement suggestions contextually
- Use visual indicators for quality levels (colors, progress bars)

### 3. **Achievement Visualization**
- Create cards/components for identified achievements
- Show confidence scores with visual indicators
- Allow users to edit/refine extracted achievements

### 4. **Mode Switching**
- Provide clear mode selection interface
- Explain benefits of each mode
- Allow seamless switching mid-conversation

### 5. **Progress Tracking**
- Visualize conversation progress
- Show phase transitions
- Display completion metrics

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "error_code": "VALIDATION_ERROR | SERVER_ERROR | NOT_FOUND",
  "details": {
    "field": "Specific field error",
    "suggestion": "How to fix the error"
  }
}
```

### Common Error Codes
- `400`: Validation error in request
- `404`: Session or resource not found
- `500`: Internal server error
- `503`: Service temporarily unavailable

---

## Performance Considerations

### Response Time Targets
- **Primary endpoints**: < 500ms
- **Quality analysis**: < 200ms  
- **Achievement mining**: < 300ms
- **Simple queries**: < 100ms

### Caching Strategy
- Cache persona definitions
- Cache quality analysis patterns
- Use session-based caching for conversation state

### Optimization Features
- Parallel processing for multiple analyses
- Pre-compiled regex patterns for performance
- Optimized database queries with proper indexing

---

## WebSocket Support (Future Enhancement)

### Real-time Updates
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8000/ws/conversation/{session_id}');

// Listen for real-time updates
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle quality scores, typing indicators, etc.
};
```

---

## Testing Endpoints

### Health Check
```
GET /conversation/health
```

### Sample Data
```
GET /conversation/sample-data
```

---

## Implementation Priority for Frontend

### Phase 1: Core Integration
1. Basic conversation interface with `/conversation/process`
2. Session management
3. Mode selection UI

### Phase 2: Enhanced Features  
1. Real-time quality analysis
2. Achievement mining visualization
3. Progress tracking

### Phase 3: Advanced Features
1. Multi-persona interface
2. Analytics dashboard
3. Export functionality

---

## Security Considerations

1. **Input Validation**: All user inputs are validated and sanitized
2. **Rate Limiting**: API calls are rate-limited to prevent abuse
3. **Session Security**: Session tokens should be handled securely
4. **Data Privacy**: User conversation data is handled according to privacy policies

---

## Support & Documentation

- **API Documentation**: Available at `/docs` (Swagger UI)
- **Schemas**: Available at `/openapi.json`
- **Health Monitoring**: Available at `/health`

This specification provides everything needed for VS Code Copilot to build a comprehensive frontend that leverages the full power of the ROCKET Framework backend system.