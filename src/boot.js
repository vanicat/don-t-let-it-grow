/* exported boot */

var boot = function (game) {
}

boot.prototype = {
  preload: function () {
    this.load.image('loading', 'assets/loading.jpg')
  },

  create: function () {
    console.log('booted')
    this.game.state.start('Preload')
  }
}
