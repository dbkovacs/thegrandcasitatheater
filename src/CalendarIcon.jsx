// File: src/CalendarIcon.jsx
import React from 'react';
import { format } from 'date-fns';

function CalendarIcon({ dateString }) {
  if (!dateString) return null;
  
  const date = new Date(`${dateString}T00:00:00`);

  const month = format(date, 'MMM').toUpperCase();
  const dayOfMonth = format(date, 'dd');
  const dayOfWeek = format(date, 'EEEE').toUpperCase();

  return (
    <div className="calendar-icon-wrapper">
      <div className="calendar-icon-rings">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="calendar-icon-body">
        <div className="calendar-icon-month">{month}</div>
        <div className="calendar-icon-day-num">{dayOfMonth}</div>
        <div className="calendar-icon-day-name">{dayOfWeek}</div>
      </div>
    </div>
  );
}

export default CalendarIcon;
// END - 2025-09-15 13:12 PM