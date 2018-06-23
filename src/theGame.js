/* global Phaser Range */

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
  
    this.plant = new Range(0, 2000, this.game)
    this.plant.setText(600, 20, 'new plant: ')
    this.plant.setRangePos(150, 10, 32 * 3, 20)
  

    // TODO: set position relatively to the window
  },

  update: function () {
    this.gold.draw()
    this.magie.draw()
    this.taint.draw()
    this.plant.draw()

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
  }
  /* ,

  render: function () {
  } */
}
