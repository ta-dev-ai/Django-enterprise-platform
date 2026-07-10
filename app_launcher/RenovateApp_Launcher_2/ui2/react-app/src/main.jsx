import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Avoid StrictMode double effects: legacy controller bridge must run once.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
