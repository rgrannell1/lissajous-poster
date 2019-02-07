
const path = require('path')
const Canvas = require('canvas')
const tinygradient = require('tinygradient')

const vector = require('./vector')
const constants = require('./constants')

const TAU = 2 * Math.PI

const curves = {}

curves.lissajous = ({x, y}) => {
  return time => {
    return vector.new(
      Math.cos(x * time + TAU),
      Math.sin(y * time))
  }
}

curves.rose = k => {
  return time => {
    return vector.new(
      Math.cos(k * time) * Math.cos(time),
      Math.cos(k * time) * Math.sin(time)
    )
  }
}

const curveFamilies = {}

curveFamilies.lissajous = ({dim}) => {
  const curvePoints = []
  for (let ith = 0; ith < dim; ith++) {
    for (let jth = 0; jth < dim; jth++) {

      let x = ith
      let y = jth

      let coords = vector.new(ith, jth)

      curvePoints.push({
        ith,
        jth,
        points: pointsAlongCurve(curves.lissajous(coords))
      })
    }
  }

  return curvePoints
}

curveFamilies.rose = ({dim}) => {
  const curvePoints = []
  for (let ith = 0; ith < dim; ith++) {
    for (let jth = 1; jth < dim; jth++) {
      let ratio = ith / jth

      curvePoints.push({
        ith,
        jth,
        points: pointsAlongCurve(curves.rose(ith / jth))
      })
    }
  }

  return curvePoints
}

const pointsAlongCurve = (curve) => {
  const points = []

  for (let part = 0; part <= TAU; part += 0.01) {
    points.push(curve(part))
  }

  return points
}

const render = {}

render.line = (ctx, from, to) => {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.lineWidth = 2
  ctx.stroke()
}

const translatePoints = curveData => {
  const {tileScale} = constants

  const scale = vector.new(tileScale.x, tileScale.y)
  const offset = vector.new(
    constants.border.x + (constants.border.x * curveData.ith),
    constants.border.y + (constants.border.y * curveData.jth)
  )

  const points = curveData.points.map(point => {
    return vector.add(vector.by(point, scale), offset)
  })

  return Object.assign({}, curveData, {points})
}

const tileColour = (ith, jth) => {
  const gradient = tinygradient('red', 'blue', 'green')
  const scale = gradient.hsv(constants.dimension)

  return `#${scale[Math.max(ith, jth)].toHex()}`
}

const prepareCurveFamilies = curveFamilies => {
  const max = vector.new(0, 0)

  const families = curveFamilies.map(curveData => {
    const translated = translatePoints(curveData).points
    const colour = tileColour(curveData.ith, curveData.jth)

    const localMax = {}

    localMax.x = translated.reduce((max, current) => Math.max(max, current.x), 0)
    localMax.y = translated.reduce((max, current) => Math.max(max, current.y), 0)

    max.x = Math.ceil(Math.max(localMax.x, max.x))
    max.y = Math.ceil(Math.max(localMax.y, max.y))

    return Object.assign({
      colour
    }, curveData, {points: translated})
  })

  return {families, max}
}

const renderCurves = curveFamilies => {
  const {max, families} = prepareCurveFamilies(curveFamilies)

  const width = max.x + constants.border.x
  const height = max.y + constants.border.y

  const canvas = Canvas.createCanvas(width, height, 'png')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = constants.colours.background
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 0.8

  families.forEach(curveFamily => {
    const {points, colour} = curveFamily
    ctx.strokeStyle = colour

    for (let ith = 0; ith < points.length - 1; ++ith) {
      let from = points[ith]
      let to = points[ith + 1]

      render.line(ctx, from, to)
    }

  })

  return canvas
}

const renderPoster = family => {
  if (!curveFamilies.hasOwnProperty(family)) {
    console.log(`"${family}" not within ${Object.keys(curveFamilies)}`)
  }

  return renderCurves(curveFamilies[family]({dim: constants.dimension}))
}

module.exports = renderPoster
