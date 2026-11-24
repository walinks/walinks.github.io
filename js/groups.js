/* ============================================
   Group list renderer — shared by every *-whatsapp-groups page
   Data comes from js/groups-data.js (window.WA_GROUPS).
   Markup contract:
     <div class="groups-grid" data-groups="jobs" data-cta="Join Group"></div>
     optional: <button class="cat-btn" data-cat="funny"> filter buttons
               (grids with data-cat-group="pakistan" are rendered as a titled block instead)
   ============================================ */
(function () {
  'use strict';

  const INVITE_RE = /^https:\/\/(chat\.whatsapp\.com\/(?:invite\/)?[A-Za-z0-9_-]{8,}|www\.whatsapp\.com\/channel\/[A-Za-z0-9_-]+)$/;
  const ICON_USERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  const ICON_PLUS  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const ICON_COPY  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg, type) {
    if (window.Toast) window.Toast.show(msg, type || 'success');
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  function card(g, cta) {
    const cleanUrl = String(g.link || '').trim();
    const name = g.name.length > 45 ? g.name.slice(0, 45) + '…' : g.name;
    const short = cleanUrl.replace('https://', '');
    return `
      <div class="group-card" data-name="${esc(g.name.toLowerCase())}">
        <div class="group-name">${ICON_USERS}<span>${esc(name)}</span></div>
        <div class="group-link"><a href="${esc(cleanUrl)}" target="_blank" rel="noopener noreferrer nofollow">${esc(short.length > 40 ? short.slice(0, 40) + '…' : short)}</a></div>
        <a class="join-btn" href="${esc(cleanUrl)}" target="_blank" rel="noopener noreferrer nofollow">${ICON_PLUS}${esc(cta)}</a>
        <button type="button" class="copy-link-btn" data-link="${esc(cleanUrl)}" aria-label="Copy invite link for ${esc(g.name)}">${ICON_COPY} Copy link</button>
      </div>`;
  }

  function mount(grid) {
    const key = grid.dataset.groups;
    const rawList = ((window.WA_GROUPS || {})[key] || []);
    const all = rawList.filter(g => g && typeof g.link === 'string' && INVITE_RE.test(g.link.trim()));
    const cta = grid.dataset.cta || 'Join Group on WhatsApp';
    const catFilter = grid.dataset.catGroup;            // optional fixed category for titled blocks
    let list = catFilter ? all.filter(g => g.cat === catFilter) : all;
    let cat = 'all', query = '';

    // toolbar (search + live count) — only for the main grid of a page
    let countEl = null;
    if (grid.dataset.search !== 'off' && !catFilter) {
      const bar = document.createElement('div');
      bar.className = 'groups-toolbar';
      bar.innerHTML = `
        <label class="groups-search"><span class="sr-only">Search groups</span>
          <input type="search" placeholder="Search ${list.length} groups…" autocomplete="off" />
        </label>
        <p class="groups-count" aria-live="polite"></p>`;
      grid.parentNode.insertBefore(bar, grid);
      countEl = bar.querySelector('.groups-count');
      bar.querySelector('input').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); render(); });
    }

    function render() {
      const shown = list.filter(g =>
        (cat === 'all' || g.cat === cat) && (!query || g.name.toLowerCase().includes(query)));
      if (countEl) countEl.textContent = `Showing ${shown.length} of ${list.length} groups`;
      grid.innerHTML = shown.length
        ? shown.map(g => card(g, cta)).join('')
        : `<div class="card groups-empty">No groups found${query ? ` for “${esc(query)}”` : ' here yet'}. New links are added regularly — check back soon.</div>`;
    }

    // category filter buttons (shared across the page)
    if (!catFilter) {
      document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
          btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
          cat = btn.dataset.cat || 'all';
          render();
        });
      });
    }

    grid.addEventListener('click', async e => {
      const b = e.target.closest('.copy-link-btn');
      if (!b) return;
      const ok = await copy(b.dataset.link);
      toast(ok ? 'Invite link copied!' : 'Copy failed — long-press the link instead.', ok ? 'success' : 'error');
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-groups]').forEach(mount);
  });
})();
