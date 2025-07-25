import React from 'react';
import { FileText, Download, Edit } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Resume Builder</h1>
        <p>Create professional resumes in minutes</p>
        <button className="cta-button">
          <Edit size={20} />
          Start Building
        </button>
      </header>
      
      <section className="features">
        <div className="feature">
          <FileText size={48} />
          <h3>Professional Templates</h3>
          <p>Choose from a variety of modern, ATS-friendly templates</p>
        </div>
        <div className="feature">
          <Edit size={48} />
          <h3>Easy Editing</h3>
          <p>Intuitive drag-and-drop interface for quick customization</p>
        </div>
        <div className="feature">
          <Download size={48} />
          <h3>Export Options</h3>
          <p>Download your resume as PDF or share online</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
