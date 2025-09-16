// src/types.ts
export interface MovieNight {
  id: string;
  hostName: string;
  movieTitle: string;
  showDate: string;
  status: 'Pending Review' | 'Approved';
  thermostat: number;
  submittedAt: any;
  posterURL?: string;
  trailerLink?: string; 
  audience?: 'Kids Welcome' | 'Adults Only';
  greeting?: string;
  notesToDavid?: string;
}

export interface Reservation {
  id: string;
  name: string;
  seatIds: string[];
}

export interface Seat {
  id: string;
  status: 'available' | 'reserved' | 'selected';
  type?: 'beanbag' | 'recliner';
}
// Build Date: 2025-09-16 02:25 PM