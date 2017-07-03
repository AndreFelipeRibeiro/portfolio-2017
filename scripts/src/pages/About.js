class About {
  constructor() {
    this.$about = document.getElementById('about')
    this.$scrollNodes   = Array.from(this.$about.querySelectorAll('[data-scrolled-into-view]'))

    // bind and cache methods
    this.handleResize    = this.handleResize.bind(this)
    this.handleScroll    = this.handleScroll.bind(this)
    this.requestScroll   = this.requestScroll.bind(this)

    this.lastPageYOffset    = window.pageYOffset
    this.currentPageYOffset = window.pageYOffset

    this.handleResize()
    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.requestScroll)
    window.addEventListener('resize', this.handleResize)
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.requestScroll)
    window.removeEventListener('resize', this.handleResize)
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
}

module.exports = About
