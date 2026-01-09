import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  CreditCard,
  AlertCircle,
  BarChart3,
  Users,
  LogOut
} from 'lucide-react';
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
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <div className="sb-sidebar-section-label">Operations</div>

        <NavLink
          to="/workers/verification"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <UserCheck size={20} />
          <span>Professional Verification</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Briefcase size={20} />
          <span>Job Monitoring</span>
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <CreditCard size={20} />
          <span>Payments</span>
        </NavLink>

        <NavLink
          to="/disputes"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <AlertCircle size={20} />
          <span>Disputes</span>
        </NavLink>

        <div className="sb-sidebar-section-label">Management</div>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <BarChart3 size={20} />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Users size={20} />
          <span>Users</span>
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
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


