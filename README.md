# react-colour-wheel
> A circular colour-picker React component; built with HTML5's canvas & context-api. Full customisation & control through `props`.

## Demo
Check out this [CodeSandbox](https://codesandbox.io/s/5wv077wv1k) example.

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
Start by giving your `ColourWheel` a `radius`, `lineWidth`, and utilise the rgb-value sent through `onColourSelected`
```jsx
<ColourWheel
  radius={200} // These are pixel-values.
  lineWidth={50} // Ditto.
  onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
/>
```

## Customisation
The `ColourWheel` component has many options available for customisation through `props`:

### `radius`
Customise the radius of the ColourWheel, all the way to the outer-edge.  
* pixels, `px`
* `propTypes`: **number**, **isRequired**

> `radius={200}`

### `lineWidth`
Customise the width of the outer- and inner-wheels.
* pixels, `px`
* `propTypes`: **number**, **isRequired**

> `lineWidth={50}`

### `onColourSelected`
Method that returns an rgb-value; typical use case might be to `setState({ rgb })` on the parent-component.
* `propTypes`: **func**

> `onColourSelected={(rgb) => ... )}`

### `padding`
Sets the space between the outer-wheel, inner-wheel, and the center-circle.
* pixels, `px`
* `propTypes`: **number**

> `padding={10}`

## How do I clear the colour-wheel programmatically?