/* globals Phaser */

var checkOverlap = function (spriteA, spriteB) {
  var boundsA = spriteA.getBounds()
  var boundsB = spriteB.getBounds()

  var i = Phaser.Rectangle.intersects(boundsA, boundsB)
  return i
}

var checkGroupOverlap = function (group, sprite) {
  var l = group.filter(function (child, index, children) {
    if (child.name === 'group') {
      return checkGroupOverlap(child, sprite)
    }
    return checkOverlap(child, sprite)
  })
  return (l.list.length > 0)
}

/* export checkGroupOverlap */
