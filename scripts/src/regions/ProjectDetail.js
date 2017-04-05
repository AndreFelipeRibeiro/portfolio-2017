const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class ProjectDetail {
  constructor() {
    this.$main           = document.getElementsByTagName('main')[0]

    this.addEventListeners()
    this.loadImages()
  }

  addEventListeners() {

  }

  loadImages() {
    this.$images = Array.from(this.$main.querySelectorAll('img[data-src]'))

    this.$images.forEach($image => {
      $image.dataset.load = 'true'
      ImageLoader.load($image)
    })
  }
}

new ProjectDetail()
