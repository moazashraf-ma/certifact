import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {new Date().getFullYear()} Deepfake Detector. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/about" className="text-white text-decoration-none mx-2">About</Link>
              </li>
              <li className="list-inline-item">
                <Link to="/help" className="text-white text-decoration-none mx-2">Help</Link>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-white text-decoration-none mx-2">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;