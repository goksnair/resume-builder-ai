import React from 'react';

function MinimalApp() {
  const [status, setStatus] = React.useState('Starting...');
  const [backendTest, setBackendTest] = React.useState('Not tested');

  React.useEffect(() => {
    setStatus('✅ Frontend Working');
  }, []);

  const testBackend = async () => {
    setBackendTest('Testing...');
    try {
      const response = await fetch('https://resume-builder-ai-production.up.railway.app/ping');
      if (response.ok) {
        const data = await response.json();
        setBackendTest('✅ Backend: ' + data.message);
      } else {
        setBackendTest('⚠️ Backend Error: ' + response.status);
      }
    } catch (error) {
      setBackendTest('❌ Connection Failed: ' + error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a202c',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
        🚀 Resume Builder AI
      </h1>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>System Status</h2>
        <p style={{ margin: '0.5rem 0' }}>Frontend: {status}</p>
        <p style={{ margin: '0.5rem 0' }}>Backend: {backendTest}</p>
        
        <button
          onClick={testBackend}
          style={{
            background: '#4299e1',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Test Backend Connection
        </button>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          <p>✅ Frontend deployed and working</p>
          <p>🔧 Backend being fixed</p>
          <p>🎯 All features will be restored after stability</p>
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;