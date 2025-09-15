// File: src/CalendarIcon.jsx
import React from 'react';
import { format } from 'date-fns';

function CalendarIcon({ dateString }) {
  if (!dateString) return null;
  
  // The date string from Firestore is 'YYYY-MM-DD'. We need to add 'T00:00:00'
  // to ensure date-fns parses it correctly without timezone shifts.
  const date = new Date(`${dateString}T00:00:00`);

  const month = format(date, 'MMM').toUpperCase();
  const dayOfMonth = format(date, 'dd');
  const dayOfWeek = format(date, 'EEEE').toUpperCase(); // E.g., THURSDAY

  return (
    <div className="calendar-icon-wrapper">
      <div className="calendar-icon-rings">
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="calendar-icon-header">{month}</div>
      <div className="calendar-icon-body">
        <div className="calendar-icon-day-num">{dayOfMonth}</div>
        <div className="calendar-icon-day-name">{dayOfWeek}</div>
      </div>
    </div>
  );
}

export default CalendarIcon;
// END - 2025-09-15_13:06 PM