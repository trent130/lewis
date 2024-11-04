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

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    border: 2px solid #414141;
    border-radius: 50px;
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
    border-radius: inherit;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as 'light' | 'dark') || "light";
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      document.documentElement.classList.toggle("light", newTheme === "light");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }
  }, [theme]);

  return (
    <Wrapper>
      <div className="toggle-switch">
        <label className="switch">
          <input
            type="checkbox"
            className="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className={`slider ${theme}`} />
        </label>
      </div>
    </Wrapper>
  );
};

export default ThemeToggler;
