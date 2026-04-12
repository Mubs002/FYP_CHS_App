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
