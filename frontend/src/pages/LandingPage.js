import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/App.css"; // Landing page styles included here

const LandingPage = () => {
  const { user, logout } = useAuth();

  const services = [
    { name: "Mechanic Services", icon: "🔧", description: "Expert mechanical repairs" },
    { name: "Car Wash & Detailing", icon: "🚿", description: "Professional cleaning" },
    { name: "Painting & Body Work", icon: "🎨", description: "Quality paint jobs" },
    { name: "Electrical Systems", icon: "⚡", description: "Electrical diagnostics" },
    { name: "Tire Services", icon: "🛞", description: "Tire replacement and rotation" },
    { name: "AC Service", icon: "❄️", description: "Air conditioning repair & maintenance" },
  ];

  const steps = [
    { step: 1, title: "Create Account", description: "Sign up quickly as a customer or provider", icon: "👤" },
    { step: 2, title: "Find & Book", description: "Browse verified workshops and book instantly", icon: "🔍" },
    { step: 3, title: "Get Service", description: "Enjoy reliable, professional auto services", icon: "🚗" },
  ];

  const handleLogout = () => {
    logout();
    window.location.reload(); // Refresh to show the landing page properly
  };

  return (
    <div className="landing-page">
      {/* Logout Button for Authenticated Users */}
      {user && (
        <div className="logout-banner">
          <div className="logout-content">
            <span>Welcome back, {user.name}! </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout & Sign In as Different User
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Trusted Workshops Near You</h1>
          <p className="hero-subtitle">
            Connecting you with professional mechanics and auto services in your area.
          </p>
          <div className="hero-buttons">
            {user ? (
              // Show dashboard links if user is logged in
              <>
                <Link to={user.role === 'provider' ? '/provider-dashboard' : '/home'} className="btn-primary">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-outline">
                  Switch Account
                </button>
              </>
            ) : (
              // Show login/signup buttons if user is not logged in
              <>
                <Link to="/login" className="btn-primary">Get Started</Link>
                <Link to="/signup" className="btn-outline">Join as Provider</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {steps.map((item, index) => (
            <div className="step-card" key={index}>
              <div className="step-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
