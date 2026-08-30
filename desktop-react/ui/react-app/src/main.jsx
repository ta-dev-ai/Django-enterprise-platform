import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/dashboard-enterprise.css';
import { ensureCsrfCookie } from './utils/csrf';
import { LocaleProvider } from './i18n/LocaleContext';
import { ThemeProvider } from './context/ThemeContext';

ensureCsrfCookie();

ReactDOM.createRoot(document.getElementById('root')).render(
  <LocaleProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </LocaleProvider>,
);
