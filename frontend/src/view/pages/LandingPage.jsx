import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

// the main landing page first thing users see when they visit the site
export default function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <FeaturesSection />
      <RoleSection />
    </div>
  );
}

// the big top section with the teal to blue gradient background
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">

        {/* the small pill badge at the top left */}
        <div className="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Trusted Healthcare Platform
        </div>

        <h1 className="hero-title">Comprehensive Health Support</h1>

        <p className="hero-subtitle">
          Your unified platform for physical and mental health care
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="hero-btn">Get Started</Link>
          <Link to="/login" className="hero-btn">Sign In</Link>
        </div>
      </div>

      {/* white wave shape at the bottom creates the curve into the next section */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C400,100 1000,20 1440,60 L1440,90 L0,90 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
