const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class About {
  constructor() {
    this.$about           = document.getElementById('about')

    this.addEventListeners()
  }

  addEventListeners() {

  }
}

new About()
