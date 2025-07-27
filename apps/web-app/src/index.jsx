import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';

// Add comprehensive error handling
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
  console.error('🚨 Error details:', event.filename, event.lineno, event.colno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

console.log('🔍 Starting React app...');

try {
  // Dynamic import to catch import errors
  import('./App.jsx').then((AppModule) => {
    const App = AppModule.default;
    console.log('✅ App component loaded successfully');
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log('✅ ReactDOM root created');
    
    root.render(
      <React.StrictMode>
        <div style={{position:'fixed',top:0,left:0,zIndex:9999,background:'#0f0',color:'#000',padding:'4px',fontWeight:'bold'}}>
          React Loading... {new Date().toLocaleTimeString()}
        </div>
        <App />
      </React.StrictMode>
    );
    console.log('✅ App rendered to DOM');
    
  }).catch((error) => {
    console.error('🚨 Failed to load App component:', error);
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; background: #fee; border: 2px solid #f00; margin: 20px;">
        <h2>App Loading Error</h2>
        <p>Failed to load App component: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  });
  
} catch (error) {
  console.error('🚨 Critical error in index.jsx:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; background: #fee; border: 2px solid #f00; margin: 20px;">
      <h2>Critical Error</h2>
      <p>Error in index.jsx: ${error.message}</p>
    </div>
  `;
}
