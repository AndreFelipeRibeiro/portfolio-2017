const Hammer = require('hammerjs')
const axios = require('axios')

const transitionEnd = require('../lib/transition-end')
const CSSScroll = require('../lib/css-scroll')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class ProjectDetail {
  constructor() {
    this.$main          = document.getElementsByTagName('main')[0]
    this.$hero          = document.getElementsByClassName('hero')[0]
    this.$loadingScreen = document.getElementById('loading-screen')
    this.$scrim         = this.$loadingScreen.getElementsByClassName('scrim')[0]
    this.$scrollWrapper = this.$main.getElementsByClassName('scroll-wrapper')[0]
    this.$pageIndex     = this.$main.getElementsByClassName('page-index')[0]
    this.$backToTop     = this.$main.getElementsByClassName('back-to-top')[0]
    this.$blocks        = Array.from(this.$main.getElementsByClassName('block'))
    this.$scrollNodes   = Array.from(this.$main.querySelectorAll('[data-scrolled-into-view]'))

    this.$headlines = []

    this.handleResize    = this.handleResize.bind(this)
    this.handleScroll    = this.handleScroll.bind(this)
    this.requestScroll   = this.requestScroll.bind(this)
    this.handleBackToTop = this.handleBackToTop.bind(this)

    this.initLoadingState()
    this.loadImages()

    this.lastPageYOffset    = window.pageYOffset
    this.currentPageYOffset = window.pageYOffset

    this.initBlocks()
    this.initIndex()

    this.handleResize()
    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)

    this.$backToTop.addEventListener('click', this.handleBackToTop)
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.requestScroll)
    window.removeEventListener('resize', this.handleResize)

    this.$backToTop.removeEventListener('click', this.handleBackToTop)
  }

  out() {
    this.removeEventListeners()
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

    const $nodesToWatch = [].concat(
      this.$scrollNodes,
      this.$headlines,
      [this.$blocks[0]]
    )

    $nodesToWatch.forEach($node => {
      $node.dataset.top = $node.getBoundingClientRect().top + this.currentPageYOffset
    })
  }

  handleScroll(e) {
    this.$scrollNodes.forEach($node => {
      const top = parseInt($node.dataset.top)
      const isInView = top < this.currentPageYOffset + this.vh
      $node.dataset.scrolledIntoView = isInView.toString()
    })

    const top = parseInt(this.$blocks[0].dataset.top)
    const shouldShowBackToTop = top < this.currentPageYOffset

    this.$backToTop.classList[shouldShowBackToTop ? 'add' : 'remove']('is-active')
  }

  handleBackToTop() {
    const duration = Math.max(800, this.currentPageYOffset / 20)
    CSSScroll(0, this.$scrollWrapper, 800)
  }

  initLoadingState() {
    document.body.classList.add('is-loading')

    this.loadProgress = 0

    this.loadingInterval = setInterval(() => {
      if (!this.imageLoadProgress) return

      let progress

      if (this.imageLoadProgress >= this.loadProgress) {
        progress = this.loadProgress
      } else {
        return
      }

      this.$scrim.style.transform = `translate3d(${progress * 100}%, 0, 0)`

      // If we are done loading all the images, then cancel the loading state!
      if (progress >= 1) {
        clearInterval(this.loadingInterval)

        this.$main.classList.remove('incoming-content')
        document.body.classList.remove('is-loading')
      }

      if (this.imageLoadProgress >= 1) {
        this.loadProgress += 1
      } else {
        this.loadProgress += 0.2
      }

    }, 700)
  }

  updateLoadingState() {

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

    if (this.$headlines.length < 1) {
      this.$pageIndex.classList.add('is-hidden')
    }

    this.$headlines.forEach(($headline, i) => {
      const $headlineIndex = $headline.getElementsByClassName('index')[0]
      const $linkIndex = this.$links[i].getElementsByTagName('span')[0]
      const linkText = `0${i + 1}.`

      $headlineIndex.textContent = linkText
      $linkIndex.textContent = linkText

      this.$links[i].addEventListener('click', () => {
        const top = parseInt($headline.dataset.top)
        const duration = Math.max(800, top / 20)
        CSSScroll(top, this.$scrollWrapper, duration)
      })
    })
  }

  loadImages() {
    this.$images = Array.from(this.$main.querySelectorAll('img[data-src]'))
    this.imageCount = this.$images.length
    this.imageLoadProgress = 0

    this.$images.forEach($image => {

      $image.addEventListener('load', () => {
        this.handleResize()
        this.imageLoadProgress += 1 / this.imageCount
        this.updateLoadingState()
      })

      $image.dataset.load = 'true'
      ImageLoader.load($image)
    })
  }
}

module.exports = ProjectDetail
