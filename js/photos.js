// photos.js - body photos in IndexedDB (never in the backup).
/* ---------- body photos: this phone only, never in the backup ---------- */
const PH_DB = 'daftar-gym-photos', PH_STORE = 'p';
function phOpen(){
  return new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('no indexeddb'));
    const rq = indexedDB.open(PH_DB, 1);
    rq.onupgradeneeded = () => { const db = rq.result; if (!db.objectStoreNames.contains(PH_STORE)) db.createObjectStore(PH_STORE, { keyPath:'id' }); };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
function phRun(mode, run){
  return phOpen().then(db => new Promise((res, rej) => {
    const tx = db.transaction(PH_STORE, mode), st = tx.objectStore(PH_STORE), rq = run(st);
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
    tx.oncomplete = () => db.close();
  }));
}
const phAll = () => phRun('readonly', st => st.getAll()).then(list => (list || []).sort((a,b) => a.date < b.date ? 1 : -1));
const phPut = rec => phRun('readwrite', st => st.put(rec));
const phDel = id => phRun('readwrite', st => st.delete(id));
// A phone photo is 3-5 MB; 720 px JPEG is about 80 KB, which the browser happily keeps.
function shrinkPhoto(file){
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 720, sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => rej(new Error('bad image'));
      img.src = fr.result;
    };
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(file);
  });
}
function openPhoto(p){
  $('phImg').src = p.data; $('phDate').textContent = dShort(p.date);
  $('phView').hidden = false;
  const del = $('phDel'); del.textContent = L('7iyed tsawira'); del.dataset.sure = '';
  twoStep(del, '7iyed tsawira', async () => {
    try { await phDel(p.id); } catch (e) {}
    $('phView').hidden = true; $('phImg').src = '';
    $('phMsg').textContent = L('Tsawira t7eydat.'); renderPhotos();
  });
}
async function renderPhotos(){
  const box = $('phList'); if (!box) return;
  box.innerHTML = '';
  let list = [];
  try { list = await phAll(); } catch (e) {}
  if (!list.length){ box.append(el('p','muted small', L('Ma kaynch tsawer ba9i.'))); return; }
  list.forEach(p => {
    const b = el('button'), img = el('img');
    b.type = 'button'; img.src = p.data; img.alt = L('Tsawira') + ' ' + dShort(p.date);
    b.append(img, el('span','d', dShort(p.date))); b.onclick = () => openPhoto(p);
    box.append(b);
  });
}
$('phAdd').onclick = () => $('phFile').click();
$('phFile').addEventListener('change', async () => {
  const f = $('phFile').files && $('phFile').files[0]; if (!f) return;
  const msg = $('phMsg');
  try {
    const data = await shrinkPhoto(f);
    await phPut({ id: today() + '-' + Date.now(), date: today(), data });
    msg.textContent = L('Tsawira tzadet.'); renderPhotos();
  } catch (e) { msg.textContent = L('Ma 9dertch nzid tsawira.'); }
  $('phFile').value = '';
});
$('phClose').onclick = () => { $('phView').hidden = true; $('phImg').src = ''; };
