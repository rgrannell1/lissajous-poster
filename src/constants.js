
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
  // or 20, 50
  tileScale: {
    x: 20,
    y: 20
  },
  border: {
    x: 50,
    y: 50
  }
}

module.exports = constants
