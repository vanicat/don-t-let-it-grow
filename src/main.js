/* global Phaser */

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
    }
  },
  scene: {
    preload: preload,
    create: create
  }
}

/* exported game */
var game = new Phaser.Game(config)

function preload () {
}

function create () {
}
