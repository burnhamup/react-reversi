import React from 'react';
import './board.css';

const PLAYER = {
  BLACK: 'black',
  WHITE: 'white',
}

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.initBoard(),
    }
  }

  initBoard() {
    const board = new Array(8);
    for (let i =0; i< board.length; i++) {
      board[i] = new Array(8).fill(null);
    }
    board[3][3] = PLAYER.WHITE;
    board[3][4] = PLAYER.BLACK;
    board[4][3] = PLAYER.BLACK;
    board[4][4] = PLAYER.WHITE
    return board;
  }

  onCellClick(x, y) {
    console.log('Clicked', x, y);
  }

  render() {
    const rows = this.state.board.map((row, x) => {
      const cells = row.map((cell, y) => {
        return (
          <Square
            value={cell}
            onClick={() => this.onCellClick(x,y)}
          />
        )
      })
      return (
        <div className="row">
          {cells}
        </div>
      )
    })
    return (
      <div className="board">
        {rows}
      </div>
    )
  }

}

class Square extends React.Component {
  render() {
    // TODO render an actual disc here
    let value = null;
    if (this.props.value === PLAYER.BLACK) {
      value = 'X';
    } else if (this.props.value === PLAYER.WHITE) {
      value = 'O';
    }
    return (
      <div
        className='square'
        onClick={this.props.onClick}
      >
        {value}
      </div>
    )
  }
}