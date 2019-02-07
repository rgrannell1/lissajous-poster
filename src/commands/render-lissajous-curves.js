
const fs = require('fs')
const constants = require('../constants')

const renderPoster = require('../index')

const command = {
  name: 'render-lissajous-curves'
}

command.task = async (_, emitter) => {
  const canvas = renderPoster('lissajous')

  canvas.createPNGStream()
    .pipe(fs.createWriteStream(constants.paths.lissajous))
}

module.exports = command
