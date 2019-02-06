
const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')

const vector = require('./vector')
const constants = require('./constants')

const TAU = 2 * Math.PI

const lissajousCurve = ({x, y}) => {
  return time => {
    return {
      x: Math.cos(x * time + TAU),
      y: Math.cos(y * time)
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

const renderPoster = curveFamilies => {
  const {width, height} = constants

  const canvas = Canvas.createCanvas(width, height, 'png')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  curveFamilies.forEach(curveData => {
    const trans = curveData.points.map(point => {
      return vector.by(point, vector.new(width, height))
    })

    ctx.globalAlpha = 0.01;
    ctx.strokeStyle = 'white'

    for (let ith = 0; ith < trans.length - 1; ++ith) {
      let from = trans[ith]
      let to = trans[ith + 1]

      render.line(ctx, from, to)
    }
  })

  canvas.createPNGStream()
    .pipe(fs.createWriteStream(path.join(__dirname, 'clock.png')))
}

const stepped = curveFamily({dim: 50})

renderPoster(stepped)