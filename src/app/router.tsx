import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import WorkerVerificationPage from '../features/worker_verification/WorkerVerificationPage';
import UsersPage from '../features/users/UsersPage';
import ProtectedRoute from './protectedRoute';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workers/verification" element={<WorkerVerificationPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


