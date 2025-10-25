// frontend/src/context/AppContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- All original state is preserved ---
  const [currentJob, setCurrentJob] = useState(null);
  const [toasts, setToasts] = useState([]);
  const location = useLocation();

  // --- Corrected History Management ---
  const [history, setHistory] = useState(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error("Failed to parse history from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
  }, [history]);

  // This function now correctly saves the FULL result object from the backend
  const addHistoryEntry = useCallback((resultData) => {
    setHistory((prevHistory) => {
      // Prevent adding duplicate results
      const isDuplicate = prevHistory.some(item => item._id === resultData._id);
      if (isDuplicate) {
        return prevHistory;
      }
      // Add the new, complete result object to the top of the list
      return [resultData, ...prevHistory];
    });
  }, []);

  // --- Original Toast Management is preserved ---
  const addToast = useCallback((title, message, type = 'info') => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    setToasts([]);
  }, [location]);

  // --- Provide all values to the app ---
  const value = {
    currentJob,
    setCurrentJob,
    history,
    addHistoryEntry, // Use this single, correct function name
    addToast,
    removeToast,
    toasts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};