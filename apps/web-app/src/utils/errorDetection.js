/**
 * Error Detection and Prevention System
 * 
 * This module provides utilities to detect and prevent common runtime errors
 * that could break the application in production.
 */

export class ErrorDetector {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Check for missing dependencies
     */
    checkDependencies() {
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

        const missingDeps = [];
        requiredDeps.forEach(dep => {
            try {
                require.resolve(dep);
            } catch (error) {
                missingDeps.push(dep);
            }
        });

        if (missingDeps.length > 0) {
            this.errors.push({
                type: 'MISSING_DEPENDENCIES',
                message: `Missing dependencies: ${missingDeps.join(', ')}`,
                critical: true,
                fix: `Run: npm install ${missingDeps.join(' ')}`
            });
        }
    }

    /**
     * Check for duplicate function declarations
     */
    checkDuplicateFunctions(fileContent, fileName) {
        const functionRegex = /(?:const|function|let|var)\s+(\w+)\s*[=\(]/g;
        const functions = new Map();
        let match;

        while ((match = functionRegex.exec(fileContent)) !== null) {
            const funcName = match[1];
            if (functions.has(funcName)) {
                this.errors.push({
                    type: 'DUPLICATE_FUNCTION',
                    message: `Duplicate function declaration: ${funcName} in ${fileName}`,
                    critical: true,
                    fix: 'Remove or rename one of the duplicate functions'
                });
            } else {
                functions.set(funcName, true);
            }
        }
    }

    /**
     * Check for missing imports
     */
    checkImports(fileContent, fileName) {
        const importRegex = /import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g;
        let match;

        while ((match = importRegex.exec(fileContent)) !== null) {
            const importPath = match[1];

            // Check for potential missing files for relative imports
            if (importPath.startsWith('./') || importPath.startsWith('../')) {
                // This would need actual file system checking in a real implementation
                this.warnings.push({
                    type: 'RELATIVE_IMPORT',
                    message: `Verify relative import exists: ${importPath} in ${fileName}`,
                    critical: false
                });
            }
        }
    }

    /**
     * Check for routing issues
     */
    checkRouting(routeConfig) {
        const routes = [];
        const duplicateRoutes = [];

        routeConfig.forEach(route => {
            if (routes.includes(route.path)) {
                duplicateRoutes.push(route.path);
            } else {
                routes.push(route.path);
            }
        });

        if (duplicateRoutes.length > 0) {
            this.errors.push({
                type: 'DUPLICATE_ROUTES',
                message: `Duplicate routes found: ${duplicateRoutes.join(', ')}`,
                critical: true,
                fix: 'Remove duplicate route definitions'
            });
        }
    }

    /**
     * Run all checks
     */
    runAllChecks(fileContents = {}, routeConfig = []) {
        this.errors = [];
        this.warnings = [];

        this.checkDependencies();

        // Check each file for issues
        Object.entries(fileContents).forEach(([fileName, content]) => {
            this.checkDuplicateFunctions(content, fileName);
            this.checkImports(content, fileName);
        });

        if (routeConfig.length > 0) {
            this.checkRouting(routeConfig);
        }

        return {
            errors: this.errors,
            warnings: this.warnings,
            hasErrors: this.errors.length > 0,
            hasCriticalErrors: this.errors.some(e => e.critical)
        };
    }

    /**
     * Format results for display
     */
    formatResults() {
        const results = [];

        if (this.errors.length > 0) {
            results.push('🚨 ERRORS:');
            this.errors.forEach(error => {
                results.push(`  - [${error.type}] ${error.message}`);
                if (error.fix) {
                    results.push(`    Fix: ${error.fix}`);
                }
            });
        }

        if (this.warnings.length > 0) {
            results.push('⚠️  WARNINGS:');
            this.warnings.forEach(warning => {
                results.push(`  - [${warning.type}] ${warning.message}`);
            });
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            results.push('✅ No issues detected');
        }

        return results.join('\n');
    }
}

export default ErrorDetector;
