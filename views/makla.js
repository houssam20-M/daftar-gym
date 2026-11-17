// views/makla.js - markup of the "Makla" tab: his own meal list against the day's target, water, and today's report.
// Only HTML lives here. The code that fills it and handles its buttons: js/food.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" id="makla" data-view="makla">
  <div>
    <h2>Makla d lyoum</h2>
    <p class="muted small" id="mnIntro">&nbsp;</p>
  </div>

  <div class="targets">
    <div class="meter"><div class="top"><span>Calories lyoum</span><span class="num" id="mKcalTxt">0 kcal</span></div><div class="bar"><i id="mKcalBar"></i></div></div>
    <div class="meter"><div class="top"><span>Protein lyoum</span><span class="num" id="mProtTxt">0 g</span></div><div class="bar"><i id="mProtBar"></i></div></div>
  </div>
  <p class="msg" id="mVerdict" role="status"></p>

  <div id="menuToday"></div>

  <details id="mnAddBox">
    <summary>Zid wejba l l-lista dyalek</summary>
    <div class="grid" style="margin-top:10px">
      <div class="field wide"><label for="mnName">Smiya</label><input id="mnName" type="text" maxlength="60" placeholder="Matalan: Ftour"></div>
      <div class="field wide"><label for="mnDesc">Ach fiha (ila bghiti)</label><input id="mnDesc" type="text" maxlength="160" placeholder="Matalan: 3 bidat + chofan"></div>
      <div class="field"><label for="mnKcal">kcal</label><input id="mnKcal" type="number" min="0" max="3000" inputmode="numeric"></div>
      <div class="field"><label for="mnProt">Protein g</label><input id="mnProt" type="number" min="0" max="300" inputmode="numeric"></div>
    </div>
    <div class="row" style="margin-top:10px"><button class="primary" type="button" id="mnAdd">Zid</button><span class="msg" id="mnMsg" role="status"></span></div>
  </details>

  <div class="field"><label for="dfNote">Ila klit chi 7aja khra, kteb hna</label><textarea id="dfNote" class="grow" rows="1" maxlength="600" placeholder="Matalan: f l-ghda klit tajine l7em"></textarea></div>
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
