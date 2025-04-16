import React from 'react';
import '../styles/HomePage.css';

const HomePage = ({ navigateTo }) => {
  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <h2 className="nav-title">Traffic Simulator</h2>
          <div className="nav-links">
            <button 
              onClick={() => navigateTo('home')} 
              className="nav-link active"
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('simulation')} 
              
              className="nav-link"
            >
              Simulation
            </button>
            <button 
              onClick={() => navigateTo('how-it-works')} 
              className="nav-link"
            >
              How It Works
            </button>
            <button 
              onClick={() => navigateTo('dashboard')} 
              className="nav-link"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>
      
      <div className="home-container">
        <section className="hero-section">
          <h1 className="hero-title">Smart Traffic Signal Simulation</h1>
          <p className="hero-subtitle">
            Explore how AI-powered traffic signals can optimize urban traffic flow and reduce congestion
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => navigateTo('simulation')}
              className="hero-button"
            >
              Start Simulation
            </button>
            <button 
              onClick={() => navigateTo('how-it-works')}
              className="hero-button secondary-button"
            >
              Learn How It Works
            </button>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <h3 className="feature-title">AI-Powered Traffic Control</h3>
            <p className="feature-description">
              Experience an advanced traffic signal system that uses vehicle counts and wait times to optimize traffic flow at intersections.
            </p>
          </div>
          
          <div className="feature-card">
            <h3 className="feature-title">Priority-Based Scheduling</h3>
            <p className="feature-description">
              Watch as the system allocates green light durations based on vehicle density and maximum wait time constraints.
            </p>
          </div>
          
          <div className="feature-card">
            <h3 className="feature-title">Real-time Adaptation</h3>
            <p className="feature-description">
              See how the signals dynamically adjust to changing traffic patterns to minimize congestion and wait times.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-title">About This Project</h2>
          <p className="about-description">
            This interactive simulation demonstrates how intelligent traffic control systems can significantly improve urban mobility. By implementing a combination of real-time vehicle detection and adaptive timing algorithms, our system optimizes traffic flow at intersections.
          </p>
          <p className="about-description">
            The simulation features a four-way intersection with varying traffic volumes in each direction. Try starting the simulation to see how the system responds to different traffic conditions!
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;