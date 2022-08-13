import React from 'react';

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'whitePlayerType': 'cpu',
      'blackPlayerType': 'human',
    }
  }

  startGame() {
    this.props.startGame(this.state);
  }

  setColor(color, value) {
    if (color === 'white') {
      this.setState({
        whitePlayerType: value
      })
    } else if (color === 'black') {
      this.setState({
        blackPlayerType: value
      })
    }
  }

  render() {
    return (
      <div className='menu'>
        <h1>Reversi</h1>
        <div>
          <span>Black</span>
          <label>
            <input
              type="radio"
              name="blackPlayerType"
              value="human"
              checked={this.state.blackPlayerType === 'human'}
              onChange={() => this.setColor('black', 'human')}
            />
            Human
          </label>
          <label>
            <input
              type="radio"
              name="blackPlayerType"
              value="cpu"
              checked={this.state.blackPlayerType === 'cpu'}
              onChange={() => this.setColor('black', 'cpu')}
            />
            CPU
          </label>
        </div>
        <div>
          <span>White</span>
          <label>
            <input
              type="radio"
              name="whitePlayerType"
              value="human"
              checked={this.state.whitePlayerType === 'human'}
              onChange={() => this.setColor('white', 'human')}
            />
            Human
          </label>
          <label>
            <input
              type="radio"
              name="whitePlayerType"
              value="cpu"
              checked={this.state.whitePlayerType === 'cpu'}
              onChange={() => this.setColor('white', 'cpu')}
            />
            CPU
          </label>
        </div>

      <button name="startGame" onClick={() => this.startGame()}>
        Start Game
      </button>
      </div>
    )
  }
}