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
          <circle cx="20" cy="20" r="20" fill="#25D366"/>
          <path d="M20 8C13.373 8 8 13.373 8 20c0 2.115.553 4.1 1.52 5.822L8 32l6.332-1.493A11.91 11.91 0 0020 32c6.627 0 12-5.373 12-12S26.627 8 20 8zm0 21.818a9.762 9.762 0 01-4.97-1.361l-.356-.212-3.756.985 1.002-3.653-.232-.375A9.763 9.763 0 0110.182 20 9.818 9.818 0 1120 29.818zm5.387-7.346c-.295-.148-1.745-.861-2.016-.96-.271-.098-.468-.148-.664.149-.197.296-.762.96-.934 1.157-.172.197-.344.222-.639.074-.295-.148-1.246-.459-2.374-1.464-.877-.782-1.47-1.748-1.641-2.044-.172-.295-.018-.455.129-.601.132-.132.295-.344.443-.517.148-.172.197-.295.295-.492.099-.197.05-.37-.025-.517-.074-.148-.664-1.6-.91-2.19-.24-.577-.483-.499-.664-.508l-.566-.01c-.197 0-.517.074-.787.37-.271.296-1.033 1.01-1.033 2.462 0 1.452 1.058 2.855 1.206 3.052.148.197 2.083 3.18 5.046 4.461.706.305 1.256.487 1.684.623.708.225 1.352.193 1.861.117.568-.084 1.745-.714 1.991-1.403.246-.689.246-1.28.172-1.403-.073-.124-.27-.197-.566-.345z" fill="white"/>
        </svg>
      </span>
      <span class="logo-text">
        <span class="logo-name">WALink</span>
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
