import React, { Component } from 'react'

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

  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')
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
