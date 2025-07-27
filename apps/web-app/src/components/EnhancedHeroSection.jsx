import React, { useState, useEffect } from 'react';

const EnhancedHeroSection = ({ onGetStarted }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Success stories for the carousel
  const successStories = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      improvement: "95% ATS Score",
      story: "Landed my dream job with a perfectly optimized resume"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager", 
      company: "Microsoft",
      improvement: "3x More Interviews",
      story: "Transformed my career narrative and got noticed by top companies"
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      company: "Meta",
      improvement: "40% Salary Increase",
      story: "AI insights helped me highlight my unique value proposition"
    }
  ];

  // Confidence-building statistics
  const stats = [
    { number: "95%", label: "Average ATS Score" },
    { number: "3.2x", label: "More Interview Calls" },
    { number: "10k+", label: "Careers Transformed" },
    { number: "24hrs", label: "Average Time to Results" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate success stories
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white">
        
        {/* Animated Hero Text */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 
            className="font-bold leading-tight mb-6 text-hero font-inter"
          >
            Transform Your Career Story
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
              With AI-Powered Precision
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed font-inter"
          >
            Join thousands of professionals who've unlocked their career potential with our 
            intelligent resume builder and <strong>ROCKET Framework</strong> psychology assessment.
          </p>
        </div>

        {/* Success Stories Carousel */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-morphism rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">✨</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{successStories[currentStoryIndex].name}</h3>
                <p className="text-white/80 text-sm">
                  {successStories[currentStoryIndex].role} at {successStories[currentStoryIndex].company}
                </p>
              </div>
            </div>
            <p className="text-white/90 mb-3 italic">
              "{successStories[currentStoryIndex].story}"
            </p>
            <div className="text-green-300 font-semibold">
              Result: {successStories[currentStoryIndex].improvement}
            </div>
            
            {/* Story indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStoryIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStoryIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-xl 
                       shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300
                       hover:bg-green-50 border-2 border-transparent hover:border-green-300"
              style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white'
              }}
            >
              <span className="relative z-10">Start Your Career Transformation</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Free ATS Analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">AI-Powered Insights</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Career Psychology</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Building Message */}
        <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3 text-white">
                Your Career Deserves Professional Excellence
              </h3>
              <p className="text-white/90 leading-relaxed">
                Don't let an outdated resume hold you back from your dream job. Our AI-powered platform, 
                combined with career psychology insights from Dr. Maya, ensures your professional story 
                resonates with both ATS systems and human recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="text-white/60 text-center">
          <div className="text-2xl mb-2">⬇</div>
          <div className="text-sm">Scroll to explore features</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;