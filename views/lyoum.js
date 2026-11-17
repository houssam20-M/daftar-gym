// views/lyoum.js - markup of the "Lyoum" tab: summary tiles and today's session.
// Only HTML lives here. The code that fills it and handles its buttons: js/stats.js, js/session.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<div class="stats" id="stats" data-view="lyoum">
  <div class="stat"><div class="lbl">Wazn daba</div><div class="val num" id="sNow">—</div><div class="sub" id="sNowSub">&nbsp;</div></div>
  <div class="stat"><div class="lbl" id="sLostLbl">N9es mn l-bdya</div><div class="val num" id="sLost">—</div><div class="sub" id="sLostSub">&nbsp;</div></div>
  <div class="stat"><div class="lbl">Ba9i l l-hadaf</div><div class="val num" id="sLeft">—</div><div class="sub" id="sLeftSub">&nbsp;</div></div>
  <div class="stat"><div class="lbl">BMI</div><div class="val num" id="sBmi">—</div><div class="sub" id="sBmiSub">&nbsp;</div></div>
</div>

<section class="block" id="seance" data-view="lyoum">
  <div class="block-head">
    <div>
      <h2>Seance d lyoum</h2>
      <p class="muted small" id="sxSub">&nbsp;</p>
    </div>
    <div class="row"><span class="pill" id="sxStreak" hidden></span><span class="pill" id="sxDay">&nbsp;</span></div>
  </div>
  <div id="sxBody"></div>
  <div class="timer" id="restBox">
    <span class="timer-txt" id="restTxt">0:00</span>
    <div class="toggle compact" role="group" aria-label="Ra7a" id="restLen">
      <button type="button" data-s="60" aria-pressed="true">60s</button>
      <button type="button" data-s="90" aria-pressed="false">90s</button>
      <button type="button" data-s="120" aria-pressed="false">120s</button>
    </div>
    <button type="button" id="restGo">Bda</button>
  </div>
  <div id="sxForm">
    <div class="field"><span class="flabel">Kifach dazt?</span>
      <div class="seg" role="radiogroup" aria-label="Kifach dazt">
        <input type="radio" name="sxFeel" id="sxF1" value="sahla"><label for="sxF1">Sahla</label>
        <input type="radio" name="sxFeel" id="sxF2" value="mezyana"><label for="sxF2">Mezyana</label>
        <input type="radio" name="sxFeel" id="sxF3" value="s3iba"><label for="sxF3">S3iba</label>
      </div>
    </div>
    <div class="field"><label for="sxNote">Molahada (wja3, machine ma l9itihach...)</label><input id="sxNote" type="text" maxlength="300"></div>
    <div class="row">
      <button class="primary" type="button" id="sxSave">Sejjel seance</button>
      <span class="msg" id="sxMsg" role="status"></span>
    </div>
  </div>
  <div class="row">
    <button type="button" id="sxRest">Lyoum rya7a</button>
    <span class="msg" id="sxRestMsg" role="status"></span>
  </div>
</section>
`);
