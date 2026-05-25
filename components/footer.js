/* ============================================
   Footer Component — Fixed Grid Layout
   ============================================ */

const Footer = (() => {
  const YEAR = new Date().getFullYear();

  const LINKS = {
    Tool: [
      { label: 'WA Link Generator', href: '/#generator' },
      { label: 'Bulk Link Creator',  href: '/#generator' },
      { label: 'QR Code Generator', href: '/#generator' },
      { label: 'Link Preview',       href: '/#generator' },
    ],
    Resources: [
      { label: 'How It Works',    href: '/#how-it-works' },
      { label: 'Use Cases',       href: '/#use-cases'    },
      { label: 'FAQ',             href: '/#faq'          },
      { label: 'WhatsApp Formats', href: '/#formats'     },
      { label: 'WhatsApp Groups', href: '/whatsapp-groups'     },
    ],
    Company: [
      { label: 'About',       href: '/about'   },
      { label: 'Privacy Policy', href: '/privacy'     },
      { label: 'Terms of Use',   href: '/terms'     },
      { label: 'Contact',        href: '/contact'     },
      { label: 'Disclaimer',        href: '/disclaimer'     },
    ],
  };

  function render() {
    return `
<footer class="site-footer" id="site-footer" role="contentinfo">
  <div class="footer-inner container">

    <!-- Column 1: Brand Info (Uses 1.8fr space) -->
    <div class="footer-brand">
      <a class="footer-logo" href="/" aria-label="WALink Generator">
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
      <p class="footer-desc">
        The most powerful free WhatsApp link generator. Create click-to-chat links instantly — no sign-up, no limits.
      </p>
      <div class="footer-badges">
        <span class="chip">✓ 100% Free</span>
        <span class="chip">✓ No Sign-Up</span>
        <span class="chip">✓ Privacy Safe</span>
      </div>
    </div>

    <!-- Columns 2, 3, & 4: Link Groups (Direct children for horizontal grid layout) -->
    ${Object.entries(LINKS).map(([group, items]) => `
      <div class="footer-col">
        <p class="footer-col-title">${group}</p>
        <ul>
          ${items.map(l => `<li><a class="footer-link" href="${l.href}">${l.label}</a></li>`).join('')}
        </ul>
      </div>
    `).join('')}

  </div>

  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p class="footer-copy">
        &copy; ${YEAR} <strong>WALink Generator</strong> — walinks.github.io. All rights reserved.
      </p>
      <p class="footer-disclaimer">
        Not affiliated with WhatsApp LLC or Meta Platforms, Inc.
      </p>
    </div>
  </div>
</footer>`;
  }

  function mount(selector = '#footer-root') {
    const root = document.querySelector(selector);
    if (!root) return;
    root.innerHTML = render();
  }

  return { mount };
})();
