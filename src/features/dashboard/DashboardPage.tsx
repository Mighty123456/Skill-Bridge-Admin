import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Clock
} from 'lucide-react';
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
    // Real-time updates: poll every 5 seconds
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num?: number) => {
    if (loading && !stats) return '...';
    return num !== undefined ? num : '—';
  };

  return (
    <div className="sb-dashboard">
      <div className="sb-dashboard-header">
        <h2>Overview</h2>
        <p>Live snapshot of platform activity and user growth.</p>
      </div>

      <div className="sb-dashboard-grid">
        <div className="sb-dashboard-card sb-dashboard-card-primary">
          <div className="sb-dashboard-card-header">
            <h3>Pending Verifications</h3>
            <Clock className="sb-dashboard-icon" size={24} />
          </div>
          <p className="sb-dashboard-metric">{formatNumber(stats?.pendingVerifications)}</p>
          <p className="sb-dashboard-caption">
            Applications awaiting administrative review.
          </p>
          <div className="sb-dashboard-card-footer">
            <ShieldCheck size={14} />
            <span>High priority</span>
          </div>
        </div>

        <div className="sb-dashboard-card">
          <div className="sb-dashboard-card-header">
            <h3>Total Workers</h3>
            <UserCheck className="sb-dashboard-icon" size={24} />
          </div>
          <p className="sb-dashboard-metric">{formatNumber(stats?.totalWorkers)}</p>
          <p className="sb-dashboard-caption">
            Total registered workers across all categories.
          </p>
          <div className="sb-dashboard-card-footer">
            <TrendingUp size={14} />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="sb-dashboard-card">
          <div className="sb-dashboard-card-header">
            <h3>Total Contractors</h3>
            <Briefcase className="sb-dashboard-icon" size={24} />
          </div>
          <p className="sb-dashboard-metric">{formatNumber(stats?.totalContractors)}</p>
          <p className="sb-dashboard-caption">
            Total registered service contractors.
          </p>
          <div className="sb-dashboard-card-footer">
            <TrendingUp size={14} />
            <span>+5% from last month</span>
          </div>
        </div>

        <div className="sb-dashboard-card">
          <div className="sb-dashboard-card-header">
            <h3>Total Users</h3>
            <Users className="sb-dashboard-icon" size={24} />
          </div>
          <p className="sb-dashboard-metric">{formatNumber(stats?.totalUsers)}</p>
          <p className="sb-dashboard-caption">
            Registered customers/tenants seeking services.
          </p>
          <div className="sb-dashboard-card-footer">
            <TrendingUp size={14} />
            <span>+24% from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


