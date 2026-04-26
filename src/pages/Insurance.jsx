import { useState } from 'react';
import { api } from '../api';
import ResponseBox from '../components/ResponseBox';

export default function Insurance() {
  const [form, setForm] = useState({ patientId: '', policyNumber: '', provider: '', validity: '' });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = async () => {
    setLoading(true); setRes(null); setErr(null);
    try {
      setRes(await api.assignInsurance(form.patientId, { policyNumber: form.policyNumber, provider: form.provider, validity: form.validity }));
    } catch (e) { setErr({ message: e.message }); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>🛡️ Insurance</h2>
        <p>Assign insurance policies to patients</p>
      </div>

      <div className="card">
        <div className="card-title">➕ Assign Insurance to Patient</div>
        <div className="token-badge">🔒 Requires Admin JWT</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Patient ID</label>
            <input type="number" placeholder="e.g. 2" value={form.patientId} onChange={e => setForm({...form,patientId:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Policy Number</label>
            <input placeholder="e.g. 123456" value={form.policyNumber} onChange={e => setForm({...form,policyNumber:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Provider</label>
            <input placeholder="e.g. LIC" value={form.provider} onChange={e => setForm({...form,provider:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Validity Date</label>
            <input type="date" value={form.validity} onChange={e => setForm({...form,validity:e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={call} disabled={loading||!form.patientId||!form.policyNumber}>
          {loading ? <><span className="spinner"></span> Assigning...</> : '▶ Assign Insurance'}
        </button>
        <ResponseBox data={res} error={err} />
      </div>
    </div>
  );
}
