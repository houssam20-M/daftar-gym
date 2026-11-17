// views/simana.js - markup of the "Simana" tab: weekly recap and the weekly check-in form.
// Only HTML lives here. The code that fills it and handles its buttons: js/food.js (recap), js/session.js (form).
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" data-view="simana">
  <div class="block-head">
    <div>
      <h2>Recap dyal simana</h2>
      <p class="muted small">Hadi l-akhbar dyal 7 simanat li fatou.</p>
    </div>
    <button type="button" id="recapShare">Sift</button>
  </div>
  <div id="recapBody"></div>
  <div class="banner" id="kcalNudge" hidden>
    <div class="row" style="justify-content:space-between">
      <span id="kcalNudgeText"></span>
      <button type="button" class="primary" id="kcalApply"></button>
    </div>
  </div>
  <p class="msg" id="recapMsg" role="status"></p>
</section>

<section class="block" id="checkin" data-view="simana">
  <div>
    <h2>Istibyan d simana</h2>
    <p class="muted small">3emmro merra f simana, nefs n-nhar, mn b3d ma ttwzen sba7 3la r-ri9.</p>
  </div>
  <form id="ciForm" novalidate>
    <div class="grid">
      <div class="field"><label for="ciDate">Date</label><input id="ciDate" type="date" required></div>
      <div class="field"><label for="ciWeight">Wazn (kg)</label><input id="ciWeight" type="number" step="0.1" min="40" max="250" inputmode="decimal" required></div>
      <div class="field"><label for="ciWaist">Dawr l-kerch (cm), ila bghiti</label><input id="ciWaist" type="number" step="0.5" min="40" max="220" inputmode="decimal"></div>
      <div class="field"><label for="ciLift">Seances d l-7adid had simana</label><input id="ciLift" type="number" step="1" min="0" max="14" inputmode="numeric"></div>
      <div class="field"><label for="ciWalk">Iyam li mchiti fihom</label><input id="ciWalk" type="number" step="1" min="0" max="7" inputmode="numeric"></div>
      <div class="field"><label for="ciSleep">N3ass (sway3 f lila)</label><input id="ciSleep" type="number" step="0.5" min="0" max="14" inputmode="decimal"></div>
      <div class="field"><label for="ciDiet">Iyam li 7tarmti fihom l-makla (0-7)</label><input id="ciDiet" type="number" step="1" min="0" max="7" inputmode="numeric"></div>
      <div class="field wide"><span class="flabel">Khobz wla sokkar had simana?</span>
        <div class="seg" role="radiogroup" aria-label="Khobz wla sokkar">
          <input type="radio" name="ciCheat" id="ciCheat0" value="la"><label for="ciCheat0">La</label>
          <input type="radio" name="ciCheat" id="ciCheat1" value="chwiya"><label for="ciCheat1">Chwiya</label>
          <input type="radio" name="ciCheat" id="ciCheat2" value="bzaf"><label for="ciCheat2">Bzaf</label>
        </div>
      </div>
      <div class="field wide"><span class="flabel">Ta9a (1 3yan, 5 mezyan bzaf)</span>
        <div class="seg" role="radiogroup" aria-label="Ta9a">
          <input type="radio" name="ciEnergy" id="ciE1" value="1"><label for="ciE1">1</label>
          <input type="radio" name="ciEnergy" id="ciE2" value="2"><label for="ciE2">2</label>
          <input type="radio" name="ciEnergy" id="ciE3" value="3"><label for="ciE3">3</label>
          <input type="radio" name="ciEnergy" id="ciE4" value="4"><label for="ciE4">4</label>
          <input type="radio" name="ciEnergy" id="ciE5" value="5"><label for="ciE5">5</label>
        </div>
      </div>
      <div class="field wide"><label for="ciNote">Molahadat (wja3, chno kan s3ib, chno t7ssen)</label><textarea id="ciNote" maxlength="600"></textarea></div>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="primary" type="submit" id="ciSave">Sejjel simana</button>
      <span class="msg" id="ciMsg" role="status"></span>
    </div>
  </form>
</section>
`);
