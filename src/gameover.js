/* global ToolBox */

var gameover = function (game) {
}

gameover.prototype = {
  preload: function () {
  },

  create: function () {
    console.log('gameover')
    this.game.add.text(this.world.centerX, this.world.centerY, 'GAME OVER',
      { font: '90px Arial', fill: '#ffffff', align: 'center' })
    this.ui = this.add.group()
    this.toolbox = new ToolBox(this, this.world.centerX, 30, this.ui)
    this.toolbox.addButton('start again', this.game.state.start('theGame'), 'Start Again')
  }
}

/* exported boot goFullscreen */
