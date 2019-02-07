
'use strict'

const vector = {}

vector.new = (x, y) => {
  return {x, y}
}

vector.add = (v0, v1) => {
  return {
    x: v0.x + v1.x,
    y: v0.y + v1.y
  }
}

vector.by = (v0, v1) => {
  return {
    x: v0.x * v1.x,
    y: v0.y * v1.y
  }
}

module.exports = vector
