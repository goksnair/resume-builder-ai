const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const path = require('path')

module.exports = defineConfig({
  base: '/resume-builder-ai/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
