// frontend/src/components/ThemeSwitcher.jsx

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa'; // Using icons for the button

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary" // Use a standard button style
      style={{ border: 'none' }} // Remove the border for a cleaner look in the navbar
      aria-label="Toggle theme"
    >
      {/* Show a moon icon for light theme, and a sun icon for dark theme */}
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;