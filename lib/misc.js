/* globals Phaser */

var checkOverlap = function (spriteA, x, y) {
  var boundsA = spriteA.getBounds()

  return Phaser.Rectangle.contains(boundsA, x, y)
}

var checkGroupOverlap = function (group, x, y) {
  var l = group.filter(function (child, index, children) {
    if (child.name === 'group') {
      return checkGroupOverlap(child, x, y)
    }
    return checkOverlap(child, x, y)
  })
  return (l.list.length > 0)
}

/* export checkGroupOverlap */
