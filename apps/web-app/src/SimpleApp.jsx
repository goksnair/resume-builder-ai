import React from 'react';

// Simple working version with basic functionality
function SimpleApp() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [backendStatus, setBackendStatus] = React.useState('Checking...');
  const [results, setResults] = React.useState(null);

  React.useEffect(() => {
    // Test backend connection
    fetch('https://resume-builder-ai-production.up.railway.app/ping')
      .then(r => r.json())
      .then(data => setBackendStatus('✅ Connected: ' + data.message))
      .catch(e => setBackendStatus('❌ Error: ' + e.message));
  }, []);

  const pages = {
    home: 'Home',
    builder: 'Resume Builder', 
    templates: 'Templates',
    analysis: 'AI Analysis',
    rocket: 'ROCKET Framework'
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://resume-builder-ai-production.up.railway.app/api/v1/resume/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResults({ type: 'upload', data });
    } catch (error) {
      setResults({ type: 'error', data: error.message });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-16">
              <h1 className="text-5xl font-bold text-white mb-4">
                ✨ Resume Builder AI
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Transform your career with AI-powered resume optimization
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">📝 Smart Builder</h3>
                  <p className="text-white/70 text-sm">AI-powered resume creation and optimization</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">🧠 AI Analysis</h3>
                  <p className="text-white/70 text-sm">Deep insights and improvement suggestions</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">🚀 ROCKET Framework</h3>
                  <p className="text-white/70 text-sm">Career psychology and optimization</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'builder':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Resume Builder</h2>
            
            {/* File Upload */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Upload Your Resume</h3>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full p-3 bg-white/20 text-white rounded border border-white/30"
              />
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                <pre className="text-white/80 text-sm overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );

      case 'templates':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Professional Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Modern Professional', 'Creative Designer', 'Tech Executive', 'Academic', 'Sales Leader', 'Startup'].map(template => (
                <div key={template} className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition-all cursor-pointer">
                  <h3 className="font-semibold text-white mb-2">{template}</h3>
                  <p className="text-white/70 text-sm">Professional template optimized for ATS</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">AI Analysis</h2>
            <div className="bg-white/10 p-6 rounded-lg">
              <p className="text-white/80">Upload a resume to get detailed AI analysis and improvement suggestions.</p>
            </div>
          </div>
        );

      case 'rocket':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">🚀 ROCKET Framework</h2>
            <div className="bg-white/10 p-6 rounded-lg">
              <p className="text-white/80">Complete your career psychology assessment with our ROCKET Framework.</p>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <h1 className="text-white font-bold text-lg">Resume Builder</h1>
            </div>
            <div className="text-xs text-white/60">{backendStatus}</div>
          </div>
        </div>
      </nav>

      {/* Page Tabs */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 py-3 overflow-x-auto">
            {Object.entries(pages).map(([key, title]) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentPage === key
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-32 pb-16 px-6">
        {renderPage()}
      </div>
    </div>
  );
}

export default SimpleApp;