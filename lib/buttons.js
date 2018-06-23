const BUTTONS_HEIGHT = 68
// const BUTTONS_WIDTH = 320

var ToolBox = function (game, x, y) {
  this.game = game
  this.buttonsSpecification = {}
  this.buttons = {}
  this.x = x
  this.y = y
  this.next_button_y = y
}

ToolBox.prototype = {
  addButton: function (name, action) {
    this.buttonsSpecification[name] = {
      x: this.x,
      y: this.next_button_y,
      name: name,
      action: action
    }

    var b = this.buttons[name] = this.game.add.button(this.x, this.next_button_y, name, action, this.game)
    b.fixedToCamera = true
    b.cameraOffset.setTo(this.x, this.next_button_y)

    this.next_button_y += BUTTONS_HEIGHT
  }
}
