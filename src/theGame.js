/* global Phaser Range */
var CAMERA_MOVE = 40
var theGame = function (game) {
}

theGame.prototype = {
  preload: function () {
  },

  create: function () {
    console.log('starting game')
    this.game.add.tileSprite(0, 0, 1920, 1920, 'background')
    this.game.world.setBounds(0, 0, 1920, 1920)
    this.cursors = this.game.input.keyboard.createCursorKeys()

    // gold should be numeric, not range...
    this.gold = new Range(100, 2000, this.game)
    this.gold.setText(20, 20, 'gold: ')
    this.gold.setRangePos(70, 10, 32 * 3, 20)

    this.magie = new Range(0, 2000, this.game)
    this.magie.setText(7 * 32, 20, 'magie: ')
    this.magie.setRangePos(95, 10, 32 * 3, 20)

    this.taint = new Range(0, 2000, this.game)
    this.taint.setText(430, 20, 'taint: ')
    this.taint.setRangePos(80, 10, 32 * 3, 20)
    this.taint.hide()

    this.plant = new Range(0, 2000, this.game)
    this.plant.setText(600, 20, 'new plant: ')
    this.plant.setRangePos(150, 10, 32 * 3, 20)
    this.plant.hide()

    // TODO: set position relatively to the window

    // for movement based on the mouse

    this.leftRectangle = new Phaser.Rectangle(0, 0, CAMERA_MOVE, this.game.camera.height)

    this.rightRectangle = new Phaser.Rectangle(this.game.camera.width - CAMERA_MOVE, 0, CAMERA_MOVE, this.game.camera.height)

    this.topRectangle = new Phaser.Rectangle(0, 0, this.game.camera.width, CAMERA_MOVE)

    this.bottomRectangle = new Phaser.Rectangle(0, this.game.camera.height - CAMERA_MOVE, this.game.camera.width, CAMERA_MOVE)
  },

  update: function () {
    this.gold.draw()
    this.magie.draw()
    this.taint.draw()
    this.plant.draw()

    // movement based on mouse

    this.moveCamera()
  },

  moveCamera: function () {
    if (this.cursors.left.isDown) {
      this.game.camera.x -= 4
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 4
    }

    if (this.cursors.up.isDown) {
      this.game.camera.y -= 4
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 4
    }

    if (this.game.input.activePointer.active) {
      var x = this.game.input.activePointer.x
      var y = this.game.input.activePointer.y
      if (this.leftRectangle.contains(x, y)) {
        this.game.camera.x -= 4
      } else if (this.rightRectangle.contains(x, y)) {
        this.game.camera.x += 4
      }
      if (this.bottomRectangle.contains(x, y)) {
        this.game.camera.y += 4
      } else if (this.topRectangle.contains(x, y)) {
        this.game.camera.y -= 4
      }
    }
  }
}
