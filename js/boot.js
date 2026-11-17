// boot.js - tabs, first run and the start of the app.
/* ---------- tabs ---------- */
const VIEWS = ['lyoum','simana','t9eddom','makla','kter','settings'];
let lastTab = 'lyoum'; // where the back button of Settings returns
function route(){
  const h = location.hash.slice(1), v = VIEWS.includes(h) ? h : 'lyoum';
  document.querySelectorAll('[data-view]').forEach(e => { e.hidden = e.dataset.view !== v; });
  if (v !== 'settings') lastTab = v;
  const g = document.querySelector('.gear'); if (g){ if (v === 'settings') g.setAttribute('aria-current','page'); else g.removeAttribute('aria-current'); }
  document.querySelectorAll('.nav a').forEach(a => { if (a.getAttribute('href') === '#' + v) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  if (v === 't9eddom' && hasPlan(S.plan)) renderChart();
  document.querySelectorAll('#app [data-view="' + v + '"] textarea.grow').forEach(autoGrow);
  animate(document.querySelectorAll('#app [data-view="' + v + '"]'));
  window.scrollTo(0, 0);
  // A tab name can match a section id (#makla): the browser scrolls to it after us, so scroll again.
  setTimeout(() => window.scrollTo(0, 0), 0);
}
window.addEventListener('hashchange', route);
// The gear opens Settings; tapped again, it closes them and goes back to the tab he was on.
document.querySelector('.gear').addEventListener('click', e => {
  e.preventDefault();
  location.hash = location.hash === '#settings' ? lastTab : 'settings';
});
// A deep link like index.html#makla lands on that section; the browser scrolls to it after load, so come back to the top.
window.addEventListener('load', () => {
  const id = location.hash.slice(1);
  if (!id || !document.getElementById(id)) return;
  setTimeout(() => window.scrollTo(0, 0), 100);
  setTimeout(() => window.scrollTo(0, 0), 300);
});

/* ---------- first run ---------- */
function hasPlan(p){ return !!p && ['heightCm','goalKg','kcal','proteinG','startDate'].every(k => p[k] != null && p[k] !== ''); }
// Calories and protein for the goal he picked. Sources: Mifflin-St Jeor (1990) for the resting burn; the usual activity
// multipliers (1.375 light, 1.55 moderate, 1.725 hard training 6-7 days); ISSN 2017 for protein (1.4-2.0 g/kg, more in a deficit);
// losing about 0.5-1% of body weight a week keeps more muscle; a lean gain is about 0.25-0.5% a week from a small surplus.
const ACTIVITY = { 3:1.375, 4:1.46, 5:1.55, 6:1.6, 7:1.6 };
function goalOf(w, goal){ return goal < w - 1 ? 'lose' : goal > w + 1 ? 'gain' : 'keep'; }
function calcPlan(sex, age, h, w, goal, days, sess){
  const bmr = 10*w + 6.25*h - 5*age + (sex === 'f' ? -161 : 5);
  const act = Math.min(1.725, (ACTIVITY[days] || 1.55) + (sess === 2 ? 0.1 : 0));
  const tdee = bmr * act, type = goalOf(w, goal), bmi = w / Math.pow(h / 100, 2);
  let kcal = tdee;
  if (type === 'lose'){
    // aim for 0.75% of body weight a week (7700 kcal per kg), never more than 1 kg a week,
    // and never cut more than 20-30% of the burn (bigger cut allowed the higher the BMI).
    const want = Math.min(1, w * 0.0075) * 7700 / 7, cap = tdee * (bmi >= 30 ? 0.3 : bmi >= 25 ? 0.25 : 0.2);
    kcal = tdee - Math.min(want, cap, 1000);
    kcal = Math.max(kcal, sex === 'f' ? 1200 : 1500, bmr * 0.9);
  } else if (type === 'gain'){
    // a small surplus: 10% of the burn, between 150 and 350 kcal a day.
    kcal = tdee + Math.min(350, Math.max(150, tdee * 0.1));
  }
  kcal = Math.round(kcal / 50) * 50;
  // Protein: losing, by the goal weight (a big body has a lot of fat, not muscle); gaining or keeping, by today's weight.
  const perKg = type === 'lose' ? 2.0 : type === 'gain' ? 1.8 : 1.6, base = type === 'lose' ? goal : w;
  const proteinG = Math.min(220, Math.max(70, Math.round(perKg * base / 5) * 5));
  const weekly = (kcal - tdee) * 7 / 7700;
  return { kcal, proteinG, tdee: Math.round(tdee / 50) * 50, bmr: Math.round(bmr), type, losing: type === 'lose', weekly };
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
  pending = { plan: { sex, age, heightCm: h, goalKg: goal, kcal: c.kcal, proteinG: c.proteinG, startDate: st, sessionsPerDay: sess, daysPerWeek: days, planAt: today(), goalType: c.type }, weightKg: Math.round(w * 10) / 10 };
  msg.textContent = '';
  $('suKcal').textContent = c.kcal + ' kcal'; $('suProt').textContent = c.proteinG + ' g';
  const wk = Math.abs(c.weekly).toFixed(1);
  $('suWhy').textContent = c.type === 'lose'
    ? L('Hadafek tn9es. Jismek kay7re9 te9riban {0} kcal f nhar m3a t-tmrin. B had l-calories ghadi tn9es te9riban {1} kg f simana, bla ma tkhser l-3adala.', c.tdee, wk)
    : c.type === 'gain'
    ? L('Hadafek tzid. Jismek kay7re9 te9riban {0} kcal f nhar m3a t-tmrin. B had l-calories ghadi tzid te9riban {1} kg f simana, ktar men l-3adala o 9lil men ch-ch7em.', c.tdee, wk)
    : L('Hadafek tb9a f nefs l-wazn o tbni l-3adala. Jismek kay7re9 te9riban {0} kcal f nhar m3a t-tmrin, so katakol nefs l-calories.', c.tdee);
  $('suForm').hidden = true; $('suResult').hidden = false; window.scrollTo(0, 0);
  animate(document.querySelectorAll('#suResult .stat, #suResult .row'));
};
$('suBack').onclick = () => { $('suResult').hidden = true; $('suForm').hidden = false; };
$('suEnter').onclick = () => {
  if (!pending) return;
  S.plan = pending.plan;
  S.settings.menuV = 1; // a new user starts with an empty food list
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
load(); migrateMenu(); applyTheme(); showStorageState();
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
// Updates: check for a new version on every open, and when a new one takes over, reload once so it shows right away.
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
  const hadOld = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadOld && !reloaded){ reloaded = true; location.reload(); } });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
}
