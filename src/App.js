import React, { Component } from 'react'

// Components:
import ColourWheel from './components/colourWheel/ColourWheel'

// Assets:
import colourStrings from './utils/hexStrings'

class App extends Component {
  state = {
    selectedColour: 'rgb(0, 0, 0)'
  }

  render() {
    const { selectedColour } = this.state

    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          backgroundColor: '#EEF5DB',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1>react-colour-picker</h1>
          <h2 style={{ color: selectedColour }}>{selectedColour}</h2>
          <h3>(pick a colour!)</h3>
        </div>
        <ColourWheel
          padding={10}
          dynamicCursor
          onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
        />
      </div>
    )
  }
}

export default App
