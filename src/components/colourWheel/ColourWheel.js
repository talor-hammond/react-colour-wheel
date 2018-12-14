// NOTES:
// -- Array-destructuring assignment won't work w vanilla ie11; needs babel-polyfill lol

import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Utils:
import {
  colourToRgbObj,
  getEffectiveRadius,
  calculateBounds,
  produceRgbShades,
  convertObjToString
} from '../../utils/utils'
import hexStrings from '../../utils/hexStrings'

// Global-vars:
const fullCircle = 2 * Math.PI
const quarterCircle = fullCircle / 4

class ColourWheel extends Component {
  constructor () {
    super()

    this.state = {
      rgb: null,
      rgbShades: [],
      innerWheelOpen: false,
      centerCircleOpen: false
    }

    // Initialised just before the DOM has loaded; after constructor().
    this.outerWheelBounds = null
    this.innerWheelBounds = null
    this.centerCircleBounds = null

    this.outerWheelRadius = null
    this.innerWheelRadius = null
    this.centerCircleRadius = null
    this.firstSpacerRadius = null
    this.secondSpacerRadius = null

    // Initialised once the DOM has loaded.
    this.canvasEl = null
    this.ctx = null

    // Bindings:
    this.onCanvasHover = this.onCanvasHover.bind(this)
    this.onCanvasClick = this.onCanvasClick.bind(this)
  }

  // MARK - Common:
  getRelativeMousePos (clientX, clientY) {
    const { radius } = this.props

    const canvasPos = this.canvasEl.getBoundingClientRect()
    const h = radius * 2
    const w = radius * 2

    // evtPos relative to our canvas.
    const onCanvas = {
      x: clientX - canvasPos.left,
      y: clientY - canvasPos.top
    }

    // e is our mouse-position relative to the center of the canvasEl; using pythag
    const fromCenter = Math.sqrt((onCanvas.x - (w / 2)) * (onCanvas.x - (w / 2)) + (onCanvas.y - (h / 2)) * (onCanvas.y - (h / 2)))

    // This returns an object in which we have both mouse-pos relative to the canvas, as well as the true-middle.
    return {
      fromCenter,
      onCanvas
    }
  }

  initCanvas () {
    const { radius } = this.props

    const width = radius * 2
    const height = radius * 2

    this.ctx.clearRect(0, 0, width, height)

    this.drawOuterWheel()
    this.drawSpacers()
  }

  // MARK - Life-cycle methods:
  componentWillMount () {
    const { radius, lineWidth, padding } = this.props

    // Setting effective radii:
    this.outerWheelRadius = radius
    this.innerWheelRadius = this.outerWheelRadius - lineWidth - padding
    this.centerCircleRadius = this.innerWheelRadius - lineWidth - padding
    this.firstSpacerRadius = this.outerWheelRadius - lineWidth // NOTE: effectiveRadius will take into account padding as lineWidth.
    this.secondSpacerRadius = this.innerWheelRadius - lineWidth

    // Defining our bounds-objects, exposes a .inside(e) -> boolean method:
    this.outerWheelBounds = calculateBounds(radius - lineWidth, radius)
    this.innerWheelBounds = calculateBounds(this.innerWheelRadius - lineWidth, this.innerWheelRadius)
    this.centerCircleBounds = calculateBounds(0, this.centerCircleRadius)
    this.firstSpacerBounds = calculateBounds(this.firstSpacerRadius - padding, this.firstSpacerRadius)
    this.secondSpacerBounds = calculateBounds(this.secondSpacerRadius - padding, this.secondSpacerRadius)
  }

  componentDidMount () {
    // Giving this context to our parent component.
    this.props.onRef(this)

    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    if (this.props.preset) {
      const rgb = colourToRgbObj(this.props.presetColour)
      const { r, g, b } = rgb
      const rgbShades = produceRgbShades(r, g, b, this.props.shades)

      this.setState({ rgb, rgbShades }, () => {
        this.drawOuterWheel()
        this.drawInnerWheel()
        this.drawCenterCircle()
        this.drawSpacers()
      })
    } else {
      this.drawOuterWheel()
      this.drawSpacers()
    }
  }

  componentWillUnmount () {
    this.props.onRef(undefined)
  }

  // MARK - mouse-events:
  onCanvasHover ({ clientX, clientY }) {
    const evt = this.getRelativeMousePos(clientX, clientY)

    // Cases for mouse-location:
    if (this.outerWheelBounds.inside(evt.fromCenter)) {
      this.canvasEl.style.cursor = 'crosshair'
    } else if (this.innerWheelBounds.inside(evt.fromCenter) && this.state.innerWheelOpen) {
      this.canvasEl.style.cursor = 'crosshair'
    } else if (this.centerCircleBounds.inside(evt.fromCenter) && this.state.centerCircleOpen) { // TODO: Have it clear on click?
      this.canvasEl.style.cursor = 'pointer'
    } else {
      this.canvasEl.style.cursor = 'auto'
    }
  }

  onCanvasClick ({ clientX, clientY }) {
    const evt = this.getRelativeMousePos(clientX, clientY)

    // Cases for click-events:
    if (this.outerWheelBounds.inside(evt.fromCenter)) {
      this.outerWheelClicked(evt.onCanvas)
    } else if (this.innerWheelBounds.inside(evt.fromCenter) && this.state.innerWheelOpen) {
      this.innerWheelClicked(evt.onCanvas)
    }
  }

  // MARK - Clicks & action methods:
  outerWheelClicked (evtPos) {
    const { shades } = this.props

    // returns an rgba array of the pixel-clicked.
    const rgbaArr = this.ctx.getImageData(evtPos.x, evtPos.y, 1, 1).data
    const [r, g, b] = rgbaArr

    const rgb = { r, g, b }

    const rgbShades = produceRgbShades(r, g, b, shades)

    // Whether the user wants rgb-strings or rgb objects returned.
    const rgbArg = convertObjToString(rgb) // TODO: Let user set different return values in props; e.g. rbg obj, string, etc.

    this.props.onColourSelected(rgbArg)

    this.setState({
      rgb,
      rgbShades,
      innerWheelOpen: true,
      centerCircleOpen: true
    }, () => {
      this.drawInnerWheel()
      this.drawCenterCircle()
    })
  }

  innerWheelClicked (evtPos) {
    const rgbaArr = this.ctx.getImageData(evtPos.x, evtPos.y, 1, 1).data
    const [r, g, b] = rgbaArr

    const rgb = { r, g, b }

    const rgbArg = convertObjToString(rgb)

    this.props.onColourSelected(rgbArg)

    this.setState({
      rgb,
      centerCircleOpen: true
    }, () => {
      this.drawCenterCircle()
    })
  }

  clear (callback = false) {
    this.setState({
      rgb: null,
      rgbShades: [],
      innerWheelOpen: false,
      centerCircleOpen: false
    }, () => {
      // Reset state & re-draw.
      this.initCanvas()
      if (callback) callback()
    })
  }

  // MARK - Drawing:
  drawOuterWheel () {
    // TODO: Draw outline; separate method.
    const { radius, colours, lineWidth } = this.props
    const height = radius * 2
    const width = radius * 2

    // This value ensures that the stroke accounts for the lineWidth provided to produce an accurately represented radius.
    const effectiveRadius = getEffectiveRadius(radius, lineWidth)

    // Converting each colour into a relative rgb-object we can iterate through.
    const rgbArr = colours.map(colour => colourToRgbObj(colour))

    rgbArr.forEach((rgb, i) => {
      this.ctx.beginPath()

      // Creates strokes 1 / rgbArr.length of the circle circumference.
      const startAngle = (fullCircle / rgbArr.length) * i
      const endAngle = (fullCircle / rgbArr.length) * (i + 1)

      this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
      this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

      // Stroke-style changes based on the shade:
      this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      this.ctx.stroke()
      this.ctx.closePath()
    })
  }

  drawSpacers () {
    if (this.props.spacers) {
      this.drawSpacer(this.firstSpacerRadius)
      this.drawSpacer(this.secondSpacerRadius)
    }
  }

  drawSpacer (spacerRadius) {
    const { radius, padding, spacers: { colour, shadowColour, shadowBlur } } = this.props

    const height = radius * 2
    const width = radius * 2

    const effectiveRadius = getEffectiveRadius(spacerRadius, padding)

    this.ctx.beginPath()

    this.ctx.arc(width / 2, height / 2, effectiveRadius, 0, fullCircle)
    this.ctx.lineWidth = padding // This is the width of the innerWheel.

    // Stroke-style changes based on the shade:
    this.ctx.shadowColor = shadowColour
    this.ctx.shadowBlur = shadowBlur
    this.ctx.strokeStyle = colour
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.shadowColor = 'transparent'
  }

  drawInnerWheel () {
    // TODO: Animate
    const { rgbShades } = this.state
    const { radius, lineWidth } = this.props

    const height = radius * 2
    const width = radius * 2

    const effectiveRadius = getEffectiveRadius(this.innerWheelRadius, lineWidth)

    // Re-initialising canvas.
    this.ctx.clearRect(0, 0, width, height)

    this.drawOuterWheel()
    this.drawSpacers()

    // Creating our shades circle:
    rgbShades.forEach((rgb, i) => {
      this.ctx.beginPath()
      // 'kicker' corrects the gap between strokes due to rounding of pi
      // i.e. the endAngle goes slightly longer than it needs to until the last rgbShade stroke is drawn.
      const kicker = i === rgbShades.length - 1 ? 2 : 1.99

      const startAngle = ((fullCircle / rgbShades.length) * i) + quarterCircle
      const endAngle = ((fullCircle / rgbShades.length) * (i + 1)) + (1 / kicker) * Math.PI

      this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
      this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

      // Stroke style changes based on the shade:
      this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      this.ctx.stroke()
      this.ctx.closePath()
    })
  }

  drawCenterCircle () {
    const { rgb } = this.state
    const { radius } = this.props

    const height = radius * 2
    const width = radius * 2
    this.ctx.lineWidth = 0

    this.ctx.beginPath()
    this.ctx.arc(width / 2, height / 2, this.centerCircleRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    this.ctx.fill()
    this.ctx.lineWidth = 0.1
    this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    this.ctx.stroke()
    this.ctx.closePath()
  }

  render () {
    const { radius, dynamicCursor } = this.props

    return (
      dynamicCursor ? (
        <canvas
          id='colour-picker'
          onClick={this.onCanvasClick}
          onMouseMove={this.onCanvasHover}
          width={`${radius * 2}px`}
          height={`${radius * 2}px`}
        />
      ) : (
        <canvas
          id='colour-picker'
          onClick={this.onCanvasClick}
          width={`${radius * 2}px`}
          height={`${radius * 2}px`}
        />
      )
    )
  }
}

ColourWheel.propTypes = {
  radius: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
  colours: PropTypes.array,
  shades: PropTypes.number,
  padding: PropTypes.number,
  dynamicCursor: PropTypes.bool,
  spacers: PropTypes.object,
  onColourSelected: PropTypes.func,
  preset: PropTypes.bool
  // presetColour: PropTypes.string
}

ColourWheel.defaultProps = {
  colours: hexStrings,
  shades: 16,
  padding: 0,
  dynamicCursor: true,
  preset: false
}

export default ColourWheel
