// ===== MOBILE NAVIGATION =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    const isActive = navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== ACTIVE NAVIGATION LINK =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== HACKTHEBOX STATS =====
async function loadHtbStats() {
    const HTB_USERNAME = 'cenchss';
    const container = document.getElementById('htb-content');
    if (!container) return;

    try {
        const searchRes = await fetch(
            `https://www.hackthebox.com/api/v4/search/fetch?query=${HTB_USERNAME}&tags=users&lang=en`,
            { headers: { 'Accept': 'application/json' } }
        );
        if (!searchRes.ok) throw new Error('search failed');
        const searchData = await searchRes.json();

        const users = searchData?.users?.data || searchData?.users || [];
        const user = users.find(u => u.name?.toLowerCase() === HTB_USERNAME.toLowerCase()) || users[0];
        if (!user) throw new Error('user not found');

        const userId = user.id;

        const profileRes = await fetch(
            `https://www.hackthebox.com/api/v4/user/profile/basic/${userId}`,
            { headers: { 'Accept': 'application/json' } }
        );
        if (!profileRes.ok) throw new Error('profile failed');
        const profileData = await profileRes.json();
        const profile = profileData?.profile || profileData;

        renderHtbStats(container, profile, HTB_USERNAME, userId);
    } catch (err) {
        renderHtbFallback(container, HTB_USERNAME);
    }
}

function renderHtbStats(container, profile, username, userId) {
    const name = profile?.name || username;
    const rank = profile?.rank || profile?.ranking || '—';
    const points = profile?.points ?? '—';
    const userOwns = profile?.system_owns ?? profile?.user_owns ?? '—';
    const rootOwns = profile?.system_owns ?? profile?.root_owns ?? '—';
    const challengeSolves = profile?.challenge_owns ?? '—';
    const globalRank = profile?.global_rank ?? '—';
    const avatar = profile?.avatar ? `https://www.hackthebox.com${profile.avatar}` : null;

    const avatarHtml = avatar
        ? `<img src="${avatar}" alt="${name}" class="htb-avatar" onerror="this.outerHTML='<div class=\'htb-avatar-placeholder\'><i class=\'fas fa-user\'></i></div>'">`
        : `<div class="htb-avatar-placeholder"><i class="fas fa-user"></i></div>`;

    const machineOwns = profile?.system_owns ?? (
        (profile?.user_owns !== undefined && profile?.root_owns !== undefined)
            ? `${profile.user_owns}u / ${profile.root_owns}r`
            : '—'
    );

    const stats = [
        { icon: 'fa-trophy', value: rank, label: 'Rank' },
        { icon: 'fa-star', value: points, label: 'Points' },
        { icon: 'fa-server', value: machineOwns, label: 'Machines Owned' },
        { icon: 'fa-flag', value: challengeSolves, label: 'Challenges' },
        { icon: 'fa-globe', value: globalRank !== '—' ? `#${globalRank}` : '—', label: 'Global Rank' },
    ];

    container.innerHTML = `
        <div class="htb-profile-card">
            ${avatarHtml}
            <div class="htb-profile-info">
                <div class="htb-username">${name}</div>
                <div class="htb-rank-badge">${rank}</div>
            </div>
            <a href="https://app.hackthebox.com/users/${userId}" target="_blank" rel="noopener noreferrer" class="htb-profile-link">
                View Profile <i class="fas fa-arrow-right"></i>
            </a>
        </div>
        <div class="htb-stats-grid">
            ${stats.map(s => `
                <div class="htb-stat-card">
                    <div class="htb-stat-icon"><i class="fas ${s.icon}"></i></div>
                    <div class="htb-stat-value">${s.value}</div>
                    <div class="htb-stat-label">${s.label}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderHtbFallback(container, username) {
    container.innerHTML = `
        <div class="htb-error">
            <div class="htb-avatar-placeholder" style="margin: 0 auto 1.5rem;"><i class="fas fa-terminal"></i></div>
            <p style="font-size:1.1rem; margin-bottom:1rem;">Stats couldn't be loaded live due to browser restrictions.</p>
            <a href="https://app.hackthebox.com/profile/${username}" target="_blank" rel="noopener noreferrer" class="htb-profile-link" style="display:inline-flex; margin-top:0.5rem;">
                View Profile on HackTheBox <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadHtbStats);

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and skill cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-card, .stat-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== PREVENT ANIMATIONS ON PAGE LOAD =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
