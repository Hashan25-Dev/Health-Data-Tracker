/**
 * App — Root component with routing and dark mode toggle.
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import Predictions from './pages/Predictions';
import Login from './pages/Login';
import './App.css';

function App() {
  // Dark mode — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            borderRadius: '10px',
            fontSize: '0.9rem',
          },
        }}
      />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="app-layout">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddRecord />} />
          <Route path="/edit/:id" element={<AddRecord />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
