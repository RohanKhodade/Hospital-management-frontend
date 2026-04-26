import { clearToken } from '../api';

const navItems = [
  { id: 'patients',     label: 'Patients',      icon: '🧑‍⚕️', section: 'SERVICES' },
  { id: 'doctors',      label: 'Doctors',        icon: '👨‍⚕️', section: null },
  { id: 'appointments', label: 'Appointments',   icon: '📅', section: null },
  { id: 'insurance',    label: 'Insurance',      icon: '🛡️', section: null },
  { id: 'users',        label: 'User Management',icon: '👤', section: 'ADMIN' },
];

export default function Sidebar({ active, onNav, username, onLogout }) {
  let lastSection = null;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>🏥</div>
        <h1>HMS Portal</h1>
        <span>Hospital Management</span>
      </div>

      <nav>
        {navItems.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          return (
            <div key={item.id}>
              {showSection && <div className="sidebar-section">{item.section}</div>}
              <div
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div>Logged in as</div>
        <div style={{ color: '#90e0ef', fontWeight: 500, marginTop: 2 }}>{username}</div>
        <button className="logout-btn" onClick={() => { clearToken(); onLogout(); }}>
          ⬅ Logout
        </button>
      </div>
    </div>
  );
}
