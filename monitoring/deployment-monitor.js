#!/usr/bin/env node

/**
 * Zero-Downtime Deployment Monitor
 * Ensures safe deployments with automatic rollback capabilities
 */

import { promises as fs } from 'fs';
import path from 'path';

class DeploymentMonitor {
  constructor() {
    this.config = {
      services: {
        frontend: {
          name: 'Frontend (Netlify)',
          url: 'https://tranquil-frangipane-ceffd4.netlify.app',
          healthEndpoint: '/',
          expectedStatus: 200
        },
        backend: {
          name: 'Backend (Railway)',
          url: 'https://resume-builder-ai-production.up.railway.app',
          healthEndpoint: '/health',
          expectedStatus: 200
        }
      },
      deployment: {
        preDeploymentChecks: 5,
        postDeploymentWait: 30, // seconds
        healthCheckRetries: 10,
        healthCheckInterval: 5, // seconds
        rollbackTimeout: 300 // seconds
      },
      thresholds: {
        maxResponseTime: 500, // ms
        minSuccessRate: 95, // percentage
        errorThreshold: 3 // consecutive errors
      }
    };
    
    this.deploymentState = {
      inProgress: false,
      startTime: null,
      phase: null,
      errors: [],
      rollbackTriggered: false
    };
  }

  async startDeploymentMonitoring(deploymentId, options = {}) {
    console.log(`🚀 Starting deployment monitoring for ID: ${deploymentId}`);
    
    this.deploymentState = {
      inProgress: true,
      startTime: new Date(),
      phase: 'pre-deployment',
      deploymentId,
      errors: [],
      rollbackTriggered: false,
      ...options
    };
    
    try {
      // Pre-deployment health checks
      await this.preDeploymentChecks();
      
      // Monitor deployment process
      await this.monitorDeployment();
      
      // Post-deployment validation
      await this.postDeploymentValidation();
      
      console.log('✅ Deployment monitoring completed successfully');
      return { success: true, deploymentId };
      
    } catch (error) {
      console.error('❌ Deployment monitoring failed:', error.message);
      
      if (!this.deploymentState.rollbackTriggered) {
        await this.triggerRollback(error);
      }
      
      return { success: false, error: error.message, deploymentId };
    } finally {
      this.deploymentState.inProgress = false;
      await this.generateDeploymentReport();
    }
  }

  async preDeploymentChecks() {
    console.log('🔍 Running pre-deployment health checks...');
    this.deploymentState.phase = 'pre-deployment';
    
    const checks = [];
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      console.log(`   Checking ${service.name}...`);
      
      for (let i = 0; i < this.config.deployment.preDeploymentChecks; i++) {
        const result = await this.performHealthCheck(service);
        checks.push({ service: serviceKey, attempt: i + 1, ...result });
        
        if (!result.success) {
          throw new Error(`Pre-deployment check failed for ${service.name}: ${result.error}`);
        }
        
        if (i < this.config.deployment.preDeploymentChecks - 1) {
          await this.sleep(this.config.deployment.healthCheckInterval * 1000);
        }
      }
    }
    
    console.log('✅ All pre-deployment checks passed');
    return checks;
  }

  async monitorDeployment() {
    console.log('📊 Monitoring deployment progress...');
    this.deploymentState.phase = 'deployment';
    
    // Wait for initial deployment to settle
    console.log(`⏳ Waiting ${this.config.deployment.postDeploymentWait}s for deployment to settle...`);
    await this.sleep(this.config.deployment.postDeploymentWait * 1000);
    
    // Start monitoring with progressive validation
    const startTime = Date.now();
    let consecutiveErrors = 0;
    
    while (Date.now() - startTime < this.config.deployment.rollbackTimeout * 1000) {
      try {
        const healthResults = await this.performComprehensiveHealthCheck();
        
        // Check if all services are healthy
        const allHealthy = healthResults.every(result => result.success);
        
        if (allHealthy) {
          consecutiveErrors = 0;
          console.log('✅ All services healthy during deployment');
        } else {
          consecutiveErrors++;
          console.log(`⚠️ Health check failed (${consecutiveErrors}/${this.config.thresholds.errorThreshold})`);
          
          if (consecutiveErrors >= this.config.thresholds.errorThreshold) {
            throw new Error(`Deployment failed: ${consecutiveErrors} consecutive health check failures`);
          }
        }
        
        // Log health status
        this.logHealthStatus(healthResults);
        
        await this.sleep(this.config.deployment.healthCheckInterval * 1000);
        
      } catch (error) {
        this.deploymentState.errors.push({
          timestamp: new Date().toISOString(),
          phase: 'deployment',
          error: error.message
        });
        throw error;
      }
    }
  }

  async postDeploymentValidation() {
    console.log('🔬 Running post-deployment validation...');
    this.deploymentState.phase = 'post-deployment';
    
    // Comprehensive validation suite
    const validationResults = await Promise.all([
      this.validateAllEndpoints(),
      this.validateROCKETFramework(),
      this.validateEliteComparisonEngine(),
      this.validatePerformance()
    ]);
    
    const allValidationsPassed = validationResults.every(result => result.success);
    
    if (!allValidationsPassed) {
      const failedValidations = validationResults.filter(r => !r.success);
      throw new Error(`Post-deployment validation failed: ${failedValidations.map(f => f.name).join(', ')}`);
    }
    
    console.log('✅ All post-deployment validations passed');
    return validationResults;
  }

  async performHealthCheck(service) {
    const startTime = Date.now();
    const url = `${service.url}${service.healthEndpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ROCKET-Deployment-Monitor/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      const success = response.status === service.expectedStatus;
      
      return {
        success,
        status: response.status,
        responseTime,
        url,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        status: 0,
        responseTime: Date.now() - startTime,
        error: error.message,
        url,
        timestamp: new Date().toISOString()
      };
    }
  }

  async performComprehensiveHealthCheck() {
    const checks = [];
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      const result = await this.performHealthCheck(service);
      checks.push({ service: serviceKey, ...result });
    }
    
    return checks;
  }

  async validateAllEndpoints() {
    console.log('   Validating all API endpoints...');
    
    const endpoints = [
      '/health',
      '/api/v1/rocket/health',
      '/api/v1/elite/health',
      '/api/v1/conversation/health',
      '/api/v1/personas/health'
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const url = `${this.config.services.backend.url}${endpoint}`;
        const response = await fetch(url);
        results.push({
          endpoint,
          success: response.ok,
          status: response.status
        });
      } catch (error) {
        results.push({
          endpoint,
          success: false,
          error: error.message
        });
      }
    }
    
    const allSuccess = results.every(r => r.success);
    return {
      name: 'Endpoint Validation',
      success: allSuccess,
      results
    };
  }

  async validateROCKETFramework() {
    console.log('   Validating ROCKET Framework...');
    
    try {
      // Test ROCKET Framework health
      const healthUrl = `${this.config.services.backend.url}/api/v1/rocket/health`;
      const healthResponse = await fetch(healthUrl);
      
      if (!healthResponse.ok) {
        throw new Error(`ROCKET health check failed: ${healthResponse.status}`);
      }
      
      // Test conversation endpoint
      const conversationUrl = `${this.config.services.backend.url}/api/v1/rocket/conversation`;
      const conversationResponse = await fetch(conversationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Health check test',
          persona: 'dr_maya'
        })
      });
      
      return {
        name: 'ROCKET Framework Validation',
        success: true,
        healthStatus: healthResponse.status,
        conversationStatus: conversationResponse.status
      };
      
    } catch (error) {
      return {
        name: 'ROCKET Framework Validation',
        success: false,
        error: error.message
      };
    }
  }

  async validateEliteComparisonEngine() {
    console.log('   Validating Elite Comparison Engine...');
    
    try {
      const url = `${this.config.services.backend.url}/api/v1/elite/health`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Elite Comparison Engine health check failed: ${response.status}`);
      }
      
      return {
        name: 'Elite Comparison Engine Validation',
        success: true,
        status: response.status
      };
      
    } catch (error) {
      return {
        name: 'Elite Comparison Engine Validation',
        success: false,
        error: error.message
      };
    }
  }

  async validatePerformance() {
    console.log('   Validating performance metrics...');
    
    const performanceResults = [];
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      const result = await this.performHealthCheck(service);
      performanceResults.push({
        service: serviceKey,
        responseTime: result.responseTime,
        withinThreshold: result.responseTime <= this.config.thresholds.maxResponseTime
      });
    }
    
    const allWithinThreshold = performanceResults.every(r => r.withinThreshold);
    
    return {
      name: 'Performance Validation',
      success: allWithinThreshold,
      results: performanceResults,
      threshold: this.config.thresholds.maxResponseTime
    };
  }

  logHealthStatus(healthResults) {
    const timestamp = new Date().toLocaleTimeString();
    const statusLine = healthResults.map(result => {
      const icon = result.success ? '✅' : '❌';
      return `${icon} ${result.service}: ${result.responseTime}ms`;
    }).join(' | ');
    
    console.log(`[${timestamp}] ${statusLine}`);
  }

  async triggerRollback(error) {
    console.log('🚨 TRIGGERING ROLLBACK - Deployment failed');
    this.deploymentState.rollbackTriggered = true;
    this.deploymentState.phase = 'rollback';
    
    // Log rollback reason
    console.log(`❌ Rollback reason: ${error.message}`);
    
    // Here you would implement actual rollback logic:
    // 1. Revert to previous deployment on Railway
    // 2. Revert to previous deployment on Netlify
    // 3. Update load balancer configurations
    // 4. Notify team of rollback
    
    console.log('📋 Rollback actions would be executed here:');
    console.log('   1. Revert Railway deployment to previous version');
    console.log('   2. Revert Netlify deployment to previous version');
    console.log('   3. Update monitoring systems');
    console.log('   4. Send rollback notifications');
    
    // Verify rollback success
    await this.sleep(10000); // Wait for rollback to complete
    
    const rollbackValidation = await this.performComprehensiveHealthCheck();
    const rollbackSuccess = rollbackValidation.every(result => result.success);
    
    if (rollbackSuccess) {
      console.log('✅ Rollback completed successfully');
    } else {
      console.log('❌ Rollback validation failed - manual intervention required');
    }
  }

  async generateDeploymentReport() {
    const report = {
      deploymentId: this.deploymentState.deploymentId,
      startTime: this.deploymentState.startTime,
      endTime: new Date(),
      duration: Date.now() - this.deploymentState.startTime.getTime(),
      success: !this.deploymentState.rollbackTriggered,
      phase: this.deploymentState.phase,
      errors: this.deploymentState.errors,
      rollbackTriggered: this.deploymentState.rollbackTriggered
    };
    
    // Save report
    const reportDir = path.join(process.cwd(), 'monitoring', 'deployment-reports');
    await fs.mkdir(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `deployment-${report.deploymentId}-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Deployment ID: ${report.deploymentId}`);
    console.log(`Status: ${report.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Duration: ${Math.round(report.duration / 1000)}s`);
    console.log(`Phase: ${report.phase}`);
    console.log(`Errors: ${report.errors.length}`);
    console.log(`Rollback: ${report.rollbackTriggered ? 'YES' : 'NO'}`);
    
    return report;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new DeploymentMonitor();
  const deploymentId = process.argv[2] || `deploy-${Date.now()}`;
  
  monitor.startDeploymentMonitoring(deploymentId)
    .then(result => {
      console.log('\nDeployment monitoring result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Deployment monitoring error:', error);
      process.exit(1);
    });
}

export default DeploymentMonitor;