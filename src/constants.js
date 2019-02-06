
const path = require('path')

const constants = {
  width: 1000,
  height: 1000,
  dimension: 25,
  paths: {
    render: path.join(__dirname, '../dist/render.png')
  },
  colours: {
    background: 'black'
  }
}

module.exports = constants
