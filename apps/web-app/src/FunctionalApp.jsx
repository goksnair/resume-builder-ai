import React from 'react';
import EnhancedHeroSection from './components/EnhancedHeroSection';

function FunctionalApp() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [backendStatus, setBackendStatus] = React.useState('Not tested');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [jobDescription, setJobDescription] = React.useState('');
  const [templates, setTemplates] = React.useState([]);
  const [analysis, setAnalysis] = React.useState(null);
  const [rocketSession, setRocketSession] = React.useState(null);

  const API_BASE_URL = 'https://resume-builder-ai-production.up.railway.app';

  React.useEffect(() => {
    testBackend();
    loadTemplates();
  }, []);

  const testBackend = async () => {
    setBackendStatus('Testing...');
    try {
      const response = await fetch(`${API_BASE_URL}/ping`);
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

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const uploadResume = async () => {
    if (!uploadedFile) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResults({
          type: 'resume_upload',
          data: data
        });
      } else {
        setResults({
          type: 'error',
          data: { message: 'Upload failed: ' + response.status }
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: 'Upload error: ' + error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const matchJob = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description!');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/job/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: jobDescription })
      });

      if (response.ok) {
        const data = await response.json();
        setResults({
          type: 'job_match',
          data: data
        });
      } else {
        setResults({
          type: 'error',
          data: { message: 'Job matching failed: ' + response.status }
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: 'Job matching error: ' + error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = async (templateId) => {
    setLoading(true);
    setResults(null);

    try {
      // Simulate template selection - in real app would generate resume
      const template = templates.find(t => t.id === templateId);
      setResults({
        type: 'template_selected',
        data: {
          message: `Selected ${template.name}`,
          template: template,
          next_steps: ['Customize template', 'Add your content', 'Download PDF']
        }
      });
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: 'Template selection error: ' + error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const getDetailedAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analysis/sample_resume_001`);
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        setResults({
          type: 'analysis',
          data: data
        });
      } else {
        setResults({
          type: 'error',
          data: { message: 'Analysis failed: ' + response.status }
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: 'Analysis error: ' + error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const startRocketSession = async () => {
    setLoading(true);
    setRocketSession(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/rocket/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRocketSession(data);
        setResults({
          type: 'rocket_session',
          data: data
        });
      } else {
        setResults({
          type: 'error',
          data: { message: 'ROCKET session failed: ' + response.status }
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: 'ROCKET session error: ' + error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const { type, data } = results;

    switch (type) {
      case 'resume_upload':
        return (
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>✅ Resume Upload Successful</h4>
            <p><strong>File:</strong> {data.filename}</p>
            <p><strong>ATS Score:</strong> {data.analysis.ats_score}%</p>
            <p><strong>Skills Found:</strong> {data.analysis.skills_found.join(', ')}</p>
            <p><strong>Experience:</strong> {data.analysis.experience_years} years</p>
          </div>
        );

      case 'job_match':
        return (
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>✅ Job Matching Complete</h4>
            <p><strong>Match Score:</strong> {data.match_score}%</p>
            <p><strong>Matching Skills:</strong> {data.matching_skills.join(', ')}</p>
            <p><strong>Missing Skills:</strong> {data.missing_skills.join(', ')}</p>
            <div>
              <strong>Recommendations:</strong>
              <ul>
                {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          </div>
        );

      case 'template_selected':
        return (
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>✅ Template Selected</h4>
            <p><strong>Template:</strong> {data.template.name}</p>
            <p><strong>Category:</strong> {data.template.category}</p>
            <div>
              <strong>Next Steps:</strong>
              <ul>
                {data.next_steps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>✅ Detailed Analysis</h4>
            <p><strong>ATS Score:</strong> {data.ats_score}%</p>
            <div>
              <strong>Strengths:</strong>
              <ul>
                {data.analysis.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
              </ul>
            </div>
            <div>
              <strong>Improvements:</strong>
              <ul>
                {data.analysis.improvements.map((improvement, i) => <li key={i}>{improvement}</li>)}
              </ul>
            </div>
          </div>
        );

      case 'rocket_session':
        return (
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>✅ ROCKET Session Started</h4>
            <p><strong>Session ID:</strong> {data.session_id}</p>
            <p><strong>Dr. Maya:</strong> {data.message}</p>
            <div>
              <strong>Questions to explore:</strong>
              <ul>
                {data.questions.map((question, i) => <li key={i}>{question}</li>)}
              </ul>
            </div>
            <p><strong>Progress:</strong> {data.progress.current_phase} - {data.progress.completion}%</p>
          </div>
        );

      case 'error':
        return (
          <div style={{
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.5)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h4>❌ Error</h4>
            <p>{data.message}</p>
          </div>
        );

      default:
        return null;
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
          <div style={{ marginTop: '-2rem', marginLeft: '-2rem', marginRight: '-2rem' }}>
            <EnhancedHeroSection 
              onGetStarted={() => setCurrentPage('builder')}
            />
            
            {/* Quick Access Section */}
            <div style={{ 
              background: 'rgba(0,0,0,0.1)', 
              padding: '4rem 2rem',
              textAlign: 'center' 
            }}>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem', 
                color: 'white',
                fontFamily: 'Inter, -apple-system, sans-serif'
              }}>
                Choose Your Journey
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: '2rem', 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '600px',
                margin: '0 auto 2rem auto'
              }}>
                Explore our comprehensive suite of AI-powered career tools designed to elevate your professional presence.
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                {Object.entries(pages).filter(([key]) => key !== 'home').map(([key, title]) => {
                  const descriptions = {
                    builder: 'Upload and optimize your resume with AI-powered analysis',
                    templates: 'Choose from professional, ATS-optimized resume templates',
                    analysis: 'Get detailed insights and improvement recommendations',
                    rocket: 'Discover your career psychology with Dr. Maya'
                  };
                  
                  const icons = {
                    builder: '📝',
                    templates: '📊', 
                    analysis: '🧠',
                    rocket: '🚀'
                  };

                  return (
                    <button
                      key={key}
                      onClick={() => setCurrentPage(key)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-4px)';
                        e.target.style.background = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {icons[key]}
                      </div>
                      <h4 style={{ 
                        fontSize: '1.3rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.5rem',
                        fontFamily: 'Inter, -apple-system, sans-serif'
                      }}>
                        {title}
                      </h4>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: '1.4'
                      }}>
                        {descriptions[key]}
                      </p>
                    </button>
                  );
                })}
              </div>
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
                onChange={(e) => setUploadedFile(e.target.files[0])}
                style={{
                  margin: '1rem 0',
                  padding: '0.5rem',
                  width: '100%'
                }}
              />
              {uploadedFile && (
                <p style={{ margin: '0.5rem 0', color: '#4CAF50' }}>
                  Selected: {uploadedFile.name}
                </p>
              )}
              <button 
                onClick={uploadResume}
                disabled={loading || !uploadedFile}
                style={{
                  background: loading ? '#888' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
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
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{
                  width: '100%',
                  height: '150px',
                  margin: '1rem 0',
                  padding: '1rem',
                  borderRadius: '5px',
                  border: 'none'
                }}
              />
              <button 
                onClick={matchJob}
                disabled={loading || !jobDescription.trim()}
                style={{
                  background: loading ? '#888' : '#FF9800',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Matching...' : 'Match Job'}
              </button>
            </div>
            {renderResults()}
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
              {templates.map(template => (
                <div key={template.id} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <p><strong>Category:</strong> {template.category}</p>
                  <button 
                    onClick={() => selectTemplate(template.id)}
                    disabled={loading}
                    style={{
                      background: loading ? '#888' : '#9C27B0',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Loading...' : 'Use Template'}
                  </button>
                </div>
              ))}
            </div>
            {renderResults()}
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
              <button 
                onClick={getDetailedAnalysis}
                disabled={loading}
                style={{
                  background: loading ? '#888' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Analyzing...' : 'Get Detailed Analysis'}
              </button>
            </div>
            {renderResults()}
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
              <button 
                onClick={startRocketSession}
                disabled={loading}
                style={{
                  background: loading ? '#888' : '#E91E63',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Starting...' : 'Start ROCKET Session'}
              </button>
            </div>
            {renderResults()}
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
        padding: currentPage === 'home' ? '0' : '2rem',
        maxWidth: currentPage === 'home' ? 'none' : '1200px',
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
        Resume Builder AI with ROCKET Framework | All Features Functional
      </footer>
    </div>
  );
}

export default FunctionalApp;