#!/usr/bin/env node

/**
 * Simple server test script
 * Tests if the development server can start without errors
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const testServer = () => {
    return new Promise((resolve, reject) => {
        console.log('🚀 Testing development server startup...');

        // Change to web-app directory
        const webAppDir = path.join(__dirname, '..', 'apps', 'web-app');

        if (!fs.existsSync(webAppDir)) {
            reject(new Error('Web app directory not found'));
            return;
        }

        // Start the dev server
        const server = spawn('npm', ['run', 'dev'], {
            cwd: webAppDir,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let hasStarted = false;
        let hasError = false;

        // Capture stdout
        server.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log('📝 Server output:', text);

            // Check for successful startup indicators
            if (text.includes('Local:') || text.includes('localhost') || text.includes('ready')) {
                hasStarted = true;
                console.log('✅ Server appears to have started successfully');
            }
        });

        // Capture stderr
        server.stderr.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.error('❌ Server error:', text);

            // Check for critical errors
            if (text.includes('Error:') || text.includes('SyntaxError') || text.includes('Module not found')) {
                hasError = true;
            }
        });

        // Timeout after 15 seconds
        const timeout = setTimeout(() => {
            server.kill('SIGTERM');

            if (hasError) {
                reject(new Error('Server startup failed with errors'));
            } else if (hasStarted) {
                resolve('Server started successfully');
            } else {
                reject(new Error('Server startup timeout - no clear success or error'));
            }
        }, 15000);

        // Handle server exit
        server.on('close', (code) => {
            clearTimeout(timeout);

            if (code === 0 || hasStarted) {
                resolve('Server test completed successfully');
            } else {
                reject(new Error(`Server exited with code ${code}`));
            }
        });

        server.on('error', (err) => {
            clearTimeout(timeout);
            reject(new Error(`Failed to start server: ${err.message}`));
        });
    });
};

// Run the test
testServer()
    .then(result => {
        console.log('🎉', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Server test failed:', error.message);
        process.exit(1);
    });
