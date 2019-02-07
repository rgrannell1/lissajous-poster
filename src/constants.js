
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
    x: 80,
    y: 80
  },
  border: {
    x: 200,
    y: 200
  }
}

module.exports = constants
