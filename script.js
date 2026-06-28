// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Stagger siblings
document.querySelectorAll('.skill-row, .project-row, .contact-link').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
});

// ===== MOBILE MENU =====
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

const burgerStyle = document.createElement('style');
burgerStyle.textContent = `
    .nav-burger.active span:nth-child(1) {
        transform: translateY(6.5px) rotate(45deg);
    }
    .nav-burger.active span:nth-child(2) {
        transform: translateY(-6.5px) rotate(-45deg);
    }
`;
document.head.appendChild(burgerStyle);

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.pageYOffset >= sec.offsetTop - 200) {
            current = sec.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? '#0a0a0a' : '';
    });
}, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PAGE FADE IN =====
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
});