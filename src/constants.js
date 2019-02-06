
const path = require('path')

const constants = {
  dimension: 15,
  paths: {
    render: path.join(__dirname, '../dist/render.png')
  },
  colours: {
    background: 'black'
  },
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
