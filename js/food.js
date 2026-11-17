// food.js - his own meal list against the day's target, the day report, water, calorie nudge, weekly recap.
/* ---------- today's food: his own meal list, empty at first, ticked against the day's target ---------- */
// The meals he had before the list became his own: kept for him, never shown to a new user.
const OLD_MENU = [
  { id:'ftour', name:'Ftour', desc:'3 bidat + chofan b l-ma (60 g) wla fakya', kcal:550, proteinG:30 },
  { id:'ghda', name:'Ghda', desc:'Noss khodra, rbe3 sder djaj wla 7out (200 g), rbe3 btata wla rouz', kcal:700, proteinG:60 },
  { id:'snack', name:'Bin l-ghda o l-3cha', desc:'2 bidat wla 7okka tun + teffa7a wla louz', kcal:300, proteinG:25 },
  { id:'3cha', name:'3cha', desc:'Soupe khodra wla 3des + 2-3 bidat wla 7out + chlada', kcal:450, proteinG:30 }
];
function migrateMenu(){
  if (S.settings.menuV === 1) return;
  if (hasPlan(S.plan) && !S.menu.length) S.menu = OLD_MENU.map(m => ({ ...m }));
  S.settings.menuV = 1; persist();
}
function dayFood(d){ return S.dayfood[d || today()] || { eaten:{} }; }
function saveDayFood(df){
  const t = today();
  if (Object.keys(df.eaten).length || df.note) S.dayfood[t] = df; else delete S.dayfood[t];
  return persist();
}
function eatenTotals(d){
  const df = dayFood(d); let kcal = 0, prot = 0, n = 0;
  S.menu.forEach(m => { if (df.eaten[m.id]){ kcal += m.kcal; prot += m.proteinG; n++; } });
  return { kcal, prot, n };
}
function renderMeals(){
  const box = $('menuToday'); if (!box) return;
  const df = dayFood(), tot = eatenTotals(), listK = S.menu.reduce((a, m) => a + m.kcal, 0);
  $('mnIntro').textContent = L('L-hadaf dyalek: {0} kcal o {1} g protein f nhar. Zid l-wejbat li katakol, o 3ellem 3lihom kol nhar.', plan.kcal, plan.proteinG);
  $('mKcalTxt').textContent = tot.kcal + ' / ' + plan.kcal + ' kcal';
  $('mProtTxt').textContent = tot.prot + ' / ' + plan.proteinG + ' g';
  $('mKcalBar').style.width = Math.min(100, tot.kcal / plan.kcal * 100) + '%';
  $('mKcalBar').classList.toggle('over', tot.kcal > plan.kcal * 1.05);
  $('mProtBar').style.width = Math.min(100, tot.prot / plan.proteinG * 100) + '%';
  const v = $('mVerdict');
  if (!S.menu.length) v.textContent = '';
  else if (Math.abs(listK - plan.kcal) > plan.kcal * 0.1) v.textContent = L('L-lista kamla fiha {0} kcal, o l-hadaf {1}. Beddel l-kemmiyat bach yt9arbo.', listK, plan.kcal);
  else if (tot.kcal > plan.kcal * 1.05) v.textContent = L('Fetti l-hadaf b {0} kcal lyoum.', tot.kcal - plan.kcal);
  else if (tot.kcal >= plan.kcal * 0.9) v.textContent = L('✓ Wselti l-hadaf dyal lyoum.');
  else v.textContent = L('Ba9i lik {0} kcal o {1} g protein.', plan.kcal - tot.kcal, Math.max(0, plan.proteinG - tot.prot));
  box.innerHTML = '';
  if (!S.menu.length){
    box.append(el('div','empty', L('L-lista khawya. Zid l-wejbat li katakol (Ftour, Ghda...) b l-calories o l-protein dyalhom, bach l-majmou3 ywsel l {0} kcal.', plan.kcal)));
    $('mnAddBox').open = true;
  }
  S.menu.forEach(m => {
    const done = !!df.eaten[m.id];
    const row = el('div','menu-row' + (done ? ' done' : '')), cb = el('input');
    cb.type = 'checkbox'; cb.id = 'mn-' + m.id; cb.checked = done; cb.setAttribute('aria-label', L('{0}: klitha', m.name));
    const nm = el('div','nm', m.name);
    if (m.desc) nm.append(el('span','', m.desc));
    nm.append(el('small','', m.kcal + ' kcal · ' + m.proteinG + ' g protein'));
    const del = el('button','link', L('7iyed')); del.type = 'button';
    twoStep(del, '7iyed', () => {
      S.menu = S.menu.filter(x => x.id !== m.id);
      for (const d in S.dayfood) if (S.dayfood[d].eaten[m.id] && d === today()) delete S.dayfood[d].eaten[m.id];
      persist(); renderMeals();
    });
    nm.append(del);
    cb.addEventListener('change', () => {
      const cur = dayFood(), next = { eaten: { ...cur.eaten } }; if (cur.note) next.note = cur.note;
      if (cb.checked) next.eaten[m.id] = true; else delete next.eaten[m.id];
      $('dfMsg').textContent = saveDayFood(next) ? '' : L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.');
      renderMeals();
    });
    row.append(cb, nm); box.append(row);
  });
  if (document.activeElement !== $('dfNote')) $('dfNote').value = df.note || '';
  renderDayReport();
}
$('mnAdd').onclick = () => {
  const msg = $('mnMsg'), name = $('mnName').value.trim(), k = numOrNull('mnKcal'), p = numOrNull('mnProt');
  if (!name || k == null || p == null){ msg.textContent = L('Kteb smiya, kcal o protein.'); $(name ? (k == null ? 'mnKcal' : 'mnProt') : 'mnName').focus(); return; }
  if (S.menu.length >= 30){ msg.textContent = L('Bzaf 3la l-akhir. 7iyed chi wa7ed.'); return; }
  S.menu.push({ id: 'm' + Date.now().toString(36), name: name.slice(0, 60), desc: $('mnDesc').value.trim().slice(0, 160), kcal: Math.round(k), proteinG: Math.round(p) });
  ['mnName','mnDesc','mnKcal','mnProt'].forEach(i => $(i).value = '');
  msg.textContent = persist() ? L('Tzadet: {0}', name) : L('Ma tzadetch.');
  renderMeals();
};
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
  if (!S.menu.length) R.push('  ' + L('L-lista khawya'));
  S.menu.forEach(m => R.push('  ' + (df.eaten[m.id] ? '✓ ' : '✕ ') + m.name + ' · ' + m.kcal + ' kcal'));
  const tot = eatenTotals(t); R.push('  = ' + tot.kcal + ' / ' + plan.kcal + ' kcal · ' + tot.prot + ' / ' + plan.proteinG + ' g protein');
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

