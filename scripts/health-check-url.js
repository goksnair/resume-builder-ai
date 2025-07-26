#!/usr/bin/env node

const http = require('http');

function checkUrl(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                reject(new Error(`Status code: ${res.statusCode}`));
            }
        });
        req.on('error', (err) => reject(err));
        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Timeout'));
        });
    });
}

(async () => {
    const url = 'http://localhost:3000/ai?tab=resume-builder';
    try {
        const ok = await checkUrl(url);
        if (ok) {
            console.log(`✅ URL is accessible: ${url}`);
            process.exit(0);
        }
    } catch (e) {
        console.error(`❌ URL check failed: ${url}`);
        console.error(e.message);
        process.exit(1);
    }
})();
