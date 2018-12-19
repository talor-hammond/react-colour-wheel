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

## What types of colours can I give the colour wheel?