import React from 'react';
import { IoIosHelpCircleOutline, IoIosBuild, IoIosWarning } from 'react-icons/io';

const Help = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-5 display-4 fw-bold text-primary">Help & FAQ</h1>

      <div className="row g-4">
        <div className="col-lg-8 mx-auto">
          <div className="accordion" id="helpAccordion">

            {/* How to Use */}
            <div className="accordion-item shadow-sm mb-3 rounded-3">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  <IoIosHelpCircleOutline className="me-2 text-primary" size={24} /> How to Use the Deepfake Detector
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  <ol>
                    <li>Navigate to the <strong>Analyze</strong> page.</li>
                    <li>Drag and drop your image or video file into the designated area, or click to select a file from your device.</li>
                    <li>The upload will begin automatically. Once uploaded, the system will queue and process your file.</li>
                    <li>You will see a progress indicator showing the current status (Upload, Queued, Processing, Done).</li>
                    <li>Once the analysis is complete, you will be redirected to the <strong>Results</strong> page, showing the classification (Real/Deepfake), confidence level, and explainability overlay if available.</li>
                    <li>You can revisit past analyses on the <strong>History</strong> page.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Troubleshooting: CORS */}
            <div className="accordion-item shadow-sm mb-3 rounded-3">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <IoIosWarning className="me-2 text-danger" size={24} /> Troubleshooting: CORS Errors
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  <p>
                    CORS (Cross-Origin Resource Sharing) errors occur when your frontend
                    (running on one origin, e.g., <code>http://localhost:5173</code>)
                    tries to make requests to your backend (running on another origin, e.g.,
                    <code>http://localhost:5000</code>) without proper permissions.
                  </p>
                  <h6>How to Fix:</h6>
                  <ul>
                    <li>
                      <strong>Backend Configuration:</strong> Ensure your Flask backend is configured to allow CORS requests from your frontend&apos;s origin.
                      For Flask, you typically use a library like <code>flask-cors</code>.
                      <pre><code>
{`from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# For specific origins:
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
# ... your routes`}
                      </code></pre>
                    </li>
                    <li>
                      <strong>Vite Proxy (Development only):</strong> Configure Vite to proxy requests to your backend by editing <code>vite.config.js</code>:
                      <pre><code>
{`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your Flask backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }
});`}
                      </code></pre>
                      Then send requests to <code>/api/your-endpoint</code> from your frontend.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item shadow-sm mb-3 rounded-3">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <IoIosBuild className="me-2 text-info" size={24} /> Troubleshooting: <code>.env</code> file
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  <p>
                    The frontend uses an environment variable <code>VITE_API_URL</code> to know where your Flask backend is running.
                    If this is not set correctly, the frontend might not be able to communicate with your backend.
                  </p>
                  <h6>How to Fix:</h6>
                  <ul>
                    <li><strong>Create <code>.env</code>:</strong> In the root directory of this frontend project, create a file named <code>.env</code>.</li>
                    <li>
                      <strong>Add API URL:</strong> Inside <code>.env</code>, add:
                      <pre><code>VITE_API_URL=http://localhost:5000/api</code></pre>
                    </li>
                    <li><strong>Restart Development Server:</strong> After modifying <code>.env</code>, restart with <code>npm run dev</code>.</li>
                    <li><strong>Check Mock Mode:</strong> If <code>VITE_API_URL</code> is missing, the frontend may use mock responses instead of the real backend.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item shadow-sm mb-3 rounded-3">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  <IoIosWarning className="me-2 text-warning" size={24} /> Common Errors
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <strong>&quot;Failed to fetch&quot; / Network Error:</strong>
                      <p>This usually means the frontend cannot reach the backend. Check:</p>
                      <ul>
                        <li>Is your Flask backend running?</li>
                        <li>Is <code>VITE_API_URL</code> in your <code>.env</code> correct?</li>
                        <li>Any CORS errors in the browser console (F12)?</li>
                        <li>Is a firewall blocking the connection?</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Unexpected Token / Syntax Errors:</strong>
                      <p>Usually caused by typos, missing brackets, or incorrect syntax. Check your code carefully.</p>
                    </li>
                    <li>
                      <strong>&quot;Cannot read properties of undefined&quot;:</strong>
                      <p>This means you&apos;re trying to access a property on <code>null</code> or <code>undefined</code>. Handle loading states properly when using API data.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
