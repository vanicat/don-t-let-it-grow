/* global ToolBox */

var gameover = function (game) {
}

gameover.prototype = {
  init: function (title) {
    this.title = title
  },

  preload: function () {
  },

  create: function () {
    console.log('gameover')
    this.game.add.text(this.world.centerX, this.world.centerY, this.title,
      { font: '90px Arial', fill: '#ffffff', align: 'center' })
    this.ui = this.add.group()
    this.toolbox = new ToolBox(this, 32, 128, this.ui)
    this.toolbox.addButton('startagain', function () { this.game.state.start('TheGame') }, 'Start Again')
  }
}

/* exported boot goFullscreen */
