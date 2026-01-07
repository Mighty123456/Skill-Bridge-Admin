import { NavLink } from 'react-router-dom';
import './Sidebar.css';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { admin, logout } = useAuth();

  return (
    <aside className={`sb-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sb-sidebar-header">
        <span className="sb-sidebar-logo">SB</span>
        <span className="sb-sidebar-title">SkillBridge Admin</span>
      </div>

      <nav className="sb-sidebar-nav" onClick={onClose}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Dashboard
        </NavLink>

        <div className="sb-sidebar-section-label">Operations</div>

        <NavLink
          to="/workers/verification"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Worker Verification
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Job Monitoring
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Payments
        </NavLink>

        <NavLink
          to="/disputes"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Disputes
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          Users
        </NavLink>
      </nav>

      <div className="sb-sidebar-footer">
        <div className="sb-sidebar-user">
          <div className="sb-sidebar-avatar">
            {admin?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="sb-sidebar-user-info">
            <span className="sb-sidebar-user-name">{admin?.name ?? 'Admin'}</span>
            <span className="sb-sidebar-user-role">Platform Admin</span>
          </div>
        </div>
        <button className="sb-sidebar-logout" onClick={logout} title="Logout">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


