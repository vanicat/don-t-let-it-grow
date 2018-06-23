/* global Phaser RangeDisplay NumericDisplay ToolBox */
const CAMERA_MOVE = 40

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

    this.createCounter()

    // TODO: set position relatively to the window

    // for movement based on the mouse
    this.leftRectangle = new Phaser.Rectangle(0, 0, CAMERA_MOVE, this.game.camera.height)
    this.rightRectangle = new Phaser.Rectangle(this.game.camera.width - CAMERA_MOVE, 0, CAMERA_MOVE, this.game.camera.height)
    this.topRectangle = new Phaser.Rectangle(0, 0, this.game.camera.width, CAMERA_MOVE)
    this.bottomRectangle = new Phaser.Rectangle(0, this.game.camera.height - CAMERA_MOVE, this.game.camera.width, CAMERA_MOVE)

    this.tools = new ToolBox(this, 32, 128)
    this.tools.addButton('hall', function () {})
    this.tools.addButton('farm', function () {})
    this.tools.addButton('magicshop', function () {})
    this.tools.addButton('search', function () {})
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
  },

  createCounter: function () {
    // gold should be numeric, not range...

    this.gold = new NumericDisplay(100, 2000, this.game)
    this.gold.setText(20, 20, 'gold: ')
    this.gold.setRangePos(200, 10, 32 * 3, 20)
    this.magie = new RangeDisplay(0, 2000, this.game)
    this.magie.setText(240, 20, 'magie: ')
    this.magie.setRangePos(100, 10, 32 * 3, 20)
    this.taint = new RangeDisplay(0, 2000, this.game)
    this.taint.setText(430, 20, 'taint: ')
    this.taint.setRangePos(80, 10, 32 * 3, 20)
    this.taint.hide()
    this.plant = new RangeDisplay(0, 2000, this.game)
    this.plant.setText(600, 20, 'new plant: ')
    this.plant.setRangePos(150, 10, 32 * 3, 20)
    this.plant.hide()
  }
}
