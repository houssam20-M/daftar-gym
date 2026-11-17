// views/header.js - markup of the top of the app: logo, theme and language buttons, week number, banners.
// Only HTML lives here. The code that fills it and handles its buttons: js/ui.js, js/report.js.
document.getElementById('app').insertAdjacentHTML('beforeend', `
<header class="top">
  <div class="brand">
    <svg class="logo" viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#11967A"/><stop offset="1" stop-color="#0A5F4E"/></linearGradient></defs>
      <rect width="100" height="100" rx="23" fill="url(#lg)"/>
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
      <p class="muted" id="subline">&nbsp;</p>
    </div>
  </div>
  <div class="hdr-tools">
    <div class="toggle compact" id="qTheme" role="group" aria-label="Lon">
      <button type="button" data-t="light" aria-pressed="false" aria-label="Bid"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/></svg></button>
      <button type="button" data-t="dark" aria-pressed="false" aria-label="K7el"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 14.7A8.7 8.7 0 0 1 9.3 3.4a8.7 8.7 0 1 0 11.3 11.3z"/></svg></button>
      <button type="button" data-t="auto" aria-pressed="false">Auto</button>
    </div>
    <div class="toggle compact" id="qLang" role="group" aria-label="Lugha">
      <button type="button" data-l="en" aria-pressed="true">EN</button>
      <button type="button" data-l="dar" aria-pressed="false">Dar</button>
    </div>
    <span class="week-chip num" id="weekChip">&nbsp;</span>
  </div>
</header>

<div class="banner" id="banner" hidden></div>

<div class="banner" id="bannerPlan" hidden>
  <div class="row" style="justify-content:space-between">
    <span id="bannerPlanText"></span>
    <div class="row"><button type="button" class="primary" id="bannerPlanGo">Beddel l-plan</button><button type="button" class="link" id="bannerPlanKeep">Khellih</button></div>
  </div>
</div>

<div class="banner" id="bannerBk" hidden>
  <div class="row" style="justify-content:space-between">
    <span id="bannerBkText"></span>
    <button type="button" class="primary" id="bannerBkGo">Dir nskha daba</button>
  </div>
</div>
`);
