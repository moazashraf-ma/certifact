// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MdSecurity, MdSpeed, MdAutoFixHigh } from 'react-icons/md';
import api from '../api/client';

// --- CHANGE #1: Import the video file from the assets folder ---
import videoBackground from '../assets/second_video.mp4';

const Home = () => {
  const [isBackendOnline, setIsBackendOnline] = React.useState(true);

  React.useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await api.getHealth();
        if (response && response.status === 'ok') {
          setIsBackendOnline(true);
        } else {
          setIsBackendOnline(false);
        }
      } catch (error) {
        console.error("Backend health check failed:", error);
        setIsBackendOnline(false);
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <div>
      {/* Style block remains the same */}
      <style>
        {`
          .video-hero-section {
            position: relative;
            overflow: hidden;
            color: #fff;
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .video-background {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: translate(-50%, -50%);
            z-index: 0;
          }
          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.25);
            z-index: 1;
          }
          .hero-content-container {
            position: relative;
            z-index: 2;
          }
          .hero-subheading {
            color: #ffffff !important;
            opacity: 0.9;
          }
        `}
      </style>

      <section className="hero-section text-center py-5 py-md-6 video-hero-section">
        <video 
          className="video-background"
          src={videoBackground} 
          autoPlay 
          loop 
          muted 
          playsInline
        ></video>

        <div className="video-overlay"></div>

        <div className="container hero-content-container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4">
                Detect Deepfakes with Confidence
              </h1>
              <p className="lead mb-5 hero-subheading">
                Our advanced AI-powered platform helps you identify manipulated images and videos quickly and accurately.
              </p>
              <Link to="/analyze" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                Start Analysis Now
              </Link>
              {!isBackendOnline && (
                <p className="mt-4 text-warning fw-bold">
                  Note: Backend is offline, running in mock mode.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 display-5 fw-bold">Why Choose Us?</h2>
          <div className="row g-4">
            {/* ... your feature cards ... */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 text-center p-4">
                <div className="card-body">
                  <MdSecurity size={60} className="text-primary mb-3" />
                  <h5 className="card-title fw-bold">High Accuracy</h5>
                  <p className="card-text text-muted">Utilizing state-of-the-art models for precise detection.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 text-center p-4">
                <div className="card-body">
                  <MdSpeed size={60} className="text-primary mb-3" />
                  <h5 className="card-title fw-bold">Fast & Efficient</h5>
                  <p className="card-text text-muted">Get results quickly without long waiting times.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 text-center p-4">
                <div className="card-body">
                  <MdAutoFixHigh size={60} className="text-primary mb-3" />
                  <h5 className="card-title fw-bold">Explainable AI</h5>
                  <p className="card-text text-muted">Understand why a decision was made with visual overlays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;