/* global Phaser */

var theGame = function (game) {
}

theGame.prototype = {
  preload: function () {
  },

  create: function () {
    this.magie_usage = 0
    this.magie_available = 0
    this.plant = 0

    this.game.add.tileSprite(0, 0, 1920, 1920, 'background')
    this.game.world.setBounds(0, 0, 1920, 1920)
    this.cursors = this.game.input.keyboard.createCursorKeys()
  },

  update: function () {
    this.plant += this.magie_usage + 1

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
}
