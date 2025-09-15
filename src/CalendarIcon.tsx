// File: src/CalendarIcon.jsx
import React from 'react';
import { format } from 'date-fns';

function CalendarIcon({ dateString }: { dateString: string }) {
  if (!dateString) return null;
  
  const date = new Date(`${dateString}T00:00:00`);

  const month = format(date, 'MMMM').toUpperCase(); // Full month name, e.g., SEPTEMBER
  const dayOfMonth = format(date, 'd');          // Day without leading zero
  const dayOfWeek = format(date, 'EEEE').toUpperCase(); 

  return (
    <div className="calendar-icon-wrapper">
      <div className="calendar-icon-top">
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="calendar-icon-header">
        {month}
      </div>
      <div className="calendar-icon-body">
        <div className="calendar-icon-day-num">{dayOfMonth}</div>
        <div className="calendar-icon-day-name">{dayOfWeek}</div>
      </div>
    </div>
  );
}

export default CalendarIcon;
// END - 2025-09-15 13:20 PM