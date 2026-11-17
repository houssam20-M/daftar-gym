// helpers.js - small tools: dates, numbers, DOM, two-step delete.
/* ---------- helpers ---------- */
const f1 = n => (n == null || isNaN(n)) ? '—' : Number(n).toFixed(1);
const iso = d => { const z = new Date(d.getTime() - d.getTimezoneOffset()*60000); return z.toISOString().slice(0,10); };
const today = () => iso(new Date());
const dnum = s => new Date(s + 'T00:00:00').getTime();
const MONTHS = { dar:['Yanayer','Fbrayer','Mars','Abril','May','Yunyu','Yulyuz','Ghucht','Chutanbir','Uktubr','Nuwanbir','Dujanbir'],
                 en:['January','February','March','April','May','June','July','August','September','October','November','December'] };
const dShort = s => { const p = s.split('-'); return p[2] + '/' + p[1]; };
const mLabel = k => { const p = k.split('-'); return MONTHS[lang][+p[1]-1] + ' ' + p[0]; };
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
// Replays the rise-in on a list of elements, one after the other.
function animate(list){ Array.from(list).forEach((e, i) => { e.classList.remove('anim'); void e.offsetWidth; e.style.setProperty('--i', i); e.classList.add('anim'); }); }
function signed(n){ return (n > 0 ? '+' : '') + f1(n); }
function diffCell(td, n){ if (n == null) { td.textContent = '—'; return; } td.textContent = signed(n); if (n < -0.05) td.classList.add('down'); else if (n > 0.05) td.classList.add('up'); }
function radioVal(name){ const r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }
function setRadio(name, v){ document.querySelectorAll('input[name="' + name + '"]').forEach(r => r.checked = (v != null && r.value === String(v))); }
const numOrNull = id => { const v = $(id).value.trim().replace(',', '.'); if (v === '') return null; const n = Number(v); return isNaN(n) ? null : n; };
// A destructive button asks once more before it runs. `key` is the Darija label.
function twoStep(btn, key, run){
  btn.onclick = () => {
    if (btn.dataset.sure !== '1'){ btn.dataset.sure = '1'; btn.textContent = L('Mt2ekked?'); setTimeout(() => { btn.dataset.sure = ''; btn.textContent = L(key); }, 4000); return; }
    btn.dataset.sure = ''; btn.textContent = L(key); run();
  };
}

// A note box that grows with its text: one line when empty, one more line for each line he writes.
function autoGrow(t){ if (!t) return; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('grow')) autoGrow(e.target); });
