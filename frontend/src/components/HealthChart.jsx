/**
 * HealthChart — Reusable Recharts line chart with gradient fill.
 * Displays weight, steps, or calories over time.
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import './HealthChart.css';

// Color presets for different metrics
const COLORS = {
  weight: { stroke: '#6366f1', fill: 'url(#gradientWeight)' },
  steps: { stroke: '#10b981', fill: 'url(#gradientSteps)' },
  calories: { stroke: '#f59e0b', fill: 'url(#gradientCalories)' },
};

// Custom tooltip component
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="chart-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

function HealthChart({ data, dataKey, title, unit = '', color = 'weight' }) {
  const colorSet = COLORS[color] || COLORS.weight;

  if (!data || data.length === 0) {
    return (
      <div className="chart-container card">
        <h3 className="chart-title">{title}</h3>
        <div className="empty-state">
          <p>No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container card animate-in">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientSteps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientCalories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            unit={unit}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={colorSet.stroke}
            fill={colorSet.fill}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
            animationDuration={1000}
            name={title}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HealthChart;
