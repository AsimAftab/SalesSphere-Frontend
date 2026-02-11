import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/fonts.css'; // Load self-hosted fonts first
import './index.css';
import App from '@/App.tsx';
import { fetchCsrfToken } from '@/api/authService';

// Fetch CSRF token in the background — don't block initial render
fetchCsrfToken();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
