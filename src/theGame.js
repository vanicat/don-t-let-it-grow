/* global firstAt Phaser RangeDisplay NumericDisplay ToolBox checkGroupOverlap snapToGrid changeHealth */
const CAMERA_MOVE = 40

const TEMPLE_CLEAN = 10
const GOLD_BY_HALL = 4
const MAGIC_BY_SHOP = 10
const HALL_COST = 400
const SHOP_COST = 200
const TEMPLE_COST = 200
const FARM_COST = 100
const STARTING_MAGIC = 399
const STARTING_GOLD = 399
const BLOW_POWER = 400

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
    this.tools.addButton('search', this.research, 'Research')
    this.tools.button('search').alpha = 0.5

    this.okMagic = true

    this.halls = this.add.group()
    this.farms = this.add.group()
    this.magikShops = this.add.group()
    this.temples = this.add.group()
    this.placement = this.add.group()

    this.plants = this.add.group()

    this.onGround = this.add.group()
    this.onGround.add(this.halls)
    this.onGround.add(this.farms)
    this.onGround.add(this.magikShops)
    this.onGround.add(this.plants)

    this.bombGroup = this.add.group()
    this.hadBomb = false
    this.again = false

    this.mainTooltip = this.add.graphics(300, 100)
    this.mainTooltip.visible = true
    // this.mainTooltip.beginFill(0xA0A0A0)
    // this.mainTooltip.drawRect(0, 0, 500, 32)
    // this.mainTooltip.endFill()

    this.mainTooltip.text = this.game.add.text(0, 0, '',
      { font: '32px Arial', fill: '#ffffff', align: 'center' })
    this.mainTooltip.text.setShadow(3, 3)
    this.mainTooltip.addChild(this.mainTooltip.text)

    this.toBeFound = null
  },

  update: function () {
    // movement based on mouse
    this.moveCamera()

    if (this.taint.value <= 0) {
      this.state.start('Gameover', true, false, 'YOU DID IT, The taint has be cleaned, you win')
    }

    if (this.taint.isMax()) {
      this.state.start('Gameover', true, false, 'GAME OVER, The taint overcome everything')
    }

    // moving placement building
    if (this.placement.length > 0) {
      this.moveBuilding()
    }

    // TODO: canceling production

    this.updateCounter()

    this.world.bringToTop(this.hid)

    this.bombGroup.callAll('myUpdate')
  },

  updateCounter: function () {
    var moreGold = this.halls.countLiving() * GOLD_BY_HALL
    var moreMagie = this.magikShops.countLiving() * MAGIC_BY_SHOP
    var lessTaint = this.temples.countLiving() * TEMPLE_CLEAN
    var morePlant = this.taint.value

    this.taint.value -= lessTaint * this.time.physicsElapsed

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

    this.taint = new RangeDisplay(2, 10000, this, this.hid)
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
      hall.health = 100

      this.buildingPlacement(hall, this.halls)
    }
  },

  addFarm: function () {
    if (this.placement.length === 0 && this.paying(FARM_COST)) {
      var farm = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'farm')
      farm.onPlacement = function () {}

      farm.health = 100

      this.buildingPlacement(farm, this.farms)
    }
  },

  addMagicShop: function () {
    if (this.placement.length === 0 && this.paying(SHOP_COST)) {
      var farm = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'magicshop')
      farm.onPlacement = function () {}

      farm.health = 100

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
    } else {
      return this.payByMagic(amount)
    }
  },

  payingByGold: function (amount) {
    if (this.gold.pay(amount)) {
      return true
    } else {
      this.message('not enough gold')
    }
  },

  payByMagic: function (amount) {
    var byMagic = this.magie.pay(amount)
    if (byMagic) {
      this.taint.add(amount) // TODO:when taint is max, do something.
    } else {
      this.message('not enough gold nor magic')
    }
    return byMagic
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
    var right = firstAt(this.plants, plant.x + 60, plant.y)
    var left = firstAt(this.plants, plant.x - 60, plant.y)
    var up = firstAt(this.plants, plant.x, plant.y - 60)
    var down = firstAt(this.plants, plant.x, plant.y + 60)

    var spread = false
    if (left === null) {
      this.newPlant({ x: plant.x - 64, y: plant.y })
      spread = true
    }
    if (right === null) {
      this.newPlant({ x: plant.x + 64, y: plant.y })
      spread = true
    }
    if (up === null) {
      this.newPlant({ x: plant.x, y: plant.y - 64 })
      spread = true
    }
    if (down === null) {
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
      if (this.hadBomb) {
        this.message('The plant came back')
      } else {
        this.message('A strange plant just sprout near the village')
      }
    }
    if (this.plants.length === 10) {
      if (this.hadBomb) {
        if (!this.again) {
          this.again = true
          this.message('Its comming back faster\n we need to investigate further')
          this.toBeFound = {
            message: 'What cause the taint ?',
            time: 10,
            cost: 600,
            onFound: this.foundCause
          }
          this.updateSearch()
        }
      } else {
        this.message('there is a lot of the strange plant, we shoud research it')
        this.toBeFound = {
          message: 'something make this plant grow,\nlet\'s look for it',
          time: 5,
          cost: 400,
          onFound: this.foundTaint
        }
        this.updateSearch()
      }
    }

    var spriteAtLocation = firstAt(this.onGround, position.x, position.y)
    if (spriteAtLocation) {
      // TODO: we are on something
      spriteAtLocation.damage(10)
      this.message('a building has taken damage')
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
    if (this.toBeFound) {
      this.tools.button('search').alpha = 1
    } else {
      this.tools.button('search').alpha = 0.5
    }
  },

  research: function () {
    if (this.toBeFound && this.paying(this.toBeFound.cost)) {
      this.time.events.add(
        Phaser.Timer.SECOND * this.toBeFound.time,
        this.toBeFound.onFound,
        this
      )
      this.toBeFound = null
      this.updateSearch()
    }
  },

  foundTaint: function () {
    this.message('there is a taint, or something, we will investigate more,\nmeanwill, let search how to blow the plant')
    this.taint.show()

    this.toBeFound = {
      message: 'Let blow plants',
      time: 4,
      cost: 200,
      onFound: this.foundBlow
    }
    this.updateSearch()
  },

  foundBlow: function () {
    this.message('nothing that can be fixed by some magic\nLet blow this')
    this.nblow = 0
    this.tools.addButton('boom', this.boom, 'Blowing stuff with magic')
    this.hadBomb = true
  },

  boom: function () {
    if (this.payByMagic(400)) {
      var bomb = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'bomb')

      bomb.anchor.setTo(0.5, 0.5)

      this.physics.enable(bomb, Phaser.Physics.ARCADE)
      var game = this
      bomb.myUpdate = function () {
        game.physics.arcade.moveToPointer(bomb, 60, game.input.activePointer, 500)
      }

      this.bombGroup.add(bomb)
      bomb.inputEnabled = true

      bomb.events.onInputDown.add(function () {
        var callback = function (child, dist) {
          return child.alive
        }
        snapToGrid(bomb, 64)
        var power = BLOW_POWER
        var plant = game.plants.getClosestTo(bomb, callback)
        while (power > 0 && plant) {
          power -= plant.health
          plant.damage(power)
          if (!plant.alive) {
            game.plants.remove(plant)
          }
          plant = game.plants.getClosestTo(bomb, callback)
        }
        bomb.kill()
      })
    }
  },

  foundCause: function () {
    this.message('it is the magic that cause this\nlet\'s pray the god for a solution')
    this.toBeFound = {
      message: 'something make this plant grow,\nlet\'s look for it',
      time: 10,
      cost: 700,
      onFound: this.foundTemple
    }
    this.updateSearch()
  },

  foundTemple: function () {
    this.message('Ask the god, they may have a solution')
    this.tools.addButton('temple', this.addTemple, 'cleaning the taint for gold')
  },

  addTemple: function () {
    if (this.placement.length === 0 && this.payingByGold(TEMPLE_COST)) {
      var temple = this.add.sprite(this.input.activePointer.x, this.input.activePointer.y, 'temple')
      temple.onPlacement = function () {}
      temple.health = 100
      this.buildingPlacement(temple, this.temples)
    }
  }
}
