// views/nav.js - markup of the tab bar at the bottom.
// Only HTML lives here. The code that fills it and handles its buttons: js/boot.js.
document.body.insertAdjacentHTML('beforeend', `
<nav class="nav" id="nav" aria-label="Tabs" hidden>
  <div class="in">
    <a href="#lyoum">Lyoum</a>
    <a href="#simana">Simana</a>
    <a href="#t9eddom">T9eddom</a>
    <a href="#makla">Makla</a>
    <a href="#kter">Kter</a>
  </div>
</nav>
`);
