import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { HoppiGlobalOverlayProvider } from './context/HoppiGlobalOverlayContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <HoppiGlobalOverlayProvider>
    <App />
  </HoppiGlobalOverlayProvider>
);

// Register Service Worker for PWA Direct Installation
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('PWA Service Worker registration skipped:', err);
    });
  });
}
