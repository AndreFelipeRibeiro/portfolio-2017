const MenuOverlay = require('./MenuOverlay')

class Header {
  constructor() {
    this.$header      = document.getElementById('header')
    this.$main        = document.getElementsByTagName('main')[0]
    this.$hamburger   = this.$header.getElementsByClassName('hamburger')[0]

    this.menuOverlay = new MenuOverlay()
  }
}

module.exports = Header
