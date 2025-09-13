// File: src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- ADD THIS LINE BACK
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// END - 2025-09-13 17:24 PM