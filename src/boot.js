/* global Phaser */
/* exported boot goFullscreen */

var boot = function (game) {
}

var goFullscreen = null

boot.prototype = {
  preload: function () {
    this.load.image('loading', 'assets/loading.jpg')
  },

  create: function () {
    console.log('booted')
    this.game.state.start('Preload')

    var game = this.game
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    goFullscreen = function () {
      game.scale.startFullScreen()
    }
  }
}
