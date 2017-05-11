const Hammer = require('hammerjs')
const axios = require('axios')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class ProjectDetail {
  constructor() {
    this.$main        = document.getElementsByTagName('main')[0]
    this.$hero        = document.getElementsByClassName('hero')[0]
    this.$blocks      = Array.from(this.$main.getElementsByClassName('block'))
    this.$scrollNodes = Array.from(this.$main.querySelectorAll('[data-scrolled-into-view]'))
    this.$pageIndex   = this.$main.getElementsByClassName('page-index')[0]

    this.$headlines = []

    this.handleResize  = this.handleResize.bind(this)
    this.handleScroll  = this.handleScroll.bind(this)
    this.requestScroll = this.requestScroll.bind(this)

    this.initBlocks()
    this.initIndex()

    this.loadImages()

    this.lastPageYOffset    = window.pageYOffset
    this.currentPageYOffset = window.pageYOffset

    this.handleResize()
    this.addEventListeners()
  }

  requestScroll(e) {
    this.requestTick(e)
  }

  requestTick(e) {
    if (this.ticking) return

    requestAnimationFrame(() => {
      this.lastPageYOffset    = this.currentPageYOffset
      this.currentPageYOffset = window.pageYOffset

      this.handleScroll(e)
      this.ticking = false
    })

    this.ticking = true
  }

  handleResize(e) {
    this.vh = window.innerHeight

    this.$scrollNodes.forEach($node => {
      $node.dataset.top = $node.getBoundingClientRect().top + this.currentPageYOffset
    })
  }

  handleScroll(e) {
    this.$scrollNodes.forEach($node => {
      const top = parseInt($node.dataset.top)
      const isInView = top < this.currentPageYOffset + this.vh
      $node.dataset.scrolledIntoView = isInView.toString()
    })
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)
  }

  initBlocks() {
    this.$blocks.forEach($block => {
      const { type } = $block.dataset

      if (type === 'project-title') this.initProjectTitle($block)
      if (type === 'custom-gallery') this.initGallery($block)
      if (type === 'headline') this.$headlines.push($block)
    })
  }

  initProjectTitle($block) {
    this.$pageIndex.parentNode.insertBefore($block, this.$pageIndex)
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

      $image.addEventListener('load', this.handleResize)

      $image.dataset.load = 'true'
      ImageLoader.load($image)
    })
  }
}

new ProjectDetail()
