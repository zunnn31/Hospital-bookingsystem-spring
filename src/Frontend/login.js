const API = 'http://localhost:8080/api';

async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('error-msg');
    errorEl.classList.add('hidden');

    if (!email || !password) {
        showError('Please fill in all fields.');
        return;
    }

    try {
        const res = await fetch(`${API}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) { showError(data.error || 'Login failed.'); return; }

        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        window.location.href = 'dashboard.html';
    } catch (e) {
        showError('Cannot connect to server.');
    }
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.remove('hidden');
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });