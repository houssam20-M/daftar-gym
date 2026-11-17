// food.js - meals, plan meals, own food buttons, water, calorie nudge, weekly recap.
/* ---------- food ---------- */
// [name, kcal, protein g, off-plan]
const FOODS = [
  ['Bida meslou9a (1)',78,6],['Sder djaj 100 g',165,31],['7okka tun b l-ma',120,26],['Sardine mechwi 100 g',200,24],['Kefta 100 g',250,20],
  ['3des, t9ebsil',290,20],['Loubia, t9ebsil',300,19],['Rouz mteyeb 150 g',195,4],['Btata meslou9a 200 g',170,4],['Chofan 60 g',230,8],
  ['7lib, kas',120,8],['Lben, kas',100,8],['Raib wla yaourt nature',80,5],['Louz 30 g',175,6],['Banana',100,1],['Teffa7a',80,0],
  ['Chlada, t9ebsil',40,2],['Khodra d tajine, t9ebsil',150,4],['Zit zitoun, mel3e9a kbira',120,0],['Harira, zlafa',180,8],
  ['Khobz, rbe3 khobza',150,5,1],['Atay b sokkar, kas',60,0,1],['Monada, kas',105,0,1]
];
function todayMeals(){ const t = today(); return meals.filter(m => m.date === t); }
function addMeal(text, kcal, prot, off){
  S.meals.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2,7), ts: Date.now(), date: today(), text, kcal: Math.round(kcal || 0), proteinG: Math.round(prot || 0), off: !!off });
  const ok = persist(); renderMeals(); return ok;
}
function renderFoods(){
  const box = $('foods'); box.innerHTML = '';
  FOODS.forEach(f => {
    const name = L(f[0]), b = el('button', f[3] ? 'off' : '', (f[3] ? '✕ ' : '') + name); b.type = 'button';
    b.append(el('small','', f[1] + ' kcal · ' + f[2] + ' g'));
    b.onclick = () => { $('mealMsg').textContent = addMeal(name, f[1], f[2], f[3]) ? L('Tzadet: {0}', name) : L('Ma tzadetch.'); };
    box.append(b);
  });
}
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
  persist(); renderWater(); renderBackupBanner();
}
$('wAdd').onclick = () => setWater(1);
$('wSub').onclick = () => setWater(-1);

/* ---------- the five plan meals, one tap each ---------- */
const MEAL_PRESETS = [['Ftour',600,35],['10h',300,12],['Ghda',750,65],['9bel wla b3d l-7adid',330,40],['3cha',520,40]];
function renderPresets(){
  const box = $('mealPresets'), logged = new Set(todayMeals().map(m => m.text));
  box.innerHTML = '';
  MEAL_PRESETS.forEach(p => {
    const name = L(p[0]), done = logged.has(name);
    const b = el('button', done ? 'ok' : '', (done ? '✓ ' : '') + name); b.type = 'button';
    b.append(el('small','', '≈' + p[1] + ' kcal · ' + p[2] + ' g'));
    b.onclick = () => { $('mealMsg').textContent = addMeal(name, p[1], p[2]) ? L('Tzadet: {0}', name) : L('Ma tzadetch.'); };
    box.append(b);
  });
}
function renderMeals(){
  renderPresets();
  const list = todayMeals();
  const kcal = list.reduce((a,m) => a + m.kcal, 0), prot = list.reduce((a,m) => a + m.proteinG, 0), offs = list.filter(m => m.off).length;
  $('mKcalTxt').textContent = kcal + ' / ' + plan.kcal + ' kcal';
  $('mProtTxt').textContent = prot + ' / ' + plan.proteinG + ' g';
  const kb = $('mKcalBar'), pb = $('mProtBar');
  kb.style.width = Math.min(100, kcal / plan.kcal * 100) + '%'; kb.classList.toggle('over', kcal > plan.kcal * 1.05);
  pb.style.width = Math.min(100, prot / plan.proteinG * 100) + '%';
  const v = $('mVerdict');
  if (!list.length) v.textContent = '';
  else if (offs) v.textContent = L('✕ Lyoum kayn {0} d l-7wayej li machi f l-plan (khobz wla sokkar).', offs);
  else if (kcal > plan.kcal * 1.05) v.textContent = L('✕ Fetti l-hadaf b {0} kcal. Ghedda rje3 l l-plan, bla ma t3a9eb rassek.', kcal - plan.kcal);
  else if (kcal >= plan.kcal * 0.85 && prot >= plan.proteinG * 0.85) v.textContent = L('✓ Nhar mzyan: l-calories o l-protein f blassthom.');
  else if (kcal >= plan.kcal * 0.85) v.textContent = L('~ L-calories kamlin walakin l-protein na9es b {0} g. Zid tun, bid wla djaj.', Math.max(0, plan.proteinG - prot));
  else v.textContent = L('Ba9i lik {0} kcal o {1} g protein.', Math.max(0, plan.kcal - kcal), Math.max(0, plan.proteinG - prot));
  const box = $('mealsToday'); box.innerHTML = '';
  if (!list.length){ box.append(el('p','muted small', L('Ba9i ma sejjelti 7ta wejba lyoum.'))); return; }
  list.forEach(m => {
    const row = el('div','meal'), left = el('div','txt', (m.off ? '✕ ' : '') + (m.text || L('Wejba'))), side = el('div','side');
    side.append(el('div','num', m.kcal + ' kcal · ' + m.proteinG + ' g'));
    const del = el('button','link', L('7iyed')); del.type = 'button';
    twoStep(del, '7iyed', () => { S.meals = S.meals.filter(x => x.id !== m.id); persist(); renderMeals(); });
    side.append(del); row.append(left, side); box.append(row);
  });
}
$('mealAdd').onclick = () => {
  const text = $('mealText').value.trim(), msg = $('mealMsg');
  if (!text){ msg.textContent = L('Kteb ach kliti.'); $('mealText').focus(); return; }
  const k = numOrNull('mealKcal'), p = numOrNull('mealProt');
  if (addMeal(text, k, p, /khobz|sokkar|monada|7elwa|msemen|chebbakiya|bread|sugar|soda|cake|candy/i.test(text))){
    msg.textContent = (k == null) ? L('Tzadet bla calories. Goulha l l-coach f t-ta9rir o howa y9eddarha.') : L('Tzadet.');
    $('mealText').value = $('mealKcal').value = $('mealProt').value = '';
  } else msg.textContent = L('Ma tzadetch.');
};

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

/* ---------- his own food buttons ---------- */
function renderMyFoods(){
  const box = $('myFoods'), list = $('myFoodsList'); if (!box || !list) return;
  box.innerHTML = ''; list.innerHTML = '';
  if (!S.foods.length){ box.append(el('p','muted small', L('Ba9i ma zedti 7ta makla dyalek.'))); return; }
  S.foods.forEach(f => {
    const b = el('button', f.off ? 'off' : '', (f.off ? '✕ ' : '') + f.name); b.type = 'button';
    b.append(el('small','', f.kcal + ' kcal · ' + f.proteinG + ' g'));
    b.onclick = () => { $('mealMsg').textContent = addMeal(f.name, f.kcal, f.proteinG, f.off) ? L('Tzadet: {0}', f.name) : L('Ma tzadetch.'); };
    box.append(b);
    const row = el('div','meal'), del = el('button','link', L('7iyed')); del.type = 'button';
    twoStep(del, '7iyed', () => { S.foods = S.foods.filter(x => x !== f); persist(); renderMyFoods(); });
    row.append(el('div','txt', f.name + ' · ' + f.kcal + ' kcal · ' + f.proteinG + ' g'), del);
    list.append(row);
  });
}
$('fAdd').onclick = () => {
  const msg = $('fMsg'), name = $('fName').value.trim(), k = numOrNull('fKcal'), p = numOrNull('fProt');
  if (!name || k == null || p == null){ msg.textContent = L('Kteb smiya, kcal o protein.'); $('fName').focus(); return; }
  if (S.foods.length >= 60){ msg.textContent = L('Bzaf 3la l-akhir. 7iyed chi wa7ed.'); return; }
  S.foods.push({ name: name.slice(0, 60), kcal: Math.round(k), proteinG: Math.round(p), off: false });
  $('fName').value = $('fKcal').value = $('fProt').value = '';
  msg.textContent = persist() ? L('Tzadet: {0}', name) : L('Ma tzadetch.');
  renderMyFoods();
};
