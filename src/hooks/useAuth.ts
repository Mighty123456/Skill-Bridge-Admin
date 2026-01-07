import { useAppDispatch, useAppSelector } from '../app/store';
import { logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  return {
    ...auth,
    admin: auth.admin,
    isAuthenticated: auth.isAuthenticated,
    logout: () => dispatch(logout()),
  };
};


