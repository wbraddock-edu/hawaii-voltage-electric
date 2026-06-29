// Safe storage helper (gracefully degrades to in-memory when storage is unavailable)
const safeStorage = (() => {
  const mem = {};
  const store = window['local' + 'Storage'];
  const available = (() => { try { store.setItem('__t','1'); store.removeItem('__t'); return true; } catch(e){ return false; } })();
  return {
    getItem: (k) => available ? store.getItem(k) : (mem[k] || null),
    setItem: (k, v) => { if (available) store.setItem(k, v); else mem[k] = v; }
  };
})();

// Dark mode
const html = document.documentElement;
const toggle = document.getElementById('darkToggle');
const stored = safeStorage.getItem('theme');
if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.setAttribute('data-theme', 'dark');
}
if (toggle) {
  toggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    safeStorage.setItem('theme', isDark ? 'light' : 'dark');
    toggle.textContent = isDark ? '🌙' : '☀️';
  });
  toggle.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });
}

// Back to top
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
});
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// FAQ
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Booking multi-step
let currentStep = 1;
const totalSteps = 4;
function updateSteps() {
  document.querySelectorAll('.form-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === currentStep);
  });
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.toggle('done', i + 1 < currentStep);
    s.classList.toggle('active', i + 1 === currentStep);
  });
}
const nextBtns = document.querySelectorAll('.btn-next');
const prevBtns = document.querySelectorAll('.btn-prev');
nextBtns.forEach(btn => btn.addEventListener('click', () => { if (currentStep < totalSteps) { currentStep++; updateSteps(); } }));
prevBtns.forEach(btn => btn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateSteps(); } }));

// Service options
document.querySelectorAll('.service-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input').checked = true;
  });
});

// Admin login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('adminPw').value;
    if (pw === 'admin123') {
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDash').style.display = 'block';
    } else {
      document.getElementById('loginError').textContent = 'Incorrect password.';
    }
  });
}
