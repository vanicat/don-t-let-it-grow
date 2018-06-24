/* global Phaser RangeDisplay NumericDisplay ToolBox checkGroupOverlap */
const CAMERA_MOVE = 40

const HALL_COST = 400
const SHOP_COST = 400
const FARM_COST = 100
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
    this.tools.addButton('hall', this.addHall, 'a hall, for getting gold\nCost: ' + HALL_COST + ' gold or some magic')
    this.tools.addButton('farm', this.addFarm, 'a Farm, for getting food\ncost: ' + FARM_COST + ' gold or some magic')
    this.tools.addButton('magicshop', this.addMagicShop, 'a Magic Shop, for getting magic\ncost: ' + SHOP_COST + ' gold or some magic')
    this.tools.addButton('search', function () {}, 'Research')

    this.okMagic = false

    this.halls = this.add.group()
    this.farms = this.add.group()
    this.magikShops = this.add.group()
    this.placement = this.add.group()
    this.buildings = this.add.group()
    this.buildings.addChild(this.halls)
    this.buildings.addChild(this.farms)
    this.buildings.addChild(this.magikShops)
  },

  update: function () {
    this.gold.draw()
    this.magie.draw()
    this.taint.draw()
    this.plant.draw()

    // movement based on mouse
    this.moveCamera()

    // moving placement building
    if (this.placement.length > 0) {
      this.moveBuilding()
    }

    //
  },

  moveBuilding: function () {
    this.placement.setAll('x', this.input.activePointer.worldX)
    this.placement.setAll('y', this.input.activePointer.worldY)
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
  },

  addHall: function () {
    if (this.placement.length === 0 && this.paying(HALL_COST)) {
      var hall = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'hall')
      hall.onPlacement = function () {}

      this.buildingPlacement(hall, this.halls)
    }
  },

  addFarm: function () {
    if (this.placement.length === 0 && this.paying(FARM_COST)) {
      var farm = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'farm')
      farm.onPlacement = function () {}

      this.buildingPlacement(farm, this.farms)
    }
  },

  addMagicShop: function () {
    if (this.placement.length === 0 && this.paying(SHOP_COST)) {
      var farm = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'magicshop')
      farm.onPlacement = function () {}

      this.buildingPlacement(farm, this.magikShops)
    }
  },

  buildingPlacement: function (sprite, buildingGroup) {
    this.placement.add(sprite)
    sprite.anchor.setTo(0.5, 0.5)
    this.world.bringToTop(this.placement)

    var game = this

    sprite.inputEnabled = true

    sprite.events.onInputDown.add(
      function () {
        if (!checkGroupOverlap(game.buildings, sprite)) {
          buildingGroup.add(sprite)
          game.placement.remove(sprite)

          sprite.onPlacement()
        }
      })

    sprite.onCancel = function () {
      game.placement.remove(sprite)
    }
  },

  paying: function (amount) {
    if (this.gold.pay(amount)) {
      return true
    } else if (this.okMagic) {
      return this.magie.pay(amount)
    }
    this.message('you could pay by magic')
    return false
  },

  message: function (m) {
    console.log(m) // TODO:display it!
  }
}
