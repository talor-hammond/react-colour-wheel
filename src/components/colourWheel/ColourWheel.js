import React, { Component } from 'react'

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

  // Life-cycle methods:
  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    this.drawOuterWheel()
  }

  // Drawing:
  drawOuterWheel () {
    const { radius, colours } = this.props
    // const radius = this.props.radius - lineWidth / 2

    const rgbArr = colours.map(colour => colourToRgbObj(colour))

    console.log(rgbArr)

    this.ctx.clearRect(0, 0, radius * 2, radius * 2)

    rgbArr.forEach((rgb, i) => {
      this.ctx.beginPath()

      // Creates strokes 1 / rgbArr.length of the circle circumference.
      const startAngle = ((2 * Math.PI) / rgbArr.length) * i
      const endAngle = ((2 * Math.PI) / rgbArr.length) * (i + 1)

      this.ctx.arc(radius, radius, radius, startAngle, endAngle)
      this.ctx.lineWidth = 60 // This is the width of the innerWheel.

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
