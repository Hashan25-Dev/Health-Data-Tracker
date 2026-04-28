/**
 * RecordForm — Add or edit a health record.
 * Handles form state, validation, and API submission.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecord, updateRecord, getRecords } from '../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiPlus } from 'react-icons/fi';
import './RecordForm.css';

function RecordForm({ editId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    steps: '',
    calories: '',
  });

  // If editing, fetch the existing record
  useEffect(() => {
    if (editId) {
      (async () => {
        try {
          const res = await getRecords();
          const record = res.data.find((r) => r.id === parseInt(editId));
          if (record) {
            setForm({
              date: record.date,
              weight: String(record.weight),
              steps: String(record.steps),
              calories: String(record.calories),
            });
          }
        } catch {
          toast.error('Failed to load record');
        }
      })();
    }
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.date || !form.weight || !form.steps || !form.calories) {
      toast.error('All fields are required');
      return;
    }

    if (parseFloat(form.weight) <= 0 || parseInt(form.steps) < 0 || parseInt(form.calories) < 0) {
      toast.error('Please enter valid positive numbers');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        date: form.date,
        weight: parseFloat(form.weight),
        steps: parseInt(form.steps),
        calories: parseInt(form.calories),
      };

      if (editId) {
        await updateRecord(editId, payload);
        toast.success('Record updated!');
      } else {
        await addRecord(payload);
        toast.success('Record added!');
      }

      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="record-form card" onSubmit={handleSubmit} id="record-form">
      <h2 className="record-form-title">
        {editId ? 'Edit Record' : 'New Health Entry'}
      </h2>
      <p className="record-form-subtitle">
        {editId ? 'Update the values below' : 'Log your daily health metrics'}
      </p>

      <div className="record-form-grid">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-input"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            className="form-input"
            placeholder="e.g. 72.5"
            step="0.1"
            min="0"
            value={form.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="steps">Steps</label>
          <input
            type="number"
            id="steps"
            name="steps"
            className="form-input"
            placeholder="e.g. 8500"
            min="0"
            value={form.steps}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="calories">Calories (kcal)</label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="form-input"
            placeholder="e.g. 2100"
            min="0"
            value={form.calories}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="record-form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
          ) : editId ? (
            <><FiSave /> Update Record</>
          ) : (
            <><FiPlus /> Add Record</>
          )}
        </button>
      </div>
    </form>
  );
}

export default RecordForm;
