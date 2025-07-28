#!/usr/bin/env node

/**
 * Advanced Health Monitoring System for ROCKET Framework
 * Monitors all production endpoints with real-time alerting
 */

import { promises as fs } from 'fs';
import path from 'path';

class ProductionHealthMonitor {
  constructor() {
    this.config = {
      frontend: {
        url: 'https://tranquil-frangipane-ceffd4.netlify.app',
        timeout: 5000,
        expectedStatus: 200
      },
      backend: {
        url: 'https://resume-builder-ai-production.up.railway.app',
        timeout: 5000,
        expectedStatus: 200
      },
      endpoints: [
        '/health',
        '/api/v1/rocket/health',
        '/api/v1/elite/health',
        '/api/v1/conversation/health',
        '/api/v1/personas/health'
      ],
      thresholds: {
        responseTime: 200, // ms
        errorRate: 5, // percentage
        uptimeTarget: 99.5 // percentage
      },
      monitoring: {
        interval: 30000, // 30 seconds
        historySize: 1440, // 24 hours at 1-minute intervals
        alertCooldown: 300000 // 5 minutes
      }
    };
    
    this.metrics = {
      uptime: new Map(),
      responseTime: new Map(),
      errors: new Map(),
      lastAlert: new Map()
    };
    
    this.isRunning = false;
  }

  async start() {
    console.log('🚀 Starting Production Health Monitor for ROCKET Framework');
    console.log(`📊 Monitoring ${this.config.endpoints.length} endpoints every ${this.config.monitoring.interval/1000}s`);
    
    this.isRunning = true;
    this.monitorLoop();
    
    // Graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  async stop() {
    console.log('\n🛑 Stopping health monitor...');
    this.isRunning = false;
    await this.saveMetrics();
    process.exit(0);
  }

  async monitorLoop() {
    while (this.isRunning) {
      try {
        await this.performHealthChecks();
        await this.analyzeMetrics();
        await this.generateReport();
        
        // Wait for next interval
        await new Promise(resolve => setTimeout(resolve, this.config.monitoring.interval));
      } catch (error) {
        console.error('❌ Monitor loop error:', error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async performHealthChecks() {
    const timestamp = new Date().toISOString();
    const results = [];

    // Check frontend
    try {
      const frontendResult = await this.checkEndpoint(this.config.frontend.url, '/');
      results.push({ service: 'frontend', ...frontendResult, timestamp });
    } catch (error) {
      results.push({ 
        service: 'frontend', 
        success: false, 
        error: error.message, 
        timestamp 
      });
    }

    // Check all backend endpoints
    for (const endpoint of this.config.endpoints) {
      try {
        const result = await this.checkEndpoint(this.config.backend.url, endpoint);
        results.push({ 
          service: `backend${endpoint}`, 
          endpoint,
          ...result, 
          timestamp 
        });
      } catch (error) {
        results.push({ 
          service: `backend${endpoint}`, 
          endpoint,
          success: false, 
          error: error.message, 
          timestamp 
        });
      }
    }

    // Store metrics
    for (const result of results) {
      this.updateMetrics(result);
    }

    return results;
  }

  async checkEndpoint(baseUrl, endpoint) {
    const startTime = Date.now();
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.backend.timeout);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ROCKET-Health-Monitor/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      const success = response.status === this.config.backend.expectedStatus;
      
      let responseData = null;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        }
      } catch (e) {
        // Non-JSON response is okay
      }
      
      return {
        success,
        status: response.status,
        responseTime,
        data: responseData,
        url
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        status: 0,
        responseTime,
        error: error.message,
        url
      };
    }
  }

  updateMetrics(result) {
    const service = result.service;
    
    // Initialize metrics for service if not exists
    if (!this.metrics.uptime.has(service)) {
      this.metrics.uptime.set(service, []);
      this.metrics.responseTime.set(service, []);
      this.metrics.errors.set(service, []);
    }
    
    // Add new metrics
    const uptimeHistory = this.metrics.uptime.get(service);
    const responseTimeHistory = this.metrics.responseTime.get(service);
    const errorHistory = this.metrics.errors.get(service);
    
    uptimeHistory.push({
      timestamp: result.timestamp,
      success: result.success
    });
    
    if (result.responseTime) {
      responseTimeHistory.push({
        timestamp: result.timestamp,
        responseTime: result.responseTime
      });
    }
    
    if (!result.success) {
      errorHistory.push({
        timestamp: result.timestamp,
        error: result.error || 'Unknown error',
        status: result.status
      });
    }
    
    // Trim history to configured size
    this.trimHistory(uptimeHistory);
    this.trimHistory(responseTimeHistory);
    this.trimHistory(errorHistory);
  }

  trimHistory(history) {
    if (history.length > this.config.monitoring.historySize) {
      history.splice(0, history.length - this.config.monitoring.historySize);
    }
  }

  async analyzeMetrics() {
    for (const [service, uptimeHistory] of this.metrics.uptime) {
      const analysis = this.calculateServiceMetrics(service);
      
      // Check for alerts
      await this.checkAlerts(service, analysis);
    }
  }

  calculateServiceMetrics(service) {
    const uptimeHistory = this.metrics.uptime.get(service) || [];
    const responseTimeHistory = this.metrics.responseTime.get(service) || [];
    const errorHistory = this.metrics.errors.get(service) || [];
    
    // Calculate uptime percentage (last 24 hours)
    const recentUptime = uptimeHistory.slice(-1440); // Last 24 hours
    const successCount = recentUptime.filter(entry => entry.success).length;
    const uptimePercentage = recentUptime.length > 0 ? 
      (successCount / recentUptime.length) * 100 : 100;
    
    // Calculate average response time (last hour)
    const recentResponseTime = responseTimeHistory.slice(-60); // Last hour
    const avgResponseTime = recentResponseTime.length > 0 ?
      recentResponseTime.reduce((sum, entry) => sum + entry.responseTime, 0) / recentResponseTime.length : 0;
    
    // Calculate error rate (last hour)
    const recentErrors = errorHistory.filter(entry => {
      const errorTime = new Date(entry.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return errorTime > oneHourAgo;
    });
    const errorRate = recentUptime.length > 0 ? 
      (recentErrors.length / Math.min(60, recentUptime.length)) * 100 : 0;
    
    return {
      uptimePercentage,
      avgResponseTime,
      errorRate,
      lastError: errorHistory[errorHistory.length - 1] || null
    };
  }

  async checkAlerts(service, metrics) {
    const alerts = [];
    const now = Date.now();
    const lastAlert = this.metrics.lastAlert.get(service) || 0;
    
    // Check if enough time has passed since last alert
    if (now - lastAlert < this.config.monitoring.alertCooldown) {
      return;
    }
    
    // Uptime alert
    if (metrics.uptimePercentage < this.config.thresholds.uptimeTarget) {
      alerts.push({
        severity: 'CRITICAL',
        service,
        type: 'UPTIME',
        message: `Uptime dropped to ${metrics.uptimePercentage.toFixed(2)}% (target: ${this.config.thresholds.uptimeTarget}%)`
      });
    }
    
    // Response time alert
    if (metrics.avgResponseTime > this.config.thresholds.responseTime) {
      alerts.push({
        severity: 'WARNING',
        service,
        type: 'PERFORMANCE',
        message: `Average response time: ${metrics.avgResponseTime.toFixed(0)}ms (target: <${this.config.thresholds.responseTime}ms)`
      });
    }
    
    // Error rate alert
    if (metrics.errorRate > this.config.thresholds.errorRate) {
      alerts.push({
        severity: 'ERROR',
        service,
        type: 'ERROR_RATE',
        message: `Error rate: ${metrics.errorRate.toFixed(2)}% (target: <${this.config.thresholds.errorRate}%)`
      });
    }
    
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
      this.metrics.lastAlert.set(service, now);
    }
  }

  async sendAlerts(alerts) {
    for (const alert of alerts) {
      console.log(`🚨 ${alert.severity} ALERT [${alert.service}]: ${alert.message}`);
      
      // Log to file
      await this.logAlert(alert);
      
      // Here you would integrate with your alerting system:
      // - Slack webhook
      // - Email notifications
      // - PagerDuty
      // - Discord webhook
      // etc.
    }
  }

  async logAlert(alert) {
    const logDir = path.join(process.cwd(), 'monitoring', 'logs');
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, 'alerts.log');
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...alert
    }) + '\n';
    
    await fs.appendFile(logFile, logEntry);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {},
      services: {}
    };
    
    let totalUptime = 0;
    let totalResponseTime = 0;
    let serviceCount = 0;
    
    for (const [service] of this.metrics.uptime) {
      const metrics = this.calculateServiceMetrics(service);
      report.services[service] = metrics;
      
      totalUptime += metrics.uptimePercentage;
      totalResponseTime += metrics.avgResponseTime;
      serviceCount++;
    }
    
    report.summary = {
      averageUptime: serviceCount > 0 ? totalUptime / serviceCount : 100,
      averageResponseTime: serviceCount > 0 ? totalResponseTime / serviceCount : 0,
      servicesMonitored: serviceCount
    };
    
    // Save report
    const reportDir = path.join(process.cwd(), 'monitoring', 'reports');
    await fs.mkdir(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, 'latest-health-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    // Console output
    this.displayReport(report);
  }

  displayReport(report) {
    console.clear();
    console.log('🏥 ROCKET Framework Health Monitor - Live Status');
    console.log('=' * 60);
    console.log(`📊 Overall System Health: ${report.summary.averageUptime.toFixed(2)}% uptime`);
    console.log(`⚡ Average Response Time: ${report.summary.averageResponseTime.toFixed(0)}ms`);
    console.log(`🔧 Services Monitored: ${report.summary.servicesMonitored}`);
    console.log(`🕐 Last Updated: ${new Date(report.timestamp).toLocaleString()}`);
    console.log('-' * 60);
    
    for (const [service, metrics] of Object.entries(report.services)) {
      const status = metrics.uptimePercentage >= this.config.thresholds.uptimeTarget ? '✅' : '❌';
      const responseStatus = metrics.avgResponseTime <= this.config.thresholds.responseTime ? '⚡' : '🐌';
      
      console.log(`${status} ${service}`);
      console.log(`   Uptime: ${metrics.uptimePercentage.toFixed(2)}%`);
      console.log(`   ${responseStatus} Response: ${metrics.avgResponseTime.toFixed(0)}ms`);
      console.log(`   Errors: ${metrics.errorRate.toFixed(2)}%`);
      console.log();
    }
  }

  async saveMetrics() {
    const metricsDir = path.join(process.cwd(), 'monitoring', 'metrics');
    await fs.mkdir(metricsDir, { recursive: true });
    
    const metricsData = {
      timestamp: new Date().toISOString(),
      uptime: Object.fromEntries(this.metrics.uptime),
      responseTime: Object.fromEntries(this.metrics.responseTime),
      errors: Object.fromEntries(this.metrics.errors)
    };
    
    const metricsFile = path.join(metricsDir, `metrics-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(metricsFile, JSON.stringify(metricsData, null, 2));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new ProductionHealthMonitor();
  monitor.start().catch(console.error);
}

export default ProductionHealthMonitor;