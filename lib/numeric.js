/* global valueMixin */

var NumericDisplay = function (value, max, game, group, style) {
  this.game = game
  this.group = group

  this.value = value
  this.max = max
  this.style = {
    background: 0x202020,
    small: 0xffff00,
    medium: 0xffff00,
    big: 0xffff00,
    max: 0xffff00
  }
  if (style) {
    this.style = { ...this.style, ...style } // not testetd
  }

  this.isHided = false
}

NumericDisplay.prototype = {
  setText: function (x, y, title) {
    this.x = x
    this.y = y
    var t = this.text = this.game.add.text(x, y, title,
      { font: '32px Arial', fill: '#ffffff', align: 'center' })
    t.anchor.setTo(0, 0)
    t.fixedToCamera = true
    t.cameraOffset.setTo(x, y)

    this.group.add(t)
  },

  setRangePos: function (width) {
    var dx = this.text.width + 10 + width
    this.valueDisplay = this.game.add.text(this.x + dx, this.y, this.value,
      { font: '32px Arial', fill: '#ffffff', align: 'center', minWidth: width })
    this.valueDisplay.fixedToCamera = true
    this.valueDisplay.anchor.setTo(1, 0)
    this.valueDisplay.cameraOffset.setTo(this.x + dx, this.y)
    this.width = width

    this.group.add(this.valueDisplay)
    this.right = this.valueDisplay.right
  },

  draw: function () {
    this.valueDisplay.text = '' + Math.floor(this.value)
  },

  hide: function () {
    if (!this.isHided) {
      this.valueDisplay.exists = false
      this.text.exists = false
    }
  }
}

valueMixin(NumericDisplay.prototype)
