const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class Labs {
  constructor() {
    this.$labs           = document.getElementById('labs')

    this.addEventListeners()
  }

  addEventListeners() {

  }
}

new Labs()
