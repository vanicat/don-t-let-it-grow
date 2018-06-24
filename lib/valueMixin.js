var valueMixin = function (toChange) {
  toChange.add = function (amount) {
    this.value += amount
    if (this.value > this.max) {
      this.value = this.max
      return true
    }
    return false
  }

  toChange.addNoLimit = function (amount) {
    this.value += amount
  }

  toChange.isMax = function () {
    return (this.value = this.max)
  }

  toChange.pay = function (amount) {
    if (amount <= this.value) {
      this.value -= amount
      return true
    } else {
      return false
    }
  }
}

/* exported valueMixin */
