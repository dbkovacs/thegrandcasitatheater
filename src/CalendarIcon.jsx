// File: src/CalendarIcon.jsx
import React from 'react';
import { format, parseISO } from 'date-fns';

function CalendarIcon({ dateString }) {
  if (!dateString) return null;

  const date = parseISO(dateString); // Parse the "YYYY-MM-DD" string
  const month = format(date, 'MMM').toUpperCase(); // E.g., SEP
  const dayOfMonth = format(date, 'dd');          // E.g., 18
  const dayOfWeek = format(date, 'EEEE').toUpperCase(); // E.g., THURSDAY

  return (
    <div className="calendar-icon-wrapper">
      <div className="calendar-icon-top">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="calendar-icon-header">{month}</div>
      <div className="calendar-icon-day-num">{dayOfMonth}</div>
      {/* Optional: Add day of week if space allows or as an overlay */}
      {/* <div className="calendar-icon-day-name">{dayOfWeek}</div> */}
    </div>
  );
}

export default CalendarIcon;
// END - 2025-09-15 13:30 PM