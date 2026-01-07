import './Topbar.css';

type TopbarProps = {
  onToggleSidebar: () => void;
};

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  return (
    <header className="sb-topbar">
      <div className="sb-topbar-left">
        <button
          className="sb-topbar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="sb-topbar-text">
          <h1 className="sb-topbar-title">Admin Dashboard</h1>
          <p className="sb-topbar-subtitle">Control center for SkillBridge operations</p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;


