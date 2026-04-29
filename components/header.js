/* ============================================
   Header Component
   ============================================ */

const Header = (() => {
  const NAV_LINKS = [
    { label: 'Generator',  href: '#generator' },
    { label: 'Features',   href: '#features'  },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases',  href: '#use-cases'  },
    { label: 'FAQ',        href: '#faq'        },
  ];

  function render() {
    return `
<header class="site-header" id="site-header" role="banner">
  <div class="header-inner container">
    <a class="header-logo" href="/" aria-label="WhatsApp Link Generator Home">
      <span class="logo-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="20" fill="white"/>
  <text 
    x="50%" 
    y="50%" 
    text-anchor="middle" 
    fill="#25D366" 
    font-size="16" 
    font-family="Arial, sans-serif" 
    font-weight="bold" 
    dy=".3em">
    WA
  </text>
</svg>

      </span>
      <span class="logo-text">
        <span class="logo-name">WA Link</span>
        <span class="logo-tag">Generator</span>
      </span>
    </a>

    <nav class="header-nav" id="header-nav" aria-label="Main navigation">
      <ul class="nav-list">
        ${NAV_LINKS.map(l => `
          <li><a class="nav-link" href="${l.href}">${l.label}</a></li>
        `).join('')}
      </ul>
    </nav>

    <div class="header-actions">
      <a href="#generator" class="btn btn--primary btn--sm header-cta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Create Link
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="header-nav">
        <span class="hamburger" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
      </button>
    </div>
  </div>
</header>
<div class="nav-overlay" id="nav-overlay"></div>`;
  }

  function init() {
    const header   = document.getElementById('site-header');
    const toggle   = document.getElementById('nav-toggle');
    const nav      = document.getElementById('header-nav');
    const overlay  = document.getElementById('nav-overlay');

    // Scroll shrink
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile toggle
    function openMenu() {
      nav.classList.add('open');
      overlay.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      nav.classList.remove('open');
      overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const links    = nav.querySelectorAll('.nav-link');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  function mount(selector = '#header-root') {
    const root = document.querySelector(selector);
    if (!root) return;
    root.innerHTML = render();
    init();
  }

  return { mount };
})();
