import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="container text-center my-5 py-5">
      <FaExclamationTriangle className="text-warning mb-4" size={80} />
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-3 text-secondary">Page Not Found</h2>
      <p className="lead mb-4">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;