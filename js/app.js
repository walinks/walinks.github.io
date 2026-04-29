/* ============================================
   WhatsApp Link Generator — Main App JS
   ============================================ */

'use strict';

/* ── Toast ── */
const Toast = {
  show(msg, type = 'success', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
      error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    };
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `${icons[type] || icons.info} <span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = '.3s ease';
      setTimeout(() => el.remove(), 350);
    }, duration);
  }
};

/* ── Phone Formatter ── */
function sanitizePhone(raw) {
  return raw.replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/\D/g, '');
}

/* ── Build WA URL ── */
function buildWAUrl(phone, message = '') {
  const cleaned = sanitizePhone(phone);
  const base = `https://wa.me/${cleaned}`;
  if (!message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/* ── Copy to clipboard ── */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return true;
  }
}

/* ── QR Code Generator (pure SVG, no external lib needed for simple QR) ── */
/* Using a CDN-based QR lib loaded in HTML */
function generateQR(url, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof QRCode === 'undefined') return;
  canvas.innerHTML = '';
  new QRCode(canvas, {
    text: url,
    width: 200,
    height: 200,
    colorDark: '#0D1F17',
    colorLight: '#FFFFFF',
    correctLevel: QRCode.CorrectLevel.H,
  });
}

/* ── Link History (localStorage) ── */
const History = {
  KEY: 'walink_history',
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; }
  },
  add(entry) {
    const hist = this.get();
    hist.unshift({ ...entry, id: Date.now(), ts: new Date().toISOString() });
    localStorage.setItem(this.KEY, JSON.stringify(hist.slice(0, 20)));
  },
  clear() { localStorage.removeItem(this.KEY); },
  remove(id) {
    const hist = this.get().filter(h => h.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(hist));
  },
};

/* ── Country Codes Data ── */
const COUNTRIES = [
  { code: '1',   flag: '🇺🇸', name: 'United States'   },
  { code: '44',  flag: '🇬🇧', name: 'United Kingdom'   },
  { code: '91',  flag: '🇮🇳', name: 'India'            },
  { code: '92',  flag: '🇵🇰', name: 'Pakistan'         },
  { code: '971', flag: '🇦🇪', name: 'UAE'              },
  { code: '966', flag: '🇸🇦', name: 'Saudi Arabia'     },
  { code: '20',  flag: '🇪🇬', name: 'Egypt'            },
  { code: '234', flag: '🇳🇬', name: 'Nigeria'          },
  { code: '55',  flag: '🇧🇷', name: 'Brazil'           },
  { code: '49',  flag: '🇩🇪', name: 'Germany'          },
  { code: '33',  flag: '🇫🇷', name: 'France'           },
  { code: '39',  flag: '🇮🇹', name: 'Italy'            },
  { code: '34',  flag: '🇪🇸', name: 'Spain'            },
  { code: '7',   flag: '🇷🇺', name: 'Russia'           },
  { code: '86',  flag: '🇨🇳', name: 'China'            },
  { code: '81',  flag: '🇯🇵', name: 'Japan'            },
  { code: '82',  flag: '🇰🇷', name: 'South Korea'      },
  { code: '62',  flag: '🇮🇩', name: 'Indonesia'        },
  { code: '60',  flag: '🇲🇾', name: 'Malaysia'         },
  { code: '65',  flag: '🇸🇬', name: 'Singapore'        },
  { code: '63',  flag: '🇵🇭', name: 'Philippines'      },
  { code: '66',  flag: '🇹🇭', name: 'Thailand'         },
  { code: '84',  flag: '🇻🇳', name: 'Vietnam'          },
  { code: '880', flag: '🇧🇩', name: 'Bangladesh'       },
  { code: '94',  flag: '🇱🇰', name: 'Sri Lanka'        },
  { code: '90',  flag: '🇹🇷', name: 'Turkey'           },
  { code: '98',  flag: '🇮🇷', name: 'Iran'             },
  { code: '964', flag: '🇮🇶', name: 'Iraq'             },
  { code: '962', flag: '🇯🇴', name: 'Jordan'           },
  { code: '961', flag: '🇱🇧', name: 'Lebanon'          },
  { code: '212', flag: '🇲🇦', name: 'Morocco'          },
  { code: '216', flag: '🇹🇳', name: 'Tunisia'          },
  { code: '213', flag: '🇩🇿', name: 'Algeria'          },
  { code: '27',  flag: '🇿🇦', name: 'South Africa'     },
  { code: '254', flag: '🇰🇪', name: 'Kenya'            },
  { code: '256', flag: '🇺🇬', name: 'Uganda'           },
  { code: '255', flag: '🇹🇿', name: 'Tanzania'         },
  { code: '233', flag: '🇬🇭', name: 'Ghana'            },
  { code: '52',  flag: '🇲🇽', name: 'Mexico'           },
  { code: '54',  flag: '🇦🇷', name: 'Argentina'        },
  { code: '56',  flag: '🇨🇱', name: 'Chile'            },
  { code: '57',  flag: '🇨🇴', name: 'Colombia'         },
  { code: '51',  flag: '🇵🇪', name: 'Peru'             },
  { code: '58',  flag: '🇻🇪', name: 'Venezuela'        },
  { code: '61',  flag: '🇦🇺', name: 'Australia'        },
  { code: '64',  flag: '🇳🇿', name: 'New Zealand'      },
  { code: '31',  flag: '🇳🇱', name: 'Netherlands'      },
  { code: '32',  flag: '🇧🇪', name: 'Belgium'          },
  { code: '41',  flag: '🇨🇭', name: 'Switzerland'      },
  { code: '46',  flag: '🇸🇪', name: 'Sweden'           },
  { code: '47',  flag: '🇳🇴', name: 'Norway'           },
  { code: '45',  flag: '🇩🇰', name: 'Denmark'          },
  { code: '358', flag: '🇫🇮', name: 'Finland'          },
  { code: '48',  flag: '🇵🇱', name: 'Poland'           },
  { code: '1',   flag: '🇨🇦', name: 'Canada'           },
];

/* ── Message Templates ── */
const TEMPLATES = {
  business: [
    { label: 'General Inquiry',    text: "Hello! I'd like to know more about your services. Could you please help me?" },
    { label: 'Appointment',        text: "Hi! I'd like to schedule an appointment. What slots are available?" },
    { label: 'Order Follow-up',    text: "Hello, I'm following up on my order. Could you provide an update?" },
    { label: 'Product Question',   text: "Hi! I have a question about one of your products. Can you help?" },
    { label: 'Pricing',            text: "Hello! Could you share your pricing details for [service/product]?" },
    { label: 'Support Request',    text: "Hi, I need assistance with [issue]. Could someone help me?" },
  ],
  ecommerce: [
    { label: 'Buy Now',            text: "Hi! I'm interested in purchasing [product]. Is it available?" },
    { label: 'Shipping Info',      text: "Hello! What are your shipping options and estimated delivery times?" },
    { label: 'Return Policy',      text: "Hi! Could you explain your return and refund policy?" },
    { label: 'Bulk Order',         text: "Hello! I'd like to place a bulk order. What discounts do you offer?" },
  ],
  personal: [
    { label: 'Hey there!',         text: "Hey! How are you doing? Let's catch up soon! 😊" },
    { label: 'Invitation',         text: "Hi! You're invited to [event]. Hope to see you there!" },
    { label: 'Quick Check-in',     text: "Just checking in — hope everything is going well! 👋" },
  ],
};

/* ── Message Character Counter ── */
function updateCharCount(textarea, countEl) {
  const len = textarea.value.length;
  countEl.textContent = `${len} / 4096 chars`;
  countEl.style.color = len > 3800 ? '#D93025' : 'var(--ink-mute)';
}

/* ── Populate Country Select ── */
function buildCountrySelect(selectEl) {
  const opts = COUNTRIES.map(c =>
    `<option value="${c.code}">${c.flag} +${c.code} — ${c.name}</option>`
  ).join('');
  selectEl.innerHTML = `<option value="">Select country code…</option>${opts}`;
}

/* ── Generator Core ── */
const Generator = {
  currentUrl: '',

  init() {
    this.bindTabs();
    this.bindSingle();
    this.bindBulk();
    this.bindTemplates();
    this.renderHistory();
  },

  /* Tabs */
  bindTabs() {
    document.querySelectorAll('.gen-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.gen-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.gen-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.getElementById(`panel-${target}`)?.classList.add('active');
      });
    });
  },

  /* Single Generator */
  bindSingle() {
    const form       = document.getElementById('gen-form-single');
    const countryEl  = document.getElementById('gen-country');
    const phoneEl    = document.getElementById('gen-phone');
    const msgEl      = document.getElementById('gen-message');
    const countEl    = document.getElementById('gen-char-count');
    const resultBox  = document.getElementById('gen-result');
    const urlEl      = document.getElementById('gen-url-output');
    const copyBtn    = document.getElementById('gen-copy-btn');
    const openBtn    = document.getElementById('gen-open-btn');
    const qrBtn      = document.getElementById('gen-qr-btn');
    const qrBox      = document.getElementById('gen-qr-box');
    const qrEl       = document.getElementById('gen-qr-canvas');
    const dlQrBtn    = document.getElementById('gen-qr-dl');

    if (countryEl) buildCountrySelect(countryEl);
    if (msgEl && countEl) {
      msgEl.addEventListener('input', () => updateCharCount(msgEl, countEl));
    }

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const country = countryEl?.value || '';
        const phone   = phoneEl?.value?.trim() || '';
        const msg     = msgEl?.value?.trim() || '';

        if (!phone) {
          Toast.show('Please enter a phone number.', 'error');
          phoneEl.focus();
          return;
        }

        const fullPhone = country ? country + phone.replace(/^0+/, '') : phone;
        const url = buildWAUrl(fullPhone, msg);
        this.currentUrl = url;

        if (urlEl)   urlEl.value = url;
        if (resultBox) resultBox.classList.remove('hidden');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Save to history
        History.add({ phone: fullPhone, url, message: msg, country });
        this.renderHistory();

        Toast.show('WhatsApp link created! 🎉', 'success');
      });
    }

    // Copy
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (!this.currentUrl) return;
        await copyText(this.currentUrl);
        Toast.show('Link copied to clipboard!', 'success');
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copied!`;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Link`;
        }, 2500);
      });
    }

    // Open WA
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (!this.currentUrl) return;
        window.open(this.currentUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // QR
    if (qrBtn) {
      qrBtn.addEventListener('click', () => {
        if (!this.currentUrl) return;
        qrBox.classList.toggle('hidden');
        if (!qrBox.classList.contains('hidden')) {
          generateQR(this.currentUrl, 'gen-qr-canvas');
        }
      });
    }

    // Download QR
    if (dlQrBtn && qrEl) {
      dlQrBtn.addEventListener('click', () => {
        const img = qrEl.querySelector('img');
        if (!img) return;
        const a = document.createElement('a');
        a.href = img.src;
        a.download = 'walink-qr.png';
        a.click();
      });
    }

    // URL field click to select all
    if (urlEl) {
      urlEl.addEventListener('click', () => urlEl.select());
    }
  },

  /* Bulk Generator */
  bindBulk() {
    const textarea  = document.getElementById('bulk-input');
    const genBtn    = document.getElementById('bulk-gen-btn');
    const resultEl  = document.getElementById('bulk-result');
    const copyAllBtn= document.getElementById('bulk-copy-all');
    let bulkLinks   = [];

    if (!genBtn) return;

    genBtn.addEventListener('click', () => {
      const raw = textarea?.value?.trim();
      if (!raw) { Toast.show('Please enter phone numbers.', 'error'); return; }

      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 100) { Toast.show('Maximum 100 numbers at once.', 'error'); return; }

      bulkLinks = lines.map(line => {
        const parts = line.split(',');
        const phone = sanitizePhone(parts[0]);
        const msg   = parts[1]?.trim() || '';
        return { phone, url: buildWAUrl(phone, msg), msg };
      });

      resultEl.innerHTML = '';
      bulkLinks.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'bulk-row';
        row.innerHTML = `
          <span class="bulk-num">${i + 1}</span>
          <span class="bulk-phone">${item.phone || 'Invalid'}</span>
          <a class="bulk-url" href="${item.url}" target="_blank" rel="noopener">${item.url}</a>
          <button class="btn btn--ghost btn--sm bulk-copy" data-url="${item.url}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>`;
        resultEl.appendChild(row);
      });

      resultEl.classList.remove('hidden');
      copyAllBtn?.classList.remove('hidden');
      Toast.show(`${bulkLinks.length} links generated!`, 'success');
    });

    // Copy individual
    resultEl?.addEventListener('click', async e => {
      const btn = e.target.closest('.bulk-copy');
      if (!btn) return;
      await copyText(btn.dataset.url);
      Toast.show('Copied!', 'success');
    });

    // Copy all
    copyAllBtn?.addEventListener('click', async () => {
      const all = bulkLinks.map(b => b.url).join('\n');
      await copyText(all);
      Toast.show('All links copied!', 'success');
    });
  },

  /* Templates */
  bindTemplates() {
    const categoryEl = document.getElementById('tpl-category');
    const listEl     = document.getElementById('tpl-list');
    const msgEl      = document.getElementById('gen-message');

    if (!categoryEl || !listEl) return;

    function renderTemplates(cat) {
      const items = TEMPLATES[cat] || [];
      listEl.innerHTML = items.map((t, i) => `
        <button class="tpl-item" data-text="${encodeURIComponent(t.text)}" data-index="${i}">
          <span class="tpl-label">${t.label}</span>
          <span class="tpl-preview">${t.text.substring(0, 60)}…</span>
        </button>
      `).join('');
    }

    renderTemplates(categoryEl.value || 'business');

    categoryEl.addEventListener('change', () => renderTemplates(categoryEl.value));

    listEl.addEventListener('click', e => {
      const item = e.target.closest('.tpl-item');
      if (!item) return;
      const text = decodeURIComponent(item.dataset.text);
      if (msgEl) {
        msgEl.value = text;
        msgEl.dispatchEvent(new Event('input'));
        // Switch to single tab
        document.querySelector('[data-tab="single"]')?.click();
        msgEl.focus();
        Toast.show('Template applied!', 'info');
      }
      listEl.querySelectorAll('.tpl-item').forEach(b => b.classList.remove('selected'));
      item.classList.add('selected');
    });
  },

  /* History */
  renderHistory() {
    const el = document.getElementById('history-list');
    if (!el) return;
    const hist = History.get();
    if (!hist.length) {
      el.innerHTML = `<p class="history-empty">No links generated yet. Create your first one above!</p>`;
      return;
    }
    el.innerHTML = hist.map(h => `
      <div class="history-item" data-id="${h.id}">
        <div class="history-meta">
          <span class="history-phone">+${h.phone}</span>
          <span class="history-time">${new Date(h.ts).toLocaleString()}</span>
        </div>
        <div class="history-url-row">
          <a class="history-url" href="${h.url}" target="_blank" rel="noopener noreferrer">${h.url}</a>
          <div class="history-actions">
            <button class="btn btn--ghost btn--sm hist-copy" data-url="${h.url}" data-tooltip="Copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="btn btn--ghost btn--sm hist-del" data-id="${h.id}" data-tooltip="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </div>
        ${h.message ? `<p class="history-msg">"${h.message.substring(0, 80)}${h.message.length > 80 ? '…' : ''}"</p>` : ''}
      </div>
    `).join('');

    el.querySelectorAll('.hist-copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        await copyText(btn.dataset.url);
        Toast.show('Copied!', 'success');
      });
    });
    el.querySelectorAll('.hist-del').forEach(btn => {
      btn.addEventListener('click', () => {
        History.remove(parseInt(btn.dataset.id));
        this.renderHistory();
      });
    });
  },
};

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Back to Top ── */
function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ── Stats Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.counter, 10);
      const dur = 1800;
      const step = 16;
      let current = 0;
      const increment = end / (dur / step);
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.round(current).toLocaleString();
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ── Clear History Button ── */
function initClearHistory() {
  document.getElementById('history-clear')?.addEventListener('click', () => {
    if (!confirm('Clear all link history?')) return;
    History.clear();
    Generator.renderHistory();
    Toast.show('History cleared.', 'info');
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  // Mount components
  if (typeof Header !== 'undefined') Header.mount('#header-root');
  if (typeof Footer !== 'undefined') Footer.mount('#footer-root');

  // Init features
  Generator.init();
  initFAQ();
  initBackTop();
  initScrollReveal();
  initCounters();
  initClearHistory();

  // Expose toast globally
  window.Toast = Toast;
});
