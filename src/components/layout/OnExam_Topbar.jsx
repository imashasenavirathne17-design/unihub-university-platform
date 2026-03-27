import React, { useEffect, useState } from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';

const Topbar = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    // Set initial
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'none' }}>
           {/* Mobile heading space or search bar space */}
        </h2>
      </div>

      <div className="topbar-right">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '22px', right: '110px', width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%' }}></span>
        </button>
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
