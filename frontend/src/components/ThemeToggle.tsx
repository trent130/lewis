import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  .toggle-switch {
    position: relative;
    width: 100px;
    height: 50px;
    --light: #d8dbe0;
    --dark: #28292c;
    --link: rgb(27, 129, 112);
    --link-hover: rgb(24, 94, 82);
  }

  .switch-label {
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: var(--dark);
    border-radius: 25px;
    cursor: pointer;
    border: 3px solid var(--dark);
  }

  .checkbox {
    position: absolute;
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    box-shadow: inset 12px -4px 0px 0px var(--light);
    background-color: var(--dark);
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider::before {
    transform: translateX(50px);
    background-color: var(--dark);
    box-shadow: none;
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
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <Wrapper>
      <div className="toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider" />
        </label>
      </div>
    </Wrapper>
  );
};

export default ThemeToggler;
