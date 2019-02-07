
const renderPoster = require('../index')

const command = {
  name: 'render',
  dependencies: [
    'render-lissajous-curves',
    'render-rose-curves'
  ]
}

module.exports = command
