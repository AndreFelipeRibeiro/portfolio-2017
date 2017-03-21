class Header {
  constructor() {
    this.$header      = document.getElementById('header')
    this.$main        = document.getElementsByTagName('main')[0]
    this.$hamburger   = this.$header.getElementsByClassName('hamburger')[0]

    this.$menuOverlay = document.getElementsByClassName('menu-overlay')[0]
    this.$menuLinks   = Array.from(this.$menuOverlay.getElementsByClassName('link'))

    // state
    this.menuIsActive = false
    this.currentUrl   = this.$menuOverlay.dataset.activeLink
    this.$activeLink  = this.$menuOverlay.querySelector(`.link[data-link=${this.currentUrl}]`)

    // cache bound methods
    this.handleClickHamburger = this.handleClickHamburger.bind(this)
    this.handleEnterLink      = this.handleEnterLink.bind(this)
    this.handleLeaveLink      = this.handleLeaveLink.bind(this)

    // add event listeners
    this.addEventListeners()
  }

  addEventListeners() {
    this.$hamburger.addEventListener('click', this.handleClickHamburger)
    this.$menuLinks.forEach($link => {
      $link.addEventListener('mouseenter', this.handleEnterLink)
      $link.addEventListener('mouseleave', this.handleLeaveLink)
    })
  }

  handleEnterLink(e) {
    this.$activeLink = e.target
    this.updateMenuOverlay()
  }

  handleLeaveLink(e) {
    if (this.$activeLink !== e.target) return
    this.$activeLink = null
    this.updateMenuOverlay()
  }

  handleClickHamburger(e) {
    this.menuIsActive = !this.menuIsActive
    this.updateMenuOverlay()
  }

  updateMenuOverlay() {
    const fn = this.menuIsActive ? 'add' : 'remove'

    this.$main.classList[fn]('is-transparent')
    this.$hamburger.classList[fn]('is-active')
    this.$menuOverlay.classList[fn]('is-active')
    this.$header.classList[fn]('has-menu-overlay')
    this.$menuLinks.forEach($link => $link.classList.remove('is-active'))

    if (!this.$activeLink) {
      this.$activeLink  = this.$menuOverlay.querySelector(`.link[data-link=${this.currentUrl}]`)
    }

    this.$menuOverlay.dataset.activeLink = this.$activeLink.dataset.link
    this.$header.dataset.activeLink = this.$activeLink.dataset.link
    this.$activeLink.classList.add('is-active')
  }
}

module.exports = Header
