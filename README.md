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

## How do I clear the colour-wheel programmatically?