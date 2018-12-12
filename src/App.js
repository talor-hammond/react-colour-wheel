import React, { Component } from 'react'

// Components:
import ColourWheel from './components/colourWheel/ColourWheel'

class App extends Component {
  render () {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ColourWheel
          radius={100}
        />
      </div>
    )
  }
}

export default App
