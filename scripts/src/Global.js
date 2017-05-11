const Router = require('./Router')
const Header = require('./blocks/Header')

const Global = {
  init() {

    // Polyfill
    Array.from = (arr) => Array.prototype.slice.call(arr)

    this.header = new Header()

    this.initRouter()
  },

  initRouter() {
    this.router = new Router()
  }
}

Global.init()
