// SHA-256 hash of the password
// To change: hash your new password at https://emn178.github.io/online-tools/sha256.html
// then replace the string below.
const PASSWORD_HASH = '568c52a7957f81eb4605c33f64271e2b548a95cfe1ce8ea299d4bf219237ae1e';
const SESSION_KEY = 'htb_auth';

const gate     = document.getElementById('gate');
const content  = document.getElementById('content');
const form     = document.getElementById('gateForm');
const input    = document.getElementById('passInput');
const error    = document.getElementById('gateError');
const lockBtn  = document.getElementById('lockBtn');
const inputWrap = document.querySelector('.input-wrap');

async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function unlock() {
    gate.style.display = 'none';
    content.style.display = 'block';
    lockBtn.style.display = 'block';
    sessionStorage.setItem(SESSION_KEY, '1');
}

function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    gate.style.display = 'flex';
    content.style.display = 'none';
    lockBtn.style.display = 'none';
    input.value = '';
    error.textContent = '';
    setTimeout(() => input.focus(), 100);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256(input.value.trim());
    if (hash === PASSWORD_HASH) {
        unlock();
    } else {
        error.textContent = 'Incorrect password.';
        inputWrap.classList.remove('shake');
        void inputWrap.offsetWidth;
        inputWrap.classList.add('shake');
        input.value = '';
        input.focus();
    }
});

lockBtn.addEventListener('click', lock);

if (sessionStorage.getItem(SESSION_KEY)) unlock();

// Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const rows = document.querySelectorAll('.writeup-row');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visible = 0;
        rows.forEach(row => {
            const show = filter === 'all' || (row.dataset.tags || '').includes(filter);
            row.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
    });
});