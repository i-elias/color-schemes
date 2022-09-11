function createElement(eleName, value) {
  const element = document.createElement(eleName);
  element.className = value;
  return element;
}

function querySelectorAll(selector) {
  const element = document.querySelectorAll(selector);
  return element;
}

export { createElement, querySelectorAll };
