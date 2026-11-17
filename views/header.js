// views/header.js - markup of the top of the app: logo, the settings gear, the week number, banners.
// Only HTML lives here. The code that fills it and handles its buttons: js/stats.js (week), js/boot.js (gear), js/report.js (banners).
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
  <a class="gear" href="#settings" aria-label="I3dadat"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" d="M9.92 3.66 L10.44 0.91 L13.56 0.91 L14.08 3.66 L16.43 4.63 L18.74 3.06 L20.94 5.26 L19.37 7.57 L20.34 9.92 L23.09 10.44 L23.09 13.56 L20.34 14.08 L19.37 16.43 L20.94 18.74 L18.74 20.94 L16.43 19.37 L14.08 20.34 L13.56 23.09 L10.44 23.09 L9.92 20.34 L7.57 19.37 L5.26 20.94 L3.06 18.74 L4.63 16.43 L3.66 14.08 L0.91 13.56 L0.91 10.44 L3.66 9.92 L4.63 7.57 L3.06 5.26 L5.26 3.06 L7.57 4.63 Z M12 8.4 A3.6 3.6 0 1 0 12 15.6 A3.6 3.6 0 1 0 12 8.4 Z"/></svg></a>
</header>
<div class="week-row"><span class="week-chip num" id="weekChip">&nbsp;</span></div>

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
