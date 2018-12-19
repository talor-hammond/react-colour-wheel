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
...somewhere in your `render()` method...
```javascript
<ColourWheel
  radius={200}
  lineWidth={50}
  onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
/>
```

## Customisation + `props`