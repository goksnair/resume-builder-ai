#!/usr/bin/env node

/**
 * Build Process Optimizer for ROCKET Framework
 * Implements caching, parallel builds, and incremental deployments
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import crypto from 'crypto';

class BuildOptimizer {
  constructor() {
    this.config = {
      frontend: {
        dir: 'apps/web-app',
        buildCommand: 'npm run build',
        distDir: 'dist',
        cacheDir: '.build-cache'
      },
      backend: {
        dir: 'apps/backend',
        buildCommand: 'pip install -r requirements_production.txt',
        cacheDir: '.build-cache'
      },
      optimization: {
        enableCache: true,
        enableParallelBuilds: true,
        enableIncrementalBuilds: true,
        maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
        checksumFiles: [
          'package.json',
          'package-lock.json',
          'requirements.txt',
          'requirements_production.txt',
          'pyproject.toml'
        ]
      }
    };
    
    this.buildState = {
      startTime: null,
      frontendHash: null,
      backendHash: null,
      cacheHit: {
        frontend: false,
        backend: false
      },
      buildTimes: {}
    };
  }

  async optimizedBuild() {
    console.log('🚀 Starting optimized build process for ROCKET Framework');
    this.buildState.startTime = Date.now();
    
    try {
      // Initialize build optimization
      await this.initializeBuildCache();
      
      // Calculate checksums for change detection
      await this.calculateChecksums();
      
      // Determine what needs rebuilding
      const rebuildNeeded = await this.determineRebuildRequirements();
      
      // Execute optimized builds
      const buildResults = await this.executeOptimizedBuilds(rebuildNeeded);
      
      // Generate build report
      const report = await this.generateBuildReport(buildResults);
      
      console.log('✅ Optimized build completed successfully');
      return report;
      
    } catch (error) {
      console.error('❌ Build optimization failed:', error.message);
      throw error;
    }
  }

  async initializeBuildCache() {
    console.log('🔧 Initializing build cache...');
    
    const frontendCacheDir = path.join(this.config.frontend.dir, this.config.frontend.cacheDir);
    const backendCacheDir = path.join(this.config.backend.dir, this.config.backend.cacheDir);
    
    await fs.mkdir(frontendCacheDir, { recursive: true });
    await fs.mkdir(backendCacheDir, { recursive: true });
    
    console.log('✅ Build cache initialized');
  }

  async calculateChecksums() {
    console.log('🔍 Calculating checksums for change detection...');
    
    // Frontend checksum
    const frontendFiles = await this.collectChecksumFiles(this.config.frontend.dir);
    this.buildState.frontendHash = this.calculateHash(frontendFiles);
    
    // Backend checksum
    const backendFiles = await this.collectChecksumFiles(this.config.backend.dir);
    this.buildState.backendHash = this.calculateHash(backendFiles);
    
    console.log(`Frontend hash: ${this.buildState.frontendHash.substring(0, 12)}...`);
    console.log(`Backend hash: ${this.buildState.backendHash.substring(0, 12)}...`);
  }

  async collectChecksumFiles(dir) {
    const files = {};
    
    for (const file of this.config.optimization.checksumFiles) {
      const filePath = path.join(dir, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        files[file] = content;
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Also include source file structure
    try {
      const srcDir = path.join(dir, 'src');
      const srcStats = await this.getDirectoryStats(srcDir);
      files['src_structure'] = JSON.stringify(srcStats);
    } catch (error) {
      // No src directory
    }
    
    // Include app directory for backend
    if (dir.includes('backend')) {
      try {
        const appDir = path.join(dir, 'app');
        const appStats = await this.getDirectoryStats(appDir);
        files['app_structure'] = JSON.stringify(appStats);
      } catch (error) {
        // No app directory
      }
    }
    
    return files;
  }

  async getDirectoryStats(dir) {
    const stats = {};
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(dir, entry.name);
          const stat = await fs.stat(filePath);
          stats[entry.name] = {
            size: stat.size,
            mtime: stat.mtime.getTime()
          };
        } else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__pycache__') {
          stats[entry.name] = await this.getDirectoryStats(path.join(dir, entry.name));
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return stats;
  }

  calculateHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data, Object.keys(data).sort()));
    return hash.digest('hex');
  }

  async determineRebuildRequirements() {
    console.log('📊 Determining rebuild requirements...');
    
    const requirements = {
      frontend: true,
      backend: true
    };
    
    if (this.config.optimization.enableIncrementalBuilds) {
      // Check frontend cache
      const frontendCacheFile = path.join(
        this.config.frontend.dir,
        this.config.frontend.cacheDir,
        'build-hash.json'
      );
      
      try {
        const frontendCache = JSON.parse(await fs.readFile(frontendCacheFile, 'utf8'));
        if (frontendCache.hash === this.buildState.frontendHash &&
            Date.now() - frontendCache.timestamp < this.config.optimization.maxCacheAge) {
          requirements.frontend = false;
          this.buildState.cacheHit.frontend = true;
          console.log('✅ Frontend cache hit - skipping build');
        }
      } catch (error) {
        // No cache file
      }
      
      // Check backend cache
      const backendCacheFile = path.join(
        this.config.backend.dir,
        this.config.backend.cacheDir,
        'build-hash.json'
      );
      
      try {
        const backendCache = JSON.parse(await fs.readFile(backendCacheFile, 'utf8'));
        if (backendCache.hash === this.buildState.backendHash &&
            Date.now() - backendCache.timestamp < this.config.optimization.maxCacheAge) {
          requirements.backend = false;
          this.buildState.cacheHit.backend = true;
          console.log('✅ Backend cache hit - skipping build');
        }
      } catch (error) {
        // No cache file
      }
    }
    
    console.log(`Build requirements: Frontend=${requirements.frontend}, Backend=${requirements.backend}`);
    return requirements;
  }

  async executeOptimizedBuilds(requirements) {
    console.log('🔨 Executing optimized builds...');
    
    const buildPromises = [];
    
    if (requirements.frontend) {
      buildPromises.push(this.buildFrontend());
    }
    
    if (requirements.backend) {
      buildPromises.push(this.buildBackend());
    }
    
    // Execute builds in parallel if enabled
    let results;
    if (this.config.optimization.enableParallelBuilds && buildPromises.length > 1) {
      console.log('⚡ Running parallel builds...');
      results = await Promise.all(buildPromises);
    } else {
      console.log('🔄 Running sequential builds...');
      results = [];
      for (const buildPromise of buildPromises) {
        results.push(await buildPromise);
      }
    }
    
    return results;
  }

  async buildFrontend() {
    console.log('🎨 Building frontend...');
    const startTime = Date.now();
    
    try {
      // Pre-build optimizations
      await this.optimizeFrontendBuild();
      
      // Execute build
      const buildOutput = execSync(this.config.frontend.buildCommand, {
        cwd: this.config.frontend.dir,
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_ENV: 'production',
          VITE_BUILD_OPTIMIZATION: 'true'
        }
      });
      
      const buildTime = Date.now() - startTime;
      this.buildState.buildTimes.frontend = buildTime;
      
      // Cache build result
      await this.cacheFrontendBuild();
      
      console.log(`✅ Frontend build completed in ${buildTime}ms`);
      
      return {
        service: 'frontend',
        success: true,
        buildTime,
        output: buildOutput,
        cacheHit: this.buildState.cacheHit.frontend
      };
      
    } catch (error) {
      const buildTime = Date.now() - startTime;
      this.buildState.buildTimes.frontend = buildTime;
      
      console.error(`❌ Frontend build failed after ${buildTime}ms:`, error.message);
      
      return {
        service: 'frontend',
        success: false,
        buildTime,
        error: error.message,
        cacheHit: false
      };
    }
  }

  async optimizeFrontendBuild() {
    // Create optimized Vite config for production
    const optimizedConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
`;
    
    const configPath = path.join(this.config.frontend.dir, 'vite.config.optimized.js');
    await fs.writeFile(configPath, optimizedConfig);
    
    // Update build command to use optimized config
    this.config.frontend.buildCommand = 'npx vite build --config vite.config.optimized.js';
  }

  async buildBackend() {
    console.log('🐍 Building backend...');
    const startTime = Date.now();
    
    try {
      // Pre-build optimizations
      await this.optimizeBackendBuild();
      
      // Execute build (dependency installation)
      const buildOutput = execSync(this.config.backend.buildCommand, {
        cwd: this.config.backend.dir,
        encoding: 'utf8',
        env: {
          ...process.env,
          PIP_CACHE_DIR: path.join(this.config.backend.dir, this.config.backend.cacheDir, 'pip')
        }
      });
      
      const buildTime = Date.now() - startTime;
      this.buildState.buildTimes.backend = buildTime;
      
      // Cache build result
      await this.cacheBackendBuild();
      
      console.log(`✅ Backend build completed in ${buildTime}ms`);
      
      return {
        service: 'backend',
        success: true,
        buildTime,
        output: buildOutput,
        cacheHit: this.buildState.cacheHit.backend
      };
      
    } catch (error) {
      const buildTime = Date.now() - startTime;
      this.buildState.buildTimes.backend = buildTime;
      
      console.error(`❌ Backend build failed after ${buildTime}ms:`, error.message);
      
      return {
        service: 'backend',
        success: false,
        buildTime,
        error: error.message,
        cacheHit: false
      };
    }
  }

  async optimizeBackendBuild() {
    // Create pip cache directory
    const pipCacheDir = path.join(this.config.backend.dir, this.config.backend.cacheDir, 'pip');
    await fs.mkdir(pipCacheDir, { recursive: true });
    
    // Update build command to use cache and optimizations
    this.config.backend.buildCommand = `pip install --cache-dir ${pipCacheDir} --no-deps -r requirements_production.txt`;
  }

  async cacheFrontendBuild() {
    if (!this.config.optimization.enableCache) return;
    
    const cacheData = {
      hash: this.buildState.frontendHash,
      timestamp: Date.now(),
      buildTime: this.buildState.buildTimes.frontend
    };
    
    const cacheFile = path.join(
      this.config.frontend.dir,
      this.config.frontend.cacheDir,
      'build-hash.json'
    );
    
    await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
  }

  async cacheBackendBuild() {
    if (!this.config.optimization.enableCache) return;
    
    const cacheData = {
      hash: this.buildState.backendHash,
      timestamp: Date.now(),
      buildTime: this.buildState.buildTimes.backend
    };
    
    const cacheFile = path.join(
      this.config.backend.dir,
      this.config.backend.cacheDir,
      'build-hash.json'
    );
    
    await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
  }

  async generateBuildReport(buildResults) {
    const totalTime = Date.now() - this.buildState.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      totalBuildTime: totalTime,
      optimization: {
        cacheEnabled: this.config.optimization.enableCache,
        parallelBuilds: this.config.optimization.enableParallelBuilds,
        incrementalBuilds: this.config.optimization.enableIncrementalBuilds
      },
      builds: buildResults,
      cacheHits: this.buildState.cacheHit,
      performance: {
        totalTime,
        frontendTime: this.buildState.buildTimes.frontend || 0,
        backendTime: this.buildState.buildTimes.backend || 0,
        parallelEfficiency: this.calculateParallelEfficiency()
      }
    };
    
    // Save report
    const reportDir = path.join(process.cwd(), 'monitoring', 'build-reports');
    await fs.mkdir(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `build-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    // Display summary
    this.displayBuildSummary(report);
    
    return report;
  }

  calculateParallelEfficiency() {
    const frontendTime = this.buildState.buildTimes.frontend || 0;
    const backendTime = this.buildState.buildTimes.backend || 0;
    const totalTime = Date.now() - this.buildState.startTime;
    
    if (frontendTime === 0 || backendTime === 0) return 1;
    
    const sequentialTime = frontendTime + backendTime;
    return sequentialTime / totalTime;
  }

  displayBuildSummary(report) {
    console.log('\n📊 BUILD OPTIMIZATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Build Time: ${report.totalBuildTime}ms`);
    console.log(`Cache Hits: Frontend=${report.cacheHits.frontend}, Backend=${report.cacheHits.backend}`);
    console.log(`Parallel Efficiency: ${(report.performance.parallelEfficiency * 100).toFixed(1)}%`);
    
    if (report.builds.length > 0) {
      console.log('\nBuild Results:');
      for (const build of report.builds) {
        const status = build.success ? '✅' : '❌';
        const cacheInfo = build.cacheHit ? ' (cache hit)' : '';
        console.log(`  ${status} ${build.service}: ${build.buildTime}ms${cacheInfo}`);
      }
    }
    
    const timeSaved = this.calculateTimeSaved(report);
    if (timeSaved > 0) {
      console.log(`\n⚡ Time saved through optimization: ${timeSaved}ms`);
    }
  }

  calculateTimeSaved(report) {
    let timeSaved = 0;
    
    // Calculate time saved from cache hits
    if (report.cacheHits.frontend) {
      timeSaved += 30000; // Estimated frontend build time
    }
    
    if (report.cacheHits.backend) {
      timeSaved += 15000; // Estimated backend build time
    }
    
    // Calculate time saved from parallel builds
    if (report.builds.length > 1 && report.performance.parallelEfficiency > 1) {
      const sequentialTime = report.builds.reduce((sum, build) => sum + build.buildTime, 0);
      timeSaved += sequentialTime - report.totalBuildTime;
    }
    
    return timeSaved;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new BuildOptimizer();
  
  optimizer.optimizedBuild()
    .then(report => {
      console.log('\nBuild optimization completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Build optimization failed:', error);
      process.exit(1);
    });
}

export default BuildOptimizer;