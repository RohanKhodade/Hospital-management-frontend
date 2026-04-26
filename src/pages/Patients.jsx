import { useState } from 'react';
import { api } from '../api';
import ResponseBox from '../components/ResponseBox';

export default function Patients() {
  const [tab, setTab] = useState('all');
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({ name: '', email: '', birthdate: '', username: '', password: '' });
  const [getIdForm, setGetIdForm] = useState({ id: '' });
  const [insForm, setInsForm] = useState({ id: '' });
  const [mrForm, setMrForm] = useState({ id: '' });

  const call = async (fn) => {
    setLoading(true); setRes(null); setErr(null);
    try { setRes(await fn()); }
    catch (e) { setErr({ message: e.message }); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>🧑‍⚕️ Patient Management</h2>
        <p>Register patients, view records and insurance</p>
      </div>

      <div className="tabs">
        {['all','get','create','insurance','medrecords'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => { setTab(t); setRes(null); setErr(null); }}>
            {{ all:'All Patients', get:'Get by ID', create:'Create Patient', insurance:'Insurance', medrecords:'Medical Records' }[t]}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <div className="card">
          <div className="card-title">📋 Get All Patients</div>
          <p style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:16}}>Fetches all registered patients from the system.</p>
          <button className="btn btn-primary" onClick={() => call(api.getAllPatients)} disabled={loading}>
            {loading ? <><span className="spinner"></span> Loading...</> : '▶ Fetch All Patients'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'get' && (
        <div className="card">
          <div className="card-title">🔍 Get Patient by ID</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient ID</label>
              <input type="number" placeholder="e.g. 1" value={getIdForm.id} onChange={e => setGetIdForm({id:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getPatientById(getIdForm.id))} disabled={loading||!getIdForm.id}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Patient'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'create' && (
        <div className="card">
          <div className="card-title">➕ Create Patient</div>
          <div className="form-grid">
            {[['name','Full Name','text','e.g. Rohan Khodade'],['email','Email','email','e.g. rohan@gmail.com'],['birthdate','Birthdate','date',''],['username','Username','text','e.g. rohan'],['password','Password','password','']].map(([k,l,t,p]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input type={t} placeholder={p} value={createForm[k]} onChange={e => setCreateForm({...createForm,[k]:e.target.value})} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.createPatient(createForm))} disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating...</> : '▶ Create Patient'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'insurance' && (
        <div className="card">
          <div className="card-title">🛡️ Get Patient Insurance</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient ID</label>
              <input type="number" placeholder="e.g. 1" value={insForm.id} onChange={e => setInsForm({id:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getPatientInsurance(insForm.id))} disabled={loading||!insForm.id}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Insurance'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'medrecords' && (
        <div className="card">
          <div className="card-title">📁 Patient Medical Records</div>
          <div className="token-badge">🔒 Requires JWT Token</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient ID</label>
              <input type="number" placeholder="e.g. 1" value={mrForm.id} onChange={e => setMrForm({id:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getPatientMedicalRecords(mrForm.id))} disabled={loading||!mrForm.id}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Medical Records'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}
    </div>
  );
}
