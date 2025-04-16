// components/HomePage.jsx
import React from 'react'
import '../styles/HomePage.css'

function HomePage({ navigateTo, ModernNavbar }) {
  return (
    <>
      <ModernNavbar />
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">Smart Traffic Signal Simulation</h1>
          <p className="hero-subtitle">
            Explore how AI-powered traffic signals can optimize urban traffic flow and reduce congestion
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => navigateTo('simulation')} 
              className="hero-button primary"
            >
              Start Simulation
            </button>
            <button 
              onClick={() => navigateTo('how-it-works')} 
              className="hero-button secondary"
            >
              Learn How It Works
            </button>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🚦</div>
            <h2>AI-Powered Traffic Control</h2>
            <p>
              Experience an advanced traffic signal system that uses vehicle counts and wait
              times to optimize traffic flow at intersections.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h2>Priority-Based Scheduling</h2>
            <p>
              Watch as the system allocates green light durations based on vehicle density and
              maximum wait time constraints.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h2>Real-time Adaptation</h2>
            <p>
              See how the signals dynamically adjust to changing traffic patterns to minimize
              congestion and wait times.
            </p>
          </div>
        </div>

        <div className="about-section">
          <h2>About This Project</h2>
          <p>
            This simulation demonstrates how intelligent traffic management systems can 
            improve urban mobility by dynamically responding to changing traffic conditions. 
            The algorithm balances efficiency with fairness to minimize overall wait times 
            while preventing any single direction from waiting too long.
          </p>
          <button 
            onClick={() => navigateTo('dashboard')} 
            className="about-button"
          >
            View Traffic Analytics
          </button>
        </div>
      </div>
    </>
  )
}

export default HomePage