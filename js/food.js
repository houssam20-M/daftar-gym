// food.js - meals, plan meals, own food buttons, water, calorie nudge, weekly recap.
/* ---------- today's food: a fixed daily menu he ticks (no dairy, no bread, no sugar) ---------- */
// [key, name, what to eat, ≈kcal, ≈protein g]
const MENU = [
  ['ftour','Ftour (sa3a 9bel gym)','3 bidat + chofan b l-ma (60 g) wla fakya. 9ahwa mn b3d l-makla, machi 9belha.',550,30],
  ['ghda','Ghda','Assiette: noss khodra, rbe3 sder djaj wla 7out (200 g), rbe3 btata wla rouz.',700,60],
  ['snack','Bin l-ghda o l-3cha','2 bidat wla 7okka tun + teffa7a wla kemcha louz.',300,25],
  ['3cha','3cha','Soupe khodra wla 3des + 2-3 bidat wla 7out + chlada.',450,30]
];
function dayFood(d){ return S.dayfood[d || today()] || { eaten:{} }; }
function saveDayFood(df){
  const t = today();
  if (Object.keys(df.eaten).length || df.note) S.dayfood[t] = df; else delete S.dayfood[t];
  return persist();
}
function renderMeals(){
  const box = $('menuToday'); if (!box) return;
  const df = dayFood(); box.innerHTML = '';
  let kcal = 0, prot = 0, n = 0;
  MENU.forEach(m => {
    const done = !!df.eaten[m[0]];
    if (done){ kcal += m[3]; prot += m[4]; n++; }
    const row = el('div','menu-row' + (done ? ' done' : '')), cb = el('input');
    cb.type = 'checkbox'; cb.id = 'mn-' + m[0]; cb.checked = done; cb.setAttribute('aria-label', L('{0}: klitha', L(m[1])));
    const nm = el('div','nm', L(m[1])); nm.append(el('span','', L(m[2])), el('small','', '≈' + m[3] + ' kcal · ' + m[4] + ' g protein'));
    cb.addEventListener('change', () => {
      const cur = dayFood(), next = { eaten: { ...cur.eaten } }; if (cur.note) next.note = cur.note;
      if (cb.checked) next.eaten[m[0]] = true; else delete next.eaten[m[0]];
      $('dfMsg').textContent = saveDayFood(next) ? '' : L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.');
      renderMeals();
    });
    row.append(cb, nm); box.append(row);
  });
  const all = MENU.reduce((a, m) => a + m[3], 0), allP = MENU.reduce((a, m) => a + m[4], 0);
  $('menuTotal').textContent = L('Kliti {0} mn {1} wejbat · ≈{2} kcal, ≈{3} g protein. Nhar kamel: ≈{4} kcal, ≈{5} g.', n, MENU.length, kcal, prot, all, allP);
  if (document.activeElement !== $('dfNote')) $('dfNote').value = df.note || '';
  renderDayReport();
}
let dfT;
$('dfNote').addEventListener('input', () => {
  clearTimeout(dfT);
  dfT = setTimeout(() => {
    const cur = dayFood(), next = { eaten: { ...cur.eaten } }, v = $('dfNote').value.trim();
    if (v) next.note = v.slice(0, 300);
    $('dfMsg').textContent = saveDayFood(next) ? L('Tsejjlat.') : L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.');
    renderDayReport();
  }, 500);
});
// Kept so older callers still work: the food buttons are gone.
function renderFoods(){}
function renderMyFoods(){}

/* ---------- the day report: what he did today, to read or copy ---------- */
function dayReportText(){
  const t = today(), R = [L('Ta9rir d lyoum') + ' · ' + dShort(t)], c = S.checkins[t], s = S.sessions[t], df = dayFood(t);
  if (c) R.push(L('Wazn') + ': ' + c.weightKg + ' kg');
  R.push('');
  if (isRest(t)) R.push(L('Gym') + ': ' + L('Rya7a'));
  else if (!s || !Object.keys(s.items || {}).length) R.push(L('Gym') + ': ' + L('ba9i ma sejjelti walou'));
  else {
    const items = s.items, ex = Object.keys(items).filter(k => !k.startsWith('w-'));
    const done = ex.filter(k => items[k].done).length;
    const feel = s.feel ? ' · ' + L(s.feel.charAt(0).toUpperCase() + s.feel.slice(1)) : '';
    R.push(L('Gym') + ': ' + (s.day === 'L' ? L('Nhar khfif') : L('Nhar {0}', s.day)) + ' · ' + L('{0} exercices', done) + feel);
    ex.forEach(k => {
      const it = items[k], name = EXINFO[k] ? L(EXINFO[k].name) : k;
      R.push('  ' + (it.done ? '✓ ' : '✕ ') + name + (it.kg != null ? ' · ' + it.kg + ' kg' : '') + (it.reps != null ? ' × ' + it.reps : ''));
    });
    if (s.note) R.push('  ' + s.note);
  }
  R.push('');
  R.push(L('Makla') + ':');
  MENU.forEach(m => R.push('  ' + (df.eaten[m[0]] ? '✓ ' : '✕ ') + L(m[1])));
  if (df.note) R.push('  ' + df.note);
  R.push(L('L-ma') + ': ' + (S.water[t] || 0) + '/12 ' + L('kisan'));
  return R.join('\n');
}
function renderDayReport(){ const b = $('dayRep'); if (b) b.textContent = dayReportText(); }
$('dayRepCopy').onclick = () => copyText(dayReportText(), $('dayRepBox'), $('dayRepMsg'), L('Tnskh. Lse9o daba l l-coach dyalek.'));

/* ---------- water: 12 glasses = 3 L ---------- */
function waterToday(){ return S.water[today()] || 0; }
function renderWater(){
  const n = waterToday(), litres = (n * 0.25).toFixed(2).replace(/\.?0+$/, '') || '0';
  $('mWaterTxt').textContent = L('{0} / 12 kisan', n) + ' · ' + litres + ' L';
  $('mWaterBar').style.width = Math.min(100, n / 12 * 100) + '%';
  $('wAdd').textContent = L('+ Kas'); $('wSub').textContent = L('− Kas');
  $('wSub').disabled = n === 0;
}
function setWater(delta){
  const t = today(), n = Math.max(0, Math.min(30, waterToday() + delta));
  if (n) S.water[t] = n; else delete S.water[t];
  persist(); renderWater(); renderBackupBanner(); renderDayReport();
}
$('wAdd').onclick = () => setWater(1);
$('wSub').onclick = () => setWater(-1);

/* ---------- calorie nudge: the scale decides, not the mood ---------- */
// Needs at least two weigh-ins in the last 14 days, at least 10 days apart.
function nudgeAdvice(){
  if (plan.kcalAt && (dnum(today()) - dnum(plan.kcalAt)) / 864e5 < 14) return null; // he just changed it
  const recent = checkins.filter(c => (dnum(today()) - dnum(c.date)) / 864e5 <= 14);
  if (recent.length < 2) return null;
  const first = recent[0], last = recent[recent.length-1], days = (dnum(last.date) - dnum(first.date)) / 864e5;
  if (days < 10) return null;
  const rate = (first.weightKg - last.weightKg) / (days / 7);
  if (rate < 0.5) return { delta:-200, rate };
  if (rate > 1.5) return { delta:200, rate };
  return null;
}
function renderNudge(){
  const b = $('kcalNudge'); if (!b) return;
  const a = nudgeAdvice();
  if (!a){ b.hidden = true; return; }
  $('kcalNudgeText').textContent = a.delta < 0
    ? L('Wazn ma tnqes bzerba3a: {0} kg f simana. N9es 200 kcal bach tkemmel b l-iqa3.', signed(a.rate))
    : L('Katnqes bzerba3a: {0} kg f simana. Zid 200 kcal bach ma tf9edch l-3adala wla l-7adid.', signed(a.rate));
  $('kcalApply').textContent = a.delta < 0 ? L('N9es 200 kcal') : L('Zid 200 kcal');
  $('kcalApply').onclick = () => {
    const next = Math.max(1300, Math.round((plan.kcal + a.delta) / 50) * 50);
    S.plan = { ...S.plan, kcal: next, kcalAt: today() };
    $('recapMsg').textContent = persist() ? L('L-plan tbeddel: {0} kcal f nhar.', next) : L('Ma tsejjelch.');
    renderAll(true);
  };
  b.hidden = false;
}

/* ---------- weekly recap: the last 7 days on one card ---------- */
function recapData(){
  const d = new Date(); d.setDate(d.getDate() - 6);
  const from = iso(d), to = today();
  const inWin = c => c.date >= from && c.date <= to, cs = checkins.filter(inWin);
  const before = checkins.filter(c => c.date < from).pop(), lastW = cs[cs.length-1] || null;
  const startW = before || cs[0] || null;
  const delta = (startW && lastW && startW !== lastW) ? lastW.weightKg - startW.weightKg : null;
  const sess = sessions.filter(s => s.date >= from && s.date <= to && Object.values(s.items || {}).some(i => i.done)).length;
  const avg = k => { const v = cs.map(c => c[k]).filter(x => typeof x === 'number'); return v.length ? v.reduce((a,b) => a+b, 0) / v.length : null; };
  return { from, to, delta, sess, diet:avg('dietDays'), sleep:avg('sleepH') };
}
function recapText(){
  const r = recapData();
  return [
    L('Recap dyal simana') + ' ' + dShort(r.from) + ' – ' + dShort(r.to),
    L('Wazn') + ': ' + (r.delta == null ? '—' : L('{0} kg f simana', signed(r.delta))),
    L('Seances') + ': ' + r.sess + '/7',
    L('Makla') + ': ' + (r.diet == null ? '—' : f1(r.diet) + '/7'),
    L('N3ass') + ': ' + (r.sleep == null ? '—' : f1(r.sleep) + ' h'),
    L('Mtaba3') + ': ' + trainStreak() + ' · Daftar l-Gym'
  ].join('\n');
}
function renderRecap(){
  const box = $('recapBody'); if (!box) return;
  const r = recapData(); box.innerHTML = '';
  const grid = el('div','recap');
  const card = (k, v, sub) => { const c = el('div','rc'), vv = el('div','v num', v); if (sub) vv.append(el('small','', ' ' + sub)); c.append(el('div','k', k), vv); return c; };
  grid.append(
    card(L('Wazn'), r.delta == null ? '—' : signed(r.delta), 'kg'),
    card(L('Seances'), String(r.sess), '/7'),
    card(L('Makla'), r.diet == null ? '—' : f1(r.diet), '/7'),
    card(L('N3ass'), r.sleep == null ? '—' : f1(r.sleep), 'h')
  );
  box.append(grid);
  if (r.delta == null && !r.sess && r.diet == null) box.append(el('p','muted small', L('Ma kaynch chi recap daba.')));
}
$('recapShare').onclick = async () => {
  const text = recapText();
  try {
    if (navigator.share) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
    $('recapMsg').textContent = L('Tnsakh. Lse3o fin bghiti.');
  } catch (e) { $('recapMsg').textContent = L('Ma tsiftch.'); }
};

