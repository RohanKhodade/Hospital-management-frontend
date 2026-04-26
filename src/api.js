const BASE = import.meta.env.VITE_API_BASE;


export function getToken() {
  return localStorage.getItem('hms_token');
}

export function setToken(token) {
  localStorage.setItem('hms_token', token);
}

export function clearToken() {
  localStorage.removeItem('hms_token');
  localStorage.removeItem('hms_user');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text(); // ← read as text first

  try {
    return JSON.parse(text); // try to parse as JSON
  } catch {
    return text; // if it fails, return raw string (your token)
  }
}
export const api = {
  // Auth
  login: (body) => request('POST', '/auth/login', body),
  createAdmin: (body) => request('POST', '/user/create/admin', body),
  createReceptionist: (body) => request('POST', '/user/create/receptionist', body),

  // Patient
  getAllPatients: () => request('GET', '/patient/all'),
  getPatientById: (id) => request('GET', `/patient/${id}`),
  createPatient: (body) => request('POST', '/patient/create', body),
  getPatientInsurance: (id) => request('GET', `/patient/${id}/insurance`),
  getPatientMedicalRecords: (id) => request('GET', `/patient/MedicalRecords/${id}`),

  // Insurance
  assignInsurance: (patientId, body) => request('POST', `/insurance/assignToPatient/${patientId}`, body),

  // Appointment
  createAppointment: (patientId, doctorId, body) => request('POST', `/appointment/create/${patientId}/${doctorId}`, body),

  // Doctor
  createDoctor: (body) => request('POST', '/doctor/create', body),
  getDoctorAppointments: (doctorId) => request('GET', `/doctor/getAppointment/${doctorId}`),
  createSchedule: (doctorId, body) => request('POST', `/doctor/createSchedule/${doctorId}`, body),
  completeAppointment: (appointmentId, body) => request('POST', `/doctor/complete/Appointment/${appointmentId}`, body),
  getDoctorMedicalRecords: (doctorId) => request('GET', `/doctor/MedicalRecords/${doctorId}`),
  getDoctorSchedule: (doctorId) => request('GET', `/doctor/getSchedule/${doctorId}`),
};
