# react-colour-wheel
> A circular colour-picker React component; built with HTML5's canvas & context-api. Full customisation & control through `props`.

## Demo
![react-colour-wheel](https://media.giphy.com/media/1nR9Qmfnz5NUu0zAam/giphy.gif)

Check out this **[CodeSandbox](https://codesandbox.io/s/5wv077wv1k)** example.

## Quick-start guide
**Installation**
```javascript
npm install react-colour-wheel
```
```javascript
yarn add react-colour-wheel
```
...and wherever you need the component:
```javascript
import ColourWheel from 'react-colour-wheel'
```
Start by giving your `ColourWheel` a `radius`, `lineWidth`, and utilise the rgb-value sent through `onColourSelected`:
```jsx
<ColourWheel
  radius={200}
  lineWidth={50}
  onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
/>
```

*However*, a more typical implementation might look like:
```jsx
<ColourWheel
  radius={200}
  padding={10}
  lineWidth={50}
  onColourSelected={(rgb) => this.setState({ rgb })}
  onRef={ref => (this.colourWheel = ref)}
  spacers={{
    colour: '#FFFFFF',
    shadowColour: 'grey',
    shadowBlur: 5
  }}
  preset
  presetColour={this.state.rgb}
  animated
/>
```

## Customisation
The `ColourWheel` component has many options available for customisation through `props`:

### `radius`
Customise the radius of the `ColourWheel`, all the way to the outer-edge.  
* pixels, `px`
* `propTypes`: **number**, **isRequired**

`radius={200}`

---

### `lineWidth`
Customise the width of the outer- and inner-wheels.
* pixels, `px`
* `propTypes`: **number**, **isRequired**

`lineWidth={50}`

---

### `onColourSelected`
Method that returns an rgb-value; typical use case might be to `setState({ rgb })` on the parent-component.
* `propTypes`: **func**

`onColourSelected={(rgb) => ... )}`

---

### `padding`
Sets the space between the outer-wheel, inner-wheel, and the center-circle.
* pixels, `px`
* `propTypes`: **number**

`padding={10}`

---

### `spacers`
Allows you to customise the styling of the `padding` that was set:
* Need to specify an object with `colour`, `shadowColour`, and `shadowBlur` properties.
* `propTypes`: **object**

```javascript
  spacers={{
    colour: '#FFFFFF',
    shadowColour: 'grey',
    shadowBlur: 5
  }}
```

---

### `colours`
Allows you to define an **array of colours** that will populate the outer-wheel of the colour-wheel.
* *By default*, an array of 16 hex-strings is provided to help you get started.
* `colours` accepts hex-strings, rgb-strings & objects, names and other variations.
  *  This is based on [tinycolor2's](https://www.npmjs.com/package/tinycolor2) core `.toRgb()` method.
* `propTypes`: **array**
* `defaultProps`: A comprehensive array of 16 colours.

```javascript
  colours={[
    'blue',
    'rgb(200, 200, 200)',
    '#FFFFFF'
  ]}
```

---

### `shades`
Choose the number of shades that will be produced when any particular colour is chosen.
* The array of shades produced & rendered will scale evenly from 10% - 90% luminosity of the selected colour.
* `propTypes`: **number** 
* `defaultProps`: `16`

```javascript
  shades={12}
```

---

### `dynamicCursor`
Determines whether or not the cursor-style should update dynamically depending on where it is hovering.
* `propTypes`: **bool**
* `defaultProps`: `true`

---

### `presetColour`
If you want the colour-wheel to render w a colour already provided, use the `presetColour` prop:
* `propTypes`: **string**
* **Important**: You must set the `preset` prop to `true` when a `presetColour` is set.

---

### `animated`
Specifies whether the inner-wheel will animate when an outer-wheel colour is selected.
* `propTypes`: **bool**
* `defaultProps`: `true`

---

## How do I clear the colour-wheel programmatically?
1. Create a `ref` to the colour-wheel component in your parent component:
```jsx
<ColourWheel
 ...
 onRef={ref => (this.colourWheel = ref)}
 ...
/>
```
2. Call the colour-wheel's `.clear()` method from your parent component where you need it:
```jsx
  clearColourWheel = () => {
    this.colourWheel.clear(() => ...)
    // NOTE: Optional callback which you can use to do stuff after the wheel has been cleared.
  }
```

## Issues
- [ ] The ColourWheel won't animate if a `spacers` prop isn't provided.
 