import React from 'react';
import './board.css';

const PLAYER = {
  BLACK: 'black',
  WHITE: 'white',
}

const DIRECTIONS = [
  [1, 1],
  [1, 0],
  [0, 1],
  [-1, -1],
  [-1, 0],
  [0, -1],
  [-1, 1],
  [1, -1],
]

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.initBoard(),
      currentColor: PLAYER.BLACK,
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

  getValidMoves(board, currentColor) {
    const moves = [];
    for (let x=0; x < board.length; x++) {
      for (let y=0; y< board.length; y++) {
        if (this.getIsValidMove(board, currentColor, x, y)) {
          moves.push([x, y]);
        }
      }
    }

  }

  getIsValidMove(board, currentColor, x, y) {
    const currentSpace = board[x][y];
    if (currentSpace) {
      return false;
    }

    const otherColor = currentColor === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
    // Check each of the eight directions
    for (const [dx, dy] of DIRECTIONS) {
      let nextX = x+dx;
      let nextY = y+dy
      let nextSquare = this.getSquare(board, nextX, nextY);
      if (nextSquare !== otherColor) {
        continue;
      }
      while(nextSquare === otherColor) {
        nextX += dx;
        nextY += dy;
        nextSquare = this.getSquare(board, nextX, nextY);
      }
      if (nextSquare === currentColor) {
        return true;
      }
    }
    return false;
  }

  getSquare(board, x, y) {
    const row = board[x];
    if (!row) {
      return null;
    }
    return row[y];

  }

  makeMove(x, y) {
    if (!this.getIsValidMove(this.state.board, this.state.currentColor, x, y)) {
      return false;
    }
    const currentColor = this.state.currentColor;
    const otherColor = currentColor === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
    // Changing state
    const boardCopy = JSON.parse(JSON.stringify(this.state.board));
    boardCopy[x][y] = this.state.currentColor;
    for (const [dx, dy] of DIRECTIONS) {
      let nextX = x+dx;
      let nextY = y+dy
      let nextSquare = this.getSquare(boardCopy, nextX, nextY);
      if (nextSquare !== otherColor) {
        continue;
      }
      while(nextSquare === otherColor) {
        nextX += dx;
        nextY += dy;
        nextSquare = this.getSquare(boardCopy, nextX, nextY);
      }
      if (nextSquare === currentColor) {
        // loop back and make changes
        while (nextX !== x || nextY !== y) {
          boardCopy[nextX][nextY] = currentColor;
          nextX -= dx;
          nextY -= dy;
        }
      } else {
        continue;
      }
    }
    this.setState({
      board: boardCopy,
      currentColor: otherColor,
    })

  }

  onCellClick(x, y) {
    this.makeMove(x,y);
    console.log('Clicked', x, y);
  }

  render() {
    const rows = this.state.board.map((row, x) => {
      const cells = row.map((cell, y) => {
        return (
          <Square
            value={cell}
            validMove={this.getIsValidMove(this.state.board, this.state.currentColor, x, y)}
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
    let className = 'square';
    if (this.props.validMove) {
      className += ' valid';
    }
    return (
      <div
        className={className}
        onClick={this.props.onClick}
      >
        {value}
      </div>
    )
  }
}