
const renderPoster = require('../index')

const command = {
  name: 'render-rose-curves'
}

command.task = async (_, emitter) => {
  renderPoster()
}


module.exports = command
