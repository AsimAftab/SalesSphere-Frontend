import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { fetchCsrfToken } from './api/authService';

const initializeApp = async () => {
  // Wait for the CSRF token to be fetched
  await fetchCsrfToken();
  
  // Now, render the app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
};

initializeApp();