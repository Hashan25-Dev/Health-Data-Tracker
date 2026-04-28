/**
 * PredictionChart — Displays historical data + predicted future values.
 * Uses dashed lines for predictions to distinguish from actual data.
 */

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import './PredictionChart.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="chart-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

function PredictionChart({ historicalData, predictions, dataKey, predictionKey, title, color }) {
  const strokeColor = color || '#6366f1';

  // Combine historical (last 30 days) + predictions into one dataset
  const recent = historicalData.slice(-30).map((d) => ({
    date: d.date,
    [dataKey]: d[dataKey],
  }));

  const lastHistorical = recent[recent.length - 1];
  const dividerDate = lastHistorical?.date;

  // Bridge: add last historical point to predictions so lines connect
  const predData = predictions.map((d) => ({
    date: d.date,
    [predictionKey]: d[predictionKey],
  }));

  // Merge — historical points won't have predictionKey, prediction points won't have dataKey
  const combined = [
    ...recent,
    // bridge point: both actual and predicted value at the boundary
    ...(lastHistorical
      ? [{ date: lastHistorical.date, [dataKey]: lastHistorical[dataKey], [predictionKey]: lastHistorical[dataKey] }]
      : []),
    ...predData,
  ];

  // De-duplicate the bridge date
  const seen = new Set();
  const deduped = combined.filter((d) => {
    if (seen.has(d.date)) return false;
    seen.add(d.date);
    return true;
  });

  // Re-add bridge values to last historical entry
  const mergedData = deduped.map((d) => {
    if (d.date === dividerDate) {
      return { ...d, [predictionKey]: d[dataKey] || d[predictionKey] };
    }
    return d;
  });

  if (!mergedData.length) {
    return (
      <div className="prediction-chart card">
        <h3 className="chart-title">{title}</h3>
        <div className="empty-state"><p>No data available</p></div>
      </div>
    );
  }

  return (
    <div className="prediction-chart card animate-in">
      <div className="prediction-chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="prediction-legend">
          <span className="legend-item">
            <span className="legend-line" style={{ background: strokeColor }} />
            Actual
          </span>
          <span className="legend-item">
            <span className="legend-line legend-line--dashed" style={{ background: strokeColor }} />
            Predicted
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`grad-pred-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.08} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />

          {dividerDate && (
            <ReferenceLine
              x={dividerDate}
              stroke="var(--text-muted)"
              strokeDasharray="4 4"
              label=""
            />
          )}

          {/* Actual data */}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            fill={`url(#grad-${dataKey})`}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
            connectNulls={false}
            name="Actual"
          />

          {/* Predicted data */}
          <Area
            type="monotone"
            dataKey={predictionKey}
            stroke={strokeColor}
            fill={`url(#grad-pred-${dataKey})`}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#fff', strokeWidth: 2 }}
            connectNulls={false}
            name="Predicted"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionChart;
