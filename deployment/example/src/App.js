import React, { Component } from 'react'

import ColourWheel from 'react-colour-wheel'

const yourDefaultColour = 'rgb(255, 255, 255)'

class App extends Component {
  state = {
    selectedColour: yourDefaultColour
  }

  clearColourWheel = () => {
    this.colourWheel.clear(() => {
      // Do some other stuff in this callback if you want -- other than re-setting your selectedColour.
      this.setState({ selectedColour: yourDefaultColour })
    })
  }

  render () {
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
          <h1><span>react-colour-wheel</span></h1>
          <h2><span style={{ color: selectedColour }}>{selectedColour}</span></h2>
        </div>

        <ColourWheel
          radius={200}
          padding={10}
          lineWidth={50}
          onColourSelected={(rgb) => this.setState({ selectedColour: rgb })}
          onRef={ref => (this.colourWheel = ref)}
          spacers={{
            colour: '#FFFFFF',
            shadowColour: 'grey',
            shadowBlur: 5
          }}
          preset // You can set this bool depending on whether you have a pre-selected colour in state.
          presetColour={this.state.selectedColour}
          animated
        />

        <div
          onClick={this.clearColourWheel}
          style={{
            cursor: 'pointer',
            fontSize: 20,
            fontWeight: '500',
            color: '#FFFFFF',
            marginTop: 20
          }}>
          clear
        </div>
      </div>
    )
  }
}

export default App
