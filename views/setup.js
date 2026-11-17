// views/setup.js - markup of the first-run screen (sex, age, height, weight, goal, start day).
// Only HTML lives here. The code that fills it and handles its buttons: js/boot.js.
document.getElementById('setup').insertAdjacentHTML('beforeend', `
<div class="brand">
  <svg class="logo" viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#11967A"/><stop offset="1" stop-color="#0A5F4E"/></linearGradient></defs>
    <rect width="100" height="100" rx="23" fill="url(#lg2)"/>
    <g transform="rotate(-30 50 50)">
      <rect x="18" y="38.5" width="7" height="23" rx="2.5" fill="#BDEBDD"/>
      <rect x="75" y="38.5" width="7" height="23" rx="2.5" fill="#BDEBDD"/>
      <rect x="25.5" y="33" width="9" height="34" rx="3" fill="#FFFFFF"/>
      <rect x="65.5" y="33" width="9" height="34" rx="3" fill="#FFFFFF"/>
      <rect x="33" y="47.2" width="34" height="5.6" rx="2.8" fill="#FFFFFF"/>
    </g>
  </svg>
  <div>
    <h1>Daftar l-Gym</h1>
    <p class="muted">Mer7ba. 3emmer l-ma3lomat dyalek merra wa7da.</p>
  </div>
</div>

<section class="block" id="suForm">
  <div class="field"><span class="flabel">Lugha</span>
    <div class="seg" role="radiogroup" aria-label="Lugha">
      <input type="radio" name="suLang" id="suLangE" value="en"><label for="suLangE">English</label>
      <input type="radio" name="suLang" id="suLangD" value="dar"><label for="suLangD">Darija</label>
    </div>
  </div>
  <div>
    <h2>Chkoun nta?</h2>
    <p class="muted small">Bihom kan7seb lik l-calories o l-protein dyal kol nhar. Hadchi kayb9a f telephone dyalek bo7do.</p>
  </div>
  <div class="grid">
    <div class="field wide"><span class="flabel">Jins</span>
      <div class="seg" role="radiogroup" aria-label="Jins">
        <input type="radio" name="suSex" id="suSexM" value="m"><label for="suSexM">Rajel</label>
        <input type="radio" name="suSex" id="suSexF" value="f"><label for="suSexF">Mra</label>
      </div>
    </div>
    <div class="field"><label for="suAge">L-3mer (3am)</label><input id="suAge" type="number" min="14" max="90" step="1" inputmode="numeric"></div>
    <div class="field"><label for="suHeight">Toul (cm)</label><input id="suHeight" type="number" min="120" max="230" step="1" inputmode="numeric"></div>
    <div class="field"><label for="suWeight">Wazn daba (kg)</label><input id="suWeight" type="number" min="40" max="250" step="0.1" inputmode="decimal"></div>
    <div class="field"><label for="suGoal">L-wazn li bghiti twsel lih (kg)</label><input id="suGoal" type="number" min="40" max="200" step="0.5" inputmode="decimal"></div>
    <div class="field"><label for="suStart">Awal nhar d gym</label><input id="suStart" type="date"></div>
  </div>
  <div class="row">
    <button class="primary" type="button" id="suGo">7seb l-plan dyali</button>
    <span class="msg" id="suMsg" role="status"></span>
  </div>
</section>

<section class="block" id="suResult" hidden>
  <div>
    <h2>L-plan dyalek</h2>
    <p class="muted small" id="suWhy">&nbsp;</p>
  </div>
  <div class="setup-tiles">
    <div class="stat"><div class="lbl">Calories f nhar</div><div class="val num" id="suKcal">—</div></div>
    <div class="stat"><div class="lbl">Protein f nhar</div><div class="val num" id="suProt">—</div></div>
  </div>
  <p class="muted small">Ar9am ta9ribiya. T9der tbeddelhom mn b3d f tab "Kter".</p>
  <div class="row">
    <button class="primary" type="button" id="suEnter">Dkhol l l-app</button>
    <button type="button" id="suBack">Rje3 beddel</button>
  </div>
</section>
`);
