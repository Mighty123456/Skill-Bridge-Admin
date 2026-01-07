import { useAuth } from '../../hooks/useAuth';
import './Topbar.css';

const Topbar = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="sb-topbar">
      <div className="sb-topbar-left">
        <h1 className="sb-topbar-title">Admin Dashboard</h1>
        <p className="sb-topbar-subtitle">Control center for SkillBridge operations</p>
      </div>
      <div className="sb-topbar-right">
        <div className="sb-topbar-user">
          <div className="sb-topbar-avatar">
            {admin?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="sb-topbar-user-info">
            <span className="sb-topbar-user-name">{admin?.name ?? 'Admin'}</span>
            <span className="sb-topbar-user-role">Platform Admin</span>
          </div>
        </div>
        <button className="sb-topbar-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;


