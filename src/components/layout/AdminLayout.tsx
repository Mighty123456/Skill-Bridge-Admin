import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../navbar/Topbar';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="sb-admin-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="sb-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="sb-admin-main">
        <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="sb-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


