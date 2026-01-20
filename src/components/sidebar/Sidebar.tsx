import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  CreditCard,
  AlertCircle,
  BarChart3,
  Users,
  LogOut,
  FileText,
  Star,
  Settings
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
          <span>Verification</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Briefcase size={20} />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/quotations"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <FileText size={20} />
          <span>Quotations</span>
        </NavLink>

        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <AlertCircle size={20} />
          <span>Emergency</span>
        </NavLink>

        <NavLink
          to="/ratings"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Star size={20} />
          <span>Ratings</span>
        </NavLink>

        <div className="sb-sidebar-section-label">Financials</div>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <CreditCard size={20} />
          <span>Payments & Wallet</span>
        </NavLink>

        <div className="sb-sidebar-section-label">Management</div>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Users size={20} />
          <span>Users & Contractors</span>
        </NavLink>

        <div className="sb-sidebar-section-label">System</div>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <BarChart3 size={20} />
          <span>Reports & Logs</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sb-sidebar-link ${isActive ? 'sb-sidebar-link-active' : ''}`
          }
        >
          <Settings size={20} />
          <span>Configuration</span>
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


