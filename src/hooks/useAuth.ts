import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { loadFromStorage, logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return {
    ...auth,
    admin: auth.admin,
    isAuthenticated: auth.isAuthenticated,
    logout: () => dispatch(logout()),
  };
};


