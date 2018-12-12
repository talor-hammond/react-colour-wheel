import React, { Component } from 'react'
// import PropTypes from 'prop-types'

// Utils:
import { colourToRgbObj, calculateBounds } from '../../utils/utils'

class ColourWheel extends Component {
  constructor () {
    super()

    this.state = {
      rgb: null
    }

    // Initialised just before the DOM has loaded; after constructor().
    this.outerWheelBounds = null

    // Initialised once the DOM has loaded.
    this.canvasEl = null
    this.ctx = null

    // Bindings:
    this.onCanvasHover = this.onCanvasHover.bind(this)
  }

  // MARK - Life-cycle methods:
  componentWillMount () {
    const { radius, lineWidth } = this.props

    // Defining our bounds-objects, exposes a .inside(e) -> boolean method:
    this.outerWheelBounds = calculateBounds(radius - lineWidth, radius)
  }

  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    this.drawOuterWheel()
  }

  // MARK - mouse-events:
  onCanvasHover ({ clientX, clientY }) {
    const { radius } = this.props

    const canvasPos = this.canvasEl.getBoundingClientRect()
    const h = radius * 2
    const w = radius * 2

    // evtPos relative to our canvas.
    const evtPos = {
      x: clientX - canvasPos.left,
      y: clientY - canvasPos.top
    }

    // e is our mouse-position relative to the center of the canvasEl; using pythag
    const e = Math.sqrt((evtPos.x - (w / 2)) * (evtPos.x - (w / 2)) + (evtPos.y - (h / 2)) * (evtPos.y - (h / 2)))

    // Checking mouse location:
    if (this.outerWheelBounds.inside(e)) {
      this.canvasEl.style.cursor = 'crosshair'
    } else {
      this.canvasEl.style.cursor = 'auto'
    }
  }

  // MARK - Drawing:
  drawOuterWheel () {
    const { radius, colours, lineWidth } = this.props
    const height = radius * 2
    const width = radius * 2

    // Takes into account the lineWidth to stop the line from over-flowing the provided radius.
    const correctedRadius = radius - lineWidth / 2

    // Converting each colour into a relative rgb-object we can iterate through.
    const rgbArr = colours.map(colour => colourToRgbObj(colour))

    this.ctx.clearRect(0, 0, width, height)

    rgbArr.forEach((rgb, i) => {
      this.ctx.beginPath()

      // Creates strokes 1 / rgbArr.length of the circle circumference.
      const startAngle = ((2 * Math.PI) / rgbArr.length) * i
      const endAngle = ((2 * Math.PI) / rgbArr.length) * (i + 1)

      this.ctx.arc(width / 2, height / 2, correctedRadius, startAngle, endAngle)
      this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

      // Stroke-style changes based on the shade:
      this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      this.ctx.stroke()
      this.ctx.closePath()
    })
  }

  render () {
    const { radius } = this.props

    return (
      <canvas
        id='colour-picker'
        // onClick={this.canvasClick}
        onMouseMove={this.onCanvasHover}
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
      />
    )
  }
}

export default ColourWheel
