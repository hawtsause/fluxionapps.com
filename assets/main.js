// ── ROOT PATH DETECTION ───────────────────────────────
(function() {
  const path = window.location.pathname;
  const segments = path.replace(/\/$/, '').split('/').filter(Boolean);
  window.__DEPTH = segments.length;
  window.__ROOT = segments.length <= 1 ? './' : '../';
})();

// ── HELPERS ───────────────────────────────────────────
function buildNavHref(slug) {
  const root = window.__ROOT;
  return slug === '' ? root : root + slug + '/';
}

// ── LOGO SVG ──────────────────────────────────────────
const LOGO_SVG = `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" stroke="url(#hlg1)" stroke-width="1.5"/>
  <ellipse cx="18" cy="18" rx="17" ry="7" stroke="url(#hlg2)" stroke-width="1.5" transform="rotate(-35 18 18)"/>
  <ellipse cx="18" cy="18" rx="17" ry="7" stroke="url(#hlg3)" stroke-width="1.5" transform="rotate(35 18 18)"/>
  <circle cx="18" cy="18" r="3" fill="url(#hlg1)"/>
  <defs>
    <linearGradient id="hlg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00f0ff"/><stop offset="1" stop-color="#7b61ff"/>
    </linearGradient>
    <linearGradient id="hlg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7b61ff"/><stop offset="1" stop-color="#ff3cac"/>
    </linearGradient>
    <linearGradient id="hlg3" x1="36" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00f0ff"/><stop offset="1" stop-color="#ff3cac"/>
    </linearGradient>
  </defs>
</svg>`;

const NAV_ITEMS = [
  { num: '01', label: 'Home',                   slug: '' },
  { num: '02', label: 'Contacts',               slug: 'contacts' },
  { num: '03', label: 'Mobile App Development', slug: 'mobile' },
  { num: '04', label: 'TV App Development',     slug: 'tv' },
  { num: '05', label: 'App Design',             slug: 'design' },
  { num: '06', label: 'ASO & Promotion',        slug: 'aso' },
  { num: '07', label: 'Careers',                slug: 'careers' },
  { num: '08', label: 'Privacy Policy',         slug: 'policy' },
];

// ── INJECT HEADER ─────────────────────────────────────
function injectHeader() {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <a href="${buildNavHref('')}" class="header-logo">
      <div class="logo-mark">${LOGO_SVG}</div>
      FLUXION LABS
    </a>
    <div class="header-right">
      <button class="btn-apply" onclick="openModal()">Get a Quote</button>
      <span class="sections-label">Sections</span>
      <div class="burger" onclick="openNav()" aria-label="Open menu">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  document.body.prepend(header);
}

// ── INJECT NAV DRAWER ─────────────────────────────────
function injectNav() {
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.onclick = closeNav;

  const drawer = document.createElement('nav');
  drawer.className = 'nav-drawer';

  const currentSlug = (function() {
    const parts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (!parts.length) return '';
    const last = parts[parts.length - 1];
    return last === 'index.html' ? '' : last;
  })();

  const linksHTML = NAV_ITEMS.map(item => {
    const isActive = item.slug === currentSlug;
    return `<li><a href="${buildNavHref(item.slug)}" class="${isActive ? 'active' : ''}">
      <span class="nav-num">${item.num}</span>${item.label}
    </a></li>`;
  }).join('');

  drawer.innerHTML = `
    <div class="nav-close" onclick="closeNav()" role="button" aria-label="Close">✕</div>
    <div class="nav-title">Navigation</div>
    <ul class="nav-links">${linksHTML}</ul>`;

  document.body.append(overlay, drawer);
  window._navOverlay = overlay;
  window._navDrawer = drawer;
}

function openNav() {
  window._navOverlay.classList.add('open');
  window._navDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  window._navOverlay.classList.remove('open');
  window._navDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

// ── INJECT MODAL ──────────────────────────────────────
function injectModal() {
  const el = document.createElement('div');
  el.className = 'modal-overlay';
  el.id = 'modal';
  el.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-close" onclick="closeModal()">✕</div>
      <h2>Get a Quote</h2>
      <p class="sub">Tell us about your project — we'll respond within 24 hours.</p>
      <div class="form-group">
        <label>Name</label>
        <input type="text" placeholder="Your name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="your@email.com" />
      </div>
      <div class="form-group">
        <label>Comment</label>
        <textarea placeholder="Tell us about your project..."></textarea>
      </div>
      <button class="btn-submit" onclick="handleSubmit(this)">Send</button>
      <p class="modal-note">By submitting you agree to processing of personal data per our <a href="${buildNavHref('policy')}">Privacy Policy</a>.</p>
    </div>`;
  el.addEventListener('click', e => { if (e.target === el) closeModal(); });
  document.body.append(el);
}

function openModal() {
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
function handleSubmit(btn) {
  btn.textContent = 'Sent! ✓';
  btn.style.background = 'linear-gradient(135deg,#00b894,#00cec9)';
  setTimeout(closeModal, 1600);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeNav(); }
});

// ── INJECT FOOTER ─────────────────────────────────────
function injectFooter() {
  const year = new Date().getFullYear();
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <div class="footer-col-title">Legal Entity</div>
        <div class="footer-legal">
          <p>FLUXION LABS LTD<br>6 Gerrards Gardens<br>HYDE, SK14 5SH<br>United Kingdom<br><br>
          <a href="mailto:info@fluxionapps.com" style="color:var(--accent)">info@fluxionapps.com</a></p>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Services</div>
        <ul class="footer-links">
          <li><a href="${buildNavHref('mobile')}">iOS App Development</a></li>
          <li><a href="${buildNavHref('mobile')}">Android App Development</a></li>
          <li><a href="${buildNavHref('design')}">App Design</a></li>
          <li><a href="${buildNavHref('aso')}">ASO &amp; Promotion</a></li>
          <li><a href="${buildNavHref('tv')}">TV App Development</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="${buildNavHref('')}">Home</a></li>
          <li><a href="${buildNavHref('contacts')}">Contacts</a></li>
          <li><a href="${buildNavHref('careers')}">Careers</a></li>
          <li><a href="${buildNavHref('policy')}">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>FLUXION LABS LTD &copy; ${year}. All rights reserved.</span>
      <span>Registered in England &amp; Wales</span>
    </div>`;
  document.body.append(footer);
}

// ── REVEAL ON SCROLL ──────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

// ── SNAKE TRAILS ──────────────────────────────────────
function initSnakes() {
  const canvas = document.createElement('canvas');
  canvas.className = 'snake-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#00f0ff','#7b61ff','#ff3cac','#00f0ff'];

  class Snake {
    constructor(ci) { this.color = COLORS[ci % COLORS.length]; this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random()-.5)*.7; this.vy = (Math.random()-.5)*.7;
      this.points = []; this.len = 100 + Math.random()*100;
    }
    update() {
      this.vx += (Math.random()-.5)*.06; this.vy += (Math.random()-.5)*.06;
      const s = Math.hypot(this.vx,this.vy);
      if (s>1.3){ this.vx=(this.vx/s)*1.3; this.vy=(this.vy/s)*1.3; }
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<-100||this.x>W+100||this.y<-100||this.y>H+100) this.reset();
      this.points.push({x:this.x,y:this.y});
      if(this.points.length>this.len) this.points.shift();
    }
    draw() {
      if(this.points.length<2) return;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x,this.points[0].y);
      for(let i=1;i<this.points.length;i++) ctx.lineTo(this.points[i].x,this.points[i].y);
      try {
        const g=ctx.createLinearGradient(this.points[0].x,this.points[0].y,this.points[this.points.length-1].x,this.points[this.points.length-1].y);
        g.addColorStop(0,'transparent'); g.addColorStop(1,this.color);
        ctx.strokeStyle=g;
      } catch(e){ ctx.strokeStyle=this.color; }
      ctx.lineWidth=1.5; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
    }
  }

  const snakes = [new Snake(0),new Snake(1),new Snake(2),new Snake(3)];
  let raf;
  function loop() {
    ctx.clearRect(0,0,W,H);
    snakes.forEach(s=>{s.update();s.draw();});
    raf = requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else loop(); });
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectNav();
  injectModal();
  injectFooter();
  initReveal();
  initSnakes();
});
