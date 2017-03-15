const Header = require('./blocks/Header')

const Global = {
  init() {

    // Polyfill
    Array.from = (arr) => Array.prototype.slice.call(arr)

    this.header = new Header()
  }
}

Global.init()
