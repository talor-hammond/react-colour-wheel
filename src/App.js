import React, { Component } from 'react'

// Components:
import ColourWheel from './components/colourWheel/ColourWheel'

// Assets:
import colourStrings from './utils/hexStrings'

class App extends Component {
  state = {
    selectedColour: 'rgb(0, 0, 0)'
  }

  componentDidMount() {
    console.log(this.state.selectedColour)
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
          <h1 style={{ color: selectedColour }}>react-colour-wheel</h1>
          <h3>(pick a colour!)</h3>
        </div>
        <ColourWheel
          radius={150}
          lineWidth={30}
          colours={colourStrings}
          shades={12}
          onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
          // toString
        />
      </div>
    )
  }
}

export default App
