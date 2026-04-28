const API = 'http://localhost:8080/api';

async function register() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const bloodGroup = document.getElementById('bloodGroup').value;

  if (!name || !email || !password || !phone) {
    showError('Please fill in all fields.'); return;
  }

  try {
    const res = await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, bloodGroup })
    });
    const data = await res.json();
    if (!res.ok) { showError(data.error || 'Registration failed.'); return; }
    alert('Account created! Please sign in.');
    window.location.href = 'login.html';
  } catch (e) {
    showError('Cannot connect to server.');
  }
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}