// File: src/StyledCalendar.jsx
import React from 'react';
import { format, getDaysInMonth, startOfMonth, getDate, getDay } from 'date-fns';

function StyledCalendar({ eventDate }) {
  if (!eventDate) return null;

  const date = new Date(`${eventDate}T00:00:00`);
  const monthName = format(date, 'MMMM');
  const year = date.getFullYear();
  const eventDay = getDate(date);

  const firstDayOfMonth = startOfMonth(date);
  const totalDaysInMonth = getDaysInMonth(date);
  const startingDayOfWeek = getDay(firstDayOfMonth); // 0=Sun, 1=Mon, ...

  // Create an array of empty slots for the days before the 1st
  const paddingDays = Array.from({ length: startingDayOfWeek });

  // Create an array for the actual days of the month
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-container">
      <div className="calendar-rings">
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="calendar-header">{monthName} {year}</div>
      <div className="calendar-grid">
        <div className="day-name">Su</div>
        <div className="day-name">Mo</div>
        <div className="day-name">Tu</div>
        <div className="day-name">We</div>
        <div className="day-name">Th</div>
        <div className="day-name">Fr</div>
        <div className="day-name">Sa</div>
        
        {paddingDays.map((_, index) => (
          <div key={`pad-${index}`} className="day-cell empty"></div>
        ))}

        {daysInMonth.map((day) => (
          <div key={day} className={`day-cell ${day === eventDay ? 'event-day' : ''}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StyledCalendar;
// END - 2025-09-15 13:00 PM