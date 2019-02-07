
const path = require('path')

const constants = {
  dimension: 15,
  paths: {
    lissajous: path.join(__dirname, '../dist/lissajous.png'),
    rose: path.join(__dirname, '../dist/rose.png')
  },
  colours: {
    background: 'black'
  },
  // or 80, 200
  // or 20, 50
  strokeWidth: 2,
  tileScale: {
    x: 80,
    y: 80
  },
  border: {
    x: 200,
    y: 200
  }
}

module.exports = constants
