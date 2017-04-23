const Hammer = require('hammerjs')
const axios = require('axios')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class ProjectDetail {
  constructor() {
    this.$main           = document.getElementsByTagName('main')[0]
    this.$blocks = Array.from(this.$main.getElementsByClassName('block'))

    this.addEventListeners()
    this.initBlocks()
    this.loadImages()
  }

  addEventListeners() {

  }

  initBlocks() {
    this.$blocks.forEach($block => {
      const { type } = $block.dataset

      if (type === 'gallery') this.initGallery($block)
    })
  }

  initGallery($block) {
    const handleChange = (index, indexWithClones, $activeChild) => {
      console.log(index)
    }

    const gallery = new BaseGallery({
      galleryNode: $block,
      childSelector: '.gallery-item',
      shouldAutoplay: false,
      handleChange
    })

    if (!this.galleries) this.galleries = []
    this.galleries.push(gallery)
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
