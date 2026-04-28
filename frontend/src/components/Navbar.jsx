/**
 * Navbar — Fixed top navigation with logo, links, auth, and dark mode toggle.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiActivity, FiSun, FiMoon, FiDownload, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { exportCSV } from '../services/api';
import toast from 'react-hot-toast';
import './Navbar.css';

function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  // Check auth state on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('username');
      setUsername(storedUser);
    };
    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    // Custom event for same-tab login/logout
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'health_records.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    window.dispatchEvent(new Event('auth-change'));
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <NavLink to="/" className="navbar-logo">
        <div className="navbar-logo-icon">
          <FiActivity />
        </div>
        <span className="navbar-logo-text">HealthTracker</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
          Dashboard
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          Add Record
        </NavLink>
        <NavLink to="/predictions" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          Predictions
        </NavLink>
      </div>

      <div className="navbar-actions">
        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export CSV">
          <FiDownload /> <span className="btn-label">Export</span>
        </button>

        {username ? (
          <div className="navbar-user">
            <span className="navbar-user-badge">
              <FiUser /> <span className="btn-label">{username}</span>
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Log out">
              <FiLogOut /> <span className="btn-label">Logout</span>
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm" id="login-btn">
            <FiLogIn /> <span className="btn-label">Login</span>
          </NavLink>
        )}

        <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme" id="theme-toggle">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
