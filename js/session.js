// session.js - the A/B/C programme, the daily session, warm-up, swaps, rest day, timer, progression.
/* ---------- exercise progression: what the last set says about next time ---------- */
function renderProgression(){
  const box = $('progList'); if (!box) return;
  box.innerHTML = '';
  const rows = [], seen = new Set();
  // sessions are newest first: the first hit per exercise is his latest set.
  sessions.forEach(s => Object.keys(s.items || {}).forEach(k => {
    const it = s.items[k], meta = EXINFO[k];
    if (!meta || seen.has(k) || !it) return;
    if (typeof it.kg !== 'number' && typeof it.reps !== 'number') return;
    seen.add(k); rows.push({ meta, date:s.date, kg:it.kg, reps:it.reps });
  }));
  if (!rows.length){ box.append(el('p','muted small', L('Ba9i ma kayn 7ta wazn f l-exercices.'))); return; }
  rows.forEach(r => {
    const target = Number(repTarget(r.meta.reps)) || 12;
    let hint, cls = '';
    if (r.reps == null){ hint = L('Kteb reps l-merra jaya'); }
    else if (r.reps >= target){ hint = L('Zid 2.5 kg'); cls = ' good'; }
    else if (r.reps >= target - 4){ hint = L('Bqa f nefs l-wazn, zid reps'); }
    else { hint = L('N9es chwiya'); cls = ' warn'; }
    const row = el('div','prow'), nm = el('div','nm', L(r.meta.name));
    nm.append(el('span','num', (r.kg != null ? r.kg + ' kg' : '—') + (r.reps != null ? ' × ' + r.reps : '') + ' · ' + dShort(r.date)));
    row.append(nm, el('span','pill' + cls, hint)); box.append(row);
  });
}

/* ---------- weekly form ---------- */
function fillForm(c){
  $('ciDate').value = c.date; $('ciWeight').value = c.weightKg == null ? '' : c.weightKg; $('ciWaist').value = c.waistCm == null ? '' : c.waistCm;
  $('ciLift').value = c.lifts == null ? '' : c.lifts; $('ciWalk').value = c.walkDays == null ? '' : c.walkDays; $('ciSleep').value = c.sleepH == null ? '' : c.sleepH;
  $('ciDiet').value = c.dietDays == null ? '' : c.dietDays; $('ciNote').value = c.note || '';
  setRadio('ciCheat', c.cheat); setRadio('ciEnergy', c.energy);
  $('ciMsg').textContent = L('Kat3eddel simana dyal {0}', c.date);
}
$('ciForm').addEventListener('submit', ev => {
  ev.preventDefault();
  const msg = $('ciMsg'), date = $('ciDate').value, w = numOrNull('ciWeight');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)){ msg.textContent = L('Khtar date.'); $('ciDate').focus(); return; }
  if (w == null || w < 40 || w > 250){ msg.textContent = L('Kteb l-wazn b kg (matalan 114.2).'); $('ciWeight').focus(); return; }
  const doc = { date, weightKg: Math.round(w*10)/10, savedAt: new Date().toISOString() };
  const opt = { waistCm:numOrNull('ciWaist'), lifts:numOrNull('ciLift'), walkDays:numOrNull('ciWalk'), sleepH:numOrNull('ciSleep'), dietDays:numOrNull('ciDiet') };
  for (const k in opt) if (opt[k] != null) doc[k] = opt[k];
  const e = radioVal('ciEnergy'); if (e) doc.energy = Number(e);
  const ch = radioVal('ciCheat'); if (ch) doc.cheat = ch;
  const note = $('ciNote').value.trim(); if (note) doc.note = note;
  S.checkins[date] = doc;
  if (!persist()){ msg.textContent = L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.'); return; }
  msg.textContent = L('Tsejjlat simana dyal {0}.', date);
  ['ciWaist','ciLift','ciWalk','ciSleep','ciDiet','ciNote','ciWeight'].forEach(i => $(i).value = '');
  setRadio('ciCheat', null); setRadio('ciEnergy', null); renderAll();
});

/* ---------- today's session ---------- */
// [key, name, sets, reps, takes a weight]
const PROGRAM = {
  A: { am:[['leg-press','Leg press',3,'10-12',1],['plank','Plank',3,'20-40 tanya',0],['mchi','Mchi 3la tapis',1,'20-30 d9i9a',0]],
       pm:[['chest-press','Chest press',3,'10-12',1],['lat-pulldown','Lat pulldown',3,'10-12',1],['lateral-raises','Lateral raises',2,'12-15',1]] },
  B: { am:[['romanian-deadlift','Romanian deadlift b haltères',3,'10',1],['leg-curl','Leg curl',2,'12',1],['mchi','Mchi 3la tapis',1,'20-30 d9i9a',0]],
       pm:[['seated-row','Seated row',3,'10-12',1],['shoulder-press','Shoulder press b haltères',3,'10-12',1],['biceps-curl','Biceps curl',2,'12',1]] },
  C: { am:[['goblet-squat','Goblet squat (wla squat 3la banc)',3,'10',1],['calf-raises','Calf raises',3,'15',1],['mchi','Mchi 3la tapis',1,'20-30 d9i9a',0]],
       pm:[['incline-press','Développé incliné b haltères',3,'10-12',1],['cable-row','Tirage horizontal',3,'10-12',1],['triceps-pushdown','Triceps pushdown',2,'12',1]] },
  L: { am:[['cardio','Vélo wla tapis, khfif',1,'30 d9i9a',0]], pm:[['stretch','Étirements',1,'10 d9ay9',0],['plank','Plank',3,'20-40 tanya',0]] }
};
// Warm-up before every session: 5 minutes, no weight.
const WARM = [['w-walk','Mchi khfif 5 d9ay9'],['w-arm','Dawran dyal l-katif'],['w-hip','Dawran dyal l-7awd o r-rokba'],['w-squat','Squat bla wazn']];
// Substitutes, for a machine that is taken or a joint that hurts.
const ALTS = {
  'leg-press':[['goblet-squat','Goblet squat (wla squat 3la banc)',3,'10',1],['leg-ext','Leg extension',3,'12-15',1]],
  'chest-press':[['incline-press','Développé incliné b haltères',3,'10-12',1],['pushup','Pompes 3la l-banc',3,'8-12',0]],
  'lat-pulldown':[['seated-row','Seated row',3,'10-12',1],['pulldown-machine','Tirage 3la l-machine',3,'10-12',1]],
  'romanian-deadlift':[['leg-curl','Leg curl',2,'12',1]],
  'leg-curl':[['romanian-deadlift','Romanian deadlift b haltères',3,'10',1]],
  'biceps-curl':[['hammer-curl','Hammer curl',2,'12',1]],
  'cable-row':[['seated-row','Seated row',3,'10-12',1]],
  'triceps-pushdown':[['triceps-over','Extension triceps b l-7bla',2,'12',1]],
  'mchi':[['cardio','Vélo wla tapis, khfif',1,'30 d9i9a',0]]
};
// Every exercise name and rep target in one place (progression list, report).
const EXINFO = (() => {
  const m = {};
  const add = x => { if (!m[x[0]]) m[x[0]] = { name: x[1], reps: x[3] }; };
  Object.values(PROGRAM).forEach(d => ['am','pm'].forEach(p => d[p].forEach(add)));
  Object.values(ALTS).forEach(l => l.forEach(add));
  WARM.forEach(add);
  return m;
})();
// The substitute he picked for a slot, if any.
function exActual(x){ const list = ALTS[x[0]], sw = S.swaps[x[0]]; if (list && sw){ const hit = list.find(a => a[0] === sw); if (hit) return hit; } return x; }
const repTarget = s => { const m = String(s).match(/\d+/g); return m ? m[m.length - 1] : ''; };
let sessDirty = false, sessShown = '';
// His own choice, set on the first-run screen and in Kter: sessions per day and training days per week.
// Older saves have neither: one session a day, every day.
const sessPerDay = () => Number(plan.sessionsPerDay) === 2 ? 2 : 1;
const daysPerWeek = () => { const n = Number(plan.daysPerWeek); return n >= 3 && n <= 7 ? n : 7; };
// One 7-day cycle per choice: 1 = weights day, 'L' = light day, 0 = rest day. Rest days are spread out.
const WEEK_PATTERN = { 7:[1,1,1,1,1,1,'L'], 6:[1,1,1,1,1,1,0], 5:[1,1,0,1,1,1,0], 4:[1,1,0,1,1,0,0], 3:[1,0,1,0,1,0,0] };
// One session: walk first, then all the weights. Two sessions: morning and evening, as in PROGRAM.
function twoADay(){ return sessPerDay() === 2; }
const isCardio = x => x[0] === 'mchi' || x[0] === 'cardio';
function sessionParts(prog){
  if (twoADay()) return [['Sba7', prog.am], ['3chiya', prog.pm]];
  const all = [...prog.am, ...prog.pm], plank = all.filter(x => x[0] === 'plank');
  return [['Mchi (bda bih)', all.filter(isCardio)], ['L-7adid', all.filter(x => !isCardio(x) && x[0] !== 'plank').concat(plank)]];
}
// Real dates one by one: adding 24h to a timestamp breaks on daylight-saving days.
function eachDate(from, to, fn){ const d = new Date(from + 'T00:00:00'), end = new Date(to + 'T00:00:00'); while (d <= end){ fn(iso(d)); d.setDate(d.getDate() + 1); } }
function isRest(d){ return !!S.rests[d]; }
// What the plan says for a date. A rest day he marks himself does not move the rotation forward.
// The A/B/C letter only moves on weights days, so it carries on across the planned rest days.
function planDay(date){
  const raw = Math.round((dnum(date) - dnum(plan.startDate)) / 864e5), pre = raw < 0;
  let rest = 0;
  if (!pre) eachDate(plan.startDate, date, d => { if (isRest(d)) rest++; });
  const idx = Math.max(0, raw - rest), pat = WEEK_PATTERN[daysPerWeek()], pos = idx % 7;
  const perWeek = pat.filter(x => x === 1).length;
  const before = Math.floor(idx / 7) * perWeek + pat.slice(0, pos).filter(x => x === 1).length;
  const letter = ['A','B','C'][before % 3], slot = pre ? 1 : pat[pos];
  const planned = slot === 1 ? letter : slot === 'L' ? 'L' : 'R';
  const restToday = !pre && isRest(date);
  return { day: restToday ? 'R' : planned, next: planned === 'R' ? letter : planned, week: pre ? 1 : Math.floor(idx / 7) + 1,
           pre, restToday, planRest: !restToday && planned === 'R', restDays: rest };
}
function dayInfo(){ return planDay(today()); }
// Days in a row with a ticked session or a marked rest day. A today that is still empty does not break the chain.
function trainStreak(){
  const has = d => isRest(d) || planDay(d).planRest || !!(S.sessions[d] && Object.values(S.sessions[d].items || {}).some(i => i.done));
  if (!plan.startDate) return 0;
  const d = new Date();
  if (!has(iso(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dnum(iso(d)) >= dnum(plan.startDate) && has(iso(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}
function lastEntry(key){
  const t = today();
  for (const s of sessions) if (s.date < t && s.items && s.items[key] && (typeof s.items[key].kg === 'number' || typeof s.items[key].reps === 'number')) return s.items[key];
  return null;
}
function renderSession(force){
  const info = dayInfo(), mine = S.sessions[today()];
  const stamp = today() + info.day + info.week + lang + (mine ? mine.savedAt : '');
  if (!force && (sessDirty || stamp === sessShown)) return;
  sessShown = stamp; sessDirty = false;
  const body = $('sxBody'); body.innerHTML = '';
  $('sxDay').textContent = info.restToday ? L('Rya7a') : info.day === 'L' ? L('Nhar khfif') : L('Nhar {0}', info.day);
  $('sxRest').textContent = info.restToday ? L('Rje3 l l-7adid') : L('Lyoum rya7a');
  $('sxForm').hidden = info.restToday;
  $('restBox').hidden = info.restToday;
  $('sxRest').hidden = !!info.planRest;
  if (info.planRest){
    $('sxDay').textContent = L('Rya7a'); $('sxForm').hidden = true; $('restBox').hidden = true;
    $('sxSub').textContent = L('Lyoum rya7a f l-plan dyalek ({0} iyam d l-7adid f simana).', daysPerWeek());
    body.append(el('div','empty', L('Nhar rya7a. Mchi chwiya ila bghiti, o rje3 ghedda.')));
    return;
  }
  if (info.restToday){
    $('sxSub').textContent = L('Lyoum rya7a. Ghddan katbda mn nhar {0}.', info.next);
    body.append(el('div','empty', L('Nhar rya7a. Ma kayn 7ta seance lyoum.')));
    return;
  }
  $('sxSub').textContent = info.pre ? L('Katbda nhar {0}. Hada howa awal nhar.', dShort(plan.startDate)) : (info.week <= 2 ? L('Simana {0}: 2 sets ghir, wazn khfif, khelli 3-4 reps f l-jib.', info.week) : L('Simana {0}: khelli 2-3 reps f l-jib. Zid l-wazn mnin tdir 12 n9iyin.', info.week));
  const prog = PROGRAM[info.day];
  // The warm-up matters on a training day; a light day is already easy.
  const anyKg = [...prog.am, ...prog.pm].some(x => exActual(x)[4]);
  if (anyKg){ const head = el('div','ex-head'); head.append(el('span'), el('span','','kg'), el('span','','reps')); body.append(head); }
  if (info.day !== 'L'){
    body.append(el('div','part', L('Warm-up 5 min')));
    WARM.forEach(w => {
      const key = w[0], name = L(w[1]), saved = (mine && mine.items && mine.items[key]) || {};
      const row = el('div','ex'), cb = el('input'); cb.type = 'checkbox'; cb.id = 'sx-' + key + '-done'; cb.checked = !!saved.done;
      cb.setAttribute('aria-label', L('{0}: derta', name));
      const nm = el('div','nm', name); nm.style.gridColumn = '2 / -1';
      row.append(cb, nm);
      if (saved.done) row.classList.add('done');
      cb.addEventListener('change', () => { row.classList.toggle('done', cb.checked); saveSession(); });
      body.append(row);
    });
  }
  sessionParts(prog).forEach(part => {
    if (!part[1].length) return;
    body.append(el('div','part', L(part[0])));
    part[1].forEach(base => {
      const x = exActual(base), key = x[0], name = L(x[1]), sets = x[2], reps = L(x[3]), hasKg = x[4];
      const saved = (mine && mine.items && mine.items[key]) || {};
      const n = info.week <= 2 ? Math.min(sets, 2) : sets;
      const row = el('div','ex'), cb = el('input'); cb.type = 'checkbox'; cb.id = 'sx-' + key + '-done'; cb.checked = !!saved.done; cb.setAttribute('aria-label', L('{0}: derta', name));
      const nm = el('div','nm', name), prev = hasKg ? lastEntry(key) : null;
      nm.append(el('span','num', (sets > 1 || hasKg ? n + ' x ' : '') + reps + (prev && prev.kg != null ? L(' · akhir merra {0} kg', prev.kg) + (prev.reps != null ? ' × ' + prev.reps : '') : '')));
      if (ALTS[base[0]]){
        const sw = el('button','link', L('Beddel l-exercice')); sw.type = 'button';
        sw.onclick = () => showSwaps(row, base);
        nm.append(sw);
      }
      row.append(cb, nm);
      if (hasKg){
        const kg = el('div','kg'), inp = el('input'); inp.type = 'number'; inp.step = '0.5'; inp.min = '0'; inp.max = '500'; inp.inputMode = 'decimal'; inp.id = 'sx-' + key + '-kg';
        inp.setAttribute('aria-label', L('{0}: wazn b kg', name)); if (typeof saved.kg === 'number') inp.value = saved.kg; else if (prev && prev.kg != null) inp.placeholder = prev.kg;
        inp.addEventListener('input', () => { sessDirty = true; }); kg.append(inp);
        const rp = el('div','kg'), rin = el('input'); rin.type = 'number'; rin.step = '1'; rin.min = '0'; rin.max = '100'; rin.inputMode = 'numeric'; rin.id = 'sx-' + key + '-reps';
        rin.setAttribute('aria-label', L('{0}: reps', name)); if (typeof saved.reps === 'number') rin.value = saved.reps; else rin.placeholder = repTarget(x[3]);
        rin.addEventListener('input', () => { sessDirty = true; });
        rp.append(rin); row.append(kg, rp);
      } else nm.style.gridColumn = '2 / -1';
      if (saved.done) row.classList.add('done');
      cb.addEventListener('change', () => { row.classList.toggle('done', cb.checked); saveSession(); });
      body.append(row);
    });
  });
  setRadio('sxFeel', mine ? mine.feel : null); $('sxNote').value = mine && mine.note ? mine.note : '';
}
// The pills that let him swap an exercise, shown under the row.
function showSwaps(row, base){
  const old = row.nextElementSibling;
  if (old && old.classList.contains('swaps')){ old.remove(); return; }
  const box = el('div','swaps'), cur = S.swaps[base[0]] || '';
  const opts = [{ key:'', label:L('Rje3 l l-asl') + ' · ' + L(base[1]) }].concat((ALTS[base[0]] || []).map(a => ({ key:a[0], label:L(a[1]) })));
  opts.forEach(o => {
    const b = el('button','', o.label); b.type = 'button';
    b.setAttribute('aria-pressed', o.key === cur ? 'true' : 'false');
    b.onclick = () => {
      if (o.key) S.swaps[base[0]] = o.key; else delete S.swaps[base[0]];
      persist(); renderSession(true); $('sxMsg').textContent = L('Beddelna: {0}', o.label);
    };
    box.append(b);
  });
  row.after(box);
}
function saveSession(){
  const info = dayInfo();
  if (info.restToday || info.planRest) return; // a rest day has no session to save
  const msg = $('sxMsg'), prog = PROGRAM[info.day], items = {};
  WARM.forEach(w => { const cb = $('sx-' + w[0] + '-done'); if (cb && cb.checked) items[w[0]] = { done:true }; });
  [...prog.am, ...prog.pm].forEach(base => {
    const x = exActual(base), key = x[0], it = { done: $('sx-' + key + '-done').checked };
    if (x[4]){ const v = $('sx-' + key + '-kg').value.trim().replace(',', '.'), n = Number(v); if (v !== '' && !isNaN(n) && n >= 0) it.kg = n; }
    if (x[4]){ const v = $('sx-' + key + '-reps').value.trim(), n = Number(v); if (v !== '' && !isNaN(n) && n >= 0) it.reps = Math.round(n); }
    if (it.done || it.kg != null || it.reps != null) items[key] = it;
  });
  const feel = radioVal('sxFeel'), note = $('sxNote').value.trim();
  if (!Object.keys(items).length && !feel && !note){ msg.textContent = L('3ellem 3la l-exercices li derti wla kteb l-awzan.'); return; }
  const doc = { date: today(), day: info.day, week: info.week, items, savedAt: new Date().toISOString() };
  if (feel) doc.feel = feel; if (note) doc.note = note;
  S.sessions[doc.date] = doc;
  if (!persist()){ msg.textContent = L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.'); return; }
  sessDirty = false; sessShown = today() + info.day + info.week + lang + doc.savedAt;
  const done = Object.values(items).filter(i => i.done).length, total = document.querySelectorAll('#sxBody input[type="checkbox"]').length;
  msg.textContent = L('Tsejjlat ({0}/{1}).', done, total) + (done === total ? L(' Bsa7a o ra7a.') : '');
  renderProgression(); renderRecap(); renderDayReport();
}
$('sxSave').onclick = saveSession;
$('sxNote').addEventListener('input', () => { sessDirty = true; });
document.querySelectorAll('input[name="sxFeel"]').forEach(r => r.addEventListener('change', saveSession));

/* ---------- rest day ---------- */
$('sxRest').onclick = () => {
  const t = today(), msg = $('sxRestMsg');
  if (S.rests[t]) delete S.rests[t]; else S.rests[t] = true;
  if (!persist()){ msg.textContent = L('Ma tsejjlatch: l-mtsaffe7 ma khellanich n7fed.'); return; }
  msg.textContent = S.rests[t] ? L('Rya7a tsejjlat. L-rotation b9at 3la 7alha.') : L('Rya7a tms7at.');
  renderSession(true); renderStats(); renderBackupBanner();
};

/* ---------- rest timer ---------- */
let restSec = 60, restTick = null, restEnd = 0, audioCtx = null;
function restShow(){ const left = Math.max(0, Math.ceil((restEnd - Date.now()) / 1000)); $('restTxt').textContent = Math.floor(left/60) + ':' + String(left % 60).padStart(2,'0'); }
function restStop(text){ clearInterval(restTick); restTick = null; restEnd = 0; $('restBox').classList.remove('on'); $('restGo').textContent = L('Bda'); if (text != null) $('restTxt').textContent = text; }
function restBeep(){
  try { if (navigator.vibrate) navigator.vibrate([220,120,220,120,220]); } catch (e) {}
  try {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.14;
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
}
$('restLen').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  restSec = Number(b.dataset.s) || 60;
  $('restLen').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  if (!restTick) $('restTxt').textContent = '0:00';
});
$('restGo').onclick = () => {
  if (restTick){ restStop('0:00'); return; }
  // The tap is the gesture that lets the phone play the beep later.
  try { const C = window.AudioContext || window.webkitAudioContext; if (C && !audioCtx) audioCtx = new C(); if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {}
  restEnd = Date.now() + restSec * 1000;
  $('restBox').classList.add('on'); $('restGo').textContent = L('7bes'); restShow();
  clearInterval(restTick);
  restTick = setInterval(() => {
    if (Date.now() >= restEnd){ restStop(L('Sali. Rje3 l l-7adid.')); restBeep(); }
    else restShow();
  }, 250);
};
