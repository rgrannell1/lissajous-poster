
import fs from 'fs'
import path from 'path'
import Canvas from 'canvas'
import tinygradient from 'tinygradient'

import vector from './vector'
import constants from './constants'

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
  const max = {x: 0, y: 0}

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

const renderPoster = curveFamilies => {
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

  canvas.createPNGStream()
    .pipe(fs.createWriteStream(constants.paths.render))
}

renderPoster(curveFamily({dim: constants.dimension}))
