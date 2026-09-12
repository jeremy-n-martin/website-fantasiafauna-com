/* Apply before styles load; keep the persistent control outside the router. */
(() => {
  'use strict';
  const themes = ['sombre', 'sombre-doux', 'clair-doux', 'clair'];
  const labels = ['sombre', 'sombre doux', 'clair doux', 'clair'];
  let theme = 'clair-doux';
  try {
    const saved = localStorage.getItem('ff-theme');
    if (themes.includes(saved)) theme = saved;
  } catch (_) { /* Storage may be disabled; the control still works. */ }
  document.documentElement.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('theme-range');
    const output = document.getElementById('theme-label');
    if (!slider || !output) return;
    function sync() {
      slider.value = String(themes.indexOf(theme));
      slider.setAttribute('aria-valuetext', labels[themes.indexOf(theme)]);
      output.textContent = labels[themes.indexOf(theme)];
    }
    sync();
    slider.addEventListener('input', () => {
      theme = themes[Number(slider.value)];
      document.documentElement.dataset.theme = theme;
      sync();
      try { localStorage.setItem('ff-theme', theme); } catch (_) { /* Optional persistence. */ }
    });
  }, { once: true });
})();
