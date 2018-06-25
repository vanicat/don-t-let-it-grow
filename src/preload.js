var preload = function (game) {
}

preload.prototype = {
  preload: function () {
    var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loading')
    loadingBar.anchor.setTo(0.5, 0.5)
    this.load.setPreloadSprite(loadingBar)
    // should preload stuff
    this.load.image('background', 'assets/debug-grid-1920x1920.png')
    this.load.image('startagain', 'assets/start again.png')
    this.load.image('hall', 'assets/hall.png')
    this.load.image('farm', 'assets/farm.png')
    this.load.image('magicshop', 'assets/magicshop.png')
    this.load.image('search', 'assets/search.png')
    this.load.image('grass', 'assets/grass.png')
    this.load.image('boom', 'assets/boom.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('temple', 'assets/temple.png')
    this.load.spritesheet('badlands', 'assets/badlands-sheet.png', 64, 64)
  },

  create: function () {
    console.log('preload done')
    this.state.start('TheGame')
  }
}
