#!/usr/bin/env python3
"""
Comprehensive stress test for ROCKET Framework API endpoints
Tests all features, edge cases, and error scenarios
"""

import os
import sys
import json
import requests
import time
import uuid
from typing import Dict, List, Any
from concurrent.futures import ThreadPoolExecutor, as_completed

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

class ROCKETFrameworkTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session_ids = []
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": time.time()
        })
    
    def test_health_check(self) -> bool:
        """Test if the server is running"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            success = response.status_code == 200
            self.log_test("Health Check", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Health Check", False, f"Error: {str(e)}")
            return False
    
    def test_start_conversation(self) -> str:
        """Test conversation initialization"""
        try:
            payload = {"user_id": None}
            response = requests.post(
                f"{self.base_url}/api/v1/conversation/start",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get("session_id")
                self.session_ids.append(session_id)
                self.log_test("Start Conversation", True, f"Session ID: {session_id[:8]}...")
                return session_id
            else:
                self.log_test("Start Conversation", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_test("Start Conversation", False, f"Error: {str(e)}")
            return None
    
    def test_conversation_response(self, session_id: str, user_input: str, expected_phase: str = None) -> Dict:
        """Test conversation response processing"""
        try:
            payload = {
                "session_id": session_id,
                "user_input": user_input
            }
            response = requests.post(
                f"{self.base_url}/api/v1/conversation/respond",
                json=payload,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                phase = data.get("phase")
                progress = data.get("progress_percentage", 0)
                
                success = True
                details = f"Phase: {phase}, Progress: {progress}%"
                
                if expected_phase and phase != expected_phase:
                    success = False
                    details += f" (Expected: {expected_phase})"
                
                self.log_test(f"Conversation Response", success, details)
                return data
            else:
                self.log_test("Conversation Response", False, f"Status: {response.status_code}, Response: {response.text}")
                return {}
        except Exception as e:
            self.log_test("Conversation Response", False, f"Error: {str(e)}")
            return {}
    
    def test_resume_preview(self, session_id: str) -> Dict:
        """Test resume preview generation"""
        try:
            response = requests.get(
                f"{self.base_url}/api/v1/conversation/{session_id}/resume-preview",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                name = data.get("name", "Unknown")
                target_role = data.get("target_role", "Unknown")
                progress_scores = data.get("progress_scores", {})
                
                self.log_test("Resume Preview", True, f"Name: {name}, Role: {target_role}, Scores: {len(progress_scores)}")
                return data
            else:
                self.log_test("Resume Preview", False, f"Status: {response.status_code}, Response: {response.text}")
                return {}
        except Exception as e:
            self.log_test("Resume Preview", False, f"Error: {str(e)}")
            return {}
    
    def test_conversation_status(self, session_id: str) -> Dict:
        """Test conversation status endpoint"""
        try:
            response = requests.get(
                f"{self.base_url}/api/v1/conversation/{session_id}/status",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                phase = data.get("current_phase")
                progress = data.get("progress_percentage", 0)
                
                self.log_test("Conversation Status", True, f"Phase: {phase}, Progress: {progress}%")
                return data
            else:
                self.log_test("Conversation Status", False, f"Status: {response.status_code}")
                return {}
        except Exception as e:
            self.log_test("Conversation Status", False, f"Error: {str(e)}")
            return {}
    
    def test_full_conversation_flow(self) -> bool:
        """Test complete conversation flow through all phases"""
        print("\n🚀 Testing Full ROCKET Framework Conversation Flow...")
        
        # Start conversation
        session_id = self.test_start_conversation()
        if not session_id:
            return False
        
        # Test conversation phases
        conversation_inputs = [
            {
                "input": "Hi, I'm John Doe and I'm targeting a Software Engineer role at tech companies",
                "expected_phase": "story_discovery",
                "description": "Introduction Phase"
            },
            {
                "input": "I led the development of a microservices architecture that reduced system latency by 40% and improved scalability for 1 million users. I architected and implemented the solution over 6 months, resulting in $2M cost savings annually.",
                "expected_phase": "achievement_mining", 
                "description": "Story Discovery with CAR Structure"
            },
            {
                "input": "I optimized database queries that reduced response time from 2 seconds to 200ms, affecting all 500K daily active users. This was completed in 3 weeks and improved user retention by 15%.",
                "expected_phase": "achievement_mining",
                "description": "Achievement Mining with REST metrics"
            },
            {
                "input": "I designed and built a real-time analytics dashboard that provides insights for 100+ business users. The project took 4 months and increased data-driven decision making by 60% across the organization.",
                "expected_phase": "synthesis",
                "description": "Final Achievement for Synthesis"
            }
        ]
        
        all_success = True
        for i, conv in enumerate(conversation_inputs):
            print(f"\n--- {conv['description']} ---")
            response_data = self.test_conversation_response(
                session_id, 
                conv["input"], 
                conv.get("expected_phase")
            )
            
            if not response_data:
                all_success = False
                continue
            
            # Test resume preview after each response
            self.test_resume_preview(session_id)
            
            # Test conversation status
            self.test_conversation_status(session_id)
            
            # Brief delay to simulate real user behavior
            time.sleep(1)
        
        return all_success
    
    def test_edge_cases(self):
        """Test edge cases and error scenarios"""
        print("\n🔍 Testing Edge Cases and Error Scenarios...")
        
        # Test invalid session ID
        try:
            fake_session = str(uuid.uuid4())
            response = requests.post(
                f"{self.base_url}/api/v1/conversation/respond",
                json={"session_id": fake_session, "user_input": "test"},
                timeout=10
            )
            success = response.status_code == 404
            self.log_test("Invalid Session ID", success, f"Status: {response.status_code} (Expected 404)")
        except Exception as e:
            self.log_test("Invalid Session ID", False, f"Error: {str(e)}")
        
        # Test empty user input
        session_id = self.test_start_conversation()
        if session_id:
            try:
                response = requests.post(
                    f"{self.base_url}/api/v1/conversation/respond",
                    json={"session_id": session_id, "user_input": ""},
                    timeout=10
                )
                # Should handle empty input gracefully
                success = response.status_code in [200, 400]
                self.log_test("Empty User Input", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Empty User Input", False, f"Error: {str(e)}")
        
        # Test very long input
        if session_id:
            long_input = "A" * 10000  # 10K characters
            try:
                response = requests.post(
                    f"{self.base_url}/api/v1/conversation/respond",
                    json={"session_id": session_id, "user_input": long_input},
                    timeout=20
                )
                success = response.status_code == 200
                self.log_test("Very Long Input", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Very Long Input", False, f"Error: {str(e)}")
    
    def test_concurrent_conversations(self, num_concurrent: int = 5):
        """Test multiple concurrent conversations"""
        print(f"\n⚡ Testing {num_concurrent} Concurrent Conversations...")
        
        def run_conversation(thread_id: int):
            session_id = self.test_start_conversation()
            if not session_id:
                return False
                
            # Simple conversation
            response = self.test_conversation_response(
                session_id, 
                f"Hi, I'm User {thread_id}, targeting a Developer role"
            )
            return bool(response)
        
        with ThreadPoolExecutor(max_workers=num_concurrent) as executor:
            futures = [executor.submit(run_conversation, i) for i in range(num_concurrent)]
            results = [future.result() for future in as_completed(futures)]
        
        success_count = sum(results)
        success = success_count == num_concurrent
        self.log_test("Concurrent Conversations", success, f"{success_count}/{num_concurrent} successful")
    
    def test_rocket_framework_features(self):
        """Test ROCKET Framework specific features"""
        print("\n🚀 Testing ROCKET Framework Features...")
        
        session_id = self.test_start_conversation()
        if not session_id:
            return
        
        # Test different types of responses to trigger different follow-up strategies
        test_cases = [
            {
                "input": "I helped with some projects",
                "description": "Modest language (should trigger confidence boost)"
            },
            {
                "input": "I worked on improving system performance",
                "description": "Vague response (should trigger quantification probe)"
            },
            {
                "input": "I led a team of 8 engineers to redesign our authentication system, reducing login failures by 95% and improving user satisfaction scores from 3.2 to 4.8 stars over 3 months",
                "description": "Strong quantified response (should proceed)"
            }
        ]
        
        for case in test_cases:
            print(f"\n--- {case['description']} ---")
            response_data = self.test_conversation_response(session_id, case["input"])
            
            if response_data:
                follow_up = response_data.get("follow_up_strategy")
                if follow_up:
                    print(f"    Follow-up strategy: {follow_up}")
    
    def run_comprehensive_test(self):
        """Run all tests comprehensively"""
        print("🚀 ROCKET Framework Comprehensive Testing Suite")
        print("=" * 60)
        
        start_time = time.time()
        
        # Basic health check
        if not self.test_health_check():
            print("❌ Server not responding, aborting tests")
            return
        
        # Core functionality tests
        self.test_full_conversation_flow()
        
        # Edge case testing
        self.test_edge_cases()
        
        # Performance testing
        self.test_concurrent_conversations()
        
        # ROCKET specific features
        self.test_rocket_framework_features()
        
        # Summary
        elapsed_time = time.time() - start_time
        total_tests = len(self.test_results)
        successful_tests = sum(1 for result in self.test_results if result["success"])
        
        print("\n" + "=" * 60)
        print("🚀 ROCKET Framework Test Summary")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Successful: {successful_tests}")
        print(f"Failed: {total_tests - successful_tests}")
        print(f"Success Rate: {(successful_tests/total_tests)*100:.1f}%")
        print(f"Total Time: {elapsed_time:.2f} seconds")
        
        if successful_tests == total_tests:
            print("🎉 All tests passed! ROCKET Framework is ready for production!")
        else:
            print("⚠️  Some tests failed. Review the issues above.")
        
        # Cleanup
        self.cleanup_test_sessions()
    
    def cleanup_test_sessions(self):
        """Clean up test sessions"""
        print(f"\n🧹 Cleaning up {len(self.session_ids)} test sessions...")
        for session_id in self.session_ids:
            try:
                requests.delete(f"{self.base_url}/api/v1/conversation/{session_id}", timeout=5)
            except:
                pass

def main():
    """Main test runner"""
    import argparse
    
    parser = argparse.ArgumentParser(description="ROCKET Framework API Tester")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL for the API")
    parser.add_argument("--concurrent", type=int, default=3, help="Number of concurrent conversations to test")
    
    args = parser.parse_args()
    
    tester = ROCKETFrameworkTester(args.url)
    tester.run_comprehensive_test()

if __name__ == "__main__":
    main()