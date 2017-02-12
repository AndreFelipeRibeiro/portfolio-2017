// Usage:
// const transitionEnd = require('./transition-end');
// element.addEventListener(transitionEnd, handler);

const map = {
  'transition'       : 'transitionend',
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd',
  'msTransition'     : 'MSTransitionEnd'
};

let elem = document.createElement('p');

for (let transition in map) {
  if (elem.style[transition] != null) {
    module.exports = map[transition];
    break;
  }
}
