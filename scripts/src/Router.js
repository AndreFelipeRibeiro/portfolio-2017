const axios = require('axios')

const MODULES = {
  '/': require('./pages/Home'),
  '/project-detail': require('./regions/ProjectDetail')
}

class Router {
  constructor() {
    this.$main = document.getElementsByTagName('main')[0]

    this.handleLinkClick = this.handleLinkClick.bind(this)
    this.handlePopState  = this.handlePopState.bind(this)

    this.updateView(location.pathname)
    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('click', this.handleLinkClick)
    window.addEventListener('popstate', this.handlePopState)
  }

  handleLinkClick(e) {
    const $link = this.getParentByTagName(e.target, 'A')
    if (!$link || !$link.href) return

    e.preventDefault()

    this.updateView($link.href)
  }

  handlePopState(e) {
    const prevWindow = e.currentTarget
    this.updateView(prevWindow.location.pathname)
  }

  updateView(path) {
    axios.get(path).then(response => {

      const $html = document.createElement('html')
      $html.innerHTML = response.data
      const $main = $html.getElementsByTagName('main')[0]

      const handleTransitionEnd = (e) => {
        if (e.target !== this.$main) return
        if (e.propertyName !== 'opacity') return

        this.$main.removeEventListener('transitionend', handleTransitionEnd)

        document.body.replaceChild($main, this.$main)
        scrollTo(0,0)

        $main.classList.add('incoming-content')
        this.$main = $main

        setTimeout(() => {
          $main.classList.remove('incoming-content')

          history.pushState({}, "Title", path)

          if (this.module) this.module.out()

          this.path = this.getCleanUrlPath(path)

          const Module = this.getModule()

          if (Module) this.module = new Module
        }, 0)
      }

      this.$main.addEventListener('transitionend', handleTransitionEnd)
      this.$main.classList.add('exiting-content')

    }).catch(error => console.log(error))
  }

  // Helpers
  getCleanUrlPath(url) {
    let urlParts = url.split('')

    if (
      urlParts.length > 1 &&
      urlParts[urlParts.length -1] === '/'
    ) {
      urlParts.pop()
    }

    return urlParts.join('')
  }

  getParentByTagName($node, tag) {
    if ($node === document.body)          return null
    if ($node.tagName === tag)            return $node
    if ($node.parentNode.tagName === tag) return $node.parentNode

    return this.getParentByTagName($node.parentNode, tag)
  }

  getModule() {
    if (MODULES[this.path]) return MODULES[this.path]

    const $main = document.getElementsByTagName('main')[0]
    const id = '/' + $main.id

    return MODULES[id] || null
  }
}

module.exports = Router
