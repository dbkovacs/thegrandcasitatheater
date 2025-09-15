// File: src/EventCalendar.tsx
import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface EventCalendarProps {
    eventDate: string | undefined;
}

function EventCalendar({ eventDate }: EventCalendarProps) {
    if (!eventDate) {
        return null;
    }

    const date = new Date(`${eventDate}T00:00:00`);

    return (
        <div className="event-calendar-wrapper bg-brand-card rounded-lg p-4 border border-yellow-300/20">
            {/* This version uses only the props compatible with your project */}
            <DayPicker
                month={date}
                selectedDays={date}
            />
            <p style={{ textAlign: 'center', padding: '0.5rem', borderTop: '1px solid #fde04720', marginTop: '0.5rem' }}>
                Showing on {format(date, 'PPP')}
            </p>
        </div>
    );
}

export default EventCalendar;