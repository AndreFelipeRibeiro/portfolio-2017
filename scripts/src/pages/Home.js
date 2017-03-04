const Hammer = require('hammerjs')

const transitionEnd = require('../lib/transition-end')

const BaseGallery = require('../blocks/Gallery')
const Pagination = require('../blocks/Pagination')

// Polyfill
Array.from = (arr) => Array.prototype.slice.call(arr)


class Home {
  constructor() {
    this.$portfolio           = document.getElementById('portfolio')
    this.$coverGallery        = this.$portfolio.getElementsByClassName('cover-gallery')[0]
    this.$coverGalleryImagery = this.$portfolio.getElementsByClassName('cover-gallery-imagery')[0]
    this.$coverGalleryText    = this.$portfolio.getElementsByClassName('cover-gallery-text')[0]
    this.$coverImages         = Array.from(this.$coverGalleryImagery.getElementsByClassName('imagery'))
    this.$coverTexts          = Array.from(this.$coverGalleryText.getElementsByClassName('text'))

    this.$coverPagination     = this.$portfolio.getElementsByClassName('cover-gallery-pagination')[0]
    this.$activePageWrapper   = this.$coverPagination.getElementsByClassName('active-page-wrapper')[0]

    this.$gridGalleryWrapper  = this.$portfolio.getElementsByClassName('grid-gallery-wrapper')[0]
    this.$gridGallery         = this.$portfolio.getElementsByClassName('grid-gallery')[0]
    this.$gridBlocks          = Array.from(this.$gridGallery.getElementsByClassName('grid-block'))

    this.$sideNav             = this.$portfolio.getElementsByClassName('side-nav')[0]
    this.$sideNavOptions      = Array.from(this.$sideNav.getElementsByClassName('label'))

    this.handleCoverChange = this.handleCoverChange.bind(this)
    this.handleResize      = this.handleResize.bind(this)
    this.handleScroll      = this.handleScroll.bind(this)
    this.requestScroll     = this.requestScroll.bind(this)

    this.isFirstLoad        = true
    this.layout             = this.$portfolio.dataset.view
    this.lastPageYOffset    = window.pageYOffset
    this.currentPageYOffset = window.pageYOffset
    this.sectionHeight      = 2000

    this.initSideNav()
    this.initPagination()
    this.initCoverGalleries()
    this.initGridGallery()

    this.updateView(this.layout)

    scrollTo(0,0)
    this.handleResize()

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
    const section = Math.floor(this.currentPageYOffset / this.sectionHeight)
    const nextIndex = section % this.$coverImages.length

    const endOfPage = this.bodyHeight - this.vh

    if      (this.currentPageYOffset <= 1)             scrollTo(0,endOfPage + 1)
    else if (this.currentPageYOffset >= endOfPage - 1) scrollTo(0,2)

    if (nextIndex === this.coverIndex) return

    this.coverGalleryImagery.goToIndex(nextIndex)
    this.pagination.update(nextIndex)
  }

  handleCoverChange(index, indexWithClones, $activeChild) {
    if (indexWithClones === this.coverIndex) return

    this.coverIndex = indexWithClones
    this.coverGalleryText.goToIndex(this.coverIndex)

    this.$coverGalleryImagery.dataset.project = $activeChild.dataset.project
  }

  initSideNav() {
    this.$sideNavOptions.forEach($option => {
      $option.addEventListener('click', (e) => {
        const layout = e.target.dataset.view
        if (layout === this.layout) return

        this.layout = layout
        this.$portfolio.dataset.view = this.layout
        this.$sideNav.dataset.view = this.layout

        this.$gridBlocks = Array.from(this.$gridGallery.querySelectorAll(`.grid-block`))

        this.updateView(this.layout)
      })
    })
  }

  updateView(type) {
    if (type === 'grid') {
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

    if (type === 'cover') {
      this.$gridBlocks.forEach($block => {
        const $image = $block.querySelector(`.imagery`)
        const scale = $block.dataset.scale
        const isActiveProject = $block.dataset.project === this.$coverGalleryImagery.dataset.project

        if (!this.isFirstLoad && isActiveProject) {
          const { diffX, diffY } = $block.dataset
          $image.style.removeProperty('transform')
          $block.style.transform = `translate3d(${diffX}px,${diffY}px,0)`

          const handleTransitionEnd = (e) => {
            if (e.target !== this.$gridGalleryWrapper) return
            if (e.propertyName !== 'opacity') return

            this.$gridGalleryWrapper.removeEventListener(transitionEnd, handleTransitionEnd)

            const scale = $block.dataset.scale
            const $image = $block.querySelector(`.imagery`)

            $block.classList.remove('is--active')
            $block.style.removeProperty('transform')
            $image.style.transform = `scale(${scale})`
          }

          this.$gridGalleryWrapper.addEventListener(transitionEnd, handleTransitionEnd)
        } else {
          $image.style.transform = `scale(${scale})`
        }
      })
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
      $gridBlockImage.style.transform = `scale(${scale})`
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
    })
  }
}

new Home()
