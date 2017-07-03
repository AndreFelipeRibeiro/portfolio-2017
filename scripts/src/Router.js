const Lifecycle = require('@squarespace/core/Lifecycle')
const axios = require('axios')

const MODULES = {
  '/': require('./pages/Home'),
  '/about': require('./pages/About'),
  '/project-detail': require('./regions/ProjectDetail')
}

class Router {
  constructor() {
    this.$main = document.getElementsByTagName('main')[0]
    this.$contentWrapper = this.$main.getElementsByClassName('content-wrapper')[0]

    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this)
    this.handleLinkClick        = this.handleLinkClick.bind(this)
    this.handlePopState         = this.handlePopState.bind(this)

    this.history = []

    this.path = this.getCleanUrlPath(location.pathname)

    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded)
    window.addEventListener('click', this.handleLinkClick)
    window.addEventListener('popstate', this.handlePopState)
  }

  handleDOMContentLoaded() {
    this.loadContentScripts()
    this.injectHTML()
  }

  handleLinkClick(e) {
    const $link = this.getParentByTagName(e.target, 'A')

    if (!$link || !$link.getAttribute('href')) return
    if ($link.getAttribute('href').indexOf('http') > -1) return

    e.preventDefault()

    this.updateView($link.getAttribute('href'))
  }

  handlePopState(e) {
    e.preventDefault()
    const prevWindow = e.currentTarget
    this.updateView(prevWindow.location.pathname)
  }

  updateView(path) {
    axios.get(path).then(response => {
      const $html = document.createElement('html')
      $html.innerHTML = response.data
      const $body = $html.getElementsByTagName('body')[0]
      const $main = $html.getElementsByTagName('main')[0]

      if (this.module) this.module.out()
      Lifecycle.destroy()

      const handleTransitionEnd = (e) => {
        if (e.target !== this.$main) return
        if (e.propertyName !== 'opacity') return

        this.$main.removeEventListener('transitionend', handleTransitionEnd)
        this.$main.parentNode.replaceChild($main, this.$main)
        scrollTo(0,0)

        this.injectHTML($main)

        $main.classList.add('incoming-content')

        document.body.className = $body.className
        this.$main = $main
        this.$contentWrapper = this.$main.getElementsByClassName('content-wrapper')[0]

        setTimeout(() => {
          history.pushState({}, "Title", path)
          this.path = this.getCleanUrlPath(path)
          this.loadContentScripts()
        }, 0)
      }

      this.$main.classList.add('exiting-content')
      this.$main.addEventListener('transitionend', handleTransitionEnd)

    }).catch(error => console.log(error))
  }

  loadContentScripts() {
    const Module = this.getModule()
    if (Module) this.module = new Module
    this.$main.classList.remove('incoming-content')
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

  injectHTML($page) {
    Lifecycle.init()

    const $videoWrappers = Array.from(this.$main.getElementsByClassName('sqs-video-wrapper'))

    $videoWrappers.forEach($wrapper => {
      const $iframe = $wrapper.getElementsByTagName('iframe')[0]
      const src = $iframe.getAttribute('src')
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=${src}`

      axios.get(oembedUrl).then(response => {
        const { data } = response
        if (!data) return

        const aspectRatio = data.height / data.width

        const $intrinsicInner = $wrapper.getElementsByClassName('intrinsic-inner')[0]
        $intrinsicInner.style.paddingBottom = aspectRatio * 100 + '%'
      })
    })
  }
}

module.exports = Router
