#!/usr/bin/env node

/**
 * Pre-deployment Health Check Script
 * 
 * This script runs comprehensive checks to ensure the application
 * is ready for production deployment and prevent runtime errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthChecker {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            errors: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    /**
     * Check if all required dependencies are installed
     */
    checkDependencies() {
        this.log('Checking dependencies...', 'info');

        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const requiredDeps = [
                'react',
                'react-dom',
                'react-router-dom',
                'lucide-react',
                '@radix-ui/react-tabs',
                '@radix-ui/react-dialog',
                'clsx',
                'tailwind-merge'
            ];

            const missingDeps = requiredDeps.filter(dep =>
                !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
            );

            if (missingDeps.length > 0) {
                this.results.failed++;
                this.results.errors.push(`Missing dependencies: ${missingDeps.join(', ')}`);
                this.log(`Missing dependencies: ${missingDeps.join(', ')}`, 'error');
                return false;
            }

            this.results.passed++;
            this.log('All required dependencies are installed', 'info');
            return true;
        } catch (error) {
            this.results.failed++;
            this.results.errors.push(`Failed to check dependencies: ${error.message}`);
            this.log(`Failed to check dependencies: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Run ESLint to check for code issues
     */
    checkCodeQuality() {
        this.log('Running code quality checks...', 'info');

        try {
            // Change to web-app directory to run lint
            const webAppDir = path.join(__dirname, '..', 'apps', 'web-app');
            execSync('npm run lint', { stdio: 'pipe', cwd: webAppDir });
            this.results.passed++;
            this.log('Code quality checks passed', 'info');
            return true;
        } catch (error) {
            this.results.failed++;
            this.results.errors.push('Code quality issues found');
            this.log('Code quality issues found. Run "npm run lint" for details.', 'error');
            return false;
        }
    }

    /**
     * Check if the application builds successfully
     */
    checkBuild() {
        this.log('Testing build process...', 'info');

        try {
            // Change to web-app directory to run build
            const webAppDir = path.join(__dirname, '..', 'apps', 'web-app');
            execSync('npm run build', { stdio: 'pipe', cwd: webAppDir });
            this.results.passed++;
            this.log('Build successful', 'info');
            return true;
        } catch (error) {
            this.results.failed++;
            this.results.errors.push('Build failed');
            this.log('Build failed. Check build logs for details.', 'error');
            return false;
        }
    }

    /**
     * Check for duplicate function declarations in React components
     */
    checkDuplicateFunctions() {
        this.log('Checking for duplicate function declarations...', 'info');

        const componentDir = path.join('src', 'components');
        if (!fs.existsSync(componentDir)) {
            this.results.warnings++;
            this.log('Components directory not found', 'warning');
            return true;
        }

        let hasDuplicates = false;
        const checkFile = (filePath) => {
            if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const functionNames = new Set();
                const duplicates = [];

                // Simple regex to find function declarations
                const functionRegex = /(?:const|function|let|var)\\s+(\\w+)\\s*[=\\(]/g;
                let match;

                while ((match = functionRegex.exec(content)) !== null) {
                    const funcName = match[1];
                    if (functionNames.has(funcName)) {
                        duplicates.push(funcName);
                        hasDuplicates = true;
                    } else {
                        functionNames.add(funcName);
                    }
                }

                if (duplicates.length > 0) {
                    this.results.errors.push(`Duplicate functions in ${filePath}: ${duplicates.join(', ')}`);
                    this.log(`Duplicate functions in ${filePath}: ${duplicates.join(', ')}`, 'error');
                }
            } catch (error) {
                this.log(`Error checking file ${filePath}: ${error.message}`, 'warning');
            }
        };

        const walkDir = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    walkDir(fullPath);
                } else {
                    checkFile(fullPath);
                }
            });
        };

        walkDir(componentDir);

        if (hasDuplicates) {
            this.results.failed++;
            return false;
        } else {
            this.results.passed++;
            this.log('No duplicate function declarations found', 'info');
            return true;
        }
    }

    /**
     * Check for missing files referenced in imports
     */
    checkImports() {
        this.log('Checking import references...', 'info');

        // This is a simplified check - a full implementation would parse all files
        try {
            // Check if key files exist
            const keyFiles = [
                'src/App.jsx',
                'src/components/rocket/EnhancedAIDashboard.jsx',
                'src/components/rocket/ResumeBuilder.jsx',
                'src/components/ui/tabs.jsx',
                'src/lib/utils.js'
            ];

            let missingFiles = 0;
            keyFiles.forEach(file => {
                if (!fs.existsSync(file)) {
                    this.results.errors.push(`Missing file: ${file}`);
                    this.log(`Missing file: ${file}`, 'error');
                    missingFiles++;
                }
            });

            if (missingFiles > 0) {
                this.results.failed++;
                return false;
            } else {
                this.results.passed++;
                this.log('All key files exist', 'info');
                return true;
            }
        } catch (error) {
            this.results.failed++;
            this.results.errors.push(`Import check failed: ${error.message}`);
            this.log(`Import check failed: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Check route configuration
     */
    checkRoutes() {
        this.log('Checking route configuration...', 'info');

        try {
            const appFile = 'src/App.jsx';
            if (!fs.existsSync(appFile)) {
                this.results.failed++;
                this.results.errors.push('App.jsx not found');
                this.log('App.jsx not found', 'error');
                return false;
            }

            const content = fs.readFileSync(appFile, 'utf8');

            // Check if critical routes exist
            const requiredRoutes = ['/ai', '/'];
            const missingRoutes = requiredRoutes.filter(route =>
                !content.includes(`path="${route}"`) && !content.includes(`path='${route}'`)
            );

            if (missingRoutes.length > 0) {
                this.results.failed++;
                this.results.errors.push(`Missing routes: ${missingRoutes.join(', ')}`);
                this.log(`Missing routes: ${missingRoutes.join(', ')}`, 'error');
                return false;
            }

            this.results.passed++;
            this.log('Route configuration looks good', 'info');
            return true;
        } catch (error) {
            this.results.failed++;
            this.results.errors.push(`Route check failed: ${error.message}`);
            this.log(`Route check failed: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Run all health checks
     */
    async runAllChecks() {
        console.log('🚀 Starting health checks...\\n');

        const checks = [
            () => this.checkDependencies(),
            () => this.checkImports(),
            () => this.checkDuplicateFunctions(),
            () => this.checkRoutes(),
            () => this.checkCodeQuality(),
            () => this.checkBuild()
        ];

        for (const check of checks) {
            await new Promise(resolve => {
                setTimeout(resolve, 100); // Small delay for readability
                check();
            });
        }

        // Summary
        console.log('\\n📊 Health Check Results:');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️  Warnings: ${this.results.warnings}`);

        if (this.results.errors.length > 0) {
            console.log('\\n🚨 Issues to fix:');
            this.results.errors.forEach(error => console.log(`  - ${error}`));
        }

        const isHealthy = this.results.failed === 0;
        console.log(`\\n${isHealthy ? '🎉' : '❌'} Application is ${isHealthy ? 'HEALTHY' : 'NOT READY'} for deployment`);

        return isHealthy;
    }
}

// Run health check if called directly
if (require.main === module) {
    const checker = new HealthChecker();
    checker.runAllChecks().then(isHealthy => {
        process.exit(isHealthy ? 0 : 1);
    });
}

module.exports = HealthChecker;
