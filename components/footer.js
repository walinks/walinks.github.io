/* ============================================
   Footer Component
   ============================================ */

const Footer = (() => {
  const YEAR = new Date().getFullYear();

  const LINKS = {
    Tool: [
      { label: 'WA Link Generator', href: '#generator' },
      { label: 'Bulk Link Creator',  href: '#generator' },
      { label: 'QR Code Generator', href: '#generator' },
      { label: 'Link Preview',       href: '#generator' },
    ],
    Resources: [
      { label: 'How It Works',    href: '#how-it-works' },
      { label: 'Use Cases',       href: '#use-cases'    },
      { label: 'FAQ',             href: '#faq'          },
      { label: 'WhatsApp Formats', href: '#formats'     },
    ],
    Company: [
      { label: 'About',       href: '#about'   },
      { label: 'Privacy Policy', href: '#'     },
      { label: 'Terms of Use',   href: '#'     },
      { label: 'Contact',        href: '#'     },
    ],
  };

  function render() {
    return `
<footer class="site-footer" id="site-footer" role="contentinfo">
  <div class="footer-inner container">

    <div class="footer-brand">
      <a class="footer-logo" href="/" aria-label="WALink Generator">
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
      <p class="footer-desc">
        The most powerful free WhatsApp link generator. Create click-to-chat links instantly — no sign-up, no limits.
      </p>
      <div class="footer-badges">
        <span class="chip">✓ 100% Free</span>
        <span class="chip">✓ No Sign-Up</span>
        <span class="chip">✓ Privacy Safe</span>
      </div>
    </div>

    <nav class="footer-nav" aria-label="Footer navigation">
      ${Object.entries(LINKS).map(([group, items]) => `
        <div class="footer-col">
          <p class="footer-col-title">${group}</p>
          <ul>
            ${items.map(l => `<li><a class="footer-link" href="${l.href}">${l.label}</a></li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </nav>

  </div>

  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p class="footer-copy">
        &copy; ${YEAR} <strong>WALink Generator</strong> — whatsapplinks.github.io. All rights reserved.
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
