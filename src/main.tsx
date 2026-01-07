import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { store } from './app/store';
import AppRouter from './app/router';
import { loadFromStorage, checkAuth } from './features/auth/authSlice';

// Initialize auth state
store.dispatch(loadFromStorage());
store.dispatch(checkAuth());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StrictMode>,
);
