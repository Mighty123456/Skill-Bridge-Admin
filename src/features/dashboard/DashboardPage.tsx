import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="sb-dashboard">
      <div className="sb-dashboard-header">
        <h2>Overview</h2>
        <p>Quick snapshot of worker onboarding and platform activity.</p>
      </div>

      <div className="sb-dashboard-grid">
        <div className="sb-dashboard-card sb-dashboard-card-primary">
          <h3>Pending Worker Verifications</h3>
          <p className="sb-dashboard-metric">—</p>
          <p className="sb-dashboard-caption">
            Review and approve identity documents before workers go live.
          </p>
        </div>

        <div className="sb-dashboard-card">
          <h3>Active Jobs</h3>
          <p className="sb-dashboard-metric">—</p>
          <p className="sb-dashboard-caption">
            Track in-progress jobs and ensure timely completion.
          </p>
        </div>

        <div className="sb-dashboard-card">
          <h3>Open Disputes</h3>
          <p className="sb-dashboard-metric">—</p>
          <p className="sb-dashboard-caption">
            Resolve escalations between workers and clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


