import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  .toggle-switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* Slider base style */
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    border-radius: 50px;
    border: 2px solid #414141;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.4em;
    width: 1.4em;
    left: 0.2em;
    bottom: 0.2em;
    background-color: white;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* Light theme styles */
  .light .slider {
    background-color: white;
    border-color: #414141;
  }

  .light .slider:before {
    background-color: black;
  }

  /* Dark theme styles */
  .dark .slider {
    background-color: black;
    border-color: #0974f1;
  }

  .dark .slider:before {
    background-color: white;
  }

  /* Checked state */
  .switch input:checked + .slider {
    box-shadow: 0 0 20px rgba(9, 117, 241, 0.8);
    border: 2px solid #0974f1;
  }

  .switch input:checked + .slider:before {
    transform: translateX(1.5em);
  }
`;
const ThemeToggler: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check if `localStorage` is accessible (only in the browser)
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Only set in `localStorage` if we're in the browser
    if (typeof window !== "undefined") {
      localStorage.setItem('theme', newTheme);
    }

    // Update the document class directly
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  if (theme === null) return null; // or a loading indicator

  return (
    <Wrapper>
      <div className="toggle-switch">
        <label className="switch" aria-label="Toggle Dark Mode">
          <input
            type="checkbox"
            className="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <span className={`slider ${theme}`} />
        </label>
      </div>
    </Wrapper>
  );
};

export default ThemeToggler;