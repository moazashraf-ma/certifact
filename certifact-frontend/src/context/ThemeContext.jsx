// frontend/src/context/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize state by reading from the browser's localStorage, defaulting to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // This effect runs whenever the theme changes
    // 1. It applies the theme to the body element using the `data-theme` attribute
    document.body.setAttribute('data-theme', theme);
    // 2. It saves the user's choice to localStorage so it persists
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme from light to dark and vice-versa
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};