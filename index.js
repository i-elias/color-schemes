'use strict';
import { createElement, querySelectorAll } from './util.js';
import { schemeSelectionsHtml } from './template.js';

const schemeContainer = document.getElementById('scheme-container');
let toastContainer;
let inputColor;
let schemeModes;
let imageColor;
let colorValue;
let isCopied;
let eventArr = [];

function generateHtml() {
  const hexArr = ['#f55a5a', '#2b283a', '#fbf3ab', '#aad1b6', '#a626d3'];
  toastContainer = createElement('div', 'toast-container');
  const colorPickerContainer = createElement('div', 'color-picker-container');
  const colorsContainer = createElement('div', 'colors-container');
  const selections = schemeSelectionsHtml();
  colorPickerContainer.insertAdjacentHTML('afterbegin', selections);

  const xmlS = new XMLSerializer();
  const getClipboardSVG = createSVG('clipboard-icon');
  getClipboardSVG.classList.add('clipboard');
  const clipboardSVGHtml = xmlS.serializeToString(getClipboardSVG);
  for (let i = 0; i < 5; i++) {
    colorsContainer.innerHTML += `
    <div class="color-stripe">
      <div class="color color-${i + 1}"></div>
      <div class="hex-container">
        <span class="color-value">${hexArr[i]}</span>
        ${clipboardSVGHtml}  
        <div class="tick-icon-container"></div>
      </div>
    </div>
    `;
  }
  document.body.prepend(toastContainer);
  schemeContainer.append(colorPickerContainer);
  schemeContainer.append(colorsContainer);
}
generateHtml();
const hexContainer = querySelectorAll('.hex-container');
const clipBoards = querySelectorAll('.clipboard');

function displayClipboardColor() {
  clipBoards.forEach((clipBoard) => {
    if (window.innerWidth < 768) {
      clipBoard.children[0].style.fill = '#fff';
    } else {
      clipBoard.children[0].style.fill = '#a7a7a7';
    }
  });
}

function displayTickIconColor(hexValue, elementName) {
  const hex = hexValue.slice(1);
  const regex = /^[a-z]/i;
  if (window.innerWidth < 768) {
    if (regex.test(hex)) {
      elementName.style.fill = '#000';
    } else {
      elementName.style.fill = '#fff';
    }
  } else {
    elementName.style.fill = '#9CA3AF';
  }
}

function createSVG(iconId) {
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svgEl.setAttributeNS(null, 'class', 'svg-icons');
  useEl.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `images/sprite.svg#${iconId}`
  );
  svgEl.setAttribute('class', 'svg-icons');
  useEl.setAttribute('xlink:href', `images/sprite.svg#${iconId}`);
  svgEl.append(useEl);
  return svgEl;
}

displayClipboardColor();

//fetch then display color scheme
function displayColors(data) {
  const tickIconContainer = querySelectorAll('.tick-icon-container ');
  const colorStripe = querySelectorAll('.color-stripe');
  const color = querySelectorAll('.color');
  colorValue = querySelectorAll('.color-value');
  isCopied = querySelectorAll('.is-copied');
  for (let i = 0; i < data.colors.length; i++) {
    imageColor = createElement('img', 'color');
    if (isCopied[i]) {
      isCopied[i].remove();
    }

    if (hexContainer[i].classList.contains('hex-bg')) {
      hexContainer[i].classList.remove('hex-bg');
    }

    imageColor.src = `${data.colors[i].image.bare}`;
    colorValue[i].textContent = data.colors[i].hex.value;
    colorValue[i].classList.remove('hidden');
    color[i].remove();
    colorStripe[i].prepend(imageColor);
    clipBoards[i].classList.remove('copied');
    tickIconContainer[i].classList.remove('is-success');
    tickIconContainer[i].style.display = 'none';
  }
}

//get color scheme
document.querySelector('.scheme-btn').addEventListener('click', function () {
  inputColor = document.querySelector('.color-picker');
  schemeModes = document.querySelector('.scheme-modes');
  const hex = inputColor.value.split('').slice(1).join('');
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${schemeModes.value}`
  )
    .then((res) => res.json())
    .then((data) => {
      displayColors(data);
    })
    .catch((error) => {
      console.error('something went wrong', error);
    });
});

function displayClipBoards(
  svg,
  hexContainer,
  colorValue,
  tickIconContainer,
  isCopied
) {
  displayTickIconColor(colorValue.textContent, isCopied);
  tickIconContainer.append(isCopied);
  tickIconContainer.style.display = 'block';
  hexContainer.classList.add('hex-bg');

  setTimeout(() => {
    navigator.clipboard.writeText(colorValue.textContent).then(() => {
      tickIconContainer.classList.add('is-success');
      colorValue.classList.add('hidden');
      svg.classList.add('copied');
    }, 1000);
  });
}

//display clipboard popup message
clipBoards.forEach((clipBoard) => {
  clipBoard.addEventListener('click', (e) => {
    if (e.currentTarget) {
      eventArr.push(e.currentTarget);
      const svg = e.currentTarget;
      const hexContainer = svg.closest('.hex-container');
      const colorValue = svg.previousElementSibling;
      const tickIconContainer = svg.nextElementSibling;

      isCopied = createSVG('tick-icon');
      isCopied.classList.add('is-copied');

      displayClipBoards(
        svg,
        hexContainer,
        colorValue,
        tickIconContainer,
        isCopied
      );

      toastContainer = document.querySelector('.toast-container');
      toastContainer.style.display = 'flex';
      const toast = createElement('div', 'toast');
      const toastInner = createElement('div', 'toast_inner');
      const span = createElement('span', '');
      setTimeout(() => {
        toast.classList.add('is-visible');
      }, 180);

      span.textContent = 'color copied to clipboard';
      toast.append(toastInner);
      toastInner.append(span);
      toastContainer.append(toast);

      setTimeout(() => {
        toast.classList.remove('is-visible');
        toast.remove();
        eventArr.pop();
        if (eventArr.length === 0) {
          toastContainer.style.display = 'none';
        }
      }, 2300);
    }
  });
});

window.addEventListener('resize', function () {
  colorValue = querySelectorAll('.color-value');
  isCopied = document.querySelectorAll('.is-copied');
  for (let i = 0; i < colorValue.length; i++) {
    if (isCopied[i]) {
      displayTickIconColor(colorValue[i].textContent, isCopied[i]);
    }
  }
  displayClipboardColor();
});
