import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/theme.css';

// Garante que o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);