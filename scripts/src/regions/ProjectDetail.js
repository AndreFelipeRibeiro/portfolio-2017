const Hammer = require('hammerjs')
const axios = require('axios')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class ProjectDetail {
  constructor() {
    this.$main           = document.getElementsByTagName('main')[0]
    this.$blocks = Array.from(this.$main.getElementsByClassName('block'))

    this.$headlines = []

    this.addEventListeners()
    this.initBlocks()
    this.initIndex()
    this.loadImages()
  }

  addEventListeners() {

  }

  initBlocks() {
    this.$blocks.forEach($block => {
      const { type } = $block.dataset

      if (type === 'gallery') this.initGallery($block)
      if (type === 'headline') this.$headlines.push($block)
    })
  }

  initGallery($block) {
    const handleChange = (index, indexWithClones, $activeChild) => {
      // something?
    }

    const gallery = new BaseGallery({
      galleryNode: $block,
      childSelector: '.gallery-item',
      shouldAutoplay: true,
      slideSpeed: 5000,
      handleChange
    })

    if (!this.galleries) this.galleries = []
    this.galleries.push(gallery)
  }

  initIndex() {
    this.$pageIndex = this.$main.getElementsByClassName('page-index')[0]
    this.$links = Array.from(this.$pageIndex.getElementsByClassName('link'))

    this.$headlines.forEach(($headline, i) => {
      const $headlineIndex = $headline.getElementsByClassName('index')[0]
      const $linkIndex = this.$links[i].getElementsByTagName('span')[0]
      const linkText = `0${i + 1}.`

      $headlineIndex.textContent = linkText
      $linkIndex.textContent = linkText
    })
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
