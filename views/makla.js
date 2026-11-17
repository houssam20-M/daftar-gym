// views/makla.js - markup of the "Makla" tab: today's menu, water, and today's report.
// Only HTML lives here. The code that fills it and handles its buttons: js/food.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" id="makla" data-view="makla">
  <div class="block-head">
    <div>
      <h2>Makla d lyoum</h2>
      <p class="muted small">Ach takol lyoum. 3ellem 3la kol wejba mnin takolha.</p>
    </div>
    <div class="rules"><span class="pill">✕ Bla khobz</span><span class="pill">✕ Bla sokkar</span><span class="pill">✕ Bla 7lib</span></div>
  </div>

  <div id="menuToday"></div>
  <p class="muted small" id="menuTotal">&nbsp;</p>
  <div class="field"><label for="dfNote">Ila klit chi 7aja khra, kteb hna</label><input id="dfNote" type="text" maxlength="300" placeholder="Matalan: f l-ghda klit tajine l7em"></div>
  <span class="msg" id="dfMsg" role="status"></span>

  <div class="meter">
    <div class="top"><span>L-ma lyoum</span><span class="num" id="mWaterTxt">0 / 12 kisan</span></div>
    <div class="bar"><i id="mWaterBar"></i></div>
    <div class="row"><button type="button" id="wAdd">+ Kas</button><button type="button" class="link" id="wSub">− Kas</button></div>
  </div>
</section>

<section class="block" id="dayReport" data-view="makla">
  <div>
    <h2>Ta9rir d lyoum</h2>
    <p class="muted small">Ach derti lyoum f gym o f l-makla. Nskho o lse9o l l-coach mnin trje3 l d-dar.</p>
  </div>
  <pre class="dayrep" id="dayRep"></pre>
  <div class="row"><button class="primary" type="button" id="dayRepCopy">Nskh ta9rir d lyoum</button><span class="msg" id="dayRepMsg" role="status"></span></div>
  <textarea class="mono" id="dayRepBox" readonly hidden aria-label="Ta9rir"></textarea>
</section>
`);
