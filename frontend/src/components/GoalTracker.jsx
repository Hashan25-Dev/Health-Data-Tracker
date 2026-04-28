/**
 * GoalTracker — Set a target weight and track progress (bonus feature).
 * Stores goal in localStorage.
 */

import React, { useState, useEffect } from 'react';
import { FiTarget, FiCheck } from 'react-icons/fi';
import './GoalTracker.css';

function GoalTracker({ currentWeight }) {
  const [goal, setGoal] = useState(() => {
    return localStorage.getItem('weightGoal') || '';
  });
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(goal);

  useEffect(() => {
    if (goal) localStorage.setItem('weightGoal', goal);
  }, [goal]);

  const handleSave = () => {
    if (inputVal && parseFloat(inputVal) > 0) {
      setGoal(inputVal);
      setEditing(false);
    }
  };

  // Calculate progress percentage
  const goalNum = parseFloat(goal);
  const startWeight = 82; // assumed starting weight
  let progress = 0;
  if (goalNum && currentWeight && currentWeight !== goalNum) {
    // Progress from startWeight toward goalNum
    const totalChange = startWeight - goalNum;
    const currentChange = startWeight - currentWeight;
    progress = totalChange !== 0 ? Math.min(100, Math.max(0, (currentChange / totalChange) * 100)) : 0;
  }

  if (!goal && !editing) {
    return (
      <div className="goal-tracker card animate-in">
        <div className="goal-tracker-empty">
          <FiTarget size={24} />
          <p>Set a weight goal to track progress</p>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
            Set Goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-tracker card animate-in">
      <div className="goal-tracker-header">
        <div className="goal-tracker-icon">
          <FiTarget />
        </div>
        <div>
          <p className="goal-tracker-label">Weight Goal</p>
          {editing ? (
            <div className="goal-tracker-edit">
              <input
                type="number"
                step="0.1"
                min="0"
                className="form-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{ width: 100, padding: '0.4rem 0.6rem' }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <FiCheck />
              </button>
            </div>
          ) : (
            <h3 className="goal-tracker-value" onClick={() => { setEditing(true); setInputVal(goal); }}>
              {goalNum} kg
            </h3>
          )}
        </div>
      </div>

      {!editing && goalNum && (
        <>
          <div className="goal-progress-bar">
            <div
              className="goal-progress-fill"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <div className="goal-progress-info">
            <span>Current: {currentWeight?.toFixed(1) || '—'} kg</span>
            <span>{Math.round(progress)}% there</span>
          </div>
        </>
      )}
    </div>
  );
}

export default GoalTracker;
