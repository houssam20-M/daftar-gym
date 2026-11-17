// ui.js - swapping the page text between languages, theme and the two quick toggles.
// Static page text is written in Darija in the HTML. This walks it once per switch and swaps each piece through L().
const ORIG = new WeakMap(), ORIGA = new WeakMap();
function applyLang(){
  document.documentElement.lang = lang === 'en' ? 'en' : 'ary-Latn';
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())){
    const tag = n.parentElement ? n.parentElement.tagName : '';
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') continue;
    if (!ORIG.has(n)) ORIG.set(n, n.nodeValue);
    const o = ORIG.get(n), k = o.trim();
    if (k) n.nodeValue = o.replace(k, L(k));
  }
  document.querySelectorAll('[placeholder],[aria-label]').forEach(e => {
    const m = ORIGA.get(e) || {};
    ['placeholder','aria-label'].forEach(a => { if (!e.hasAttribute(a)) return; if (!(a in m)) m[a] = e.getAttribute(a); e.setAttribute(a, L(m[a])); });
    ORIGA.set(e, m);
  });
}
function applyTheme(){ const t = S.settings.theme; if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); syncQuick(); }
// The two header controls and the radios in Kter show the same setting.
function syncQuick(){
  const t = S.settings.theme || 'auto', tg = $('qTheme'), lg = $('qLang');
  if (tg) tg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t ? 'true' : 'false'));
  if (lg) lg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === lang ? 'true' : 'false'));
}
function syncSettingsUI(){ setRadio('setTheme', S.settings.theme || 'auto'); setRadio('setLang', lang); setRadio('suLang', lang); syncQuick(); }
function setLang(v){
  S.settings.lang = v === 'en' ? 'en' : 'dar'; persist();
  document.querySelectorAll('.msg').forEach(m => { m.textContent = ''; });
  renderFoods();
  if (!$('setup').hidden){ $('suResult').hidden = true; $('suForm').hidden = false; } else { sessDirty = false; renderAll(true); }
  applyLang(); syncSettingsUI();
}
