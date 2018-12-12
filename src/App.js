import React, { Component } from 'react'

// react-colour-wheel:
import ColourWheel from './components/colourWheel/ColourWheel'

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
          <h1>react-colour-wheel</h1>
          <h2 style={{ color: selectedColour }}>{selectedColour}</h2>
          <h3>(pick a colour!)</h3>
        </div>
        <ColourWheel
          radius={200}
          padding={15}
          lineWidth={50}
          shades={10}
          dynamicCursor
          onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
          onRef={(ref) => this.colourWheel = ref}
        />
      </div>
    )
  }
}

export default App
