// stats.js - the four numbers, the weight chart and the tables.
/* ---------- summary ---------- */
function renderStats(){
  const first = checkins[0], last = checkins[checkins.length-1];
  $('subline').textContent = L('{0} cm · l-hadaf {1} kg', plan.heightCm, plan.goalKg);
  $('weekChip').textContent = L('Simana {0}', dayInfo().week);
  const st = trainStreak();
  $('sxStreak').hidden = st < 2;
  $('sxStreak').textContent = st >= 2 ? L('{0} nhar mtaba3', st) : '';
  if (!last){
    ['sNow','sLost','sLeft','sBmi'].forEach(i => $(i).textContent = '—');
    $('sNowSub').textContent = L('Twzen o 3emmer tab "Simana"');
    $('sLostSub').textContent = $('sLeftSub').textContent = $('sBmiSub').textContent = ' ';
    return;
  }
  const setVal = (id, v) => { $(id).textContent = ''; $(id).append(f1(v) + ' ', el('small','', 'kg')); };
  setVal('sNow', last.weightKg); $('sNowSub').textContent = L('Akhir wazn: {0}', dShort(last.date));
  // "Progress" points the way of his goal: down when losing, up when gaining.
  const g = goalType(), dir = g === 'gain' ? 1 : -1;
  $('sLostLbl').textContent = L(g === 'gain' ? 'Zad mn l-bdya' : g === 'keep' ? 'Tbeddel mn l-bdya' : 'N9es mn l-bdya');
  const lost = (last.weightKg - first.weightKg) * dir; setVal('sLost', g === 'keep' ? last.weightKg - first.weightKg : lost);
  const days = (dnum(last.date) - dnum(first.date)) / 864e5;
  $('sLostSub').textContent = days >= 7 ? L('{0} kg f simana', f1(lost / (days/7))) : L('Mn {0} kg', f1(first.weightKg));
  const left = g === 'keep' ? Math.abs(last.weightKg - plan.goalKg) : (plan.goalKg - last.weightKg) * dir; setVal('sLeft', Math.max(0, left));
  const rate = days >= 14 ? lost / (days/7) : 0;
  $('sLeftSub').textContent = (rate > 0.1 && left > 0) ? L('Te9riban {0} simana b had l-iqa3', Math.ceil(left / rate)) : L('L-hadaf: {0} kg', plan.goalKg);
  const bmi = last.weightKg / Math.pow(plan.heightCm/100, 2);
  $('sBmi').textContent = f1(bmi);
  $('sBmiSub').textContent = bmi < 18.5 ? L('Ta7t l-wazn l-3adi') : bmi < 25 ? L('Wazn 3adi') : bmi < 30 ? L('Fo9 l-wazn chwiya') : L('L-3adi: ta7t 25');
}

/* ---------- chart ---------- */
function monthly(){
  const map = new Map();
  for (const c of checkins){ const k = c.date.slice(0,7); if (!map.has(k)) map.set(k, []); map.get(k).push(c); }
  const out = []; let prevEnd = null;
  for (const [k, arr] of map){
    const start = prevEnd == null ? arr[0].weightKg : prevEnd, end = arr[arr.length-1].weightKg;
    const vals = key => arr.map(a => a[key]).filter(x => typeof x === 'number');
    const avg = key => { const v = vals(key); return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null; };
    const sum = key => { const v = vals(key); return v.length ? v.reduce((a,b)=>a+b,0) : null; };
    out.push({ key:k, weightKg:end, start, diff:end-start, lifts:sum('lifts'), sleep:avg('sleepH'), energy:avg('energy'), diet:avg('dietDays') });
    prevEnd = end;
  }
  return out;
}
let chartRange = '12';
function renderChart(){
  const box = $('chart'); box.innerHTML = '';
  $('vRange12').textContent = view === 'week' ? L('12 simana') : L('12 chhour');
  let pts = view === 'week' ? checkins.map(c => ({ x:dnum(c.date), y:c.weightKg, label:dShort(c.date) }))
                            : monthly().map(m => ({ x:dnum(m.key + '-15'), y:m.weightKg, label:mLabel(m.key) }));
  // A long log would squash the line: show the last 12 weeks (or months) unless he asks for everything.
  if (chartRange === '12') pts = pts.slice(-12);
  if (!pts.length){ box.append(el('div','empty', L('Ba9i ma kayn 7ta wazn. Mnin t3emmer awal istibyan, l-khet dyal l-wazn ghadi yban hna.'))); $('chartLegend').hidden = true; return; }
  const W = Math.max(280, Math.round(box.clientWidth) || 340), H = 230, m = { l:36, r:58, t:14, b:28 };
  // Dashed pace line: 0.75 kg a week from the first weigh-in, only over the days he has data for.
  const PACE = 0.75;
  const pacePts = pts.length > 1 ? [pts[0], pts[pts.length-1]].map(p => ({ x:p.x, y:pts[0].y - PACE * (p.x - pts[0].x) / 864e5 / 7 })) : null;
  const ys = pts.map(p => p.y).concat(pacePts ? pacePts.map(p => p.y) : []);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  if (hi - lo < 2){ lo -= 1; hi += 1; }
  const step = [0.5,1,2,5,10,20].find(s => (hi - lo) / s <= 5) || 20;
  lo = Math.floor(lo/step)*step; hi = Math.ceil(hi/step)*step;
  const x0 = pts[0].x, x1 = pts[pts.length-1].x;
  const X = v => x1 === x0 ? (m.l + (W - m.l - m.r)/2) : m.l + (v - x0)/(x1 - x0) * (W - m.l - m.r);
  const Y = v => m.t + (hi - v)/(hi - lo) * (H - m.t - m.b);
  const NS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const svg = s('svg', { viewBox:'0 0 ' + W + ' ' + H, role:'img', 'aria-label':L('Wazn b kg 3la l-wa9t') });
  for (let v = lo; v <= hi + 1e-9; v += step){
    svg.append(s('line', { class:'grid-l', x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v) }));
    svg.append(s('text', { class:'axis-t', x:m.l - 8, y:Y(v) + 4, 'text-anchor':'end' }, String(+v.toFixed(1))));
  }
  const every = Math.max(1, Math.ceil(pts.length / (view === 'week' ? 5 : 3)));
  pts.forEach((p, i) => {
    const isLast = i === pts.length-1;
    if (!isLast && (i % every !== 0 || (pts.length-1-i) < every)) return;
    svg.append(s('text', { class:'axis-t', x:X(p.x), y:H - 8, 'text-anchor': (i === 0 && pts.length > 1) ? 'start' : 'middle' }, p.label));
  });
  if (pts.length > 1){
    const d = pts.map((p,i) => (i ? 'L' : 'M') + X(p.x).toFixed(1) + ' ' + Y(p.y).toFixed(1)).join(' ');
    svg.append(s('path', { class:'area', d: d + ' L' + X(x1).toFixed(1) + ' ' + (H - m.b) + ' L' + X(x0).toFixed(1) + ' ' + (H - m.b) + ' Z' }));
    svg.append(s('path', { class:'ln', d }));
  }
  if (pacePts) svg.append(s('line', { class:'pace', x1:X(pacePts[0].x), y1:Y(pacePts[0].y), x2:X(pacePts[1].x), y2:Y(pacePts[1].y) }));
  $('chartLegend').hidden = !pacePts;
  if (pacePts) $('chartLegendTxt').textContent = L('L-iqa3 l-mtwq3: {0} kg f simana', String(PACE));
  pts.forEach(p => svg.append(s('circle', { class:'dot', cx:X(p.x), cy:Y(p.y), r:4.5 })));
  const lastP = pts[pts.length-1];
  svg.append(s('text', { class:'end-t', x:X(lastP.x) + 9, y:Y(lastP.y) + 4 }, f1(lastP.y) + ' kg'));
  const cross = s('line', { class:'cross', y1:m.t, y2:H - m.b, x1:0, x2:0, visibility:'hidden' });
  svg.append(cross);
  const tip = el('div','tip'); tip.hidden = true;
  box.append(svg, tip);
  const move = ev => {
    const r = svg.getBoundingClientRect(); const px = (ev.clientX - r.left) / r.width * W;
    let best = pts[0]; for (const p of pts) if (Math.abs(X(p.x) - px) < Math.abs(X(best.x) - px)) best = p;
    cross.setAttribute('x1', X(best.x)); cross.setAttribute('x2', X(best.x)); cross.setAttribute('visibility','visible');
    tip.textContent = best.label + ' · ' + f1(best.y) + ' kg'; tip.hidden = false;
    tip.style.left = Math.min(86, Math.max(14, X(best.x) / W * 100)) + '%'; tip.style.top = (Y(best.y) / H * r.height) + 'px';
  };
  svg.addEventListener('pointermove', move); svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', () => { tip.hidden = true; cross.setAttribute('visibility','hidden'); });
  if (pts.length === 1) box.append(el('p','muted small', L('N9ta wa7da daba. Mn simana jaya ghadi yban l-khet.')));
}

/* ---------- tables ---------- */
function renderTable(){
  const wrap = $('tableWrap'); wrap.innerHTML = '';
  if (!checkins.length) return;
  const t = el('table'), th = el('thead'), tb = el('tbody'), hr = el('tr');
  const heads = view === 'week'
    ? [['Date',0],['Wazn',1],['Far9',1],['7adid',1],['Mchi',1],['N3ass',1],['Ta9a',1],['Makla',1],['Khobz/sokkar',0],['Molahadat',0],['',0]]
    : [['Chher',0],['Bdya',1],['Niheya',1],['Far9',1],['7adid',1],['N3ass',1],['Ta9a',1],['Makla',1]];
  heads.forEach(h => hr.append(el('th', h[1] ? 'n' : '', L(h[0]))));
  th.append(hr); t.append(th, tb);
  const num = (v, suf) => { const td = el('td','n'); td.textContent = (typeof v === 'number') ? (Number.isInteger(v) ? v : f1(v)) + (suf || '') : '—'; return td; };
  if (view === 'week'){
    [...checkins].reverse().forEach((c, i, arr) => {
      const prev = arr[i+1], tr = el('tr');
      tr.append(el('td','num', c.date), num(c.weightKg, ' kg'));
      const d = el('td','n'); diffCell(d, prev ? c.weightKg - prev.weightKg : null); tr.append(d);
      tr.append(num(c.lifts), num(c.walkDays, '/7'), num(c.sleepH, ' h'), num(c.energy, '/5'), num(c.dietDays, '/7'));
      tr.append(el('td','', c.cheat ? L(c.cheat) : '—'));
      const note = el('td','', c.note ? L(c.note) : ''); note.style.minWidth = '160px'; tr.append(note);
      const act = el('td'), ed = el('button','link', L('Beddel')), del = el('button','link', L('7iyed')); ed.type = del.type = 'button';
      ed.onclick = () => { fillForm(c); location.hash = 'simana'; };
      twoStep(del, '7iyed', () => { delete S.checkins[c.date]; persist(); renderAll(); });
      act.style.whiteSpace = 'nowrap'; act.append(ed, del); tr.append(act); tb.append(tr);
    });
  } else {
    [...monthly()].reverse().forEach(mo => {
      const tr = el('tr'); tr.append(el('td','', mLabel(mo.key)), num(mo.start, ' kg'), num(mo.weightKg, ' kg'));
      const d = el('td','n'); diffCell(d, mo.diff); tr.append(d);
      tr.append(num(mo.lifts), num(mo.sleep, ' h'), num(mo.energy, '/5'), num(mo.diet, '/7')); tb.append(tr);
    });
  }
  wrap.append(t);
}
