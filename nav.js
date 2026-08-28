// Every page except the home page gets its navigation from here: a hamburger
// button that opens a popup menu. The component ships its own styles so the
// pages don't each carry a copy.
const NAV_LINKS = [
  ['index.html',      'Home',       '\u{1F3E0}'],
  ['tournament.html', 'Tournament', '\u{1F3C6}'],
  ['albo.html',       'Albo',       '\u{1F947}'],
  ['decks.html',      'Decks',      '\u{1F0CF}'],
  ['standings.html',  'Standings',  '\u{1F4CA}'],
  ['stats.html',      'Stats',      '\u{1F4C8}'],
  ['mvp.html',        'MVP',        '⭐'],
  ['rules.html',      'Rules',      '\u{1F4CB}'],
  ['scandals.html',   'Scandals',   '\u{1F5DE}️'],
];

const NAV_CSS = `
  site-nav {
    display: block;
    margin-bottom: 28px;
  }

  .nav-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex-direction: column;
    width: 44px;
    height: 44px;
    padding: 0;
    background: #fff;
    border: 1.5px solid #000;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .nav-toggle:hover { background: #f5f5f5; }
  .nav-toggle:focus-visible { outline: 2px solid #000; outline-offset: 2px; }
  .nav-toggle span { display: block; width: 20px; height: 2px; background: #000; }

  .nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    background: rgba(0, 0, 0, 0.45);
  }

  .nav-overlay[hidden] { display: none; }

  .nav-menu {
    background: #fff;
    border: 1.5px solid #000;
    border-radius: 10px;
    padding: 8px;
    min-width: 220px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .nav-menu a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    color: #000;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1;
  }

  .nav-menu a:hover { background: #f5f5f5; }
  .nav-menu a:focus-visible { outline: 2px solid #000; outline-offset: -2px; }
  .nav-menu a[aria-current="page"] { background: #000; color: #fff; }
  .nav-menu .nav-icon { font-size: 1.2rem; }

  /* Phones: the menu takes the full width so the targets stay thumb-sized. */
  @media (max-width: 600px) {
    .nav-overlay { padding: 12px; }
    .nav-menu { width: 100%; min-width: 0; }
  }
`;

class SiteNav extends HTMLElement {
  connectedCallback() {
    if (!document.getElementById('site-nav-css')) {
      const style = document.createElement('style');
      style.id = 'site-nav-css';
      style.textContent = NAV_CSS;
      document.head.appendChild(style);
    }

    const current = location.pathname.split('/').pop() || 'index.html';

    this.innerHTML = `
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-overlay" hidden>
        <nav class="nav-menu" id="nav-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          ${NAV_LINKS.map(([href, label, icon]) => `
          <a href="${href}"${href === current ? ' aria-current="page"' : ''}><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</a>`).join('')}
        </nav>
      </div>
    `;

    const toggle = this.querySelector('.nav-toggle');
    const overlay = this.querySelector('.nav-overlay');
    const menu = this.querySelector('.nav-menu');

    const open = () => {
      overlay.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      menu.querySelector('a').focus();
    };

    const close = ({ refocus = true } = {}) => {
      overlay.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (refocus) toggle.focus();
    };

    toggle.addEventListener('click', () => (overlay.hidden ? open() : close()));
    // clicking the dimmed area, but not the menu itself, dismisses it
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    // let the link navigate; just release the scroll lock on the way out
    menu.addEventListener('click', e => { if (e.target.closest('a')) close({ refocus: false }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close(); });
  }
}

customElements.define('site-nav', SiteNav);
