// store.js - the saved data: localStorage, clean, load, save.
/* ---------- storage: everything lives in this phone's localStorage ---------- */
const KEY = 'daftar-gym-v1';
// No built-in numbers: every phone starts empty and fills these in on the first-run screen.
const DEF = { heightCm:null, goalKg:null, kcal:null, proteinG:null, startDate:null, sex:null, age:null, kcalAt:null };
let S = { plan:{}, settings:{}, checkins:{}, sessions:{}, meals:[], rests:{}, water:{}, foods:[], swaps:{} };
let plan = { ...DEF }, checkins = [], sessions = [], meals = [], view = 'week', storageOk = true, lang = 'en';
const $ = id => document.getElementById(id);
function clean(o){
  const out = { plan:{}, settings:{}, checkins:{}, sessions:{}, meals:[], rests:{}, water:{}, foods:[], swaps:{} };
  if (!o || typeof o !== 'object') return out;
  if (o.plan && typeof o.plan === 'object') for (const k in DEF) if (o.plan[k] != null) out.plan[k] = o.plan[k];
  if (o.settings && typeof o.settings === 'object'){
    if (['auto','light','dark'].includes(o.settings.theme)) out.settings.theme = o.settings.theme;
    if (['dar','en'].includes(o.settings.lang)) out.settings.lang = o.settings.lang;
    if (typeof o.settings.backupAt === 'string' && !isNaN(Date.parse(o.settings.backupAt))) out.settings.backupAt = o.settings.backupAt;
    if (Number(o.settings.v) === 2) out.settings.v = 2;
  }
  const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (o.checkins && typeof o.checkins === 'object') for (const k in o.checkins) { const c = o.checkins[k]; if (isDate(k) && c && typeof c.weightKg === 'number') out.checkins[k] = { ...c, date:k }; }
  if (o.sessions && typeof o.sessions === 'object') for (const k in o.sessions) { const s = o.sessions[k]; if (isDate(k) && s && typeof s === 'object') out.sessions[k] = { ...s, date:k }; }
  if (o.rests && typeof o.rests === 'object') for (const k in o.rests) if (isDate(k) && o.rests[k]) out.rests[k] = true;
  if (o.water && typeof o.water === 'object') for (const k in o.water) { const n = Number(o.water[k]); if (isDate(k) && n > 0) out.water[k] = Math.min(30, Math.round(n)); }
  if (Array.isArray(o.foods)) out.foods = o.foods.filter(f => f && f.name).slice(0, 60).map(f => ({
    name: String(f.name).slice(0, 60), kcal: Math.max(0, Math.min(3000, Math.round(Number(f.kcal) || 0))),
    proteinG: Math.max(0, Math.min(300, Math.round(Number(f.proteinG) || 0))), off: !!f.off }));
  if (o.swaps && typeof o.swaps === 'object') for (const k in o.swaps) if (typeof o.swaps[k] === 'string' && o.swaps[k]) out.swaps[k] = o.swaps[k];
  if (Array.isArray(o.meals)) out.meals = o.meals.filter(m => m && isDate(m.date || '')).map(m => ({ id:String(m.id || (m.ts + '-' + Math.random().toString(36).slice(2,7))), ts:Number(m.ts) || 0, date:m.date, text:String(m.text || ''), kcal:Number(m.kcal) || 0, proteinG:Number(m.proteinG) || 0, off:!!m.off }));
  return out;
}
function load(){
  try { const raw = localStorage.getItem(KEY); if (raw) S = clean(JSON.parse(raw)); } catch (e) { storageOk = false; }
  // One-time move: English is now the app's main language. After this, his own choice is kept.
  if (S.settings.v !== 2){ S.settings.v = 2; delete S.settings.lang; persist(); }
  else sync();
}
function persist(){ try { localStorage.setItem(KEY, JSON.stringify(S)); storageOk = true; } catch (e) { storageOk = false; } sync(); showStorageState(); return storageOk; }
function sync(){
  plan = { ...DEF, ...S.plan };
  lang = S.settings.lang === 'dar' ? 'dar' : 'en'; // English is the main language; Darija is the option.
  checkins = Object.values(S.checkins).sort((a,b) => a.date < b.date ? -1 : 1);
  sessions = Object.values(S.sessions).sort((a,b) => a.date < b.date ? 1 : -1);
  meals = [...S.meals].sort((a,b) => a.ts - b.ts);
}
function showStorageState(){ const b = $('banner'); b.hidden = storageOk; b.textContent = storageOk ? '' : L('Had l-mtsaffe7 ma khellanich n7fed l-ma3lomat. Khrej mn l-mode privé wla jerreb Chrome.'); }
