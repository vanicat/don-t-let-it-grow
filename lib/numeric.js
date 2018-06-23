var NumericDisplay = function (value, max, game, style) {
  this.game = game

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
    t.fixedToCamera = true
    t.cameraOffset.setTo(x, y)
  },

  setRangePos: function (dx, width) {
    this.valueDisplay = this.game.add.text(this.x + dx, this.y, this.value,
      { font: '32px Arial', fill: '#ffffff', align: 'center', minWidth: width })
    this.valueDisplay.fixedToCamera = true
    this.valueDisplay.anchor.setTo(1, 0)
    this.valueDisplay.cameraOffset.setTo(this.x + dx, this.y)
    this.width = width
  },

  draw: function () {
    this.valueDisplay.text = '' + this.value
  },

  hide: function () {
    if (!this.isHided) {
      this.valueDisplay.exists = false
      this.text.exists = false
    }
  }
}
