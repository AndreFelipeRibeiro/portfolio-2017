const prefixedTransform = require('../../lib/transform')

const TRANSITION_DURATION = 200

class LoadingScreen {
  constructor() {
    this.$main          = document.getElementsByTagName('main')[0]
    this.$loadingScreen = document.getElementById('loading-screen')
    this.$scrim         = this.$main.getElementsByClassName('scrim')[0]

    // Bind methods
    this.init    = this.init.bind(this)
    this.animate = this.animate.bind(this)

    this.vw = window.innerWidth
    this.lastFrameTime = new Date().getTime()
    this.pxPerMillisecond = 0.02
    this.progress = 0

    setTimeout(this.init, 0)
  }

  init() {
    this.animate()
  }

  animate() {
    const now = new Date().getTime()
    const timeDiff = now - this.lastFrameTime

    if (timeDiff < TRANSITION_DURATION || this.isTransitioning) return requestAnimationFrame(this.animate)

    const pxDiff = this.pxPerMillisecond * timeDiff

    // If we've already "fake-loaded" 33% and the images are all done, force a complete.
    const forceLoadComplete = this.requestedComplete && this.progress > this.vw / 3
    if (forceLoadComplete || this.progress >= this.vw - pxDiff) return this.handleLoadComplete(timeDiff)

    this.lastFrameTime = now
    this.progress += pxDiff
    this.updateView(timeDiff)

    requestAnimationFrame(this.animate)
  }

  updateProgress(requestedProgress) {
    if (requestedProgress >= 1) this.requestedComplete = true

    const actualProgress = this.progress / this.vw
    const progressDiff = requestedProgress - actualProgress

    let adjustedSpeed = this.pxPerMillisecond

    if (progressDiff > 0) adjustedSpeed = Math.min(1, this.pxPerMillisecond + 0.01)
    if (progressDiff < 0) adjustedSpeed = Math.max(0.001, this.pxPerMillisecond - 0.01)

    this.pxPerMillisecond = adjustedSpeed
  }

  updateView(transitionDuration) {
    const handleTransitionEnd = (e) => {
      if (e.target !== this.$scrim) return
      if (e.propertyName !== prefixedTransform) return

      this.$scrim.removeEventListener('transitionend', handleTransitionEnd)
      this.isTransitioning = false
    }

    this.$scrim.addEventListener('transitionend', handleTransitionEnd)
    this.isTransitioning = true

    this.$scrim.clientHeight
    this.$scrim.style[prefixedTransform] = `translate3d(${this.progress}px,0,0)`
    this.$scrim.style.transitionDuration = `${transitionDuration}ms`
  }

  handleLoadComplete(transitionDuration) {
    this.$scrim.style[prefixedTransform] = `translate3d(100%,0,0)`
    this.$scrim.style.transitionDuration = `${transitionDuration}ms`

    document.body.classList.remove('is-loading')
    this.$main.classList.remove('incoming-content')
  }
}

module.exports = LoadingScreen
