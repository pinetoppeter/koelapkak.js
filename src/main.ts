/**
 * Entry Point for the DEV preview/testing page
 */

import { Koelapkak } from "./lib";
import { Direction } from "./types";

// init with optional options
Koelapkak.init('#container', {
  listenForWindowResize: true,
  direction: Direction.LEFT_TO_RIGHT
});

const randomClass = (): string | null => {
  const classes = [null, 'smaller', 'larger', 'wider'];
  return classes[Math.floor(Math.random() * classes.length)];
}

document.getElementById('btn-add')?.addEventListener('click', add);
document.getElementById('btn-remove')?.addEventListener('click', remove);

function add() {
  let element = document.createElement('div');
  let inner = document.createElement('div');
  element.appendChild(inner);
  const className = randomClass();

  if (className) {
    element.classList.add(className);
  }
  document.getElementById('container')?.appendChild(element);
}

function remove() {
  const children = document.getElementById('container')!.children;
  const lastChild = Array.from(children).pop();

  if (lastChild) {
    document.getElementById('container')?.removeChild(lastChild);
  }
}