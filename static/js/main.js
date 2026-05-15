(function () {
  'use strict';

  // ---- Copy BibTeX ----
  const btn = document.getElementById('copyBibtex');
  const block = document.getElementById('bibtex-block');
  if (btn && block) {
    btn.addEventListener('click', async () => {
      const text = block.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (_e) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (__e) { /* noop */ }
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1600);
    });
  }
})();
