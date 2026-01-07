import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sb-sidebar">
      <div className="sb-sidebar-header">
        <span className="sb-sidebar-logo">SB</span>
        <span className="sb-sidebar-title">SkillBridge Admin</span>
      </div>

      <nav className="sb-sidebar-nav">
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
      </nav>
    </aside>
  );
};

export default Sidebar;


