import { useState } from 'react';
import { api } from '../api';
import ResponseBox from '../components/ResponseBox';

export default function Users() {
  const [tab, setTab] = useState('admin');
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [recepForm, setRecepForm] = useState({ username: '', password: '' });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = async (fn) => {
    setLoading(true); setRes(null); setErr(null);
    try { setRes(await fn()); }
    catch (e) { setErr({ message: e.message }); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>👤 User Management</h2>
        <p>Create admin and receptionist accounts</p>
      </div>

      <div className="tabs">
        {['admin','receptionist'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => { setTab(t); setRes(null); setErr(null); }}>
            {{ admin:'Create Admin', receptionist:'Create Receptionist' }[t]}
          </button>
        ))}
      </div>

      {tab === 'admin' && (
        <div className="card">
          <div className="card-title">🔑 Create Admin</div>
          <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:16}}>No auth required — use carefully.</p>
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input placeholder="e.g. admin2" value={adminForm.username} onChange={e => setAdminForm({...adminForm,username:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="e.g. admin2123" value={adminForm.password} onChange={e => setAdminForm({...adminForm,password:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.createAdmin(adminForm))} disabled={loading||!adminForm.username}>
            {loading ? <><span className="spinner"></span> Creating...</> : '▶ Create Admin'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'receptionist' && (
        <div className="card">
          <div className="card-title">🏥 Create Receptionist</div>
          <div className="token-badge">🔒 Requires Admin JWT</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input placeholder="e.g. voila" value={recepForm.username} onChange={e => setRecepForm({...recepForm,username:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="e.g. voila123" value={recepForm.password} onChange={e => setRecepForm({...recepForm,password:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.createReceptionist(recepForm))} disabled={loading||!recepForm.username}>
            {loading ? <><span className="spinner"></span> Creating...</> : '▶ Create Receptionist'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}
    </div>
  );
}
