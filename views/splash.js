// views/splash.js - markup of the logo screen shown for a second when the app opens.
// Only HTML lives here. The code that fills it and handles its buttons: js/boot.js.
document.body.insertAdjacentHTML('beforeend', `
<div id="splash" aria-hidden="true">
  <svg viewBox="0 0 100 100">
    <defs><linearGradient id="lg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#11967A"/><stop offset="1" stop-color="#0A5F4E"/></linearGradient></defs>
    <rect width="100" height="100" rx="23" fill="url(#lg3)"/>
    <g>
      <rect x="18" y="38.5" width="7" height="23" rx="2.5" fill="#BDEBDD"/>
      <rect x="75" y="38.5" width="7" height="23" rx="2.5" fill="#BDEBDD"/>
      <rect x="25.5" y="33" width="9" height="34" rx="3" fill="#FFFFFF"/>
      <rect x="65.5" y="33" width="9" height="34" rx="3" fill="#FFFFFF"/>
      <rect x="33" y="47.2" width="34" height="5.6" rx="2.8" fill="#FFFFFF"/>
    </g>
  </svg>
  <div class="nm">Daftar l-Gym</div>
  <div class="tg">Kol nhar chwiya</div>
</div>
`);
