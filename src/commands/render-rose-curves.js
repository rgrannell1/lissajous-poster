
const fs = require('fs')
const constants = require('../constants')

const renderPoster = require('../index')

const command = {
  name: 'render-rose-curves'
}

command.task = async (_, emitter) => {
  const canvas = renderPoster('rose')

  canvas.createPNGStream()
    .pipe(fs.createWriteStream(constants.paths.rose))
}


module.exports = command
