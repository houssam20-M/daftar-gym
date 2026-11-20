// report.js - the report for the coach, plan settings and the backup.
/* ---------- report for the coach (always in English so any coach or model reads it) ---------- */
function report(){
  const R = [], info = dayInfo();
  R.push('GYM REPORT ' + today() + ' (from the Daftar l-Gym app)');
  R.push('Plan: ' + (plan.sex ? (plan.sex === 'f' ? 'female, ' : 'male, ') : '') + (plan.age ? plan.age + 'y, ' : '') + plan.heightCm + ' cm, goal ' + plan.goalKg + ' kg, ' + plan.kcal + ' kcal + ' + plan.proteinG + ' g protein/day, start ' + plan.startDate + ', ' + sessPerDay() + ' session(s)/day, ' + daysPerWeek() + ' days/week. Today = week ' + info.week + ', day ' + info.day + '.');
  R.push(''); R.push('WEIGH-INS:');
  if (!checkins.length) R.push('  (none yet)');
  checkins.forEach(c => R.push('  ' + c.date + ': ' + c.weightKg + ' kg' + (c.waistCm != null ? ', waist ' + c.waistCm + ' cm' : '') + (c.lifts != null ? ', lifts ' + c.lifts : '') + (c.walkDays != null ? ', walk ' + c.walkDays + '/7' : '') + (c.sleepH != null ? ', sleep ' + c.sleepH + 'h' : '') + (c.energy != null ? ', energy ' + c.energy + '/5' : '') + (c.dietDays != null ? ', diet ' + c.dietDays + '/7' : '') + (c.cheat ? ', bread/sugar: ' + c.cheat : '') + (c.note ? ' | ' + c.note : '')));
  R.push(''); R.push('SESSIONS (last 14, newest first):');
  if (!sessions.length) R.push('  (none yet)');
  sessions.slice(0, 14).forEach(s => {
    const items = Object.keys(s.items || {}).map(k => k + (s.items[k].kg != null ? ' ' + s.items[k].kg + 'kg' : '') + (s.items[k].done ? ' done' : ' NOT done')).join(', ');
    R.push('  ' + s.date + ' day ' + s.day + ' (week ' + s.week + ')' + (s.feel ? ', felt ' + s.feel : '') + ': ' + (items || 'nothing ticked') + (s.note ? ' | ' + s.note : ''));
  });
  R.push(''); R.push('FOOD (last 7 days):');
  const byDay = {}; meals.forEach(m => { (byDay[m.date] = byDay[m.date] || []).push(m); });
  const days = Object.keys(byDay).sort().slice(-7);
  if (!days.length) R.push('  (none yet)');
  days.forEach(d => { const a = byDay[d]; R.push('  ' + d + ': ' + a.reduce((x,m) => x + m.kcal, 0) + ' kcal, ' + a.reduce((x,m) => x + m.proteinG, 0) + ' g protein | ' + a.map(m => m.text + (m.kcal ? '' : ' (kcal unknown)')).join('; ') + (S.water[d] ? ' | water ' + S.water[d] + '/12' : '')); });
  R.push('Goal: ' + goalType() + '.');
  R.push(''); R.push('MEAL LIST: ' + (S.menu.length ? S.menu.map(m => m.name + ' ' + m.kcal + 'kcal/' + m.proteinG + 'g').join('; ') : '(empty)'));
  R.push('MEALS EATEN (last 7 days):'); 
  const fdays = Object.keys(S.dayfood).sort().slice(-7);
  if (!fdays.length) R.push('  (none yet)');
  fdays.forEach(d => { const f = S.dayfood[d], tot = eatenTotals(d); R.push('  ' + d + ': ' + (S.menu.filter(m => f.eaten[m.id]).map(m => m.name).join(', ') || 'none') + ' = ' + tot.kcal + ' kcal, ' + tot.prot + ' g' + (f.note ? ' | ' + f.note : '') + (S.water[d] ? ' | water ' + S.water[d] + '/12' : '')); });
  const rests = Object.keys(S.rests).sort().slice(-10);
  R.push(''); R.push('REST DAYS (last 10): ' + (rests.length ? rests.join(', ') : 'none'));
  if (S.water[today()]) R.push('Water today: ' + S.water[today()] + '/12 glasses.');
  return R.join('\n');
}
async function copyText(text, box, msg, okText){
  box.value = text; box.hidden = false;
  try { await navigator.clipboard.writeText(text); msg.textContent = okText; }
  catch (e) { box.focus(); box.select(); msg.textContent = L('Nskho b yeddik: dghet mtewwel 3la n-ness o khtar "Copier".'); }
}
$('repCopy').onclick = () => copyText(report(), $('repBox'), $('repMsg'), L('Tnskh. Lse9o daba l l-coach dyalek.'));

/* ---------- settings, plan, backup ---------- */
document.querySelectorAll('input[name="setTheme"]').forEach(r => r.addEventListener('change', () => { S.settings.theme = r.value; persist(); applyTheme(); }));
document.querySelectorAll('input[name="setLang"], input[name="suLang"]').forEach(r => r.addEventListener('change', () => setLang(r.value)));
function fillPlan(){ $('pHeight').value = plan.heightCm; $('pGoal').value = plan.goalKg; $('pStart').value = plan.startDate; $('pKcal').value = plan.kcal; $('pProt').value = plan.proteinG; setRadio('pSess', sessPerDay()); setRadio('pDays', daysPerWeek()); if ($('pLight')) $('pLight').value = lightDay() >= 0 ? String(lightDay()) : ''; }
$('pSave').onclick = () => {
  const h = numOrNull('pHeight'), g = numOrNull('pGoal'), k = numOrNull('pKcal'), p = numOrNull('pProt'), st = $('pStart').value, msg = $('pMsg');
  if (!h || !g || !k || !p || !/^\d{4}-\d{2}-\d{2}$/.test(st)){ msg.textContent = L('3emmer ga3 l-khanat.'); return; }
  const sess = Number(radioVal('pSess')) || sessPerDay(), days = Number(radioVal('pDays')) || daysPerWeek();
  const ldRaw = $('pLight') ? $('pLight').value : '', ld = ldRaw === '' ? null : Number(ldRaw);
  S.plan = { ...S.plan, heightCm:h, goalKg:g, kcal:k, proteinG:p, startDate:st, sessionsPerDay:sess, daysPerWeek:days, lightDay:ld, planAt:today() };
  msg.textContent = persist() ? L('L-plan tsejjel.') : L('Ma tsejjelch.'); sessDirty = false; renderAll(true);
};
/* ---------- monthly plan reminder: after 30 days on the same choice, ask once ---------- */
function renderPlanBanner(){
  const b = $('bannerPlan'); if (!b) return;
  if (!hasPlan(S.plan)){ b.hidden = true; return; }
  const since = (dnum(today()) - dnum(plan.planAt || plan.startDate)) / 864e5;
  if (since < 30){ b.hidden = true; return; }
  $('bannerPlanText').textContent = L('Daz chhar 3la l-plan dyalek: {0} f nhar, {1} iyam f simana. Bghiti tbeddel?', L(sessPerDay() === 2 ? 'jouj seances' : 'seance wa7da'), daysPerWeek());
  b.hidden = false;
}
$('bannerPlanGo').onclick = () => {
  location.hash = 'kter';
  setTimeout(() => { const t = $('pSess1'); if (t) t.closest('.field').scrollIntoView({ block:'center', behavior:'smooth' }); }, 120);
};
$('bannerPlanKeep').onclick = () => { S.plan = { ...S.plan, planAt: today() }; persist(); renderPlanBanner(); };

/* ---------- backup nudge: once a week, the banner asks for a backup ---------- */
function dataDays(){
  return new Set([...Object.keys(S.checkins), ...Object.keys(S.sessions), ...Object.keys(S.water), ...Object.keys(S.rests), ...(S.meals || []).map(m => m.date)]).size;
}
function renderBackupBanner(){
  const b = $('bannerBk');
  if (!b) return;
  if (!hasPlan(S.plan) || !dataDays()){ b.hidden = true; return; }
  const last = S.settings.backupAt ? Date.parse(S.settings.backupAt) : NaN;
  const since = isNaN(last) ? (Date.now() - dnum(plan.startDate)) / 864e5 : (Date.now() - last) / 864e5;
  if (since < 7){ b.hidden = true; return; }
  $('bannerBkText').textContent = L('Dir nskha dyal l-ma3lomat dyalek: 3ad 7 nhar wla ktar bla nskha.');
  b.hidden = false;
}
function markBackup(){ S.settings.backupAt = new Date().toISOString(); persist(); renderBackupBanner(); }
$('bannerBkGo').onclick = () => {
  location.hash = 'kter';
  setTimeout(() => { const t = $('bkExport'); if (t) t.scrollIntoView({ block:'center', behavior:'smooth' }); }, 120);
};
$('bkShow').onclick = () => { copyText(JSON.stringify(S), $('bkBox'), $('bkMsg'), L('N-nskha tnskhat. Sifetha l rassek f WhatsApp wla Telegram.')); markBackup(); };
$('bkExport').onclick = () => {
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type:'application/json' }));
    a.download = 'daftar-gym-' + today() + '.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    $('bkMsg').textContent = L('L-fichier khrej l Téléchargements.'); markBackup();
  } catch (e) { $('bkMsg').textContent = L('Ma khrejch. Dghet "Werri n-nskha" o nskhha.'); }
};
twoStep($('bkImport'), 'Rje3 n-nskha', () => {
  const msg = $('bkMsg');
  try {
    const parsed = clean(JSON.parse($('bkBox').value));
    if (!Object.keys(parsed.checkins).length && !Object.keys(parsed.sessions).length && !parsed.meals.length && !Object.keys(parsed.plan).length){ msg.textContent = L('Had n-nskha khawya wla machi dyal had l-app.'); return; }
    if (!hasPlan(parsed.plan)) parsed.plan = S.plan;
    S = parsed; const ok = persist(); applyTheme(); fillPlan(); setLang(lang);
    msg.textContent = ok ? L('N-nskha rej3at.') : L('Ma rej3atch.');
  } catch (e) { msg.textContent = L('N-ness li lse9ti machi nskha s7i7a.'); }
});
