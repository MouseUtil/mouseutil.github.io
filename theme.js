// Shared theme switcher for all MouseUtil pages.
// Opens a dropdown with Light / Dark / System. Persists the choice in
// localStorage so it syncs across every page (and browser tabs) on this site.
(function () {
  var STORAGE_KEY = 'mouseutil-theme';
  var media = window.matchMedia('(prefers-color-scheme: light)');

  var ICONS = {
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 18a6 6 0 0 0 0-12v12z" fill="currentColor"></path></svg>'
  };
  var LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

  function systemTheme() {
    return media.matches ? 'light' : 'dark';
  }

  function getPref() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }

  function setPref(pref) {
    localStorage.setItem(STORAGE_KEY, pref);
  }

  function closeMenu() {
    var menu = document.getElementById('theme-menu');
    var btn = document.getElementById('theme-toggle');
    if (menu) menu.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    var menu = document.getElementById('theme-menu');
    var btn = document.getElementById('theme-toggle');
    if (menu) menu.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function apply(pref) {
    var effective = pref === 'system' ? systemTheme() : pref;
    document.documentElement.setAttribute('data-theme', effective);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var iconSpan = btn.querySelector('.theme-icon');
      if (iconSpan) iconSpan.innerHTML = ICONS[pref];
      var label = 'Theme: ' + LABELS[pref] + (pref === 'system' ? ' (' + LABELS[effective] + ')' : '') + ' — click to change';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }

    var options = document.querySelectorAll('.theme-option');
    for (var i = 0; i < options.length; i++) {
      var isActive = options[i].getAttribute('data-value') === pref;
      options[i].classList.toggle('active', isActive);
      options[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  }

  function init() {
    var pref = getPref();
    apply(pref);

    var btn = document.getElementById('theme-toggle');
    var menu = document.getElementById('theme-menu');

    if (btn && menu) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      var options = menu.querySelectorAll('.theme-option');
      for (var i = 0; i < options.length; i++) {
        options[i].addEventListener('click', function () {
          pref = this.getAttribute('data-value');
          setPref(pref);
          apply(pref);
          closeMenu();
        });
      }

      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }

    // Keep in sync if the OS-level light/dark preference changes while "System" is active.
    media.addEventListener('change', function () {
      if (getPref() === 'system') apply('system');
    });

    // Keep in sync across tabs/pages when the choice changes elsewhere.
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        pref = getPref();
        apply(pref);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
