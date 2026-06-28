import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ClerkOrMockProvider } from './lib/clerk-service.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkOrMockProvider>
      <App />
    </ClerkOrMockProvider>
  </StrictMode>,
);
