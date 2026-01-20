import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import WorkerVerificationPage from '../features/worker_verification/WorkerVerificationPage';
import UsersPage from '../features/users/UsersPage';
import ProtectedRoute from './protectedRoute';

import JobManagementPage from '../features/jobs/JobManagementPage';
import QuotationMonitoringPage from '../features/quotations/QuotationMonitoringPage';
import PaymentWalletPage from '../features/payments/PaymentWalletPage';
import RatingsFeedbackPage from '../features/ratings/RatingsFeedbackPage';
import EmergencyJobPage from '../features/emergency/EmergencyJobPage';
import PlatformConfigurationPage from '../features/settings/PlatformConfigurationPage';
import ReportsPage from '../features/reports/ReportsPage';

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

          <Route path="jobs" element={<JobManagementPage />} />
          <Route path="quotations" element={<QuotationMonitoringPage />} />
          <Route path="payments" element={<PaymentWalletPage />} />
          <Route path="ratings" element={<RatingsFeedbackPage />} />
          <Route path="emergency" element={<EmergencyJobPage />} />
          <Route path="settings" element={<PlatformConfigurationPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


