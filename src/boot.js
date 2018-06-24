/* global Phaser */

var boot = function (game) {
}

var goFullscreen = null

boot.prototype = {
  preload: function () {
    this.load.image('loading', 'assets/loading.png')

    var scale = this.game.scale
    window.onresize = function () {
      scale.setGameSize(window.innerWidth * 0.95, window.innerHeight * 0.95)
      return false
    }
  },

  create: function () {
    console.log('booted')
    this.physics.startSystem(Phaser.Physics.ARCADE)

    this.game.state.start('Preload')

    var game = this.game
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    goFullscreen = function () {
      // TODO: this should change the size of the view
      game.scale.startFullScreen()
    }
  }
}

/* exported boot goFullscreen */
