import React from 'react';

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="progress-indicator mb-5">
      <ul className="list-unstyled d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex-fill text-center ${
              index < currentStep ? 'completed' : ''
            } ${
              index === currentStep ? 'active' : ''
            }`}
          >
            <div
              className={`step-circle d-flex align-items-center justify-content-center mx-auto mb-2
                ${index < currentStep ? 'bg-success text-white' : ''}
                ${index === currentStep ? 'bg-primary text-white' : 'bg-light text-muted border'}
              `}
            >
              {index < currentStep ? (
                <i className="bi bi-check-lg"></i> // Bootstrap icon for check
              ) : (
                index + 1
              )}
            </div>
            <div className="step-label text-truncate mt-1">{step.label}</div>
          </li>
        ))}
      </ul>
      <div className="progress mt-3" style={{ height: '8px' }} role="progressbar" aria-label="Progress" aria-valuenow={(currentStep / (steps.length - 1)) * 100} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-bar bg-primary"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;