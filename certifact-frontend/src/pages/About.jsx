import React from 'react';
import { MdOutlineSecurity, MdScience, MdGroup } from 'react-icons/md';
import { MdVerifiedUser, MdInsights, MdVisibility } from "react-icons/md"; 
const About = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 display-4 fw-bold text-primary">About Our Project</h1>
      <p className="lead text-center mb-5">
        Building a reliable and user-friendly deepfake detection platform.
      </p>

      <div className="row g-4 mb-5"> 
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <MdOutlineSecurity className="text-primary mb-3" size={50} />
              <h5 className="card-title fw-bold">Our Goal</h5>
              <p className="card-text text-muted"> 
                In an era where digital manipulation is becoming increasingly sophisticated, our project aims to provide a robust tool for identifying deepfakes in images and videos. We are committed to fostering a safer digital environment.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <MdScience className="text-primary mb-3" size={50} />
              <h5 className="card-title fw-bold">Technology Stack</h5>
              <p className="card-text text-muted">
                This frontend is built with <strong>React</strong> and <strong>Vite</strong> for a fast and modern development experience. Styling is handled with <strong>Bootstrap 5</strong> for responsiveness and a clean look. The backend utilizes <strong>Flask</strong> with advanced machine learning models.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <MdGroup className="text-primary mb-3" size={50} />
              <h5 className="card-title fw-bold">Our Team</h5>
              <p className="card-text text-muted">
                We are a dedicated team of final-year project students passionate about combating misinformation and enhancing digital security through innovative AI solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-15">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold mb-4 text-center">Core Features</h3>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3 justify-content-center">
                  <MdVerifiedUser className="text-success me-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>Comprehensive Detection:</strong> Deepfake analysis for images and videos.
                  </div>
                </li>
                <li className="d-flex align-items-center mb-3 justify-content-center">
                  <MdInsights className="text-info me-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>Confidence Scoring:</strong> Receive clear, percentage-based scores for every analysis result.
                  </div>
                </li>
                <li className="d-flex align-items-center mb-3 justify-content-center">
                  <MdVisibility className="text-warning me-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>Explainable AI:</strong> Understand the model's decision with visual overlays like heatmaps or bounding boxes.
                  </div>
                </li>
                <li className="d-flex align-items-center justify-content-center">
                  <MdGroup className="text-primary me-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>User-Friendly Interface:</strong> A clean dashboard with full job tracking and analysis history.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;