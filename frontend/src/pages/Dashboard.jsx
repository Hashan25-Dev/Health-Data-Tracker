/**
 * Dashboard — Main page with summary cards, charts, goal tracker, and records table.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecords, getStats, deleteRecord } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import HealthChart from '../components/HealthChart';
import GoalTracker from '../components/GoalTracker';
import toast from 'react-hot-toast';
import { FiTrendingDown, FiActivity, FiZap, FiCalendar, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recordsRes, statsRes] = await Promise.all([getRecords(), getStats()]);
      setRecords(recordsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load data. Is the backend running on port 5000?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await deleteRecord(id);
      toast.success('Record deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete record');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading your health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container" id="dashboard-page">
      {/* Header */}
      <div className="page-header dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your health journey at a glance</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          <FiPlus /> Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid-4 dashboard-cards">
          <SummaryCard
            title="Avg Weight"
            value={`${stats.average?.weight || 0} kg`}
            subtitle={`Latest: ${stats.latest?.weight || 0} kg`}
            icon={<FiTrendingDown />}
            color="indigo"
          />
          <SummaryCard
            title="Avg Steps"
            value={(stats.average?.steps || 0).toLocaleString()}
            subtitle={`Max: ${(stats.max?.steps || 0).toLocaleString()}`}
            icon={<FiActivity />}
            color="emerald"
          />
          <SummaryCard
            title="Avg Calories"
            value={(stats.average?.calories || 0).toLocaleString()}
            subtitle={`Min: ${(stats.min?.calories || 0).toLocaleString()}`}
            icon={<FiZap />}
            color="amber"
          />
          <SummaryCard
            title="Total Entries"
            value={stats.count || records.length}
            subtitle={`Latest: ${stats.latest?.date || '—'}`}
            icon={<FiCalendar />}
            color="rose"
          />
        </div>
      )}

      {/* Goal Tracker */}
      <div className="dashboard-goal">
        <GoalTracker currentWeight={stats?.latest?.weight} />
      </div>

      {/* Charts */}
      <div className="grid-2 dashboard-charts">
        <HealthChart data={records} dataKey="weight" title="Weight Over Time" unit=" kg" color="weight" />
        <HealthChart data={records} dataKey="steps" title="Steps Over Time" color="steps" />
      </div>

      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        <HealthChart data={records} dataKey="calories" title="Calories Over Time" unit=" kcal" color="calories" />
      </div>

      {/* Records Table */}
      <div className="dashboard-table-section card animate-in" style={{ marginTop: '1.5rem' }}>
        <div className="dashboard-table-header">
          <h3>Recent Records</h3>
          <span className="dashboard-table-count">{records.length} entries</span>
        </div>

        {records.length === 0 ? (
          <div className="empty-state">
            <p>No records yet. Add your first health entry!</p>
            <button className="btn btn-primary" onClick={() => navigate('/add')}>
              <FiPlus /> Add Record
            </button>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table" id="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Steps</th>
                  <th>Calories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().slice(0, 15).map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{r.weight}</td>
                    <td>{r.steps.toLocaleString()}</td>
                    <td>{r.calories.toLocaleString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/edit/${r.id}`)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
