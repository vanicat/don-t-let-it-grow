var Range = function (x, y, width, height, max, graphics) {
  this.graphics = graphics
  this.x = x
  this.y = y
  this.value = 0
  this.max = max
  this.width = width
  this.height = height
}

Range.prototype = {
  draw: function () {
    this.graphics.clear()
    this.graphics.beginFill(0x202020)
    this.graphics.drawRect(this.x, this.y, this.width, this.height)
    this.graphics.endFill()
    if (this.value > 0) {
      this.graphics.beginFill(0xffff00)
      this.graphics.drawRect(this.x, this.y, this.width * this.value / this.max, this.height)
      this.graphics.endFill()
    }
  }
}
