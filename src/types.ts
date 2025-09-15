// File: src/types.ts

// The main blueprint for a movie night event
export interface MovieNight {
  id: string;
  hostName: string;
  movieTitle: string;
  showDate: string;
  status: 'Pending Review' | 'Approved';
  thermostat: number;
  submittedAt: any;
  posterURL?: string; // Optional
  trailerLink?: string; // ADDED: Optional trailer link
}

// A blueprint for a reservation
export interface Reservation {
  id: string;
  name: string;
  seatIds: string[];
}

// A blueprint for a single seat
export interface Seat {
  id:string;
  status: 'available' | 'reserved' | 'selected';
}