import React, { useState } from 'react';

const HeatmapOverlay = ({ baseImageUrl, overlayImageUrl, altText = "Media analysis overlay" }) => {
  const [overlayVisible, setOverlayVisible] = useState(true);

  if (!baseImageUrl) {
    return <p className="text-muted">No media to display.</p>;
  }

  return (
    <div className="heatmap-overlay-container position-relative bg-light rounded shadow-sm p-2">
      <div className="image-wrapper position-relative overflow-hidden rounded">
        <img
          src={baseImageUrl}
          alt={`Original ${altText}`}
          className="img-fluid d-block"
          style={{ width: '100%', height: 'auto' }}
        />
        {overlayImageUrl && overlayVisible && (
          <img
            src={overlayImageUrl}
            alt={`Overlay ${altText}`}
            className="img-fluid d-block position-absolute top-0 start-0"
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.6, // Adjust opacity for heatmap effect
              mixBlendMode: 'multiply', // Experiment with blend modes
            }}
          />
        )}
      </div>

      {overlayImageUrl && (
        <div className="form-check form-switch d-flex align-items-center justify-content-center mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleHeatmap"
            checked={overlayVisible}
            onChange={() => setOverlayVisible(!overlayVisible)}
            role="switch"
            aria-checked={overlayVisible}
            aria-label="Toggle explainability overlay"
          />
          <label className="form-check-label ms-2" htmlFor="toggleHeatmap">
            Show Explainability Overlay
          </label>
        </div>
      )}
    </div>
  );
};

export default HeatmapOverlay;