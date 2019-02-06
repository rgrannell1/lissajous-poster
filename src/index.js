
const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const tinygradient = require('tinygradient')

const vector = require('./vector')
const constants = require('./constants')

const TAU = 2 * Math.PI

const lissajousCurve = ({x, y}) => {
  return time => {
    return {
      x: Math.cos(x * time + TAU),
      y: Math.sin(y * time)
    }
  }
}

const curveFamily = ({dim}) => {
  const curves = []
  for (let ith = 0; ith < dim; ith++) {
    for (let jth = 0; jth < dim; jth++) {

      let x = ith
      let y = jth

      curves.push({
        ith,
        jth,
        points: curveOverTime(lissajousCurve({x, y}))
      })
    }
  }
  return curves
}

const curveOverTime = (curve) => {
  const points = []

  for (let time = 0; time <= TAU; time += 0.01) {
    points.push(curve(time))
  }

  return points
}

const render = {}

render.line = (ctx, from, to) => {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

const translatePoints = curveData => {
  const scale = vector.new(20, 20)
  const offset = vector.new(
    50 + (50 * curveData.ith),
    50 + (50 * curveData.jth)
  )

  const points = curveData.points.map(point => {
    return vector.add(vector.by(point, scale), offset)
  })

  return Object.assign({}, curveData, {points})
}

const retrieveColour = (ith, jth) => {
  const gradient = tinygradient('red', 'blue', 'green')
  const scale = gradient.hsv(constants.dimension)

  const x = Math.max(ith, jth)

  return `#${scale[x].toHex()}`
}

const renderPoster = curveFamilies => {
  const {width, height} = constants

  const canvas = Canvas.createCanvas(width, height, 'png')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = constants.colours.background
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 0.8

  curveFamilies.forEach(curveData => {
    const trans = translatePoints(curveData).points
    ctx.strokeStyle = retrieveColour(curveData.ith, curveData.jth)

    for (let ith = 0; ith < trans.length - 1; ++ith) {
      let from = trans[ith]
      let to = trans[ith + 1]

      render.line(ctx, from, to)
    }
  })

  canvas.createPNGStream()
    .pipe(fs.createWriteStream(constants.paths.render))
}

renderPoster(curveFamily({dim: constants.dimension}))
