const BUTTONS_HEIGHT = 68
// const BUTTONS_WIDTH = 320

var ToolBox = function (state, x, y) {
  this.state = state
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

    var b = this.buttons[name] = this.state.add.button(this.x, this.next_button_y, name, action, this.state)
    b.fixedToCamera = true
    b.cameraOffset.setTo(this.x, this.next_button_y)

    this.next_button_y += BUTTONS_HEIGHT
  }
}
