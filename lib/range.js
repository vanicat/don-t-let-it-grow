var Range = function (x, y, width, height, max, graphics, style) {
  this.graphics = graphics
  this.x = x
  this.y = y
  this.value = 0
  this.max = max
  this.width = width
  this.height = height
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
}

Range.prototype = {
  draw: function () {
    this.graphics.clear()
    this.graphics.beginFill(this.style.background)
    this.graphics.drawRect(this.x, this.y, this.width, this.height)
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
      this.graphics.drawRect(this.x, this.y, this.width * this.value / this.max, this.height)
      this.graphics.endFill()
    }
  }
}
