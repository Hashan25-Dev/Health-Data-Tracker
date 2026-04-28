/**
 * AddRecord — Page for adding or editing a health record.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import RecordForm from '../components/RecordForm';
import './AddRecord.css';

function AddRecord() {
  const { id } = useParams(); // If editing, id will be set from /edit/:id

  return (
    <div className="page-container" id="add-record-page">
      <div className="page-header">
        <h1>{id ? 'Edit Record' : 'Add Health Record'}</h1>
        <p>{id ? 'Update the details below' : 'Log your daily weight, steps, and calories'}</p>
      </div>

      <RecordForm editId={id} />
    </div>
  );
}

export default AddRecord;
