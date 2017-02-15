const BaseGallery = require('./Gallery')
const Hammer = require('hammerjs')

console.log("Hey, bozo.")

// Polyfill
Array.from = (arr) => Array.prototype.slice.call(arr)


class Portfolio {
  constructor() {
    this.$coverGallery        = document.getElementsByClassName('cover-gallery')[0]
    this.$coverGalleryImagery = document.getElementsByClassName('cover-gallery-imagery')[0]
    this.$coverGalleryText    = document.getElementsByClassName('cover-gallery-text')[0]
    this.$coverImages         = Array.from(this.$coverGalleryImagery.getElementsByClassName('imagery'))
    this.$coverTexts          = Array.from(this.$coverGalleryText.getElementsByClassName('text'))

    this.handleCoverChange = this.handleCoverChange.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.requestScroll = this.requestScroll.bind(this)

    this.lastPageYOffset = window.pageYOffset

    this.initCoverGalleries()

    scrollTo(0,0)

    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)
  }

  requestScroll(e) {
  	this.requestTick(e)
  }

  requestTick(e) {
    console.log('tick', this.ticking)

    if (this.ticking) {
      console.log('frame saved')
      return
    }

    requestAnimationFrame(() => {
      this.lastPageYOffset = window.pageYOffset
      this.handleScroll(e)
      this.ticking = false
    })

  	this.ticking = true
  }

  handleResize() {
    this.vh = window.innerHeight
    this.bodyHeight = document.body.clientHeight
  }

  handleScroll(e) {
    const sectionHeight = this.vh
    const section = Math.floor(this.lastPageYOffset / sectionHeight)
    const nextIndex = section % this.$coverImages.length

    const endOfPage = this.bodyHeight - this.vh

    if      (this.lastPageYOffset <= 1)             scrollTo(0,endOfPage + 1)
    else if (this.lastPageYOffset >= endOfPage - 1) scrollTo(0,2)

    if (nextIndex === this.coverIndex) return

    this.coverGalleryImagery.goToIndex(nextIndex)
  }

  handleCoverChange(index, indexWithClones, $activeChild) {
    if (indexWithClones === this.coverIndex) return

    this.coverIndex = indexWithClones
    this.coverGalleryText.goToIndex(this.coverIndex)

    this.$coverGalleryImagery.dataset.project = $activeChild.dataset.project
  }

  initCoverGalleries() {
    this.coverIndex = 0

    this.coverGalleryImagery = new BaseGallery({
      galleryNode: this.$coverGalleryImagery,
      childSelector: '.imagery',
      shouldAutoplay: false,
      handleChange: this.handleCoverChange
    })

    this.coverGalleryText = new BaseGallery({
      galleryNode: this.$coverGalleryText,
      childSelector: '.text',
      shouldAutoplay: false,
      handleChange: () => {}
    })

    document.body.style.height = (this.$coverImages.length + 1) * window.innerHeight + 'px'
    this.handleResize()

    this.$coverGalleryImagery.dataset.project = this.$coverImages[0].dataset.project
  }
}

new Portfolio()
