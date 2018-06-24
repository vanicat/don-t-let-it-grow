/* global Phaser RangeDisplay NumericDisplay ToolBox */
const CAMERA_MOVE = 40

var theGame = function (game) {
}

theGame.prototype = {
  preload: function () {
  },

  create: function () {
    console.log('starting game')
    this.add.tileSprite(0, 0, 1920, 1920, 'background')
    this.world.setBounds(0, 0, 1920, 1920)
    this.cursors = this.input.keyboard.createCursorKeys()

    this.createCounter()

    // TODO: set position relatively to the window

    // for movement based on the mouse
    this.leftRectangle = new Phaser.Rectangle(0, 0, CAMERA_MOVE, this.camera.height)
    this.rightRectangle = new Phaser.Rectangle(this.camera.width - CAMERA_MOVE, 0, CAMERA_MOVE, this.camera.height)
    this.topRectangle = new Phaser.Rectangle(0, 0, this.camera.width, CAMERA_MOVE)
    this.bottomRectangle = new Phaser.Rectangle(0, this.camera.height - CAMERA_MOVE, this.camera.width, CAMERA_MOVE)

    this.tools = new ToolBox(this, 32, 128)
    this.tools.addButton('hall', function () {})
    this.tools.addButton('farm', function () {})
    this.tools.addButton('magicshop', function () {})
    this.tools.addButton('search', function () {})

    this.halls = this.add.group()
    this.farms = this.add.group()
    this.magikShops = this.add.group()
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
      this.camera.x -= 4
    } else if (this.cursors.right.isDown) {
      this.camera.x += 4
    }

    if (this.cursors.up.isDown) {
      this.camera.y -= 4
    } else if (this.cursors.down.isDown) {
      this.camera.y += 4
    }

    if (this.input.activePointer.active) {
      var x = this.input.activePointer.x
      var y = this.input.activePointer.y
      if (this.leftRectangle.contains(x, y)) {
        this.camera.x -= 4
      } else if (this.rightRectangle.contains(x, y)) {
        this.camera.x += 4
      }
      if (this.bottomRectangle.contains(x, y)) {
        this.camera.y += 4
      } else if (this.topRectangle.contains(x, y)) {
        this.camera.y -= 4
      }
    }
  },

  createCounter: function () {
    // gold should be numeric, not range...

    this.gold = new NumericDisplay(100, 2000, this)
    this.gold.setText(20, 20, 'gold: ')
    this.gold.setRangePos(200, 10, 32 * 3, 20)
    this.magie = new RangeDisplay(0, 2000, this)
    this.magie.setText(240, 20, 'magie: ')
    this.magie.setRangePos(100, 10, 32 * 3, 20)
    this.taint = new RangeDisplay(0, 2000, this)
    this.taint.setText(430, 20, 'taint: ')
    this.taint.setRangePos(80, 10, 32 * 3, 20)
    this.taint.hide()
    this.plant = new RangeDisplay(0, 2000, this)
    this.plant.setText(600, 20, 'new plant: ')
    this.plant.setRangePos(150, 10, 32 * 3, 20)
    this.plant.hide()
  }
}
