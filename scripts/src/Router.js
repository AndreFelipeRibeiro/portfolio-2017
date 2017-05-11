const axios = require('axios')

const MODULES = {
  '/': require('./pages/Home'),
  '/project-detail': require('./regions/ProjectDetail')
}

class Router {
  constructor() {
    this.$main = document.getElementsByTagName('main')[0]

    this.handleLinkClick = this.handleLinkClick.bind(this)

    this.in()
    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('click', this.handleLinkClick)
  }

  handleLinkClick(e) {
    const $link = this.getParentByTagName(e.target, 'A')
    if (!$link || !$link.href) return

    e.preventDefault()

    axios.get($link.href).then(response => {

      const $html = document.createElement('html')
      $html.innerHTML = response.data
      const $main = $html.getElementsByTagName('main')[0]

      const handleTransitionEnd = (e) => {
        if (e.target !== this.$main) return
        if (e.propertyName !== 'opacity') return

        this.$main.removeEventListener('transitionend', handleTransitionEnd)

        document.body.replaceChild($main, this.$main)
        $main.classList.add('incoming-content')
        this.$main = $main

        setTimeout(() => {
          $main.classList.remove('incoming-content')

          history.pushState({}, "Title", $link.href)
          scrollTo(0,0)
          this.in()
        }, 0)
      }

      this.$main.addEventListener('transitionend', handleTransitionEnd)
      this.$main.classList.add('exiting-content')

    }).catch(error => console.log(error))
  }

  in() {
    if (this.module) this.module.out()

    this.path = this.getCleanUrlPath()

    const Module = this.getModule()

    if (Module) this.module = new Module
  }

  // Helpers
  getCleanUrlPath() {
    let url = location.pathname
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
