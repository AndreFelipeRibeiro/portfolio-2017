const transitionEnd = require('../lib/transition-end')
const transform = require('../lib/transform')


class Pagination {
  constructor($parent, count) {
    this.$parent = $parent
    this.count = count

    this.lastIndex = this.count - 1

    this.$activePages = [this.appendPageLabel(this.lastIndex)]

    for (let i = 0; i < this.count; i++) {
      this.$activePages.push(this.appendPageLabel(i))
    }

    this.$activePages = [this.appendPageLabel(0)]

    this.activePageHeight = this.$activePages[0].clientHeight
  }

  appendPageLabel(index) {
    const $pageLabel = document.createElement('div')
    $pageLabel.classList.add('label')
    $pageLabel.classList.add('active-page')
    $pageLabel.textContent = '0' + (index + 1)

    this.$parent.appendChild($pageLabel)
    return $pageLabel
  }

  update(i, withTransitions = true) {
    this.$parent.removeEventListener(transitionEnd, this.handleTransitionEnd)

    const index = i + 1
    const destination = index * this.activePageHeight * -1

    let resetTo = null
    if (i === 0 && this.activeIndex === this.lastIndex) resetTo = 'next'
    if (i === this.lastIndex && this.activeIndex === 0) resetTo = 'prev'
    this.activeIndex = i

    if (!resetTo) {
      if (!withTransitions) {
        this.$parent.classList.add('no-transitions')
        this.$parent.clientHeight
      }

      this.$parent.style[transform] = `translate3d(0,${destination}px, 0)`

      if (!withTransitions) {
        this.$parent.clientHeight
        this.$parent.classList.remove('no-transitions')
      }

      return
    }

    const fakeIndex = resetTo === 'prev' ? 0 : this.lastIndex + 2
    const fakeDestination = fakeIndex * this.activePageHeight * -1

    this.handleTransitionEnd = () => this.update(i, false)
    this.$parent.addEventListener(transitionEnd, this.handleTransitionEnd)

    this.$parent.style[transform] = `translate3d(0,${fakeDestination}px, 0)`
  }
}

module.exports = Pagination
