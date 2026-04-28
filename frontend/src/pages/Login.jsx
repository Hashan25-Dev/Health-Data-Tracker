/**
 * Login — Premium JWT authentication page with animated background.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/api';
import toast from 'react-hot-toast';
import { FiLogIn, FiUserPlus, FiActivity, FiHeart, FiTrendingUp, FiShield } from 'react-icons/fi';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isSignup && form.password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = isSignup
        ? await signup(form)
        : await login(form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      // Notify navbar about auth change
      window.dispatchEvent(new Event('auth-change'));
      toast.success(isSignup ? 'Account created!' : `Welcome back, ${res.data.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" id="login-page">
      {/* Animated background shapes */}
      <div className="login-bg">
        <div className="login-bg-shape login-bg-shape--1" />
        <div className="login-bg-shape login-bg-shape--2" />
        <div className="login-bg-shape login-bg-shape--3" />
      </div>

      <div className="login-container">
        {/* Left side — branding */}
        <div className="login-branding">
          <div className="login-branding-icon">
            <FiActivity size={32} />
          </div>
          <h2 className="login-branding-title">HealthTracker</h2>
          <p className="login-branding-subtitle">
            Your personal health companion — track, analyze, and predict your wellness journey.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon"><FiHeart /></div>
              <div>
                <h4>Track Daily Metrics</h4>
                <p>Log weight, steps, and calories</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><FiTrendingUp /></div>
              <div>
                <h4>AI-Powered Predictions</h4>
                <p>7-day forecasts with machine learning</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><FiShield /></div>
              <div>
                <h4>Secure & Private</h4>
                <p>JWT-encrypted authentication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side — form */}
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              {isSignup ? <FiUserPlus size={24} /> : <FiLogIn size={24} />}
            </div>
            <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isSignup ? 'Sign up to start tracking your health' : 'Log in to continue your journey'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder={isSignup ? 'Create a password (min 4 chars)' : 'Enter your password'}
                value={form.password}
                onChange={handleChange}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={loading} id="login-submit-btn">
              {loading ? (
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : isSignup ? (
                <><FiUserPlus /> Create Account</>
              ) : (
                <><FiLogIn /> Sign In</>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="login-toggle">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} id="toggle-auth-mode">
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
