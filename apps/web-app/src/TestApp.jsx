import React from 'react';

function TestApp() {
  return (
    <div style={{
      padding: '20px',
      background: '#f0f8ff',
      border: '2px solid #007bff',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h1 style={{color: '#007bff'}}>🚀 Resume Builder Test App</h1>
      <p>✅ React is working correctly!</p>
      <p>⏰ Current time: {new Date().toLocaleString()}</p>
      <div style={{marginTop: '20px'}}>
        <h2>🔧 Debug Information:</h2>
        <ul>
          <li>React Version: {React.version}</li>
          <li>Environment: {import.meta.env.MODE}</li>
          <li>Base URL: {import.meta.env.BASE_URL}</li>
        </ul>
      </div>
      <div style={{marginTop: '20px', padding: '10px', background: '#d4edda', borderRadius: '4px'}}>
        <strong>✅ If you can see this, React is working properly!</strong>
      </div>
    </div>
  );
}

export default TestApp;