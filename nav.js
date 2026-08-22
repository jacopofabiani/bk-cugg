class SiteNav extends HTMLElement {
  connectedCallback() {
    const links = [
      ['index.html',      'Home'],
      ['tournament.html', 'Tournament'],
      ['albo.html',       "Albo d'Oro"],
      ['decks.html',      'Decks'],
      ['standings.html',  'Standings'],
      ['stats.html',      'Stats'],
      ['mvp.html',        'MVP'],
      ['rules.html',      'Rules'],
      ['scandals.html',   'Scandals'],
    ];

    const current = location.pathname.split('/').pop() || 'index.html';
    this.innerHTML = `
      <nav>
        ${links.map(([href, label]) => `<a href="${href}"${href === current ? ' style="text-decoration:underline"' : ''}>${label}</a>`).join('\n        ')}
      </nav>
    `;
  }
}

customElements.define('site-nav', SiteNav);
