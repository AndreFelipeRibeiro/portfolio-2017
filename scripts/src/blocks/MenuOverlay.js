class MenuOverlay {
  constructor() {
    this.$header      = document.getElementById('header')
    this.$main        = document.getElementsByTagName('main')[0]
    this.$hamburger   = this.$header.getElementsByClassName('hamburger')[0]

    this.$menuOverlay = document.getElementsByClassName('menu-overlay')[0]
    this.$menuLinks   = Array.from(this.$menuOverlay.getElementsByClassName('link'))

    // state
    this.menuIsActive = false
    this.currentUrl   = this.$menuOverlay.dataset.activeLink

    // cache bound methods
    this.handleClickHamburger = this.handleClickHamburger.bind(this)
    this.handleClickLink      = this.handleClickLink.bind(this)
    this.handleEnterLink      = this.handleEnterLink.bind(this)
    this.handleLeaveLink      = this.handleLeaveLink.bind(this)

    // add event listeners
    this.addEventListeners()
  }

  addEventListeners() {
    this.$hamburger.addEventListener('click', this.handleClickHamburger)
    this.$menuLinks.forEach($link => {
      $link.addEventListener('click', e => this.handleClickLink(e, $link))
      $link.addEventListener('mouseenter', this.handleEnterLink)
      $link.addEventListener('mouseleave', this.handleLeaveLink)
    })
  }

  handleClickLink(e, $target) {
    if ($target.classList.contains('active-page')) {
      e.preventDefault()
      e.stopImmediatePropagation()
      return
    }

    this.$menuLinks.forEach($link => $link.classList.remove('active-page'))
    $target.classList.add('active-page')

    this.menuIsActive = false
    this.updateMenuOverlay()
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

    document.body.classList[fn]('has-menu-overlay')
    this.$hamburger.classList[fn]('is-active')
    this.$menuOverlay.classList[fn]('is-active')
    this.$header.classList[fn]('has-menu-overlay')

    this.$menuOverlay.classList[!!this.$activeLink ? 'add' : 'remove']('has-hovered-link')
  }
}

module.exports = MenuOverlay
