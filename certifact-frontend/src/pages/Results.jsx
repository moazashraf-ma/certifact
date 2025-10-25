// frontend/src/pages/Results.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import ResultCard from '../components/ResultCard';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';

const Results = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [error, setError] = useState(null);
  const { addHistoryEntry } = useAppContext();

  useEffect(() => {
    const fetchResultData = async () => {
      if (!id) {
        setError("No result ID was provided in the URL.");
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.getResult(id);
        setResult(data);
        addHistoryEntry(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred while fetching the results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultData();
  }, [id, addHistoryEntry]);

  const handleDownload = async () => {
    if (isDownloading) return; 
    setIsDownloading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`http://localhost:5000/api/results/${id}/report`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Handle cases where response is not JSON
        throw new Error(errorData.error || 'Report generation failed on the server.');
      }

      // Get the filename from the 'Content-Disposition' header for robustness
      const disposition = response.headers.get('Content-Disposition');
      let filename = `CF_Report_${id}.pdf`; // A fallback filename
      if (disposition && disposition.includes('attachment')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // Append, click, and then remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL to free memory
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
      alert(`Could not download the report: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="fa-spin me-2" size="2em" />
        <h2 className="d-inline-block align-middle">Loading Results...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <h4>Error Fetching Results</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <h2>No Results Found</h2>
        <p>There are no analysis results for the provided ID.</p>
        <Link to="/analyze" className="btn btn-primary">Start a New Analysis</Link>
      </div>
    );
  }

  const confidencePercentage = (result.confidence * 100).toFixed(2);
  const isDeepfake = result.label.toLowerCase() === 'ai-generated';

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Analysis Results</h1>
        <button 
          onClick={handleDownload} 
          className="btn btn-outline-primary"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <FaSpinner className="fa-spin me-2" />
              Generating...
            </>
          ) : (
            <>
              <FaDownload className="me-2" />
              Download Report
            </>
          )}
        </button>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Analyzed Media</h5>
            </div>
            <div className="card-body p-0 d-flex align-items-center justify-content-center bg-light">
              {result.type === 'video' ? (
                <video
                  src={`http://localhost:5000${result.file_url}`}
                  poster={`http://localhost:5000${result.thumbnail_url}`}
                  controls
                  className="img-fluid"
                  style={{ maxHeight: '500px', width: '100%' }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`http://localhost:5000${result.file_url}`}
                  alt="Analyzed Media"
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <ResultCard label={isDeepfake ? 'MANIPULATED' : result.label} confidence={result.confidence} timestamp={result.timestamp} />
          {isDeepfake ? (
            <div className="alert alert-warning mt-3">
              <h4>Warning: Manipulated Content Detected!</h4>
              <p>Our analysis indicates a high probability of this media being manipulated ({confidencePercentage}% confidence).</p>
            </div>
          ) : (
            <div className="alert alert-success mt-3">
              <h4>Authentic Content Likely!</h4>
              <p>Our analysis suggests this media is likely authentic ({confidencePercentage}% confidence).</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-lg btn-secondary">Perform Another Analysis</Link>
      </div>
    </div>
  );
};

export default Results;