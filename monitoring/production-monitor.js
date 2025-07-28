#!/usr/bin/env node

/**
 * Comprehensive Production Monitoring & Alerting System
 * Real-time monitoring with intelligent alerting for ROCKET Framework
 */

import { promises as fs } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

class ProductionMonitor extends EventEmitter {
  constructor() {
    super();
    this.config = {
      services: {
        frontend: {
          name: 'Frontend (Netlify)',
          url: 'https://tranquil-frangipane-ceffd4.netlify.app',
          endpoints: ['/', '/ai', '/professional-templates', '/templates'],
          critical: true
        },
        backend: {
          name: 'Backend (Railway)',
          url: 'https://resume-builder-ai-production.up.railway.app',
          endpoints: [
            '/health',
            '/api/v1/rocket/health',
            '/api/v1/elite/health',
            '/api/v1/conversation/health',
            '/api/v1/personas/health'
          ],
          critical: true
        }
      },
      monitoring: {
        interval: 30000, // 30 seconds
        healthCheckTimeout: 10000, // 10 seconds
        alertCooldown: 300000, // 5 minutes
        dataRetention: 7 * 24 * 60 * 60 * 1000 // 7 days
      },
      thresholds: {
        responseTime: {
          warning: 1000, // 1 second
          critical: 2000 // 2 seconds
        },
        uptime: {
          warning: 99.0, // 99%
          critical: 98.0 // 98%
        },
        errorRate: {
          warning: 2, // 2%
          critical: 5 // 5%
        }
      },
      alerts: {
        channels: ['console', 'file', 'webhook'],
        webhook: {
          url: process.env.WEBHOOK_URL || '',
          enabled: false
        },
        email: {
          enabled: false,
          recipients: []
        }
      }
    };
    
    this.state = {
      isRunning: false,
      metrics: new Map(),
      alerts: new Map(),
      lastHealthCheck: new Map(),
      dashboardData: {
        startTime: new Date(),
        totalChecks: 0,
        totalAlerts: 0,
        currentStatus: 'healthy'
      }
    };
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.on('healthCheck', this.handleHealthCheck.bind(this));
    this.on('alert', this.handleAlert.bind(this));
    this.on('recovery', this.handleRecovery.bind(this));
    this.on('statusChange', this.handleStatusChange.bind(this));
  }

  async start() {
    console.log('🚀 Starting Production Monitor for ROCKET Framework');
    console.log(`📊 Monitoring ${Object.keys(this.config.services).length} services`);
    console.log(`⏱️  Check interval: ${this.config.monitoring.interval / 1000}s`);
    
    this.state.isRunning = true;
    this.state.dashboardData.startTime = new Date();
    
    // Initialize metrics storage
    await this.initializeMetrics();
    
    // Start monitoring loop
    this.monitoringLoop();
    
    // Start dashboard server
    this.startDashboard();
    
    // Graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
    
    console.log('✅ Production Monitor started successfully');
  }

  async stop() {
    console.log('\n🛑 Stopping Production Monitor...');
    this.state.isRunning = false;
    
    // Save final metrics
    await this.saveMetrics();
    
    console.log('✅ Production Monitor stopped');
    process.exit(0);
  }

  async initializeMetrics() {
    for (const serviceKey of Object.keys(this.config.services)) {
      this.state.metrics.set(serviceKey, {
        uptime: [],
        responseTime: [],
        errors: [],
        availability: 100,
        averageResponseTime: 0,
        errorRate: 0,
        lastStatus: 'unknown'
      });
      
      this.state.alerts.set(serviceKey, {
        lastAlert: 0,
        alertCount: 0,
        consecutiveFailures: 0
      });
    }
  }

  async monitoringLoop() {
    while (this.state.isRunning) {
      try {
        await this.performHealthChecks();
        await this.analyzeMetrics();
        await this.updateDashboard();
        
        // Save metrics periodically
        if (this.state.dashboardData.totalChecks % 20 === 0) {
          await this.saveMetrics();
        }
        
        await this.sleep(this.config.monitoring.interval);
        
      } catch (error) {
        console.error('❌ Monitoring loop error:', error.message);
        await this.sleep(5000); // Short delay before retry
      }
    }
  }

  async performHealthChecks() {
    const timestamp = new Date().toISOString();
    const checkPromises = [];
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      for (const endpoint of service.endpoints) {
        checkPromises.push(
          this.checkEndpoint(serviceKey, service, endpoint, timestamp)
        );
      }
    }
    
    const results = await Promise.allSettled(checkPromises);
    this.state.dashboardData.totalChecks += results.length;
    
    // Process results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        this.emit('healthCheck', result.value);
      }
    }
  }

  async checkEndpoint(serviceKey, service, endpoint, timestamp) {
    const startTime = Date.now();
    const url = `${service.url}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.monitoring.healthCheckTimeout
      );
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ROCKET-Production-Monitor/1.0',
          'Accept': 'application/json, text/html, */*'
        }
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      const success = response.ok;
      
      return {
        serviceKey,
        service: service.name,
        endpoint,
        url,
        timestamp,
        success,
        status: response.status,
        responseTime,
        error: success ? null : `HTTP ${response.status}`
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        serviceKey,
        service: service.name,
        endpoint,
        url,
        timestamp,
        success: false,
        status: 0,
        responseTime,
        error: error.message
      };
    }
  }

  handleHealthCheck(result) {
    const metrics = this.state.metrics.get(result.serviceKey);
    const alerts = this.state.alerts.get(result.serviceKey);
    
    if (!metrics || !alerts) return;
    
    // Update metrics
    metrics.uptime.push({
      timestamp: result.timestamp,
      success: result.success,
      endpoint: result.endpoint
    });
    
    metrics.responseTime.push({
      timestamp: result.timestamp,
      responseTime: result.responseTime,
      endpoint: result.endpoint
    });
    
    if (!result.success) {
      metrics.errors.push({
        timestamp: result.timestamp,
        error: result.error,
        endpoint: result.endpoint,
        status: result.status
      });
      
      alerts.consecutiveFailures++;
    } else {
      if (alerts.consecutiveFailures > 0) {
        this.emit('recovery', {
          serviceKey: result.serviceKey,
          service: result.service,
          endpoint: result.endpoint
        });
      }
      alerts.consecutiveFailures = 0;
    }
    
    // Trim old data
    this.trimMetrics(metrics);
    
    // Check for alerts
    this.checkAlertConditions(result.serviceKey, result);
    
    // Update last health check
    this.state.lastHealthCheck.set(result.serviceKey, result.timestamp);
  }

  trimMetrics(metrics) {
    const cutoff = Date.now() - this.config.monitoring.dataRetention;
    
    metrics.uptime = metrics.uptime.filter(
      entry => new Date(entry.timestamp).getTime() > cutoff
    );
    
    metrics.responseTime = metrics.responseTime.filter(
      entry => new Date(entry.timestamp).getTime() > cutoff
    );
    
    metrics.errors = metrics.errors.filter(
      entry => new Date(entry.timestamp).getTime() > cutoff
    );
  }

  checkAlertConditions(serviceKey, result) {
    const alerts = this.state.alerts.get(serviceKey);
    const service = this.config.services[serviceKey];
    
    if (!alerts || !service) return;
    
    const now = Date.now();
    
    // Check cooldown
    if (now - alerts.lastAlert < this.config.monitoring.alertCooldown) {
      return;
    }
    
    const alertConditions = [];
    
    // Critical service down
    if (!result.success && service.critical) {
      alertConditions.push({
        severity: 'critical',
        type: 'service_down',
        message: `Critical service ${result.service} is down (${result.endpoint})`,
        details: {
          endpoint: result.endpoint,
          error: result.error,
          status: result.status
        }
      });
    }
    
    // Response time threshold
    if (result.responseTime > this.config.thresholds.responseTime.critical) {
      alertConditions.push({
        severity: 'critical',
        type: 'response_time',
        message: `Response time critical: ${result.responseTime}ms (${result.endpoint})`,
        details: {
          responseTime: result.responseTime,
          threshold: this.config.thresholds.responseTime.critical
        }
      });
    } else if (result.responseTime > this.config.thresholds.responseTime.warning) {
      alertConditions.push({
        severity: 'warning',
        type: 'response_time',
        message: `Response time elevated: ${result.responseTime}ms (${result.endpoint})`,
        details: {
          responseTime: result.responseTime,
          threshold: this.config.thresholds.responseTime.warning
        }
      });
    }
    
    // Consecutive failures
    if (alerts.consecutiveFailures >= 3) {
      alertConditions.push({
        severity: 'critical',
        type: 'consecutive_failures',
        message: `${alerts.consecutiveFailures} consecutive failures for ${result.service}`,
        details: {
          consecutiveFailures: alerts.consecutiveFailures,
          endpoint: result.endpoint
        }
      });
    }
    
    // Emit alerts
    for (const condition of alertConditions) {
      this.emit('alert', {
        serviceKey,
        service: result.service,
        ...condition,
        timestamp: new Date().toISOString()
      });
      
      alerts.lastAlert = now;
      alerts.alertCount++;
      this.state.dashboardData.totalAlerts++;
    }
  }

  handleAlert(alert) {
    console.log(`🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.message}`);
    
    // Log to file
    this.logAlert(alert);
    
    // Send webhook if configured
    if (this.config.alerts.webhook.enabled) {
      this.sendWebhookAlert(alert);
    }
    
    // Update system status
    if (alert.severity === 'critical') {
      this.emit('statusChange', 'critical');
    } else if (alert.severity === 'warning' && this.state.dashboardData.currentStatus === 'healthy') {
      this.emit('statusChange', 'warning');
    }
  }

  handleRecovery(recovery) {
    console.log(`✅ RECOVERY: ${recovery.service} (${recovery.endpoint}) is healthy again`);
    
    this.logAlert({
      severity: 'info',
      type: 'recovery',
      message: `Service ${recovery.service} recovered`,
      serviceKey: recovery.serviceKey,
      timestamp: new Date().toISOString()
    });
  }

  handleStatusChange(status) {
    const previousStatus = this.state.dashboardData.currentStatus;
    this.state.dashboardData.currentStatus = status;
    
    console.log(`📊 System status changed: ${previousStatus} → ${status}`);
  }

  async analyzeMetrics() {
    for (const [serviceKey, metrics] of this.state.metrics) {
      // Calculate availability
      const recentUptime = metrics.uptime.slice(-100); // Last 100 checks
      if (recentUptime.length > 0) {
        const successCount = recentUptime.filter(entry => entry.success).length;
        metrics.availability = (successCount / recentUptime.length) * 100;
      }
      
      // Calculate average response time
      const recentResponseTime = metrics.responseTime.slice(-50); // Last 50 checks
      if (recentResponseTime.length > 0) {
        const totalTime = recentResponseTime.reduce((sum, entry) => sum + entry.responseTime, 0);
        metrics.averageResponseTime = totalTime / recentResponseTime.length;
      }
      
      // Calculate error rate
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recentErrors = metrics.errors.filter(
        entry => new Date(entry.timestamp).getTime() > oneHourAgo
      );
      const recentChecks = metrics.uptime.filter(
        entry => new Date(entry.timestamp).getTime() > oneHourAgo
      );
      
      if (recentChecks.length > 0) {
        metrics.errorRate = (recentErrors.length / recentChecks.length) * 100;
      }
      
      // Update last status
      const lastCheck = metrics.uptime[metrics.uptime.length - 1];
      if (lastCheck) {
        metrics.lastStatus = lastCheck.success ? 'healthy' : 'unhealthy';
      }
    }
  }

  async updateDashboard() {
    const dashboard = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.state.dashboardData.startTime.getTime(),
      status: this.state.dashboardData.currentStatus,
      totalChecks: this.state.dashboardData.totalChecks,
      totalAlerts: this.state.dashboardData.totalAlerts,
      services: {}
    };
    
    for (const [serviceKey, metrics] of this.state.metrics) {
      const service = this.config.services[serviceKey];
      dashboard.services[serviceKey] = {
        name: service.name,
        status: metrics.lastStatus,
        availability: metrics.availability.toFixed(2),
        averageResponseTime: Math.round(metrics.averageResponseTime),
        errorRate: metrics.errorRate.toFixed(2),
        lastCheck: this.state.lastHealthCheck.get(serviceKey),
        alertCount: this.state.alerts.get(serviceKey)?.alertCount || 0
      };
    }
    
    // Save dashboard data
    const dashboardDir = path.join(process.cwd(), 'monitoring', 'dashboard');
    await fs.mkdir(dashboardDir, { recursive: true });
    
    const dashboardFile = path.join(dashboardDir, 'current-status.json');
    await fs.writeFile(dashboardFile, JSON.stringify(dashboard, null, 2));
    
    // Update console display
    this.displayDashboard(dashboard);
  }

  displayDashboard(dashboard) {
    console.clear();
    console.log('🏥 ROCKET Framework Production Monitor');
    console.log('='.repeat(60));
    console.log(`🌐 System Status: ${this.getStatusIcon(dashboard.status)} ${dashboard.status.toUpperCase()}`);
    console.log(`⏱️  Uptime: ${this.formatUptime(dashboard.uptime)}`);
    console.log(`📊 Total Checks: ${dashboard.totalChecks}`);
    console.log(`🚨 Total Alerts: ${dashboard.totalAlerts}`);
    console.log(`🕐 Last Updated: ${new Date(dashboard.timestamp).toLocaleTimeString()}`);
    console.log('-'.repeat(60));
    
    for (const [serviceKey, service] of Object.entries(dashboard.services)) {
      const statusIcon = this.getStatusIcon(service.status);
      console.log(`${statusIcon} ${service.name}`);
      console.log(`   Availability: ${service.availability}%`);
      console.log(`   Avg Response: ${service.averageResponseTime}ms`);
      console.log(`   Error Rate: ${service.errorRate}%`);
      console.log(`   Alerts: ${service.alertCount}`);
      console.log();
    }
  }

  getStatusIcon(status) {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      case 'unhealthy': return '🔴';
      default: return '❓';
    }
  }

  formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  async logAlert(alert) {
    const logDir = path.join(process.cwd(), 'monitoring', 'logs');
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, 'production-alerts.log');
    const logEntry = JSON.stringify(alert) + '\n';
    
    await fs.appendFile(logFile, logEntry);
  }

  async sendWebhookAlert(alert) {
    if (!this.config.alerts.webhook.url) return;
    
    try {
      const payload = {
        text: `🚨 ${alert.severity.toUpperCase()}: ${alert.message}`,
        attachments: [{
          color: alert.severity === 'critical' ? 'danger' : 'warning',
          fields: [
            {
              title: 'Service',
              value: alert.service,
              short: true
            },
            {
              title: 'Type',
              value: alert.type,
              short: true
            },
            {
              title: 'Time',
              value: new Date(alert.timestamp).toLocaleString(),
              short: false
            }
          ]
        }]
      };
      
      await fetch(this.config.alerts.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
    } catch (error) {
      console.error('Failed to send webhook alert:', error.message);
    }
  }

  async saveMetrics() {
    const metricsDir = path.join(process.cwd(), 'monitoring', 'metrics');
    await fs.mkdir(metricsDir, { recursive: true });
    
    const metricsData = {
      timestamp: new Date().toISOString(),
      dashboardData: this.state.dashboardData,
      metrics: Object.fromEntries(this.state.metrics),
      alerts: Object.fromEntries(this.state.alerts)
    };
    
    const filename = `metrics-${new Date().toISOString().split('T')[0]}.json`;
    const metricsFile = path.join(metricsDir, filename);
    
    await fs.writeFile(metricsFile, JSON.stringify(metricsData, null, 2));
  }

  startDashboard() {
    // Simple HTTP server for dashboard (optional)
    console.log('📊 Dashboard available in monitoring/dashboard/current-status.json');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new ProductionMonitor();
  
  monitor.start().catch(error => {
    console.error('Failed to start production monitor:', error);
    process.exit(1);
  });
}

export default ProductionMonitor;