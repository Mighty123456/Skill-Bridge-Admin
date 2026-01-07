import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type AdminLoginPayload } from '../../api/auth.api';

export type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export type AuthState = {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (payload: AdminLoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      return res.data ?? res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to login. Please check your credentials.';
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadFromStorage(state) {
      const token = localStorage.getItem('sb_admin_token');
      const adminRaw = localStorage.getItem('sb_admin_user');
      if (token && adminRaw) {
        state.token = token;
        state.admin = JSON.parse(adminRaw);
        state.isAuthenticated = true;
      }
    },
    logout(state) {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('sb_admin_token');
      localStorage.removeItem('sb_admin_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<{ token: string; user: AdminUser }>,
        ) => {
          state.isLoading = false;
          state.token = action.payload.token;
          state.admin = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('sb_admin_token', action.payload.token);
          localStorage.setItem('sb_admin_user', JSON.stringify(action.payload.user));
        },
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
      });
  },
});

export const { loadFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;


