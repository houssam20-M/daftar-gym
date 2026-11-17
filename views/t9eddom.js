// views/t9eddom.js - markup of the "T9eddom" tab: weight chart, table, exercise progression, photos.
// Only HTML lives here. The code that fills it and handles its buttons: js/stats.js, js/session.js, js/photos.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" id="progress" data-view="t9eddom">
  <div class="block-head">
    <h2>T9eddom dyal l-wazn</h2>
    <div class="row">
      <div class="toggle" role="group" aria-label="Simana wla chher">
        <button type="button" id="vWeek" aria-pressed="true">Kol simana</button>
        <button type="button" id="vMonth" aria-pressed="false">Kol chher</button>
      </div>
      <div class="toggle compact" id="vRange" role="group" aria-label="Ch7al mn wa9t">
        <button type="button" data-r="12" aria-pressed="true" id="vRange12">12 simana</button>
        <button type="button" data-r="all" aria-pressed="false">Kolchi</button>
      </div>
    </div>
  </div>
  <div class="chart" id="chart"></div>
  <div class="legend" id="chartLegend" hidden><i></i><span id="chartLegendTxt"></span></div>
  <div class="tablewrap" id="tableWrap"></div>
  <div>
    <h3>Progression dyal l-exercices</h3>
    <div id="progList"></div>
  </div>
</section>
`);
