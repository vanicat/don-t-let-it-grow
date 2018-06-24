/* global Phaser RangeDisplay NumericDisplay ToolBox checkGroupOverlap snapToGrid changeHealth */
const CAMERA_MOVE = 40

const GOLD_BY_HALL = 4
const MAGIC_BY_SHOP = 10
const HALL_COST = 400
const SHOP_COST = 200
const FARM_COST = 100
const STARTING_MAGIC = 400
const STARTING_GOLD = 400

var theGame = function (game) {
}

theGame.prototype = {
  preload: function () {
  },

  create: function () {
    console.log('starting game')
    this.add.tileSprite(0, 0, 1920, 1920, 'background')
    this.add.tileSprite(0, 0, 1920, 1920, 'grass')
    this.world.setBounds(0, 0, 1800, 768)
    this.cursors = this.input.keyboard.createCursorKeys()

    this.hid = this.add.group()

    this.createCounter()

    // TODO: set position relatively to the window

    // for movement based on the mouse
    this.leftRectangle = new Phaser.Rectangle(0, 0, CAMERA_MOVE, this.camera.height)
    this.rightRectangle = new Phaser.Rectangle(this.camera.width - CAMERA_MOVE, 0, CAMERA_MOVE, this.camera.height)
    this.topRectangle = new Phaser.Rectangle(0, 0, this.camera.width, CAMERA_MOVE)
    this.bottomRectangle = new Phaser.Rectangle(0, this.camera.height - CAMERA_MOVE, this.camera.width, CAMERA_MOVE)

    this.tools = new ToolBox(this, 32, 128, this.hid)
    this.tools.addButton('hall', this.addHall, 'a hall, for getting gold\nCost: ' + HALL_COST + ' gold or some magic')
    this.tools.addButton('farm', this.addFarm, 'a Farm, for getting food\ncost: ' + FARM_COST + ' gold or some magic')
    this.tools.addButton('magicshop', this.addMagicShop, 'a Magic Shop, for getting magic\ncost: ' + SHOP_COST + ' gold or some magic')
    this.tools.addButton('search', function () {}, 'Research')
    this.tools.button('search').alpha = 0.5

    this.okMagic = true

    this.halls = this.add.group()
    this.farms = this.add.group()
    this.magikShops = this.add.group()
    this.placement = this.add.group()

    this.plants = this.add.group()

    this.onGround = this.add.group()
    this.onGround.add(this.halls)
    this.onGround.add(this.farms)
    this.onGround.add(this.magikShops)
    this.onGround.add(this.plants)

    this.mainTooltip = this.add.graphics(300, 100)
    this.mainTooltip.visible = true
    // this.mainTooltip.beginFill(0xA0A0A0)
    // this.mainTooltip.drawRect(0, 0, 500, 32)
    // this.mainTooltip.endFill()

    this.mainTooltip.text = this.game.add.text(0, 0, '',
      { font: '32px Arial', fill: '#ffffff', align: 'center' })
    this.mainTooltip.text.setShadow(3, 3)
    this.mainTooltip.addChild(this.mainTooltip.text)

    this.research = {}
  },

  update: function () {
    // movement based on mouse
    this.moveCamera()

    // moving placement building
    if (this.placement.length > 0) {
      this.moveBuilding()
    }

    // TODO: canceling production

    this.updateCounter()

    this.world.bringToTop(this.hid)
  },

  updateCounter: function () {
    var moreGold = this.halls.length * GOLD_BY_HALL
    var moreMagie = this.magikShops.length * MAGIC_BY_SHOP
    var morePlant = this.taint.value

    this.gold.addNoLimit(moreGold * this.time.physicsElapsed)
    this.magie.add(moreMagie * this.time.physicsElapsed)
    // TODO:create plante when this maxout
    if (this.plant.add(morePlant * this.time.physicsElapsed)) {
      this.plantGrow()
    }

    this.gold.draw()
    this.magie.draw()
    this.taint.draw()
    this.plant.draw()
  },

  moveBuilding: function () {
    var position = {
      x: this.input.activePointer.worldX - 32,
      y: this.input.activePointer.worldY - 32
    }
    snapToGrid(position, 64)
    this.placement.setAll('x', position.x)
    this.placement.setAll('y', position.y)
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

    this.gold = new NumericDisplay(STARTING_GOLD, 2000, this, this.hid)
    this.gold.setText(20, 20, 'gold: ')
    this.gold.setRangePos(200, 10, 32 * 3, 20)

    this.magie = new RangeDisplay(STARTING_MAGIC, 5000, this, this.hid)
    this.magie.setText(240, 20, 'magie: ')
    this.magie.setRangePos(100, 10, 32 * 3, 20)

    this.taint = new RangeDisplay(0, 2000, this, this.hid)
    this.taint.setText(430, 20, 'taint: ')
    this.taint.setRangePos(80, 10, 32 * 3, 20)
    this.taint.hide()

    this.plant = new RangeDisplay(0, 2000, this, this.hid)
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
        if (!checkGroupOverlap(game.onGround, sprite.x, sprite.y)) {
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
      var byMagic = this.magie.pay(amount)
      if (byMagic) {
        this.taint.add(amount) // TODO:when taint is max, do something.
      } else {
        this.message('not enough gold nor magic')
      }

      return byMagic
    } else {
      this.message('you could pay by magic')
    }
    return false
  },

  message: function (m) {
    this.mainTooltip.text.text = m
    this.mainTooltip.visible = true

    this.time.events.add(Phaser.Timer.SECOND * 2, function () { this.mainTooltip.visible = false }, this)
    console.log(m) // TODO:display it!
  },

  plantGrow: function () {
    if (Math.random() * (this.plants.length + 1) < 1) {
      var position = {
        x: this.world.randomX,
        y: this.world.randomY
      }

      snapToGrid(position, 64)

      this.newPlant(position)
    } else {
      var plant = this.plants.getRandom()

      this.spreadPlant(plant)
    }
    this.plant.value = 0
  },

  spreadPlant: function (plant) {
    var right = this.plants.getClosestTo({ x: plant.x + 60, y: plant.y })
    var left = this.plants.getClosestTo({ x: plant.x - 60, y: plant.y })
    var up = this.plants.getClosestTo({ x: plant.x, y: plant.y - 60 })
    var down = this.plants.getClosestTo({ x: plant.x, y: plant.y + 60 })
    var spread = false
    if (left === plant) {
      this.newPlant({ x: plant.x - 64, y: plant.y })
      spread = true
    }
    if (right === plant) {
      this.newPlant({ x: plant.x + 64, y: plant.y })
      spread = true
    }
    if (up === plant) {
      this.newPlant({ x: plant.x, y: plant.y - 64 })
      spread = true
    }
    if (down === plant) {
      this.newPlant({ x: plant.x, y: plant.y + 64 })
      spread = true
    }
    if (spread) return

    [left, right, up, down].forEach(function (snd) {
      if (snd.health < plant.health) {
        this.spreadPlant(snd)
        spread = true
      }
    }, this)

    if (spread) return

    changeHealth(plant, 10)
  },

  newPlant: function (position) {
    snapToGrid(position, 64)

    if (this.plants.length === 0) {
      this.message('A strange plant just sprout near the village')
    }
    if (this.plants.length === 10 ) {
      this.message('there is a lot of the strange plant, we shoud research it')
      this.research['taint'] = { 
        message: 'something make this plant grow,\nlet\'s look for it',
        time: 2,
        cost: 400,
        onFound: this.foundTaint
      }
      this.updateSearch()
    }

    if (checkGroupOverlap(this.onGround, position.x, position.y)) {
      // TODO: we are on something
      var neigbour = this.plants.getClosestTo(position)
      if (neigbour && neigbour.x === position.x && neigbour.y === position.y) {
        console.log('this is a plant')
      }
    } else {
      var grass = this.add.sprite(position.x, position.y, 'badlands')
      grass.health = 10
      changeHealth(grass, 0)
      grass.anchor.setTo(0.5, 0.5)
      this.plants.add(grass)
      this.world.bringToTop(grass)
    }
  },

  updateSearch: function () {
    if (this.research.length === 0) {
      this.tools.button('search').alpha = .5
    } else {
      this.tools.button('search').alpha = 1
    }
  }
}
