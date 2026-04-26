import { useState } from 'react';
import { api } from '../api';
import ResponseBox from '../components/ResponseBox';

export default function Appointments() {
  const [form, setForm] = useState({ patientId: '', doctorId: '', time: '', reason: '' });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = async () => {
    setLoading(true); setRes(null); setErr(null);
    try {
      setRes(await api.createAppointment(form.patientId, form.doctorId, { time: form.time, reason: form.reason }));
    } catch (e) { setErr({ message: e.message }); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>📅 Appointments</h2>
        <p>Book appointments between patients and doctors</p>
      </div>

      <div className="card">
        <div className="card-title">➕ Create Appointment</div>
        <div className="token-badge">🔒 Requires JWT Token</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Patient ID</label>
            <input type="number" placeholder="e.g. 1" value={form.patientId} onChange={e => setForm({...form,patientId:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Doctor ID</label>
            <input type="number" placeholder="e.g. 2" value={form.doctorId} onChange={e => setForm({...form,doctorId:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input type="datetime-local" value={form.time} onChange={e => setForm({...form,time:e.target.value})} />
          </div>
          <div className="form-group" style={{gridColumn:'1/-1'}}>
            <label>Reason</label>
            <input placeholder="e.g. ear pain, fever, checkup" value={form.reason} onChange={e => setForm({...form,reason:e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={call} disabled={loading||!form.patientId||!form.doctorId}>
          {loading ? <><span className="spinner"></span> Booking...</> : '▶ Book Appointment'}
        </button>
        <ResponseBox data={res} error={err} />
      </div>
    </div>
  );
}
