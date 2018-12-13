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
          backgroundColor: '#394032',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
          <h1>react-colour-wheel</h1>
          <h2 style={{ color: selectedColour }}>{selectedColour}</h2>
        </div>
        <ColourWheel
          radius={200}
          padding={10}
          lineWidth={50}
          dynamicCursor
          onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
          onRef={(ref) => this.colourWheel = ref}
          // shadow
          // shadowDepth
          // preset={} // colour from parent's state here.
        />
        <div 
        // onClick={this.colourWheel.clearSelection}
        style={{ 
          cursor: 'pointer',
          fontSize: 20,
          fontWeight: '500',
          color: '#FFFFFF',
          marginTop: 20,
          transition: '1s ease text-decoration'
        }}>
          clear
        </div>
      </div>
    )
  }
}

export default App
