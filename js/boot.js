// boot.js - tabs, first run and the start of the app.
/* ---------- tabs ---------- */
const VIEWS = ['lyoum','simana','t9eddom','makla','kter'];
function route(){
  const h = location.hash.slice(1), v = VIEWS.includes(h) ? h : 'lyoum';
  document.querySelectorAll('[data-view]').forEach(e => { e.hidden = e.dataset.view !== v; });
  document.querySelectorAll('.nav a').forEach(a => { if (a.getAttribute('href') === '#' + v) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  if (v === 't9eddom' && hasPlan(S.plan)) renderChart();
  animate(document.querySelectorAll('#app [data-view="' + v + '"]'));
  window.scrollTo(0, 0);
  // A tab name can match a section id (#makla): the browser scrolls to it after us, so scroll again.
  setTimeout(() => window.scrollTo(0, 0), 0);
}
window.addEventListener('hashchange', route);
// A deep link like index.html#makla lands on that section; the browser scrolls to it after load, so come back to the top.
window.addEventListener('load', () => {
  const id = location.hash.slice(1);
  if (!id || !document.getElementById(id)) return;
  setTimeout(() => window.scrollTo(0, 0), 100);
  setTimeout(() => window.scrollTo(0, 0), 300);
});

/* ---------- first run ---------- */
function hasPlan(p){ return !!p && ['heightCm','goalKg','kcal','proteinG','startDate'].every(k => p[k] != null && p[k] !== ''); }
// Mifflin-St Jeor resting burn x activity: 1.3 + 0.03 per training day, + 0.05 for two sessions a day (7 days, one session = 1.51).
// Losing weight: 24% under that. Protein: 2.2 g per kg of goal weight.
function calcPlan(sex, age, h, w, goal, days, sess){
  const act = 1.3 + 0.03 * (days || 7) + (sess === 2 ? 0.05 : 0);
  const tdee = (10*w + 6.25*h - 5*age + (sex === 'f' ? -161 : 5)) * act, losing = goal < w - 1;
  const kcal = Math.max(sex === 'f' ? 1300 : 1500, Math.round((losing ? tdee * 0.76 : tdee) / 50) * 50);
  return { kcal, proteinG: Math.min(220, Math.max(90, Math.round(2.2 * goal / 5) * 5)), tdee: Math.round(tdee / 50) * 50, losing };
}
let pending = null;
function showSetup(){ $('app').hidden = true; $('nav').hidden = true; $('setup').hidden = false; $('suForm').hidden = false; $('suResult').hidden = true; if (!$('suStart').value) $('suStart').value = today(); window.scrollTo(0, 0); animate(document.querySelectorAll('#setup .brand, #suForm > *')); }
function enterApp(){ $('setup').hidden = true; $('app').hidden = false; $('nav').hidden = false; fillPlan(); route(); renderAll(true); }
$('suGo').onclick = () => {
  const msg = $('suMsg'), sex = radioVal('suSex'), age = numOrNull('suAge'), h = numOrNull('suHeight'), w = numOrNull('suWeight'), goal = numOrNull('suGoal'), st = $('suStart').value;
  const bad = (id, text) => { msg.textContent = text; if (id) $(id).focus(); };
  if (!sex) return bad(null, L('Khtar: rajel wla mra.'));
  if (age == null || age < 14 || age > 90) return bad('suAge', L('Kteb l-3mer dyalek.'));
  if (h == null || h < 120 || h > 230) return bad('suHeight', L('Kteb t-toul b cm (matalan 175).'));
  if (w == null || w < 40 || w > 250) return bad('suWeight', L('Kteb l-wazn dyalek b kg.'));
  if (goal == null || goal < 40 || goal > 200) return bad('suGoal', L('Kteb l-wazn li bghiti twsel lih.'));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(st)) return bad('suStart', L('Khtar awal nhar.'));
  const sess = Number(radioVal('suSess')), days = Number(radioVal('suDays'));
  if (!sess) return bad(null, L('Khtar ch7al mn seance f nhar.'));
  if (!days) return bad(null, L('Khtar ch7al mn nhar f simana.'));
  const c = calcPlan(sex, age, h, w, goal, days, sess);
  pending = { plan: { sex, age, heightCm: h, goalKg: goal, kcal: c.kcal, proteinG: c.proteinG, startDate: st, sessionsPerDay: sess, daysPerWeek: days, planAt: today() }, weightKg: Math.round(w * 10) / 10 };
  msg.textContent = '';
  $('suKcal').textContent = c.kcal + ' kcal'; $('suProt').textContent = c.proteinG + ' g';
  $('suWhy').textContent = c.losing ? L('Jismek kay7re9 te9riban {0} kcal f nhar m3a t-tmrin. Bach tn9es b chwiya o bla ma tjou3, khassek takol 9el mn hadchi.', c.tdee) : L('Jismek kay7re9 te9riban {0} kcal f nhar m3a t-tmrin. L-hadaf dyalek 9rib mn l-wazn dyalek, so kanakhdo nefs l-calories.', c.tdee);
  $('suForm').hidden = true; $('suResult').hidden = false; window.scrollTo(0, 0);
  animate(document.querySelectorAll('#suResult .stat, #suResult .row'));
};
$('suBack').onclick = () => { $('suResult').hidden = true; $('suForm').hidden = false; };
$('suEnter').onclick = () => {
  if (!pending) return;
  S.plan = pending.plan;
  const d = today(); if (!S.checkins[d]) S.checkins[d] = { date: d, weightKg: pending.weightKg, note: 'Wazn d l-bdya', savedAt: new Date().toISOString() };
  persist(); pending = null; enterApp();
};

/* ---------- boot ---------- */
function renderAll(force){ if (!hasPlan(S.plan)) return; renderPlanBanner(); renderStats(); renderSession(force); renderChart(); renderTable(); renderMeals(); renderWater(); renderBackupBanner(); renderProgression(); renderRecap(); renderNudge(); renderMyFoods(); renderPhotos(); }
function setView(v){ view = v; $('vWeek').setAttribute('aria-pressed', v === 'week'); $('vMonth').setAttribute('aria-pressed', v === 'month'); renderChart(); renderTable(); }
$('vWeek').onclick = () => setView('week'); $('vMonth').onclick = () => setView('month');
$('vRange').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !b.dataset.r) return;
  chartRange = b.dataset.r;
  $('vRange').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  renderChart();
});
load(); applyTheme(); showStorageState();
$('ciDate').value = today(); renderFoods(); syncSettingsUI();
if (hasPlan(S.plan)) enterApp(); else showSetup();
applyLang();
// Splash: the logo shows first, then the first screen comes in.
(() => {
  const sp = $('splash'), calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    sp.classList.add('out');
    if ($('setup').hidden) animate(document.querySelectorAll('#app header.top, #app [data-view]:not([hidden])')); else animate(document.querySelectorAll('#setup .brand, #suForm > *'));
    setTimeout(() => sp.remove(), 450);
  }, calm ? 150 : 1500);
})();
// A new day starts while the app stays open in the background: refresh when it comes back.
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (hasPlan(S.plan) && !$('progress').hidden) renderChart(); }, 150); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAll(); });
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
