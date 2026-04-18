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

// section showing the 6 things the platform offers
function FeaturesSection() {
  const features = [
    { icon: '🗓', text: 'Book appointments for physical & mental health' },
    { icon: '🧠', text: 'AI-powered symptom checker with medication suggestions' },
    { icon: '💚', text: 'Therapy sessions and mood tracking' },
    { icon: '💬', text: 'Real-time chat with healthcare providers' },
    { icon: '📋', text: 'Complete health records management' },
    { icon: '💊', text: 'Digital prescriptions and medication tracking' },
  ];

  return (
    <section className="features">
      <h2 className="features-title">Everything you need in one place</h2>
      <p className="features-subtitle">
        Comprehensive care that connects your physical and mental wellbeing
      </p>

      {/* i looped through the features array to render each row */}
      <div className="features-grid">
        {features.map((item, index) => (
          <div className="feature-item" key={index}>
            <div className="feature-icon-box">{item.icon}</div>
            <span className="feature-text">{item.text}</span>
            <span className="feature-check">✓</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// role seclection section where user picks patient or doctor before signing up
function RoleSection() {
  const [selected, setSelected] = useState('patient');
  const navigate = useNavigate();

  return (
    <section className="role-section">
      <h2 className="role-title">I am a...</h2>
      <p className="role-subtitle">Select your role to get started</p>

      <div className="role-cards">

        {/* patient card - clicking sets selected to patient */}
        <div
          className={`role-card ${selected === 'patient' ? 'role-card-selected' : ''}`}
          onClick={() => setSelected('patient')}
        >
          <div className="role-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h3 className="role-name">Patient</h3>
          <p className="role-desc">
            Access healthcare services, book appointments, and manage your health records
          </p>
        </div>

        {/* professional card - clicking sets selected to professional */}
        <div
          className={`role-card ${selected === 'professional' ? 'role-card-selected' : ''}`}
          onClick={() => setSelected('professional')}
        >
          <div className="role-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="role-name">Doctor</h3>
          <p className="role-desc">
            Manage appointments, view patient records, and create prescriptions
          </p>
        </div>
      </div>

      <div className="role-buttons">
        {/* i passed the selected role as state so the register page can read it */}
        <button
          className="btn-teal"
          onClick={() => navigate('/register', { state: { role: selected } })}
        >
          Create Account
        </button>
        <Link to="/login" className="btn-outline-dark">Sign In</Link>
      </div>
    </section>
  );
}
