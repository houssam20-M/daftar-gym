// views/photo-viewer.js - markup of the full-screen photo viewer.
// Only HTML lives here. The code that fills it and handles its buttons: js/photos.js.
document.body.insertAdjacentHTML('beforeend', `
<div class="viewer" id="phView" hidden>
  <button type="button" id="phClose" aria-label="Sed">✕</button>
  <img id="phImg" alt="">
  <span class="vdate" id="phDate"></span>
  <button type="button" id="phDel">7iyed tsawira</button>
</div>
`);
