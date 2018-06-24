/* globals Phasetips */

const BUTTONS_HEIGHT = 68
// const BUTTONS_WIDTH = 320

var ToolBox = function (state, x, y, group) {
  this.state = state
  this.group = group

  this.buttonsSpecification = {}
  this.buttons = {}

  this.x = x
  this.y = y
  this.next_button_y = y
}

ToolBox.prototype = {
  addButton: function (name, action, tooltips) {
    this.buttonsSpecification[name] = {
      x: this.x,
      y: this.next_button_y,
      name: name,
      action: action
    }

    var b = this.buttons[name] = this.state.add.button(this.x, this.next_button_y, name, action, this.state)
    b.fixedToCamera = true
    b.cameraOffset.setTo(this.x, this.next_button_y)

    b.tooltips = new Phasetips(this.state.game, {
      targetObject: b,
      position: 'right',
      context: tooltips
    })

    this.group.add(b)

    this.next_button_y += BUTTONS_HEIGHT
  }
}
