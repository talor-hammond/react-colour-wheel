# How does it work under the hood?

## Where did I start?

The first problem to be solved is drawing circles programmatically -- we can do this via HTML5's `<canvas>` API. Luckily, I had some previous experience w/ `<canvas>` and knew that circles / lines could be drawn with the context-object made available a `<canvas>` element. We can **initialise our canvas-context** by creating a new context-object with the `.getContext()` method. This will expose the methods we need to be able to draw / and fill circles programmatically on our canvas.

```javascript
  componentDidMount () {
    // Initialising our canvas & context objs.
    this.canvasEl = document.getElementById('colour-picker')
    this.ctx = this.canvasEl.getContext('2d')

    ...
  }
    // I chose to assign our canvas' context-object to this.ctx, that way I can call the methods cleanly from anywhere inside our ColourWheel component.
```

Once `this.ctx` is defined, we can **use the `.arc(w, h, rad, startAngle, endAngle)` method to draw our outer-wheel**. The outer-wheel is drawn based on the array of `colours` fed in through `props`. The `startAngle` and `endAngle` should scale automatically to draw one complete circle; depending on the length of the array.

```javascript
  rgbArr.forEach((rgb, i) => {
    ...
    // Creates strokes 1 / rgbArr.length of the circle circumference.
    const startAngle = (fullCircle / rgbArr.length) * i
    const endAngle = (fullCircle / rgbArr.length) * (i + 1)

    this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
    this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

    // Stroke-style changes based on the shade:
    this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    ...
  })
```

## How did you deal with track hover / click events on the canvas?

There were two immediate challenges when it came to tracking mouse-events on the canvas:
1. How could I track events relative to the centre (or *bulls-eye*) of the circle?
2. How could I track X and Y from the top-left of the canvas?

Firstly, our `<canvas />` element has two events been tracked:
```javascript
   <canvas
    ...
    onClick={this.onCanvasClick}
    onMouseMove={this.onCanvasHover}
    ...
   />
```

The `onCanvasHover()` method defines an `evt` variable defined by `getRelativeMousePos()` -- which ends up doing most of the dirty-work.

```javascript
onCanvasHover ({ clientX, clientY }) {
  const evt = this.getRelativeMousePos(clientX, clientY)
  ...
```

```javascript
getRelativeMousePos (clientX, clientY) {
 ...
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
```

`onCanvasHover()` then checks to see what bounds the event was inside, and updates the cursor accordingly:
```javascript
// Cases for mouse-location:
if (this.outerWheelBounds.inside(evt.fromCenter)) {
this.canvasEl.style.cursor = 'crosshair'
} else if (this.innerWheelBounds.inside(evt.fromCenter) && this.state.innerWheelOpen) {
this.canvasEl.style.cursor = 'crosshair'
}
...
```

The `.inside` method is made available by the `calculateBounds(min, max)` utility-function:
```js
export function calculateBounds (min, max) { // i.e. min & max pixels away from the center of the canvas.
  return {
    inside: (cursorPosFromCenter) => { // our relative mouse-position is passed through here to check.
      return cursorPosFromCenter >= min && cursorPosFromCenter <= max
    }
  }
}
```

### Tying this all together now...

Before the DOM loads, I calculate the radius of all the circles & spacers on the `ColourWheel` based on the `radius`, `lineWidth`, and `padding` props passed in:

Then, we can calculate the bounds of the circles and spacers, giving those variables a `inside()` function which can be used to check whether the event occured within the boundaries of *x*.

**See `componentWillMount()`** for reference.

## ...and how are the shades & inner-circle rendered?

**This was one of the more-interesting challenges for me**. The main difficulty was being able to produce an array of shades of the selected colour. I spent quite some time researching / experimenting until I realised the key to this was to **convert the colour to an hsl** (hue, saturation, *lightness*), and scale the lightness to produce lighter / darker shades.

```javascript
export function produceRgbShades (r, g, b, amount) {
  let shades = []

  const hsl = tinycolor(`rgb(${r}, ${g}, ${b})`).toHsl()

  for (let i = 9; i > 1; i -= 8 / amount) { // Decrements from 9 - 1; i being what luminosity (hsl.l) is multiplied by.
    hsl.l = 0.1 * i
    shades.push(tinycolor(hsl).toRgb())
  }

  return shades
}
```

The `amount` of iterations is the length of the `shades` specified through props. This function will start by producing an 90% lightness (0.9) all the way down to 10% (0.1). That way we will never get true black or white.

## Giving the user the ability to clear the `ColourWheel`
The `clear` method is exposed when the user makes a reference to the `ColourWheel` in their parent-component. The reference is made through `this.props.onRef(this)` when the component mounts.

They can then fire the method after some interaction in their parent, and optionally fire a callback to handle anything else they need to do following `.clear()`

```javascript
clear (callback = false) {
 this.setState({
   rgb: null,
   innerWheelOpen: false,
   centerCircleOpen: false
 }, () => {
   // Reset state & re-draw.
   this.initCanvas()
   if (callback) callback()
 })
}
```

## Other challenges

Turning it into an `npm` package.

Used `rollup` to bundle the `ColourWheel.js` code into `build/ColourWheel.js`. Used `npm link` to create a system-wide module so I could test how the package worked locally before publishing.