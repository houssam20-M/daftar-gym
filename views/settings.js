// views/settings.js - markup of the Settings page (opened by the gear): light/dark, colours, language.
// Only HTML lives here. The code: js/ui.js (theme, colours, language) and js/boot.js (the gear opens and closes it).
document.getElementById('app').insertAdjacentHTML('beforeend', `
<section class="block" id="settings" data-view="settings">
  <h2>I3dadat</h2>
  <div class="field"><span class="flabel">Lon</span>
    <div class="seg" role="radiogroup" aria-label="Lon">
      <input type="radio" name="setTheme" id="setThemeA" value="auto"><label for="setThemeA">Auto</label>
      <input type="radio" name="setTheme" id="setThemeL" value="light"><label for="setThemeL">Bid</label>
      <input type="radio" name="setTheme" id="setThemeD" value="dark"><label for="setThemeD">K7el</label>
    </div>
  </div>
  <div class="field"><span class="flabel">Alwan</span>
    <div class="swatches" id="palettes" role="radiogroup" aria-label="Alwan">
      <button type="button" role="radio" aria-checked="false" data-p="khdar"><i style="background:linear-gradient(135deg,#0C7A63 50%,#3FCBA7 50%)"></i><span>Khdar</span></button>
      <button type="button" role="radio" aria-checked="false" data-p="majorelle"><i style="background:linear-gradient(135deg,#2B45C2 50%,#8EA2FF 50%)"></i><span>Majorelle</span></button>
      <button type="button" role="radio" aria-checked="false" data-p="zafran"><i style="background:linear-gradient(135deg,#A3500A 50%,#F2A54A 50%)"></i><span>Zafran</span></button>
      <button type="button" role="radio" aria-checked="false" data-p="ward"><i style="background:linear-gradient(135deg,#B02D5C 50%,#F27FA6 50%)"></i><span>Ward</span></button>
      <button type="button" role="radio" aria-checked="false" data-p="zitoun"><i style="background:linear-gradient(135deg,#566513 50%,#BDCB5E 50%)"></i><span>Zitoun</span></button>
      <button type="button" role="radio" aria-checked="false" data-p="bnafsaji"><i style="background:linear-gradient(135deg,#6A3CC2 50%,#B79CFF 50%)"></i><span>Bnafsaji</span></button>
    </div>
  </div>
  <div class="field"><span class="flabel">Lugha</span>
    <div class="seg" role="radiogroup" aria-label="Lugha">
      <input type="radio" name="setLang" id="setLangE" value="en"><label for="setLangE">English</label>
      <input type="radio" name="setLang" id="setLangD" value="dar"><label for="setLangD">Darija</label>
    </div>
  </div>
</section>
`);
