const BaseGallery = require('./Gallery')
const Hammer = require('hammerjs')
const transform = require('./lib/transform')
const transitionEnd = require('./lib/transition-end')

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

    this.$coverPagination     = document.getElementsByClassName('cover-gallery-pagination')[0]
    this.$activePageWrapper   = this.$coverPagination.getElementsByClassName('active-page-wrapper')[0]

    this.handleCoverChange = this.handleCoverChange.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.requestScroll = this.requestScroll.bind(this)

    this.lastPageYOffset = window.pageYOffset
    this.currentPageYOffset = window.pageYOffset

    this.initPagination()
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

    if (this.ticking) {
      return
    }

    requestAnimationFrame(() => {
      this.lastPageYOffset = this.currentPageYOffset
      this.currentPageYOffset = window.pageYOffset
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
    const section = Math.floor(this.currentPageYOffset / sectionHeight)
    const nextIndex = section % this.$coverImages.length

    const endOfPage = this.bodyHeight - this.vh

    if      (this.currentPageYOffset <= 1)             scrollTo(0,endOfPage + 1)
    else if (this.currentPageYOffset >= endOfPage - 1) scrollTo(0,2)

    if (nextIndex === this.coverIndex) return

    const direction = nextIndex > this.coverIndex  ? 'next' : 'prev'
    let resetTo = null
    if (nextIndex === 0 && this.coverIndex === this.lastCoverIndex) resetTo = 'next'
    if (nextIndex === this.lastCoverIndex && this.coverIndex === 0) resetTo = 'prev'

    this.coverGalleryImagery.goToIndex(nextIndex)
    this.updatePagination(nextIndex, direction, resetTo)
  }

  handleCoverChange(index, indexWithClones, $activeChild) {
    if (indexWithClones === this.coverIndex) return

    this.coverIndex = indexWithClones
    this.coverGalleryText.goToIndex(this.coverIndex)

    this.$coverGalleryImagery.dataset.project = $activeChild.dataset.project
  }

  appendPageLabel(index) {
    const $pageLabel = document.createElement('div')
    $pageLabel.classList.add('label')
    $pageLabel.classList.add('active-page')
    $pageLabel.textContent = '0' + (index + 1)

    this.$activePageWrapper.appendChild($pageLabel)
    return $pageLabel
  }

  initPagination() {
    this.lastCoverIndex = this.$coverImages.length - 1

    this.$activePages = [this.appendPageLabel(this.lastCoverIndex)]
    this.$coverImages.forEach(($cover, i) => this.$activePages.push(this.appendPageLabel(i)))
    this.$activePages = [this.appendPageLabel(0)]

    this.activePageHeight = this.$activePages[0].clientHeight
  }

  updatePagination(i, direction, resetTo = null) {
    this.$activePageWrapper.removeEventListener(transitionEnd, this.handleTransitionEnd)

    const index = i + 1
    const destination = index * this.activePageHeight * -1

    if (!resetTo) {
      if (!direction) {
        this.$activePageWrapper.classList.add('no-transitions')
        this.$activePageWrapper.clientHeight
      }

      this.$activePageWrapper.style[transform] = `translate3d(0,${destination}px, 0)`

      if (!direction) {
        this.$activePageWrapper.clientHeight
        this.$activePageWrapper.classList.remove('no-transitions')
      }

      return
    }

    const fakeIndex = resetTo === 'prev' ? 0 : this.lastCoverIndex + 2
    const fakeDestination = fakeIndex * this.activePageHeight * -1

    this.handleTransitionEnd = () => this.updatePagination(i, null)
    this.$activePageWrapper.addEventListener(transitionEnd, this.handleTransitionEnd)

    this.$activePageWrapper.style[transform] = `translate3d(0,${fakeDestination}px, 0)`
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
