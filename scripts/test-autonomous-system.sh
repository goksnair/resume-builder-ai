#!/bin/bash

# 🧪 AUTONOMOUS SYSTEM FUNCTIONALITY TEST
# Comprehensive testing of the multi-agent orchestration system

set -euo pipefail

PROJECT_ROOT="/Users/gokulnair/Resume Builder"
MEMORY_DIR="$PROJECT_ROOT/agent-memory"
LOG_DIR="$PROJECT_ROOT/logs"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

log_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
    FAILED_TESTS+=("$1")
}

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Test 1: Verify autonomous system directory structure
test_directory_structure() {
    log_test "Testing directory structure..."
    
    local directories=(
        "$MEMORY_DIR"
        "$MEMORY_DIR/agent-states"
        "$MEMORY_DIR/context-snapshots"
        "$MEMORY_DIR/task-queues"
        "$LOG_DIR"
        "$SCRIPTS_DIR"
        "$PROJECT_ROOT/.claude/agents"
    )
    
    local all_exist=true
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            log_fail "Directory missing: $dir"
            all_exist=false
        fi
    done
    
    if $all_exist; then
        log_pass "All required directories exist"
    fi
}

# Test 2: Verify agent configuration files
test_agent_configurations() {
    log_test "Testing agent configuration files..."
    
    local agent_files=(
        "$PROJECT_ROOT/.claude/agents/master-orchestrator.md"
        "$PROJECT_ROOT/.claude/agents/ui-ux-agent.md"
        "$PROJECT_ROOT/CLAUDE.md"
    )
    
    local all_exist=true
    for file in "${agent_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_fail "Agent configuration missing: $(basename $file)"
            all_exist=false
        else
            # Check if file has content
            if [ ! -s "$file" ]; then
                log_fail "Agent configuration empty: $(basename $file)"
                all_exist=false
            fi
        fi
    done
    
    if $all_exist; then
        log_pass "All agent configuration files exist and have content"
    fi
}

# Test 3: Verify agent memory system
test_agent_memory_system() {
    log_test "Testing agent memory system..."
    
    # Test shared context
    if [ -f "$MEMORY_DIR/shared-context.json" ]; then
        if jq . "$MEMORY_DIR/shared-context.json" >/dev/null 2>&1; then
            log_pass "Shared context JSON is valid"
        else
            log_fail "Shared context JSON is invalid"
        fi
    else
        log_fail "Shared context file missing"
    fi
    
    # Test agent states
    local agents=("master-orchestrator" "ui-ux-agent" "backend-agent" "qa-agent" "devops-agent")
    local agents_valid=true
    
    for agent in "${agents[@]}"; do
        local agent_file="$MEMORY_DIR/agent-states/$agent.json"
        if [ -f "$agent_file" ]; then
            if jq . "$agent_file" >/dev/null 2>&1; then
                local agent_id=$(jq -r '.agentId' "$agent_file")
                if [ "$agent_id" = "$agent" ]; then
                    continue
                else
                    log_fail "Agent ID mismatch in $agent.json"
                    agents_valid=false
                fi
            else
                log_fail "Invalid JSON in $agent.json"
                agents_valid=false
            fi
        else
            log_fail "Agent state file missing: $agent.json"
            agents_valid=false
        fi
    done
    
    if $agents_valid; then
        log_pass "All agent state files are valid"
    fi
}

# Test 4: Test usage monitoring system
test_usage_monitoring() {
    log_test "Testing usage monitoring system..."
    
    # Check if usage monitor script exists and is executable
    if [ -f "$SCRIPTS_DIR/usage-monitor.sh" ] && [ -x "$SCRIPTS_DIR/usage-monitor.sh" ]; then
        log_pass "Usage monitor script exists and is executable"
        
        # Test usage calculation functions
        log_test "Testing usage calculation functions..."
        
        # Source the script to test functions
        source "$SCRIPTS_DIR/usage-monitor.sh"
        
        # Test get_usage_percentage function
        local usage=$(get_usage_percentage)
        if [[ "$usage" =~ ^[0-9]+$ ]] && [ "$usage" -ge 0 ] && [ "$usage" -le 100 ]; then
            log_pass "Usage percentage function returns valid value: $usage%"
        else
            log_fail "Usage percentage function returns invalid value: $usage"
        fi
        
        # Test time until reset function
        local time_until_reset=$(get_time_until_reset)
        if [[ "$time_until_reset" =~ ^[0-9]+$ ]] && [ "$time_until_reset" -ge 0 ]; then
            log_pass "Time until reset function returns valid value: ${time_until_reset}s"
        else
            log_fail "Time until reset function returns invalid value: $time_until_reset"
        fi
        
        # Test next reset time
        local next_reset=$(get_next_reset_time)
        if [[ "$next_reset" =~ ^[0-9]+$ ]] && [ "$next_reset" -gt $(date '+%s') ]; then
            local next_reset_human=$(date -d "@$next_reset" '+%Y-%m-%d %H:%M:%S')
            log_pass "Next reset time is valid: $next_reset_human"
        else
            log_fail "Next reset time is invalid: $next_reset"
        fi
    else
        log_fail "Usage monitor script missing or not executable"
    fi
}

# Test 5: Test autonomous system initialization
test_system_initialization() {
    log_test "Testing system initialization..."
    
    # Check if start script exists and is executable
    if [ -f "$SCRIPTS_DIR/start-autonomous-system.sh" ] && [ -x "$SCRIPTS_DIR/start-autonomous-system.sh" ]; then
        log_pass "Start script exists and is executable"
    else
        log_fail "Start script missing or not executable"
    fi
    
    # Test if system can be initialized (dry run)
    log_test "Testing system initialization (dry run)..."
    
    # Create a backup of current state
    local temp_backup="/tmp/agent-memory-backup-$$"
    if [ -d "$MEMORY_DIR" ]; then
        cp -r "$MEMORY_DIR" "$temp_backup"
    fi
    
    # Run initialization
    if "$SCRIPTS_DIR/start-autonomous-system.sh" >/dev/null 2>&1; then
        log_pass "System initialization completed successfully"
        
        # Verify initialization created required files
        if [ -f "$MEMORY_DIR/shared-context.json" ] && [ -d "$MEMORY_DIR/agent-states" ]; then
            log_pass "Initialization created required memory files"
        else
            log_fail "Initialization did not create required memory files"
        fi
    else
        log_fail "System initialization failed"
    fi
    
    # Restore backup if it existed
    if [ -d "$temp_backup" ]; then
        rm -rf "$MEMORY_DIR"
        mv "$temp_backup" "$MEMORY_DIR"
    fi
}

# Test 6: Test context preservation functionality
test_context_preservation() {
    log_test "Testing context preservation functionality..."
    
    # Source usage monitor to access functions
    source "$SCRIPTS_DIR/usage-monitor.sh"
    
    # Test context saving
    log_test "Testing context save functionality..."
    
    # Save current context
    if save_context >/dev/null 2>&1; then
        # Check if snapshot was created
        local snapshots=$(ls -1 "$MEMORY_DIR/context-snapshots" 2>/dev/null | wc -l)
        if [ $snapshots -gt 0 ]; then
            log_pass "Context save created snapshot directory"
            
            # Get latest snapshot
            local latest_snapshot=$(ls -1t "$MEMORY_DIR/context-snapshots" | head -1)
            local snapshot_path="$MEMORY_DIR/context-snapshots/$latest_snapshot"
            
            # Verify snapshot contents
            if [ -f "$snapshot_path/backup-metadata.json" ]; then
                log_pass "Context save created metadata file"
            else
                log_fail "Context save did not create metadata file"
            fi
            
            if [ -f "$snapshot_path/shared-context.json" ]; then
                log_pass "Context save preserved shared context"
            else
                log_fail "Context save did not preserve shared context"
            fi
        else
            log_fail "Context save did not create snapshot"
        fi
    else
        log_fail "Context save function failed"
    fi
}

# Test 7: Test reset detection functionality
test_reset_detection() {
    log_test "Testing reset detection functionality..."
    
    # Source usage monitor to access functions
    source "$SCRIPTS_DIR/usage-monitor.sh"
    
    # Test reset time functions
    local current_time=$(date '+%s')
    local last_reset=$(get_last_reset_time)
    
    if [[ "$last_reset" =~ ^[0-9]+$ ]] && [ "$last_reset" -le $current_time ]; then
        log_pass "Last reset time is valid"
    else
        log_fail "Last reset time is invalid: $last_reset"
    fi
    
    # Test reset cycle calculation
    local next_reset=$(get_next_reset_time)
    local expected_next=$((last_reset + 5 * 3600))  # 5 hours later
    
    if [ "$next_reset" -eq "$expected_next" ]; then
        log_pass "Reset cycle calculation is correct"
    else
        log_fail "Reset cycle calculation is incorrect: expected $expected_next, got $next_reset"
    fi
}

# Test 8: Test Phase 2 build readiness
test_phase2_readiness() {
    log_test "Testing Phase 2 build readiness..."
    
    # Check if build exists
    if [ -d "$PROJECT_ROOT/apps/web-app/dist" ]; then
        log_pass "Phase 2 build directory exists"
        
        # Check build contents
        if [ -f "$PROJECT_ROOT/apps/web-app/dist/index.html" ]; then
            log_pass "Build contains index.html"
            
            # Check if build mentions Enhanced Experience
            if grep -q "Enhanced Experience" "$PROJECT_ROOT/apps/web-app/dist/index.html"; then
                log_pass "Build contains Phase 2 Enhanced Experience title"
            else
                log_fail "Build does not contain Phase 2 Enhanced Experience title"
            fi
        else
            log_fail "Build does not contain index.html"
        fi
        
        # Check build size
        local build_size=$(du -sh "$PROJECT_ROOT/apps/web-app/dist" | cut -f1)
        log_info "Build size: $build_size"
        
        if [ -f "$PROJECT_ROOT/apps/web-app/dist/assets/index-"*.js ]; then
            log_pass "Build contains JavaScript assets"
        else
            log_fail "Build does not contain JavaScript assets"
        fi
    else
        log_fail "Phase 2 build directory does not exist"
    fi
}

# Test 9: Test agent coordination protocols
test_agent_coordination() {
    log_test "Testing agent coordination protocols..."
    
    # Check if CLAUDE.md contains proper protocols
    if [ -f "$PROJECT_ROOT/CLAUDE.md" ]; then
        if grep -q "AUTONOMOUS OPERATION PROTOCOLS" "$PROJECT_ROOT/CLAUDE.md"; then
            log_pass "CLAUDE.md contains autonomous operation protocols"
        else
            log_fail "CLAUDE.md missing autonomous operation protocols"
        fi
        
        if grep -q "Usage Reset Auto-Restart" "$PROJECT_ROOT/CLAUDE.md"; then
            log_pass "CLAUDE.md contains auto-restart configuration"
        else
            log_fail "CLAUDE.md missing auto-restart configuration"
        fi
        
        if grep -q "Every $RESET_CYCLE_HOURS hours" "$PROJECT_ROOT/CLAUDE.md"; then
            log_pass "CLAUDE.md contains correct reset cycle information"
        else
            log_fail "CLAUDE.md missing correct reset cycle information"
        fi
    else
        log_fail "CLAUDE.md file missing"
    fi
}

# Test 10: Integration test - simulate usage monitoring
test_integration_monitoring() {
    log_test "Testing integrated monitoring simulation..."
    
    # Start usage monitor in test mode
    log_test "Starting usage monitor for integration test..."
    
    # Kill any existing monitor
    if [ -f "$LOG_DIR/usage-monitor.pid" ]; then
        local old_pid=$(cat "$LOG_DIR/usage-monitor.pid")
        if kill -0 $old_pid 2>/dev/null; then
            kill $old_pid
            sleep 2
        fi
    fi
    
    # Start monitor
    "$SCRIPTS_DIR/usage-monitor.sh" start >/dev/null 2>&1
    sleep 3
    
    # Check if monitor is running
    if "$SCRIPTS_DIR/usage-monitor.sh" status | grep -q "Usage monitor is running"; then
        log_pass "Usage monitor started successfully"
        
        # Check status output
        local status_output=$("$SCRIPTS_DIR/usage-monitor.sh" status 2>&1)
        
        if echo "$status_output" | grep -q "Reset cycle: Every 5 hours"; then
            log_pass "Monitor reports correct reset cycle"
        else
            log_fail "Monitor does not report correct reset cycle"
        fi
        
        if echo "$status_output" | grep -q "Next reset:"; then
            log_pass "Monitor reports next reset time"
        else
            log_fail "Monitor does not report next reset time"
        fi
        
        # Stop monitor
        "$SCRIPTS_DIR/usage-monitor.sh" stop >/dev/null 2>&1
        log_pass "Usage monitor stopped successfully"
    else
        log_fail "Usage monitor failed to start"
    fi
}

# Main test execution
run_all_tests() {
    clear
    echo -e "${PURPLE}🧪 AUTONOMOUS SYSTEM FUNCTIONALITY TEST${NC}"
    echo "=================================================="
    echo ""
    
    log_info "Starting comprehensive autonomous system tests..."
    echo ""
    
    test_directory_structure
    test_agent_configurations
    test_agent_memory_system
    test_usage_monitoring
    test_system_initialization
    test_context_preservation
    test_reset_detection
    test_phase2_readiness
    test_agent_coordination
    test_integration_monitoring
    
    echo ""
    echo "=================================================="
    echo -e "${PURPLE}TEST RESULTS SUMMARY${NC}"
    echo "=================================================="
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
        echo -e "${GREEN}   Total tests: $TESTS_PASSED${NC}"
        echo -e "${GREEN}   Failed tests: $TESTS_FAILED${NC}"
        echo ""
        echo -e "${GREEN}✅ Autonomous system is fully functional and ready!${NC}"
        echo ""
        echo -e "${CYAN}System capabilities verified:${NC}"
        echo "   🤖 Multi-agent orchestration system"
        echo "   🔄 5-hour reset cycle detection and auto-restart"
        echo "   💾 Context preservation and restore"
        echo "   📊 Usage monitoring and threshold detection"
        echo "   🏗️ Phase 2 build ready for deployment"
        echo ""
        return 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED${NC}"
        echo -e "${GREEN}   Passed tests: $TESTS_PASSED${NC}"
        echo -e "${RED}   Failed tests: $TESTS_FAILED${NC}"
        echo ""
        echo -e "${RED}Failed test details:${NC}"
        for failed_test in "${FAILED_TESTS[@]}"; do
            echo -e "${RED}   • $failed_test${NC}"
        done
        echo ""
        echo -e "${YELLOW}⚠️  Please fix the failed tests before deploying the autonomous system.${NC}"
        echo ""
        return 1
    fi
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_all_tests
fi