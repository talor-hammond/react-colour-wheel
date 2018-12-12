import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Utils:
import { colourToRgbObj, calculateBounds, produceRgbShades, convertObjToString } from '../../utils/utils'
import hexStrings from '../../utils/hexStrings'

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
    this.outerWheelRadius = null // TODO: Define this in componentWillMount()
    this.innerWheelRadius = null

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

    return {
      fromCenter,
      onCanvas
    }
  }

  // MARK - Life-cycle methods:
  componentWillMount () {
    const { radius, lineWidth, padding } = this.props

    // Setting effective radii:
    this.outerWheelRadius = radius - lineWidth / 2 // Takes into account the lineWidth to stop the line from over-flowing the provided radius.
    this.innerWheelRadius = radius - lineWidth - (lineWidth / 2) - padding // Subtracts props.radius as well as props.padding to account.

    // Defining our bounds-objects, exposes a .inside(e) -> boolean method:
    this.outerWheelBounds = calculateBounds(radius - lineWidth, radius)
    this.innerWheelBounds = calculateBounds(this.innerWheelRadius - lineWidth / 2, this.innerWheelRadius + lineWidth / 2)
  }

  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    this.drawOuterWheel()
  }

  // MARK - mouse-events:
  onCanvasHover ({ clientX, clientY }) {
    const evt = this.getRelativeMousePos(clientX, clientY)
    console.log(evt.fromCenter)

    // Checking mouse location:
    if (this.outerWheelBounds.inside(evt.fromCenter)) {
      this.canvasEl.style.cursor = 'crosshair'
    } else if (this.innerWheelBounds.inside(evt.fromCenter) && this.state.innerWheelOpen) {
      this.canvasEl.style.cursor = 'crosshair'
    } else {
      this.canvasEl.style.cursor = 'auto'
    }
  }

  onCanvasClick ({ clientX, clientY }) {
    const evt = this.getRelativeMousePos(clientX, clientY)

    // Cases for click-events:
    if (this.outerWheelBounds.inside(evt.fromCenter)) {
      this.outerWheelClicked(evt.onCanvas)
    }
  }

  // MARK - Clicks:
  outerWheelClicked (evtPos) {
    const { shades, toRgbString } = this.props

    // returns an rgba array of the pixel-clicked.
    const rgbaArr = this.ctx.getImageData(evtPos.x, evtPos.y, 1, 1).data
    const [r, g, b] = rgbaArr

    const rgb = { r, g, b }

    const rgbShades = produceRgbShades(r, g, b, shades)

    // Whether the user wants rgb-strings or rgb objects returned.
    const rgbArg = toRgbString ? convertObjToString(rgb) : rgb

    this.props.onColourSelected(rgbArg)

    this.setState({
      rgb,
      rgbShades,
      innerWheelOpen: true,
      centerCircleOpen: false
    }, () => {
      this.drawInnerWheel()
    })
  }

  // MARK - Drawing:
  drawOuterWheel () {
    const { radius, colours, lineWidth } = this.props
    const height = radius * 2
    const width = radius * 2

    // Converting each colour into a relative rgb-object we can iterate through.
    const rgbArr = colours.map(colour => colourToRgbObj(colour))

    this.ctx.clearRect(0, 0, width, height)

    rgbArr.forEach((rgb, i) => {
      this.ctx.beginPath()

      // Creates strokes 1 / rgbArr.length of the circle circumference.
      const startAngle = ((2 * Math.PI) / rgbArr.length) * i
      const endAngle = ((2 * Math.PI) / rgbArr.length) * (i + 1)

      this.ctx.arc(width / 2, height / 2, this.outerWheelRadius, startAngle, endAngle)
      this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

      // Stroke-style changes based on the shade:
      this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      this.ctx.stroke()
      this.ctx.closePath()
    })
  }

  // TODO: Animate w requestAnimationFrame()
  drawInnerWheel () {
    const { rgbShades } = this.state
    const { radius, lineWidth } = this.props

    const height = radius * 2
    const width = radius * 2

    // Re-initialising canvas.
    this.ctx.clearRect(0, 0, width, height)

    this.drawOuterWheel()
    // this.drawWhiteRings()

    // Creating our shades circle:
    rgbShades.forEach((rgb, i) => {
      this.ctx.beginPath()
      // 'kicker' corrects the gap between strokes due to rounding of pi
      // i.e. the endAngle goes slightly longer than it needs to until the last rgbShade stroke is drawn.
      const kicker = i === rgbShades.length - 1 ? 2 : 1.99

      const startAngle = (((2 * Math.PI) / rgbShades.length) * i) + (1 / 2 * Math.PI)
      const endAngle = (((2 * Math.PI) / rgbShades.length) * (i + 1)) + (1 / kicker * Math.PI)

      this.ctx.arc(width / 2, height / 2, this.innerWheelRadius, startAngle, endAngle)
      this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

      // Stroke style changes based on the shade:
      this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      this.ctx.stroke()
      this.ctx.closePath()
    })
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
  radius: PropTypes.number,
  lineWidth: PropTypes.number,
  colours: PropTypes.array,
  shades: PropTypes.number,
  padding: PropTypes.number,
  dynamicCursor: PropTypes.bool
}

ColourWheel.defaultProps = {
  radius: 200,
  lineWidth: 50,
  toRgbString: true,
  colours: hexStrings,
  shades: 16,
  padding: 0,
  dynamicCursor: false
}

export default ColourWheel
