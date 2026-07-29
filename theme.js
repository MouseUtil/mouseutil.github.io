// Shared theme toggle for all MouseUtil pages.
// Cycles Dark -> Light -> System -> Dark. Persists choice in localStorage
// so it syncs across every page (and across browser tabs) on this site.
(function () {
  var STORAGE_KEY = 'mouseutil-theme';
  var ICONS = { dark: '🌙', light: '☀️', system: '🖥️' };
  var LABELS = { dark: 'Dark', light: 'Light', system: 'System' };
  var media = window.matchMedia('(prefers-color-scheme: light)');

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

  function nextPref(pref) {
    return pref === 'dark' ? 'light' : pref === 'light' ? 'system' : 'dark';
  }

  function apply(pref) {
    var effective = pref === 'system' ? systemTheme() : pref;
    document.documentElement.setAttribute('data-theme', effective);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = ICONS[pref];
      var label = 'Theme: ' + LABELS[pref] + (pref === 'system' ? ' (' + LABELS[effective] + ')' : '') + ' — click to change';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
  }

  function init() {
    var pref = getPref();
    apply(pref);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        pref = nextPref(pref);
        setPref(pref);
        apply(pref);
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
