/* global valueMixin */

var RangeDisplay = function (value, max, game, group, style) {
  this.game = game
  this.group = group
  this.graphics = this.game.add.graphics()
  this.graphics.fixedToCamera = true

  group.add(this.graphics)

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

  this.isHidden = false
}

RangeDisplay.prototype = {
  setText: function (x, y, title) {
    this.x = x
    this.y = y
    var t = this.text = this.game.add.text(x, y, title,
      { font: '32px Arial', fill: '#ffffff', align: 'center' })
    t.fixedToCamera = true
    t.cameraOffset.setTo(x, y)

    this.group.add(t)
  },

  setRangePos: function (width) {
    var dx = this.text.width + 10
    var height = 20
    this.graphics.cameraOffset.setTo(this.x + dx, this.text.centerY - height / 2)
    this.width = width
    this.height = height
    this.right = this.x + dx + width
  },

  draw: function () {
    this.graphics.clear()
    this.graphics.beginFill(this.style.background)
    this.graphics.drawRect(0, 0, this.width, this.height)
    this.graphics.endFill()
    if (this.value > 0) {
      var t = this.value / this.max
      var color
      if (t < 0.4) {
        color = this.style.small
      } else if (t < 0.6) {
        color = this.style.medium
      } else if (t < 1) {
        color = this.style.big
      } else {
        color = this.style.max
        t = 1
      }
      this.graphics.beginFill(color)
      this.graphics.drawRect(0, 0, this.width * this.value / this.max, this.height)
      this.graphics.endFill()
    }
  },

  hide: function () {
    if (!this.isHidden) {
      this.graphics.exists = false
      this.text.exists = false
      this.isHidden = true
    }
  },

  show: function () {
    if (this.isHidden) {
      this.graphics.exists = true
      this.text.exists = true
      this.isHidden = false
    }
  }
}

valueMixin(RangeDisplay.prototype)
