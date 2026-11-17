// views/kter.js - markup of the "Kter" tab: settings, coach report, plan, backup.
// Only HTML lives here. The code that fills it and handles its buttons: js/report.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" data-view="kter">
  <h2>I3dadat</h2>
  <div class="field"><span class="flabel">Lon</span>
    <div class="seg" role="radiogroup" aria-label="Lon">
      <input type="radio" name="setTheme" id="setThemeA" value="auto"><label for="setThemeA">Auto</label>
      <input type="radio" name="setTheme" id="setThemeL" value="light"><label for="setThemeL">Bid</label>
      <input type="radio" name="setTheme" id="setThemeD" value="dark"><label for="setThemeD">K7el</label>
    </div>
  </div>
  <div class="field"><span class="flabel">Lugha</span>
    <div class="seg" role="radiogroup" aria-label="Lugha">
      <input type="radio" name="setLang" id="setLangE" value="en"><label for="setLangE">English</label>
      <input type="radio" name="setLang" id="setLangD" value="dar"><label for="setLangD">Darija</label>
    </div>
  </div>
</section>

<section class="block" data-view="kter">
  <div>
    <h2>Ta9rir l l-coach</h2>
    <p class="muted small">Dghet "Nskh t-ta9rir" o lse9o l l-coach dyalek (Claude, OpenCode, wla chi wa7ed). Fih l-wazn, l-awzan dyal l-exercices, o l-makla.</p>
  </div>
  <div class="row"><button class="primary" type="button" id="repCopy">Nskh t-ta9rir</button><span class="msg" id="repMsg" role="status"></span></div>
  <textarea class="mono" id="repBox" readonly hidden aria-label="Ta9rir"></textarea>
</section>

<section class="block" data-view="kter">
  <div>
    <h2>L-plan dyali</h2>
    <p class="muted small">Beddel hadchi ghir ila l-wazn dyalek tbeddel bzaf wla gal lik l-coach.</p>
  </div>
  <div class="grid">
    <div class="field"><label for="pHeight">Toul (cm)</label><input id="pHeight" type="number" min="120" max="230" inputmode="numeric"></div>
    <div class="field"><label for="pGoal">L-hadaf (kg)</label><input id="pGoal" type="number" min="40" max="200" step="0.5" inputmode="decimal"></div>
    <div class="field"><label for="pStart">Awal nhar</label><input id="pStart" type="date"></div>
    <div class="field"><label for="pKcal">kcal f nhar</label><input id="pKcal" type="number" min="1000" max="5000" step="50" inputmode="numeric"></div>
    <div class="field"><label for="pProt">Protein f nhar (g)</label><input id="pProt" type="number" min="40" max="350" step="5" inputmode="numeric"></div>
  </div>
  <div class="row"><button type="button" id="pSave">Sejjel l-plan</button><span class="msg" id="pMsg" role="status"></span></div>
</section>

<section class="block" data-view="kter">
  <div>
    <h2>Nskha i7tiyatiya</h2>
    <p class="muted small">L-ma3lomat kayt7efdo f had telephone bo7do. Dir nskha merra f simana, bach ila tbeddel telephone wla tms7 l-mtsaffe7 ma ydi3 walou.</p>
  </div>
  <div class="row">
    <button type="button" id="bkExport">Khrej nskha (fichier)</button>
    <button type="button" id="bkShow">Werri n-nskha</button>
    <span class="msg" id="bkMsg" role="status"></span>
  </div>
  <div class="field"><label for="bkBox">Bach trje3 nskha 9dima: lse9ha hna o dghet "Rje3 n-nskha"</label><textarea class="mono" id="bkBox"></textarea></div>
  <div class="row"><button type="button" id="bkImport">Rje3 n-nskha</button></div>
</section>

<section class="block" data-view="kter">
  <div>
    <h2>Tsawer dyal l-jism</h2>
    <p class="muted small">Merra f chher, nefs l-blasa o nefs l-lon. Kayt7efdo f had telephone bo7do, machi f n-nskha.</p>
  </div>
  <div class="row">
    <button type="button" class="primary" id="phAdd">Zid tsawira</button>
    <input type="file" id="phFile" accept="image/*" hidden>
    <span class="msg" id="phMsg" role="status"></span>
  </div>
  <div class="photos" id="phList"></div>
</section>
`);
