const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')


class Home {
  constructor() {
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

    this.$sideNav             = this.$portfolio.getElementsByClassName('side-nav')[0]
    this.$sideNavOptions      = Array.from(this.$sideNav.getElementsByClassName('label'))

    this.handleCoverChange  = this.handleCoverChange.bind(this)
    this.handleResize       = this.handleResize.bind(this)
    this.handleScroll       = this.handleScroll.bind(this)
    this.requestScroll      = this.requestScroll.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.handleTouch        = this.handleTouch.bind(this)

    this.isFirstLoad         = true
    this.layout              = this.$portfolio.dataset.view
    this.lastPageYOffset     = window.pageYOffset
    this.currentPageYOffset  = window.pageYOffset
    this.sectionHeight       = 2000

    this.initSideNav()
    this.initPagination()
    this.initCoverGalleries()
    this.initGridGallery()
    this.initTouch()

    this.updateLayout(this.layout)

    scrollTo(0,0)
    this.handleResize()

    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)

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

  setTimer() {
    if (this.timer) clearInterval(this.timer)

    this.lastCoverChange = new Date().getTime()

    this.timer = setInterval(() => {
      const now = new Date().getTime()
      const timeSinceLastChange = now - this.lastCoverChange
      const translation = (timeSinceLastChange / 8000) * 100
      this.$paginationTimer.style.transform = `translate3d(${translation}%,0,0)`

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
    this.vh = window.innerHeight
    this.bodyHeight = document.body.clientHeight

    this.setGridBlockSizes()
  }

  handleScroll(e) {
    if (this.layout === 'grid') return

    const section = Math.floor(this.currentPageYOffset / this.sectionHeight)
    const nextIndex = section % this.$coverImages.length

    const endOfPage = this.bodyHeight - this.vh

    if      (this.currentPageYOffset <= 1)             scrollTo(0,endOfPage + 1)
    else if (this.currentPageYOffset >= endOfPage - 1) scrollTo(0,2)

    if (nextIndex === this.coverIndex) return

    this.coverGalleryImagery.goToIndex(nextIndex)
  }

  handleCoverChange(index, indexWithClones, $activeChild) {
    if (indexWithClones === this.coverIndex) return

    this.lastCoverChange = new Date().getTime()

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== 'opacity') return
      if (!e.target.classList.contains('imagery')) return
      if (e.elapsedTime < 1) return

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
          direction: Hammer.DIRECTION_HORIZONTAL
        }
      ]]
    })

    touch.on('swipe', this.handleTouch)
  }

  handleTouch(e) {
    const { direction } = e

    if (direction === Hammer.DIRECTION_LEFT)  this.coverGalleryImagery.next() // handle left swipe
    if (direction === Hammer.DIRECTION_RIGHT) this.coverGalleryImagery.prev() // handle right swipe
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
    this.isTransitioning = true
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

new Home()
