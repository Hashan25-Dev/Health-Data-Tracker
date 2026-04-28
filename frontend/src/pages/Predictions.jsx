/**
 * Predictions — ML prediction page with charts and data table.
 */

import React, { useState, useEffect } from 'react';
import { getRecords, getPredictions } from '../services/api';
import PredictionChart from '../components/PredictionChart';
import { FiCpu, FiTrendingUp } from 'react-icons/fi';
import './Predictions.css';

function Predictions() {
  const [records, setRecords] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [recRes, predRes] = await Promise.all([getRecords(), getPredictions()]);
        setRecords(recRes.data);
        setPredictions(predRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Training ML model and generating predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Predictions</h1>
          <p>AI-powered health forecasts</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const preds = predictions?.predictions || [];
  const accuracy = predictions?.model_accuracy || {};

  return (
    <div className="page-container" id="predictions-page">
      <div className="page-header">
        <h1>Predictions</h1>
        <p>Linear Regression model — next 7 days forecast</p>
      </div>

      {/* Model Info Cards */}
      <div className="grid-3 predictions-info">
        <div className="card animate-in predictions-info-card">
          <div className="predictions-info-icon"><FiCpu /></div>
          <p className="predictions-info-label">Model</p>
          <h4>Linear Regression</h4>
        </div>
        <div className="card animate-in predictions-info-card">
          <div className="predictions-info-icon"><FiTrendingUp /></div>
          <p className="predictions-info-label">Training Samples</p>
          <h4>{predictions?.training_samples || 0}</h4>
        </div>
        <div className="card animate-in predictions-info-card">
          <div className="predictions-info-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><FiTrendingUp /></div>
          <p className="predictions-info-label">Weight R² Score</p>
          <h4>{(accuracy.weight_r2 * 100).toFixed(1)}%</h4>
        </div>
      </div>

      {/* Prediction Charts */}
      <div className="grid-2 predictions-charts">
        <PredictionChart
          historicalData={records}
          predictions={preds}
          dataKey="weight"
          predictionKey="predicted_weight"
          title="Weight Forecast"
          color="#6366f1"
        />
        <PredictionChart
          historicalData={records}
          predictions={preds}
          dataKey="steps"
          predictionKey="predicted_steps"
          title="Steps Forecast"
          color="#10b981"
        />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <PredictionChart
          historicalData={records}
          predictions={preds}
          dataKey="calories"
          predictionKey="predicted_calories"
          title="Calories Forecast"
          color="#f59e0b"
        />
      </div>

      {/* Predictions Table */}
      <div className="card animate-in" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Predicted Values — Next 7 Days
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="prediction-table" id="predictions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Steps</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {preds.map((p, i) => (
                <tr key={i}>
                  <td>{new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td>{p.predicted_weight}</td>
                  <td>{p.predicted_steps.toLocaleString()}</td>
                  <td>{p.predicted_calories.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Predictions;
