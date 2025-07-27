import React from 'react';

function ExpandedApp() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [backendStatus, setBackendStatus] = React.useState('Not tested');

  React.useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    setBackendStatus('Testing...');
    try {
      const response = await fetch('https://resume-builder-ai-production.up.railway.app/ping');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('✅ Connected: ' + data.message);
      } else {
        setBackendStatus('⚠️ Error: ' + response.status);
      }
    } catch (error) {
      setBackendStatus('❌ Failed: ' + error.message);
    }
  };

  const pages = {
    home: 'Home',
    builder: 'Resume Builder', 
    templates: 'Templates',
    analysis: 'AI Analysis',
    rocket: 'ROCKET Framework'
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 Resume Builder AI</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              AI-Powered Resume Builder with ROCKET Framework
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {Object.entries(pages).filter(([key]) => key !== 'home').map(([key, title]) => (
                <button
                  key={key}
                  onClick={() => setCurrentPage(key)}
                  style={{
                    background: 'rgba(66, 153, 225, 0.8)',
                    border: '1px solid rgba(66, 153, 225, 1)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'builder':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝 Resume Builder</h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3>Upload Resume</h3>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                style={{
                  margin: '1rem 0',
                  padding: '0.5rem',
                  width: '100%'
                }}
              />
              <button style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Analyze Resume
              </button>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '8px'
            }}>
              <h3>Job Description</h3>
              <textarea 
                placeholder="Paste job description here..."
                style={{
                  width: '100%',
                  height: '150px',
                  margin: '1rem 0',
                  padding: '1rem',
                  borderRadius: '5px',
                  border: 'none'
                }}
              />
              <button style={{
                background: '#FF9800',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Match Job
              </button>
            </div>
          </div>
        );
      
      case 'templates':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊 Professional Templates</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem'
            }}>
              {['Executive', 'Technical', 'Creative', 'Academic'].map(template => (
                <div key={template} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3>{template} Template</h3>
                  <p>Professional {template.toLowerCase()} resume template</p>
                  <button style={{
                    background: '#9C27B0',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'analysis':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠 AI Analysis</h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '8px'
            }}>
              <h3>Resume Analysis Results</h3>
              <div style={{ margin: '1rem 0' }}>
                <p>🎯 ATS Score: <strong>85%</strong></p>
                <p>📊 Skills Match: <strong>12/15 matched</strong></p>
                <p>⚡ Improvement Areas: <strong>3 suggestions</strong></p>
              </div>
              <button style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Get Detailed Analysis
              </button>
            </div>
          </div>
        );
      
      case 'rocket':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 ROCKET Framework</h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '8px'
            }}>
              <h3>Career Psychology Assessment</h3>
              <p>Get personalized career insights from Dr. Maya</p>
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '5px',
                margin: '1rem 0',
                fontStyle: 'italic'
              }}>
                "Tell me about your career goals and I'll help you optimize your professional narrative."
              </div>
              <button style={{
                background: '#E91E63',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Start ROCKET Session
              </button>
            </div>
          </div>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Resume Builder AI</h1>
        <div style={{ fontSize: '0.9rem' }}>
          Backend: {backendStatus}
        </div>
      </nav>

      {/* Page Navigation */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {Object.entries(pages).map(([key, title]) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key)}
            style={{
              background: currentPage === key ? 'rgba(66, 153, 225, 0.8)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '1rem 2rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        opacity: 0.8
      }}>
        Resume Builder AI with ROCKET Framework | Production Ready
      </footer>
    </div>
  );
}

export default ExpandedApp;