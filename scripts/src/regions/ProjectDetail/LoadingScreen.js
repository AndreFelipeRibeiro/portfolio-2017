const prefixedTransform = require('../../lib/transform')

const TRANSITION_DURATION = 200
const ORIGINAL_PX_PER_MILLISECOND = 0.02

class LoadingScreen {
  constructor() {
    this.$main          = document.getElementsByTagName('main')[0]
    this.$header        = document.getElementById('header')
    this.$loadingScreen = document.getElementById('loading-screen')
    this.$scrim         = this.$main.getElementsByClassName('scrim')[0]

    // Bind methods
    this.init    = this.init.bind(this)
    this.animate = this.animate.bind(this)

    this.vw = window.innerWidth
    this.lastFrameTime = new Date().getTime()
    this.pxPerMillisecond = ORIGINAL_PX_PER_MILLISECOND
    this.progress = 0

    setTimeout(this.init, 0)
  }

  init() {
    document.body.classList.add('is-loading')
    document.body.classList.add('is-fixed')
    this.animate()
  }

  animate() {
    const now = new Date().getTime()
    const timeDiff = now - this.lastFrameTime

    if (timeDiff < TRANSITION_DURATION || this.isTransitioning) return requestAnimationFrame(this.animate)

    const pxDiff = this.pxPerMillisecond * timeDiff

    // If we've already "fake-loaded" 25% and the images are all done, force a complete.
    const forceLoadComplete = this.requestedComplete && this.progress > this.vw / 4
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

    const handleTransitionEnd = (e) => {
      if (e.target === this.$loadingScreen) {
        if (e.propertyName === 'opacity') {
          this.$header.classList.remove('force-is-light')
          this.$loadingScreen.removeEventListener('transitionend', handleTransitionEnd)
          return
        }
      }

      if (e.target === this.$scrim) {
        if (e.propertyName === prefixedTransform) {
          document.body.classList.remove('is-loading')
          this.$header.classList.add('force-is-light')
        }

        if (e.propertyName === 'opacity') {
          document.body.classList.remove('is-fixed')
        }
      }
    }

    this.$loadingScreen.addEventListener('transitionend', handleTransitionEnd)
  }
}

module.exports = LoadingScreen
