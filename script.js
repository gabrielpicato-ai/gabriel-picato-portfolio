// --- Tailwind configuration ---
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
          mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
        },
        colors: {
          apple: {
            bg: '#000000',
            card: 'rgba(255, 255, 255, 0.04)',
            glass: 'rgba(25, 25, 28, 0.58)',
            border: 'rgba(255, 255, 255, 0.1)',
            borderHover: 'rgba(255, 255, 255, 0.25)',
            text: '#f5f5f7',
            muted: '#86868b',
            subtle: '#6e6e73'
          }
        }
      }
    }
  };
}

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

function toggleMenu() {
  if (!mobileMenuBtn || !mobileMenu) return;

  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    mobileMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    mobileMenuBtn.children[0].classList.add('rotate-45', 'translate-y-[3.5px]');
    mobileMenuBtn.children[1].classList.add('-rotate-45', '-translate-y-[3.5px]');
  } else {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    mobileMenuBtn.children[0].classList.remove('rotate-45', 'translate-y-[3.5px]');
    mobileMenuBtn.children[1].classList.remove('-rotate-45', '-translate-y-[3.5px]');
  }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (isMenuOpen) toggleMenu();
  });
});

// --- Real PDF Credential Tab Switcher ---
const documentFiles = {
  'resume': {
    title: 'Picato-Resume.pdf',
    view: 'doc-resume-view',
    button: 'tab-btn-resume'
  },
  'ats-resume': {
    title: 'Picato-ATS-Friendly-Resume.pdf',
    view: 'doc-ats-resume-view',
    button: 'tab-btn-ats-resume'
  },
  'letter': {
    title: 'Picato-Application-Letter.pdf',
    view: 'doc-letter-view',
    button: 'tab-btn-letter'
  }
};

function switchDocument(type) {
  const selected = documentFiles[type] || documentFiles.resume;
  const views = ['doc-resume-view', 'doc-ats-resume-view', 'doc-letter-view'];
  const buttons = ['tab-btn-resume', 'tab-btn-ats-resume', 'tab-btn-letter'];
  const activeTitle = document.getElementById('doc-active-title');
  const openLink = document.getElementById('doc-open-link');
  const downloadLink = document.getElementById('doc-download-link');

  views.forEach(id => {
    const view = document.getElementById(id);
    if (view) view.classList.toggle('hidden', id !== selected.view);
  });

  buttons.forEach(id => {
    const button = document.getElementById(id);
    if (!button) return;
    const active = id === selected.button;
    button.className = active
      ? 'px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all bg-white text-black shadow-sm'
      : 'px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all text-[#86868b] hover:text-white';
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  if (activeTitle) activeTitle.textContent = selected.title;
  if (openLink) openLink.href = selected.title;
  if (downloadLink) downloadLink.href = selected.title;
}

// Keep these functions for compatibility with any existing buttons/scripts.
function copyDocumentText() {
  const activeView = document.querySelector('.document-frame:not(.hidden) iframe');
  if (!activeView) return;
  showStatusNotification('The actual PDF is displayed above. Use the PDF viewer to select and copy text.');
}

function printDocument() {
  const activeView = document.querySelector('.document-frame:not(.hidden) iframe');
  if (activeView && activeView.contentWindow) {
    activeView.contentWindow.print();
  } else {
    window.print();
  }
}

// --- Contact Form ---
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('form-name')?.value.trim() || '';
  const email = document.getElementById('form-email')?.value.trim() || '';
  const subject = document.getElementById('form-subject')?.value.trim() || 'Portfolio Inquiry';
  const message = document.getElementById('form-message')?.value.trim() || '';
  const statusBox = document.getElementById('form-status');

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:gabrielpicatoo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (statusBox) {
    statusBox.textContent = 'Opening your email client...';
    statusBox.classList.remove('hidden');
  }

  window.location.href = mailto;
}

function showStatusNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 liquid-glass px-4 py-2.5 rounded-full text-xs font-mono text-white border border-white/20 shadow-xl transition-opacity duration-300';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// --- Staggered Scroll Reveal Observer ---
if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-delay-element').forEach(el => fadeObserver.observe(el));
}

// --- Animated Background Canvas ---
const canvas = document.getElementById('grainient-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let time = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function renderGrainient() {
    time += 0.004;
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const minDim = Math.min(width, height);

    const points = [
      { x: cx + Math.sin(time * 0.9) * (width * 0.28), y: cy + Math.cos(time * 0.7) * (height * 0.25), color: '239, 68, 68', alpha: 0.42 },
      { x: cx + Math.cos(time * 1.1 + 1.5) * (width * 0.32), y: cy + Math.sin(time * 0.85 + 2.0) * (height * 0.28), color: '249, 115, 22', alpha: 0.45 },
      { x: cx + Math.sin(time * 0.65 + 3.2) * (width * 0.3), y: cy + Math.cos(time * 1.05 + 1.2) * (height * 0.3), color: '234, 179, 8', alpha: 0.35 }
    ];

    points.forEach(point => {
      const gradient = ctx.createRadialGradient(point.x, point.y, 10, point.x, point.y, minDim * 0.65);
      gradient.addColorStop(0, `rgba(${point.color}, ${point.alpha})`);
      gradient.addColorStop(0.5, `rgba(${point.color}, 0.1)`);
      gradient.addColorStop(1, `rgba(${point.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

    requestAnimationFrame(renderGrainient);
  }

  window.addEventListener('load', renderGrainient, { once: true });
}
