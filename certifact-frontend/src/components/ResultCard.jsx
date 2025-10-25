import React from 'react';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'; // Example icons

const ResultCard = ({ label, confidence, mediaUrl, onDownload, isError = false }) => {
  const isDeepfake = label === 'deepfake';
  const cardClass = isError ? 'border-danger' : (isDeepfake ? 'border-danger' : 'border-success');
  const textClass = isError ? 'text-danger' : (isDeepfake ? 'text-danger' : 'text-success');
  const icon = isError ? <IoIosCloseCircle /> : (isDeepfake ? <IoIosCloseCircle /> : <IoIosCheckmarkCircle />);

  if (isError) {
    return (
      <div className={`card shadow-sm ${cardClass}`}>
        <div className="card-body text-center p-4">
          <h4 className="card-title text-danger mb-3">Analysis Error!</h4>
          <p className="card-text text-danger">Something went wrong during the analysis.</p>
          <p className="card-text">Please try again or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card shadow-sm ${cardClass}`}>
      {mediaUrl && (
        <img
          src={mediaUrl}
          className="card-img-top img-fluid"
          alt="Analysis media thumbnail"
          style={{ maxHeight: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
        />
      )}
      <div className="card-body text-center p-4">
        <h4 className={`card-title mb-3 d-flex align-items-center justify-content-center ${textClass}`}>
          {icon}
          <span className="ms-2">Result: {label.toUpperCase()}</span>
        </h4>
        <p className="card-text fs-5">
          Confidence: <strong className={textClass}>{(confidence * 100).toFixed(2)}%</strong>
        </p>
        {label === 'deepfake' && (
          <span className="badge bg-danger rounded-pill px-3 py-2 mt-2">Deepfake Detected!</span>
        )}
        {label === 'real' && (
          <span className="badge bg-success rounded-pill px-3 py-2 mt-2">Real Media</span>
        )}

        {onDownload && (
          <button onClick={onDownload} className="btn btn-outline-primary mt-4">
            Download Report
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultCard;