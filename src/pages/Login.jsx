import { useState } from 'react';
import { api, setToken } from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.username || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.login(form);
      if (res.token || res.jwt || typeof res === 'string') {
        const token = res.token || res.jwt || res;
        setToken(token);
        localStorage.setItem('hms_user', form.username);
        onLogin(token);
      } else {
        setError(JSON.stringify(res));
      }
    } catch (e) {
      setError('Could not connect to backend. Is Spring Boot running?');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="cross-icon">🏥</div>
          <h1>HMS Portal</h1>
          <p>Hospital Management System</p>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handle} placeholder="Enter username" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle} placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner"></span> Signing in...</> : '→ Sign In'}
        </button>

        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
}
