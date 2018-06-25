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

function snapToGrid (o, size) {
  o.x = Math.ceil(o.x / size) * size
  o.y = Math.ceil(o.y / size) * size
}

function changeHealth (object, amount) {
  object.health += amount
  object.frame = Math.min(100, object.health) / 10
}

function firstAt(group, x, y) {
  var childAt = group.filter(function (child, index, children) {
    return checkOverlap(child, x, y)
  })
  var res = childAt.first
  while (res && res.name === 'group') {
    res = firstAt(res, x, y)
    if (res === null) res = childAt.next
  }
  return res
}

/* export checkGroupOverlap */
