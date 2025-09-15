// File: src/EventCalendar.jsx
import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Import base styles
import { format } from 'date-fns';

// SVG for the red marker circle effect. This is included directly in our code.
const svgCircle = `
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" stroke="#B1745E" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="10 3" transform="rotate(-15 50 50)"/>
  </svg>
`;
const encodedSvg = `data:image/svg+xml;base64,${btoa(svgCircle)}`;


function EventCalendar({ eventDate }) {
  if (!eventDate) return null;

  // Convert the "YYYY-MM-DD" string from Firestore into a proper Date object
  const date = new Date(`${eventDate}T00:00:00`);

  const modifiers = {
    event: date, // This is the date we want to circle
  };
  
  const modifiersStyles = {
    event: {
      position: 'relative',
      color: 'var(--color-terracotta)',
      fontWeight: 'bold',
    },
  };
  
  // Custom component to add the red circle around the event date
  const EventDay = (props) => {
    const isEvent = props.modifiers.event;
    return (
      <div style={{ position: 'relative' }}>
        {props.children}
        {isEvent && <div style={{
          position: 'absolute',
          top: '-10px', left: '-10px',
          width: '44px', height: '44px',
          backgroundImage: `url("${encodedSvg}")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }} />}
      </div>
    );
  };

  return (
    <div className="event-calendar-wrapper">
      <DayPicker
        mode="single"
        selected={date}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        showOutsideDays
        fixedWeeks
        month={date} // Ensure the calendar always shows the month of the event
        footer={<p className="event-calendar-footer">Showing on: {format(date, 'PPP')}</p>}
        components={{ Day: EventDay }}
        className="event-calendar"
      />
    </div>
  );
}

export default EventCalendar;
// END - 2025-09-15 12:30 PM