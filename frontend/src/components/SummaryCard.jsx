/**
 * SummaryCard — Reusable stat card with icon, value, and label.
 */

import React from 'react';
import './SummaryCard.css';

function SummaryCard({ title, value, subtitle, icon, color = 'indigo' }) {
  return (
    <div className={`summary-card animate-in`} id={`card-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`summary-card-icon summary-card-icon--${color}`}>
        {icon}
      </div>
      <div className="summary-card-content">
        <p className="summary-card-title">{title}</p>
        <h3 className="summary-card-value">{value}</h3>
        {subtitle && <p className="summary-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default SummaryCard;
