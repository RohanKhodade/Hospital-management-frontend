import { useState } from 'react';
import { api } from '../api';
import ResponseBox from '../components/ResponseBox';

export default function Doctors() {
  const [tab, setTab] = useState('create');
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({ name: '', username: '', password: '' });
  const [apptForm, setApptForm] = useState({ doctorId: '' });
  const [schedForm, setSchedForm] = useState({ doctorId: '', dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '17:00:00', slotDuration: 30 });
  const [completeForm, setCompleteForm] = useState({ appointmentId: '', prescription: '', notes: '' });
  const [mrForm, setMrForm] = useState({ doctorId: '' });
  const [getSchedForm, setGetSchedForm] = useState({ doctorId: '' });

  const call = async (fn) => {
    setLoading(true); setRes(null); setErr(null);
    try { setRes(await fn()); }
    catch (e) { setErr({ message: e.message }); }
    setLoading(false);
  };

  const days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

  return (
    <div>
      <div className="page-header">
        <h2>👨‍⚕️ Doctor Management</h2>
        <p>Manage doctors, schedules and appointments</p>
      </div>

      <div className="tabs">
        {['create','appointments','schedule','getschedule','complete','medrecords'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => { setTab(t); setRes(null); setErr(null); }}>
            {{ create:'Create Doctor', appointments:'Appointments', schedule:'Create Schedule', getschedule:'Get Schedule', complete:'Complete Appt', medrecords:'Medical Records' }[t]}
          </button>
        ))}
      </div>

      {tab === 'create' && (
        <div className="card">
          <div className="card-title">➕ Create Doctor</div>
          <div className="token-badge">🔒 Requires Admin JWT</div>
          <div className="form-grid">
            {[['name','Full Name','text','e.g. Dr. Amol'],['username','Username','text','e.g. amol'],['password','Password','password','']].map(([k,l,t,p]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input type={t} placeholder={p} value={createForm[k]} onChange={e => setCreateForm({...createForm,[k]:e.target.value})} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.createDoctor(createForm))} disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating...</> : '▶ Create Doctor'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'appointments' && (
        <div className="card">
          <div className="card-title">📅 Get Doctor Appointments</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="number" placeholder="e.g. 1" value={apptForm.doctorId} onChange={e => setApptForm({doctorId:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getDoctorAppointments(apptForm.doctorId))} disabled={loading||!apptForm.doctorId}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Appointments'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'schedule' && (
        <div className="card">
          <div className="card-title">🗓️ Create Doctor Schedule</div>
          <div className="token-badge">🔒 Requires Admin JWT</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="number" placeholder="e.g. 1" value={schedForm.doctorId} onChange={e => setSchedForm({...schedForm,doctorId:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Day of Week</label>
              <select value={schedForm.dayOfWeek} onChange={e => setSchedForm({...schedForm,dayOfWeek:e.target.value})}>
                {days.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" value={schedForm.startTime.slice(0,5)} onChange={e => setSchedForm({...schedForm,startTime:e.target.value+':00'})} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" value={schedForm.endTime.slice(0,5)} onChange={e => setSchedForm({...schedForm,endTime:e.target.value+':00'})} />
            </div>
            <div className="form-group">
              <label>Slot Duration (mins)</label>
              <input type="number" value={schedForm.slotDuration} onChange={e => setSchedForm({...schedForm,slotDuration:parseInt(e.target.value)})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.createSchedule(schedForm.doctorId, { dayOfWeek: schedForm.dayOfWeek, startTime: schedForm.startTime, endTime: schedForm.endTime, slotDuration: schedForm.slotDuration }))} disabled={loading||!schedForm.doctorId}>
            {loading ? <><span className="spinner"></span> Creating...</> : '▶ Create Schedule'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'getschedule' && (
        <div className="card">
          <div className="card-title">📋 Get Doctor Schedule</div>
          <div className="token-badge">🔒 Requires JWT</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="number" placeholder="e.g. 1" value={getSchedForm.doctorId} onChange={e => setGetSchedForm({doctorId:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getDoctorSchedule(getSchedForm.doctorId))} disabled={loading||!getSchedForm.doctorId}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Schedule'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'complete' && (
        <div className="card">
          <div className="card-title">✅ Complete Appointment</div>
          <div className="token-badge">🔒 Requires Doctor JWT</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Appointment ID</label>
              <input type="number" placeholder="e.g. 2" value={completeForm.appointmentId} onChange={e => setCompleteForm({...completeForm,appointmentId:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Prescription</label>
              <input placeholder="e.g. tablet1, tablet2" value={completeForm.prescription} onChange={e => setCompleteForm({...completeForm,prescription:e.target.value})} />
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label>Notes</label>
              <textarea placeholder="e.g. eat light, take rest, do yoga" value={completeForm.notes} onChange={e => setCompleteForm({...completeForm,notes:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.completeAppointment(completeForm.appointmentId, { prescription: completeForm.prescription, notes: completeForm.notes }))} disabled={loading||!completeForm.appointmentId}>
            {loading ? <><span className="spinner"></span> Submitting...</> : '▶ Complete Appointment'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}

      {tab === 'medrecords' && (
        <div className="card">
          <div className="card-title">📁 Doctor Medical Records</div>
          <div className="token-badge">🔒 Requires Doctor JWT</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="number" placeholder="e.g. 1" value={mrForm.doctorId} onChange={e => setMrForm({doctorId:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => call(() => api.getDoctorMedicalRecords(mrForm.doctorId))} disabled={loading||!mrForm.doctorId}>
            {loading ? <><span className="spinner"></span> Fetching...</> : '▶ Get Records'}
          </button>
          <ResponseBox data={res} error={err} />
        </div>
      )}
    </div>
  );
}
