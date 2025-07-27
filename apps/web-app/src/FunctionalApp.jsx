import React from 'react';
import EnhancedHeroSection from './components/EnhancedHeroSection';
import EnhancedNavigation from './components/EnhancedNavigation';
import ProgressIndicator from './components/ProgressIndicator';
import { 
  PageTransition, 
  EnhancedPageContainer, 
  LoadingTransition, 
  InteractiveCard 
} from './components/PageTransition';

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
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [showProgressIndicator, setShowProgressIndicator] = React.useState(false);

  const API_BASE_URL = 'https://resume-builder-ai-production.up.railway.app';

  React.useEffect(() => {
    testBackend();
    loadTemplates();
  }, []);

  // Enhanced page navigation with transitions
  const handlePageChange = React.useCallback((newPage) => {
    if (newPage === currentPage) return;
    
    setIsTransitioning(true);
    
    // Add a slight delay for smooth transition
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 150);
  }, [currentPage]);

  // Handle progress indicator step clicks
  const handleProgressStepClick = React.useCallback((stepId) => {
    handlePageChange(stepId);
  }, [handlePageChange]);

  // Toggle progress indicator visibility
  const toggleProgressIndicator = React.useCallback(() => {
    setShowProgressIndicator(!showProgressIndicator);
  }, [showProgressIndicator]);

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
          <InteractiveCard
            hoverEffect="glow"
            className="bg-green-500/10 border border-green-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✅</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Resume Upload Successful</h4>
                <div className="space-y-2 text-white/80">
                  <p><strong className="text-white">File:</strong> {data.filename}</p>
                  <p><strong className="text-white">ATS Score:</strong> <span className="text-green-400 font-bold">{data.analysis.ats_score}%</span></p>
                  <p><strong className="text-white">Skills Found:</strong> {data.analysis.skills_found.join(', ')}</p>
                  <p><strong className="text-white">Experience:</strong> {data.analysis.experience_years} years</p>
                </div>
              </div>
            </div>
          </InteractiveCard>
        );

      case 'job_match':
        return (
          <InteractiveCard
            hoverEffect="glow"
            className="bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-orange-400 mb-3">Job Matching Complete</h4>
                <div className="space-y-3 text-white/80">
                  <p><strong className="text-white">Match Score:</strong> <span className="text-orange-400 font-bold">{data.match_score}%</span></p>
                  <p><strong className="text-white">Matching Skills:</strong> {data.matching_skills.join(', ')}</p>
                  <p><strong className="text-white">Missing Skills:</strong> <span className="text-red-300">{data.missing_skills.join(', ')}</span></p>
                  <div>
                    <strong className="text-white">Recommendations:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                      {data.recommendations.map((rec, i) => (
                        <li key={i} className="text-white/70">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        );

      case 'template_selected':
        return (
          <InteractiveCard
            hoverEffect="glow"
            className="bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📄</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Template Selected</h4>
                <div className="space-y-3 text-white/80">
                  <p><strong className="text-white">Template:</strong> {data.template.name}</p>
                  <p><strong className="text-white">Category:</strong> <span className="text-purple-300">{data.template.category}</span></p>
                  <div>
                    <strong className="text-white">Next Steps:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                      {data.next_steps.map((step, i) => (
                        <li key={i} className="text-white/70">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        );

      case 'analysis':
        return (
          <InteractiveCard
            hoverEffect="glow"
            className="bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🧠</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Detailed Analysis Complete</h4>
                <div className="space-y-4 text-white/80">
                  <p><strong className="text-white">ATS Score:</strong> <span className="text-blue-400 font-bold text-xl">{data.ats_score}%</span></p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4">
                      <strong className="text-green-400 flex items-center mb-2">
                        <span className="mr-2">💪</span> Strengths
                      </strong>
                      <ul className="space-y-1 text-sm">
                        {data.analysis.strengths.map((strength, i) => (
                          <li key={i} className="text-white/70 flex items-start">
                            <span className="text-green-400 mr-2">•</span> {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-orange-500/10 rounded-lg p-4">
                      <strong className="text-orange-400 flex items-center mb-2">
                        <span className="mr-2">⚡</span> Improvements
                      </strong>
                      <ul className="space-y-1 text-sm">
                        {data.analysis.improvements.map((improvement, i) => (
                          <li key={i} className="text-white/70 flex items-start">
                            <span className="text-orange-400 mr-2">•</span> {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        );

      case 'rocket_session':
        return (
          <InteractiveCard
            hoverEffect="glow"
            className="bg-pink-500/10 border border-pink-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚀</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-pink-400 mb-3">ROCKET Session Started</h4>
                <div className="space-y-4 text-white/80">
                  <p><strong className="text-white">Session ID:</strong> <span className="text-pink-300 font-mono text-sm">{data.session_id}</span></p>
                  
                  <div className="bg-black/20 rounded-lg p-4 border-l-4 border-pink-400">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">👩‍💼</span>
                      </div>
                      <div>
                        <p className="text-pink-300 font-medium text-sm mb-1">Dr. Maya says:</p>
                        <p className="text-white/90 italic">{data.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-white flex items-center mb-2">
                      <span className="mr-2">❓</span> Questions to explore:
                    </strong>
                    <ul className="space-y-1 text-sm">
                      {data.questions.map((question, i) => (
                        <li key={i} className="text-white/70 flex items-start">
                          <span className="text-pink-400 mr-2">{i + 1}.</span> {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-pink-500/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-white text-sm">Progress: {data.progress.current_phase}</strong>
                      <span className="text-pink-400 font-bold">{data.progress.completion}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.progress.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        );

      case 'error':
        return (
          <InteractiveCard
            hoverEffect="glow"
            className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl p-6 animate-fadeIn"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">❌</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-red-400 mb-3">Something went wrong</h4>
                <p className="text-white/80">{data.message}</p>
                <div className="mt-4 p-3 bg-red-500/10 rounded-lg border-l-4 border-red-400">
                  <p className="text-red-300 text-sm">
                    <strong>Need help?</strong> Try refreshing the page or contact support if the issue persists.
                  </p>
                </div>
              </div>
            </div>
          </InteractiveCard>
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
          <EnhancedPageContainer pageId="home" className="-mt-8 -mx-8">
            <div style={{ marginTop: '-6rem', marginLeft: '-2rem', marginRight: '-2rem' }}>
              <EnhancedHeroSection 
                onGetStarted={() => handlePageChange('builder')}
              />
              
              {/* Progress Indicator Section */}
              <div style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <button
                  onClick={toggleProgressIndicator}
                  className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {showProgressIndicator ? 'Hide Journey Map' : 'View Your Journey Map'}
                </button>
                
                {showProgressIndicator && (
                  <div className="transition-all duration-700 ease-out">
                    <ProgressIndicator 
                      currentPage={currentPage}
                      onStepClick={handleProgressStepClick}
                    />
                  </div>
                )}
              </div>
              
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
                      <InteractiveCard
                        key={key}
                        onClick={() => handlePageChange(key)}
                        hoverEffect="lift"
                        className="bg-white/10 border border-white/20 text-white p-8 rounded-xl text-left backdrop-blur-sm"
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
                      </InteractiveCard>
                    );
                  })}
                </div>
              </div>
            </div>
          </EnhancedPageContainer>
        );
      
      case 'builder':
        return (
          <EnhancedPageContainer 
            pageId="builder"
            title="📝 Resume Builder"
            description="Upload your resume and get AI-powered optimization insights"
            showBackButton={true}
            onBack={() => handlePageChange('home')}
          >
            <div className="space-y-6">
              <InteractiveCard
                hoverEffect="glow"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Upload Resume</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => setUploadedFile(e.target.files[0])}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <span>✓</span>
                      <span className="text-sm">Selected: {uploadedFile.name}</span>
                    </div>
                  )}
                  <InteractiveCard
                    onClick={uploadResume}
                    disabled={loading || !uploadedFile}
                    hoverEffect="scale"
                    className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      loading || !uploadedFile
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
                    } text-white`}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </InteractiveCard>
                </div>
              </InteractiveCard>

              <InteractiveCard
                hoverEffect="glow"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Job Description</h3>
                <div className="space-y-4">
                  <textarea 
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-40 p-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <InteractiveCard
                    onClick={matchJob}
                    disabled={loading || !jobDescription.trim()}
                    hoverEffect="scale"
                    className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      loading || !jobDescription.trim()
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg'
                    } text-white`}
                  >
                    {loading ? 'Matching...' : 'Match Job'}
                  </InteractiveCard>
                </div>
              </InteractiveCard>

              {results && (
                <div className="animate-fadeIn">
                  {renderResults()}
                </div>
              )}
            </div>
          </EnhancedPageContainer>
        );
      
      case 'templates':
        return (
          <EnhancedPageContainer 
            pageId="templates"
            title="📊 Professional Templates"
            description="Choose from our collection of ATS-optimized resume templates"
            showBackButton={true}
            onBack={() => handlePageChange('home')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <InteractiveCard
                  key={template.id}
                  hoverEffect="lift"
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                >
                  <div className="mb-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{template.description}</p>
                    <div className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-purple-200 text-xs font-medium">
                      {template.category}
                    </div>
                  </div>
                  <InteractiveCard
                    onClick={() => selectTemplate(template.id)}
                    disabled={loading}
                    hoverEffect="scale"
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      loading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
                    } text-white`}
                  >
                    {loading ? 'Loading...' : 'Use Template'}
                  </InteractiveCard>
                </InteractiveCard>
              ))}
            </div>
            
            {templates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-white mb-2">Loading Templates...</h3>
                <p className="text-white/70">Please wait while we fetch the latest professional templates.</p>
              </div>
            )}

            {results && (
              <div className="mt-8 animate-fadeIn">
                {renderResults()}
              </div>
            )}
          </EnhancedPageContainer>
        );
      
      case 'analysis':
        return (
          <EnhancedPageContainer 
            pageId="analysis"
            title="🧠 AI Analysis"
            description="Get detailed insights and improvement recommendations for your resume"
            showBackButton={true}
            onBack={() => handlePageChange('home')}
          >
            <div className="space-y-6">
              <InteractiveCard
                hoverEffect="glow"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Resume Analysis Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-1">85%</div>
                    <div className="text-white/70 text-sm">ATS Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">12/15</div>
                    <div className="text-white/70 text-sm">Skills Matched</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-400 mb-1">3</div>
                    <div className="text-white/70 text-sm">Improvement Areas</div>
                  </div>
                </div>

                <div className="text-center">
                  <InteractiveCard
                    onClick={getDetailedAnalysis}
                    disabled={loading}
                    hoverEffect="scale"
                    className={`inline-block px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                      loading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl'
                    } text-white text-lg`}
                  >
                    {loading ? 'Analyzing...' : 'Get Detailed Analysis'}
                  </InteractiveCard>
                </div>
              </InteractiveCard>

              {results && (
                <div className="animate-fadeIn">
                  {renderResults()}
                </div>
              )}
            </div>
          </EnhancedPageContainer>
        );
      
      case 'rocket':
        return (
          <EnhancedPageContainer 
            pageId="rocket"
            title="🚀 ROCKET Framework"
            description="Complete your career psychology assessment with Dr. Maya"
            showBackButton={true}
            onBack={() => handlePageChange('home')}
          >
            <div className="space-y-6">
              <InteractiveCard
                hoverEffect="glow"
                className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-8 border border-pink-500/30"
              >
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👩‍💼</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Meet Dr. Maya</h3>
                  <p className="text-white/80 text-lg">Your AI Career Psychology Specialist</p>
                </div>

                <div className="bg-black/20 rounded-xl p-6 mb-8 border-l-4 border-pink-400">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">💬</span>
                    </div>
                    <div>
                      <p className="text-white/90 italic text-lg leading-relaxed">
                        "Tell me about your career goals and I'll help you optimize your professional narrative. 
                        Together, we'll unlock the psychology behind your career success."
                      </p>
                      <p className="text-pink-300 text-sm mt-2 font-medium">- Dr. Maya, Career Psychology AI</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="text-white font-semibold mb-2">Strengths Discovery</h4>
                    <p className="text-white/70 text-sm">Identify your unique value proposition and core competencies</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl mb-2">🧠</div>
                    <h4 className="text-white font-semibold mb-2">Psychology Insights</h4>
                    <p className="text-white/70 text-sm">Understand your career motivations and growth patterns</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl mb-2">📈</div>
                    <h4 className="text-white font-semibold mb-2">Career Optimization</h4>
                    <p className="text-white/70 text-sm">Align your narrative with industry best practices</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌟</div>
                    <h4 className="text-white font-semibold mb-2">Confidence Building</h4>
                    <p className="text-white/70 text-sm">Build unshakeable professional confidence</p>
                  </div>
                </div>

                <div className="text-center">
                  <InteractiveCard
                    onClick={startRocketSession}
                    disabled={loading}
                    hoverEffect="scale"
                    className={`inline-block px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                      loading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-xl'
                    } text-white text-lg`}
                  >
                    {loading ? 'Starting Session...' : 'Start ROCKET Session with Dr. Maya'}
                  </InteractiveCard>
                </div>
              </InteractiveCard>

              {results && (
                <div className="animate-fadeIn">
                  {renderResults()}
                </div>
              )}
            </div>
          </EnhancedPageContainer>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div 
      className="min-h-screen text-white font-sans relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        fontFamily: 'Inter, -apple-system, sans-serif'
      }}
    >
      {/* Enhanced Navigation */}
      <EnhancedNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        backendStatus={backendStatus}
        pages={pages}
      />

      {/* Loading Transition */}
      <LoadingTransition 
        isVisible={loading && isTransitioning} 
        message="Transitioning..."
      />

      {/* Main Content with Page Transitions */}
      <main className={`${currentPage === 'home' ? 'p-0' : 'px-4 sm:px-6 lg:px-8'} max-w-7xl mx-auto transition-all duration-500`}>
        <PageTransition
          currentPage={currentPage}
          isTransitioning={isTransitioning}
          onTransitionComplete={() => setIsTransitioning(false)}
        >
          {renderPage()}
        </PageTransition>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-black/20 backdrop-blur-sm mt-16 py-8 px-6 text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Resume Builder AI</div>
                <div className="text-xs text-white/60">Powered by ROCKET Framework</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>All Features Functional</span>
              </div>
              <div>© 2024 Resume Builder AI</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .text-hero {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
        }
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

export default FunctionalApp;