const BaseGallery = require('./Gallery')
const Hammer = require('hammerjs')

console.log("Hey, bozo.")

class Portfolio {
  constructor() {
    this.$coverGallery = document.getElementsByClassName('cover-gallery')[0]
    this.$projectCovers = Array.prototype.slice.call(this.$coverGallery.getElementsByClassName('project'))

    this.handleCoverChange = this.handleCoverChange.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    this.lastPageY = window.pageYOffset

    this.initCoverGallery()

    this.addEventListeners()
  }

  addEventListeners() {
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    let coverIndex = Math.floor(window.pageYOffset / window.innerHeight)
    if (coverIndex === this.coverIndex) return

    this.coverGallery.goToIndex(coverIndex)
  }

  handleCoverChange(index, indexWithClones) {
    if (indexWithClones === this.coverIndex) return

    this.coverIndex = indexWithClones
  }

  initCoverGallery() {
    this.coverIndex = 0

    const numOfClones = 3

    this.coverGallery = new BaseGallery({
      galleryNode: this.$coverGallery,
      childSelector: '.project',
      numOfClones,
      shouldAutoplay: false,
      handleChange: this.handleCoverChange
    })

    document.body.style.height = this.$projectCovers.length * numOfClones * window.innerHeight
  }
}

new Portfolio()
