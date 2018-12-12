import React, { Component } from 'react'
// import PropTypes from 'prop-types'

// Utils:
import { colourToRgbObj } from '../../utils/utils'

class ColourWheel extends Component {
  constructor () {
    super()

    this.state = {
      rgb: null
    }

    // Initialised once the DOM has loaded.
    this.canvasEl = null
    this.ctx = null
    this.radius = null

    // Bindings:
  }

  // MARK - Life-cycle methods:
  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    this.drawOuterWheel()
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
        // onMouseMove={this.onCanvasHover}
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
      />
    )
  }
}

export default ColourWheel
