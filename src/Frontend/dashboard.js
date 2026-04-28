const API = 'http://localhost:8080/api';
const userEmail = localStorage.getItem('userEmail');
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

if (!userEmail) window.location.href = 'login.html';

let allDoctors = [];
let selectedDoctorId = null;

// ── INIT ──────────────────────────────────────────────
window.onload = () => {
    loadDoctors();
    showSection('doctors');
};

// ── NAV ───────────────────────────────────────────────
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + name).classList.add('active');
    if (name === 'appointments') loadAppointments();
    if (name === 'profile') loadProfile();
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// ── DOCTORS ───────────────────────────────────────────
async function loadDoctors() {
    try {
        const res = await fetch(`${API}/doctors`);
        allDoctors = await res.json();
        renderDoctors(allDoctors);
    } catch {
        document.getElementById('doctors-grid').innerHTML =
            '<p class="empty-state">Failed to load doctors.</p>';
    }
}

function renderDoctors(list) {
    const grid = document.getElementById('doctors-grid');
    if (!list.length) {
        grid.innerHTML = '<p class="empty-state">No doctors found.</p>'; return;
    }
    grid.innerHTML = list.map(d => `
    <div class="doctor-card">
      <div class="doctor-avatar">👨‍⚕️</div>
      <div class="doctor-name">${d.name}</div>
      <div class="doctor-spec">${d.specialization}</div>
      <div class="doctor-info">🏥 ${d.hospital}</div>
      <div class="doctor-info">🎓 ${d.qualification} · ${d.experience} yrs exp</div>
      <div class="doctor-rating">⭐ ${d.rating}</div>
      <button class="btn-book" onclick="openModal(${d.id}, '${d.name}', '${d.specialization}')">
        Book Appointment
      </button>
    </div>
  `).join('');
}

function filterDoctors() {
    const q = document.getElementById('search-doctor').value.toLowerCase();
    const filtered = allDoctors.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
    );
    renderDoctors(filtered);
}

// ── MODAL ─────────────────────────────────────────────
function openModal(doctorId, name, spec) {
    selectedDoctorId = doctorId;
    document.getElementById('modal-doctor-name').textContent = `${name} – ${spec}`;
    document.getElementById('modal-error').classList.add('hidden');

    // Set min date = today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appt-date').min = today;
    document.getElementById('appt-date').value = today;

    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
    selectedDoctorId = null;
}

// ── BOOK ──────────────────────────────────────────────
async function bookAppointment() {
    const date = document.getElementById('appt-date').value;
    const slot = document.getElementById('appt-slot').value;
    const type = document.getElementById('appt-type').value;
    const symptoms = document.getElementById('appt-symptoms').value;

    if (!date) { showModalError('Please select a date.'); return; }

    try {
        const res = await fetch(`${API}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: parseInt(userId),
                doctorId: selectedDoctorId,
                appointmentDate: date,
                timeSlot: slot,
                type: type,
                symptoms: symptoms
            })
        });
        const data = await res.json();
        if (!res.ok) { showModalError(data.error || 'Booking failed.'); return; }

        closeModal();
        alert('Appointment booked successfully!');
        showSection('appointments');
    } catch {
        showModalError('Cannot connect to server.');
    }
}

function showModalError(msg) {
    const el = document.getElementById('modal-error');
    el.textContent = msg;
    el.classList.remove('hidden');
}

// ── APPOINTMENTS ──────────────────────────────────────
async function loadAppointments() {
    const list = document.getElementById('appointments-list');
    list.innerHTML = '<p class="empty-state">Loading...</p>';
    try {
        const res = await fetch(`${API}/appointments?email=${userEmail}`);
        const data = await res.json();
        if (!data.length) {
            list.innerHTML = '<p class="empty-state">No appointments yet.</p>'; return;
        }
        list.innerHTML = data.map(a => `
      <div class="appt-card">
        <div class="appt-info">
          <h4>${a.doctor?.name || 'N/A'}</h4>
          <p>🩺 ${a.doctor?.specialization || ''} · ${a.type}</p>
          <p>📅 ${a.appointmentDate} · ⏰ ${a.timeSlot}</p>
          ${a.symptoms ? `<p>📝 ${a.symptoms}</p>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">
          <span class="badge ${a.status === 'SCHEDULED' ? 'badge-scheduled' : 'badge-cancelled'}">
            ${a.status}
          </span>
          ${a.status === 'SCHEDULED' ? `
            <button class="btn-cancel" onclick="cancelAppointment(${a.id})">Cancel</button>
          ` : ''}
        </div>
      </div>
    `).join('');
    } catch {
        list.innerHTML = '<p class="empty-state">Failed to load appointments.</p>';
    }
}

async function cancelAppointment(id) {
    if (!confirm('Cancel this appointment?')) return;
    try {
        await fetch(`${API}/appointments/${id}/cancel`, { method: 'PUT' });
        loadAppointments();
    } catch {
        alert('Failed to cancel.');
    }
}

// ── PROFILE ───────────────────────────────────────────
async function loadProfile() {
    try {
        const res = await fetch(`${API}/users/profile?email=${userEmail}`);
        const u = await res.json();
        document.getElementById('profile-info').innerHTML = `
      <h3>${u.name}</h3>
      <div class="profile-row"><span class="label">Email</span><span class="value">${u.email}</span></div>
      <div class="profile-row"><span class="label">Phone</span><span class="value">${u.phone || '–'}</span></div>
      <div class="profile-row"><span class="label">Blood Group</span><span class="value">${u.bloodGroup?.replace('_POS','+').replace('_NEG','-') || '–'}</span></div>
      <div class="profile-row"><span class="label">Role</span><span class="value">${u.role}</span></div>
    `;
    } catch {
        document.getElementById('profile-info').innerHTML = '<p>Failed to load profile.</p>';
    }
}