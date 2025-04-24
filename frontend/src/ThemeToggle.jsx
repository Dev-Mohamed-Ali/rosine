// ThemeToggle.jsx
import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="btn btn-warning">
      {theme === 'light' ? '🌙 الوضع الداكن' : '☀️ الوضع الفاتح'}
    </button>
  );
};

export default ThemeToggle;
