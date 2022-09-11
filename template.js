function schemeSelectionsHtml() {
  let html = `
      <input class="color-picker" type="color" value="#F55A5A"/>
      <div class="custom-select">
        <select class="scheme-modes">
          <option value="monochrome">Monochrome</option>
          <option value="monochrome-dark">Monochrome-dark</option>
          <option value="monochrome-light">Monochrome-light</option>
          <option value="analogic">Analogic</option>
          <option value="complement">Complement</option>
          <option value="analogic-complement">Analogic-complement</option>
          <option value="triad">Triad</option>
        </select>
        <span class="custom-arrow"></span>
      </div>
      <button class="scheme-btn">Get color scheme</button>
  `;
  return html;
}

export { schemeSelectionsHtml };
