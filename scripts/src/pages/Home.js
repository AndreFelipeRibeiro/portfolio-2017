const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')

const IS_MOBILE_OS = require('../lib/is-mobile-os')


class Home {
  constructor() {
    this.$main                = document.getElementsByTagName('main')[0]
    this.$portfolio           = document.getElementById('portfolio')
    this.$coverGalleryWrapper = this.$portfolio.getElementsByClassName('cover-gallery-wrapper')[0]
    this.$coverGallery        = this.$portfolio.getElementsByClassName('cover-gallery')[0]
    this.$coverGalleryImagery = this.$portfolio.getElementsByClassName('cover-gallery-imagery')[0]
    this.$coverGalleryText    = this.$portfolio.getElementsByClassName('cover-gallery-text')[0]
    this.$coverImages         = Array.from(this.$coverGalleryImagery.getElementsByClassName('imagery'))
    this.$coverTexts          = Array.from(this.$coverGalleryText.getElementsByClassName('text'))

    this.$coverPagination     = this.$portfolio.getElementsByClassName('cover-gallery-pagination')[0]
    this.$paginationDivider   = this.$coverPagination.getElementsByClassName('divider')[0]
    this.$paginationTimer     = this.$paginationDivider.getElementsByClassName('timer')[0]
    this.$activePageWrapper   = this.$coverPagination.getElementsByClassName('active-page-wrapper')[0]

    this.$gridGalleryWrapper  = this.$portfolio.getElementsByClassName('grid-gallery-wrapper')[0]
    this.$gridGallery         = this.$portfolio.getElementsByClassName('grid-gallery')[0]
    this.$gridBlocks          = Array.from(this.$gridGallery.getElementsByClassName('grid-block'))

    this.$header              = document.getElementById('header')

    this.$sideNav             = this.$portfolio.getElementsByClassName('side-nav')[0]
    this.$sideNavOptions      = Array.from(this.$sideNav.getElementsByClassName('label'))

    this.$cursorArrow         = document.getElementsByClassName('cursor-arrow')[0]

    this.handleCoverChange     = this.handleCoverChange.bind(this)
    this.handleResize          = this.handleResize.bind(this)
    this.handleScroll          = this.handleScroll.bind(this)
    this.requestScroll         = this.requestScroll.bind(this)
    this.handleLayoutChange    = this.handleLayoutChange.bind(this)
    this.handleKeyDown         = this.handleKeyDown.bind(this)
    this.handleTouch           = this.handleTouch.bind(this)

    this.isFirstLoad         = true
    this.layout              = this.$portfolio.dataset.view
    this.lastPageYOffset     = window.pageYOffset
    this.currentPageYOffset  = window.pageYOffset
    this.sectionHeight       = IS_MOBILE_OS ? 1000 : 2000
    this.scrollTimeout       = undefined

    this.initSideNav()
    this.initPagination()
    this.initCoverGalleries()
    this.initGridGallery()
    this.initTouch()

    this.setGalleryHeights()

    this.updateLayout(this.layout)

    scrollTo(0,0)
    this.handleResize()

    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('keydown', this.handleKeyDown)

    this.$gridBlocks.forEach($block => {
      $block.addEventListener('mouseenter', () => {
        if (this.isTransitioning) return
        this.hoveredBlock = $block
        this.$gridGallery.classList.add('has-hovered-block')
        $block.classList.add('is-hovered')
      })
      $block.addEventListener('mouseleave', () => {
        if (this.isTransitioning) return
        if (this.hoveredBlock !== $block) return
        this.$gridGallery.classList.remove('has-hovered-block')
        $block.classList.remove('is-hovered')
        this.hoveredBlock = null
      })
    })
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.requestScroll)
    window.removeEventListener('resize', this.handleResize)
  }

  out() {
    this.removeEventListeners()
    document.body.style.removeProperty('height')
  }

  setTimer() {
    if (this.timer) clearInterval(this.timer)

    this.lastCoverChange = new Date().getTime()

    this.timer = setInterval(() => {
      const now = new Date().getTime()
      const timeSinceLastChange = now - this.lastCoverChange
      const translation = (timeSinceLastChange / 8000) * 100
      this.$paginationTimer.style.transform = `translate3d(${translation}%,0,0)`

      if (window.STOP_GALLERY) return this.coverGalleryImagery.stop()

      if (timeSinceLastChange >= 8000) this.coverGalleryImagery.next()
    }, 700)
  }

  requestScroll(e) {
  	this.requestTick(e)
  }

  requestTick(e) {
    if (this.ticking) return

    requestAnimationFrame(() => {
      this.lastPageYOffset = this.currentPageYOffset
      this.currentPageYOffset = window.pageYOffset
      this.handleScroll(e)
      this.ticking = false
    })

  	this.ticking = true
  }

  handleResize() {
    this.vw = window.innerWidth
    this.vh = window.innerHeight
    this.bodyHeight = document.body.clientHeight

    this.setGalleryHeights()
    this.setGridBlockSizes()

    if (this.vw < 1024) {
      this.layout = 'cover'
      this.$portfolio.dataset.view = this.layout
      this.$sideNav.dataset.view = this.layout
      this.updateLayout(this.layout)
    }
  }

  handleScroll(e) {
    if (this.layout === 'grid') return
    if (IS_MOBILE_OS) return

    clearTimeout(this.scrollTimeout)

    const direction = this.currentPageYOffset > this.lastPageYOffset
    const endOfPage = this.bodyHeight - this.vh

    if      (this.currentPageYOffset <= 1)             scrollTo(0, endOfPage + 1)
    else if (this.currentPageYOffset >= endOfPage - 1) scrollTo(0, 2)

    this.scrollTimeout = setTimeout(() => {
      clearTimeout(this.scrollTimeout)
      if (this.isTransitioning) return
      if (direction) return this.coverGalleryImagery.next()
      if (!direction) return this.coverGalleryImagery.prev()
    }, 30)
  }

  /**
   * Calculate the height from the address bars and such.
   * This should only ever be called once.
   */
  getGalleryHeight() {
    const headerHeight       = this.$header.clientHeight
    const addressBarHeight   = window.screen.availHeight - window.innerHeight
    const adjustedHeroHeight = window.screen.availHeight - addressBarHeight

    return adjustedHeroHeight - headerHeight + 'px'
  }

  // Manually set this hero height so it doesn't jump up and down on scroll.
  setGalleryHeights() {
    if (IS_MOBILE_OS) {
      const galleryHeight = this.getGalleryHeight()
      this.$coverGalleryWrapper.style.height = galleryHeight
      this.$gridGalleryWrapper.style.height = galleryHeight
    } else {
      this.$coverGalleryWrapper.style.removeProperty('height')
      this.$gridGalleryWrapper.style.removeProperty('height')
    }
  }

  handleCoverChange(index, indexWithClones, $activeChild) {
    if (indexWithClones === this.coverIndex) return

    this.lastCoverChange = new Date().getTime()

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== 'opacity') return
      if (!e.target.classList.contains('imagery')) return

      $activeChild.removeEventListener(transitionEnd, handleTransitionEnd)
      this.isTransitioning = false
    }

    this.isTransitioning = true
    $activeChild.addEventListener(transitionEnd, handleTransitionEnd)

    this.coverIndex = indexWithClones
    this.coverGalleryText.goToIndex(this.coverIndex)
    this.pagination.update(this.coverIndex)

    this.$coverGalleryImagery.dataset.project = $activeChild.dataset.project
  }

  handleKeyDown(e) {
    if (this.layout === 'grid') return
    if (this.isTransitioning) return

    if (e.code === "ArrowRight") this.coverGalleryImagery.next()
    if (e.code === "ArrowDown") this.coverGalleryImagery.next()

    if (e.code === "ArrowLeft") this.coverGalleryImagery.prev()
    if (e.code === "ArrowUp") this.coverGalleryImagery.prev()
  }

  initSideNav() {
    this.$sideNavOptions.forEach($option => {
      $option.addEventListener('click', (e) => {
        const layout = e.target.dataset.view
        if (layout === this.layout) return
        if (this.isTransitioning) return

        this.layout = layout
        this.$portfolio.dataset.view = this.layout
        this.$sideNav.dataset.view = this.layout

        this.$gridBlocks = Array.from(this.$gridGallery.querySelectorAll(`.grid-block`))
        this.updateLayout()
      })
    })
  }

  initTouch() {
    const touch = new Hammer(this.$coverGalleryWrapper, {
      recognizers: [[
        Hammer.Swipe, {
          threshold: 5,
          velocity: 0.35,
          direction: Hammer.DIRECTION_ALL
        }
      ]]
    })

    touch.on('swipe', this.handleTouch)
  }

  handleTouch(e) {
    const { direction } = e

    if (direction === Hammer.DIRECTION_LEFT)  this.coverGalleryImagery.next()
    if (direction === Hammer.DIRECTION_UP)    this.coverGalleryImagery.next()

    if (direction === Hammer.DIRECTION_RIGHT) this.coverGalleryImagery.prev()
    if (direction === Hammer.DIRECTION_DOWN)  this.coverGalleryImagery.prev()
  }

  handleLayoutChange(e) {
    if (this.layout === 'grid') {
      if (!e.target.classList.contains('imagery')) return
      if (e.target.parentNode.classList.contains('is--active')) return
      if (e.propertyName !== 'opacity') return
    }

    if (this.layout === 'cover') {
      if (e.target !== this.$gridGalleryWrapper) return
      if (e.propertyName !== 'opacity') return
    }

    this.isTransitioning = false
    this.$gridGalleryWrapper.removeEventListener(transitionEnd, this.handleLayoutChange)

    this.setGridBlockSizes()

    if (this.layout === 'cover') {
      this.$gridBlocks.forEach($block => {
        const scale = $block.dataset.scale
        const $image = $block.querySelector(`.imagery`)

        $block.classList.remove('is--active')
        $block.style.removeProperty('transform')
        $image.style.transform = `scale(${scale})`
      })
    }
  }

  updateLayout() {
    if (!this.isFirstLoad) this.isTransitioning = true
    this.$gridGalleryWrapper.removeEventListener(transitionEnd, this.handleLayoutChange)
    this.$gridGalleryWrapper.addEventListener(transitionEnd, this.handleLayoutChange)

    if (this.layout === 'grid') {
      clearInterval(this.timer)

      this.$gridBlocks.forEach($block => {
        const scale = $block.dataset.scale
        const $image = $block.querySelector(`.imagery`)

        const isActiveProject = $block.dataset.project === this.$coverGalleryImagery.dataset.project
        if (isActiveProject) $block.classList.add('is--active')

        if (!this.isFirstLoad && isActiveProject) {
          const { diffX, diffY } = $block.dataset
          $block.classList.add('no-transitions')
          $image.classList.add('no-transitions')
          $image.style.removeProperty('transform')
          $block.style.transform = `translate3d(${diffX}px,${diffY}px,0)`
          $block.clientHeight
          $image.clientHeight
          $image.classList.remove('no-transitions')
          $block.classList.remove('no-transitions')
        }

        $block.style.removeProperty('transform')
        $image.style.transform = `scale(${scale})`
      })
    }

    if (this.layout === 'cover') {
      this.$gridGallery.classList.remove('has-hovered-block')
      this.hoveredBlock = null

      this.$gridBlocks.forEach($block => {
        $block.classList.remove('is-hovered')

        const $image = $block.querySelector(`.imagery`)
        const scale = $block.dataset.scale
        const isActiveProject = $block.dataset.project === this.$coverGalleryImagery.dataset.project

        if (!this.isFirstLoad && isActiveProject) {

          const { diffX, diffY } = $block.dataset
          $image.style.removeProperty('transform')
          $block.style.transform = `translate3d(${diffX}px,${diffY}px,0)`

        } else {
          $image.style.transform = `scale(${scale})`
        }
      })

      this.setTimer()
    }

    this.isFirstLoad = false
  }

  initPagination() {
    this.lastCoverIndex = this.$coverImages.length - 1
    this.pagination = new Pagination(this.$activePageWrapper, this.$coverImages.length)
  }

  initCoverGalleries() {
    this.coverIndex = 0
    this.pagination.update(this.coverIndex)

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

    document.body.style.height = (this.$coverImages.length + 1) * this.sectionHeight + 'px'

    this.$coverGalleryImagery.dataset.project = this.$coverImages[0].dataset.project

    this.setTimer()
  }

  initGridGallery() {
    this.gridBlocks = {}
    this.setGridBlockSizes()
  }

  setGridBlockSizes() {
    this.$coverImages.forEach($image => {
      const project = $image.dataset.project
      const $gridBlock = this.$gridGallery.querySelector(`.grid-block[data-project=${project}]`)
      const $gridBlockImage = $gridBlock.getElementsByClassName('imagery')[0]
      const scale = parseFloat($gridBlock.dataset.scale)

      this.gridBlocks[project] = $gridBlock

      $gridBlockImage.style.width = $image.clientWidth + 'px'
      $gridBlockImage.style.height = $image.clientHeight + 'px'

      $gridBlockImage.classList.add('no-transitions')
      $gridBlock.classList.add('no-transitions')
      $gridBlockImage.style.transform = `scale(${scale})`

      const hadTransform = !!$gridBlock.style.transform
      $gridBlock.style.removeProperty('transform')

      $gridBlockImage.clientHeight
      $gridBlockImage.classList.remove('no-transitions')

      $gridBlock.style.width = $image.clientWidth * scale + 'px'
      $gridBlock.style.height = $image.clientHeight * scale + 'px'

      const imageRect = $image.getBoundingClientRect()
      const gridBlockRect = $gridBlockImage.getBoundingClientRect()
      const diffX = imageRect.left - gridBlockRect.left
      const diffY = imageRect.top - gridBlockRect.top

      $gridBlock.dataset.diffX = diffX
      $gridBlock.dataset.diffY = diffY

      if (hadTransform) $gridBlock.style.transform = `translate3d(${diffX}px,${diffY}px,0)`

      $gridBlock.clientHeight
      $gridBlock.classList.remove('no-transitions')
    })
  }
}

module.exports = Home
