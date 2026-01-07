import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../navbar/Topbar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="sb-admin-shell">
      <Sidebar />
      <div className="sb-admin-main">
        <Topbar />
        <main className="sb-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


