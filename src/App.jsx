import { useState } from 'react';
import { getToken } from './api';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Insurance from './pages/Insurance';
import Users from './pages/Users';
import './index.css';

const pages = {
  patients: <Patients />,
  doctors: <Doctors />,
  appointments: <Appointments />,
  insurance: <Insurance />,
  users: <Users />,
};

export default function App() {
  const [token, setToken] = useState(getToken());
  const [page, setPage] = useState('patients');
  const username = localStorage.getItem('hms_user') || 'User';

  if (!token) {
    return <Login onLogin={(t) => setToken(t)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        active={page}
        onNav={setPage}
        username={username}
        onLogout={() => setToken(null)}
      />
      <div className="main-content">
        {pages[page]}
      </div>
    </div>
  );
}
