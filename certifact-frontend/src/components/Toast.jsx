import React, { useEffect, useRef } from 'react';
import * as bootstrap from 'bootstrap';

const Toast = ({ id, title, message, type = 'info', onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    const toastElement = toastRef.current;
    if (!toastElement) return;

    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 5000, // 5 seconds
    });

    const handleHidden = () => {
      onClose(id); // Remove from state once hidden
    };

    toastElement.addEventListener('hidden.bs.toast', handleHidden);
    toast.show();

    return () => {
      toastElement.removeEventListener('hidden.bs.toast', handleHidden);
      toast.dispose(); // Clean up toast instance
    };
  }, [id, onClose]);

  const headerClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-primary';

  return (
    <div
      ref={toastRef}
      className={`toast align-items-center text-white ${headerClass} border-0`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1050, // Higher than modals
      }}
    >
      <div className="d-flex">
        <div className="toast-body">
          <strong>{title}:</strong> {message}
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Toast;