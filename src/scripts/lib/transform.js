const map = {
  'transform'       : 'transform',
  'WebkitTransform' : 'webkitTransform',
  'MozTransform'    : 'Transform',
  'OTransform'      : 'oTransform',
  'msTransform'     : 'MSTransform'
}

let elem = document.createElement('p')

for (let transform in map) {
  if (elem.style[transform] != null) {
    module.exports = map[transform]
    break;
  }
}
