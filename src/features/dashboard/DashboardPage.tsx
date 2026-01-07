import { useEffect, useState } from 'react';
import { dashboardApi, type DashboardStats } from '../../api/dashboard.api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const formatNumber = (num?: number) => {
    if (loading) return '...';
    return num !== undefined ? num : '—';
  };

  return (
    <div className="sb-dashboard">
      <div className="sb-dashboard-header">
        <h2>Overview</h2>
        <p>Quick snapshot of worker onboarding and platform activity.</p>
      </div>

      <div className="sb-dashboard-grid">
        <div className="sb-dashboard-card sb-dashboard-card-primary">
          <h3>Pending Verifications</h3>
          <p className="sb-dashboard-metric">{formatNumber(stats?.pendingWorkers)}</p>
          <p className="sb-dashboard-caption">
            Review and approve identity documents before workers go live.
          </p>
        </div>

        <div className="sb-dashboard-card">
          <h3>Verified Professionals</h3>
          <p className="sb-dashboard-metric">{formatNumber(stats?.verifiedWorkers)}</p>
          <p className="sb-dashboard-caption">
            Total workers and contractors currently active on the platform.
          </p>
        </div>

        <div className="sb-dashboard-card">
          <h3>Total Users</h3>
          <p className="sb-dashboard-metric">{formatNumber(stats?.totalUsers)}</p>
          <p className="sb-dashboard-caption">
            Registered users seeking services (excluding professionals).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


