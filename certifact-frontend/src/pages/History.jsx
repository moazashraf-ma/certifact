// frontend/src/pages/History.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHistory, MdAccessTime } from 'react-icons/md';
import api from '../api/client';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'Date unknown';
    return new Date(isoString).toLocaleString();
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="lead text-muted">Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Failed to load history: {error}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 display-4 fw-bold text-primary">Analysis History</h1>

      {history.length === 0 ? (
        <div className="text-center p-5 card shadow-sm border-0 rounded-4">
          <MdHistory className="text-muted mx-auto mb-3" size={80} />
          <p className="lead text-muted">No past analyses found.</p>
          <p>Complete an analysis, and your results will appear here.</p>
          <Link to="/analyze" className="btn btn-primary btn-lg mt-3">Start First Analysis</Link>
        </div>
      ) : (
        <div className="row g-4">
          {history.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                {/* **** THIS BLOCK IS UPDATED **** */}
                {/* It now checks for thumbnail_url first and provides a fallback. */}
                {item.thumbnail_url ? (
                  <img
                    src={`http://localhost:5000${item.thumbnail_url}`}
                    className="card-img-top"
                    alt="Analysis thumbnail"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center bg-light text-muted" 
                    style={{ height: '200px' }}
                  >
                    No Preview Available
                  </div>
                )}
                {/* **** END OF UPDATE **** */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">Analysis Result</h5>
                  <p className="card-text mb-1">
                    Label:{" "}
                    <span
                      className={`fw-bold ${
                        item.label === "AI-generated"
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {item.label ? item.label.toUpperCase() : "N/A"}
                    </span>
                  </p>
                  <p className="card-text mb-3">
                    Confidence:{" "}
                    <span className="fw-bold">
                      {(item.confidence * 100).toFixed(2)}%
                    </span>
                  </p>
                  <div className="mt-auto">
                    <p className="card-text text-muted small">
                      <MdAccessTime className="me-1" />{" "}
                      {formatDateTime(item.timestamp)}
                    </p>
                    <Link
                      to={`/results/${item._id}`}
                      className="btn btn-outline-primary btn-sm w-100 mt-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;