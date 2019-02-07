
const renderPoster = require('../index')

const command = {
  name: 'render-lissajous-curves'
}

command.task = async (_, emitter) => {
  renderPoster()
}


module.exports = command
