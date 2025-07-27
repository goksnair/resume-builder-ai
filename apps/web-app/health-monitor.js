#!/usr/bin/env node
/**
 * Frontend Health Monitor
 * Continuously monitors the React app for availability and errors
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';
const CHECK_INTERVAL = 5000; // 5 seconds
const LOG_FILE = './health-monitor.log';

class HealthMonitor {
  constructor() {
    this.frontendStatus = 'unknown';
    this.backendStatus = 'unknown';
    this.startTime = new Date();
    this.errorCount = 0;
    this.successCount = 0;
    
    this.log('🚀 Frontend Health Monitor Started');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync(LOG_FILE, logEntry);
  }

  async checkUrl(url, name) {
    return new Promise((resolve) => {
      const request = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            // Check for specific content
            if (name === 'Frontend' && data.includes('<div id="root">')) {
              resolve({ status: 'healthy', statusCode: res.statusCode, hasContent: true });
            } else if (name === 'Backend' && data.includes('"message":"pong"')) {
              resolve({ status: 'healthy', statusCode: res.statusCode, hasContent: true });
            } else {
              resolve({ status: 'degraded', statusCode: res.statusCode, hasContent: false });
            }
          } else {
            resolve({ status: 'unhealthy', statusCode: res.statusCode, hasContent: false });
          }
        });
      });

      request.on('error', (error) => {
        resolve({ status: 'down', error: error.message, hasContent: false });
      });

      request.setTimeout(3000, () => {
        resolve({ status: 'timeout', hasContent: false });
      });
    });
  }

  async runHealthCheck() {
    const frontendResult = await this.checkUrl(FRONTEND_URL, 'Frontend');
    const backendResult = await this.checkUrl(`${BACKEND_URL}/ping`, 'Backend');

    // Update status
    const previousFrontendStatus = this.frontendStatus;
    this.frontendStatus = frontendResult.status;
    this.backendStatus = backendResult.status;

    // Log status changes
    if (previousFrontendStatus !== this.frontendStatus) {
      this.log(`🔄 Frontend status changed: ${previousFrontendStatus} → ${this.frontendStatus}`);
    }

    // Count errors and successes
    if (frontendResult.status === 'healthy' && backendResult.status === 'healthy') {
      this.successCount++;
    } else {
      this.errorCount++;
      this.log(`❌ Health check failed - Frontend: ${frontendResult.status}, Backend: ${backendResult.status}`);
      
      if (frontendResult.error) {
        this.log(`   Frontend error: ${frontendResult.error}`);
      }
      if (backendResult.error) {
        this.log(`   Backend error: ${backendResult.error}`);
      }
    }

    // Report status every 10 checks
    if ((this.successCount + this.errorCount) % 10 === 0) {
      const uptime = Math.floor((Date.now() - this.startTime) / 1000);
      const successRate = (this.successCount / (this.successCount + this.errorCount) * 100).toFixed(1);
      
      this.log(`📊 Status Report - Uptime: ${uptime}s, Success Rate: ${successRate}%, Frontend: ${this.frontendStatus}, Backend: ${this.backendStatus}`);
    }

    return {
      frontend: frontendResult,
      backend: backendResult,
      overall: frontendResult.status === 'healthy' && backendResult.status === 'healthy' ? 'healthy' : 'degraded'
    };
  }

  async startMonitoring() {
    this.log('🔍 Starting continuous health monitoring...');
    
    setInterval(async () => {
      await this.runHealthCheck();
    }, CHECK_INTERVAL);

    // Initial check
    const initialStatus = await this.runHealthCheck();
    this.log(`🎯 Initial status - Frontend: ${initialStatus.frontend.status}, Backend: ${initialStatus.backend.status}`);
    
    return initialStatus;
  }

  async generateStatusPage() {
    const status = await this.runHealthCheck();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const successRate = this.successCount + this.errorCount > 0 
      ? (this.successCount / (this.successCount + this.errorCount) * 100).toFixed(1) 
      : 0;

    const statusHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Resume Builder - Health Status</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="10">
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 15px; margin: 10px 0; border-radius: 6px; font-weight: bold; }
        .healthy { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .degraded { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .unhealthy { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .down { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        h1 { color: #333; text-align: center; }
        .timestamp { text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Resume Builder - System Status</h1>
        
        <div class="status ${status.frontend.status}">
            Frontend (${FRONTEND_URL}): ${status.frontend.status.toUpperCase()}
            ${status.frontend.statusCode ? ` (HTTP ${status.frontend.statusCode})` : ''}
        </div>
        
        <div class="status ${status.backend.status}">
            Backend (${BACKEND_URL}): ${status.backend.status.toUpperCase()}
            ${status.backend.statusCode ? ` (HTTP ${status.backend.statusCode})` : ''}
        </div>
        
        <div class="metrics">
            <div class="metric">
                <h3>Uptime</h3>
                <p>${Math.floor(uptime / 60)}m ${uptime % 60}s</p>
            </div>
            <div class="metric">
                <h3>Success Rate</h3>
                <p>${successRate}%</p>
            </div>
            <div class="metric">
                <h3>Total Checks</h3>
                <p>${this.successCount + this.errorCount}</p>
            </div>
            <div class="metric">
                <h3>Last Check</h3>
                <p>${new Date().toLocaleTimeString()}</p>
            </div>
        </div>
        
        <div class="timestamp">
            Status page automatically refreshes every 10 seconds<br>
            Generated at ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('./public/status.html', statusHtml);
    return statusHtml;
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new HealthMonitor();
  
  monitor.startMonitoring().then((initialStatus) => {
    console.log('✅ Health monitor is running');
    console.log(`📊 Initial status: ${JSON.stringify(initialStatus, null, 2)}`);
    
    // Generate status page every 30 seconds
    setInterval(() => {
      monitor.generateStatusPage();
    }, 30000);
    
    // Generate initial status page
    monitor.generateStatusPage();
  });
}

module.exports = HealthMonitor;