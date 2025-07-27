import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp from './TestApp.jsx';
import './styles/index.css';

// Global error handling
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

console.log('🚀 Starting Resume Builder AI - Full Application');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);