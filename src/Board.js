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

class BoardState {
  constructor(board=null) {
    if (board == null) {
      this.board = this.initBoard();
    } else {
      this.board = JSON.parse(JSON.stringify(board));
    }
  }

  copy() {
    return new BoardState(this.board);
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

  getScore(color) {
    let score = 0;
    for (let x=0; x < this.board.length; x++) {
      for (let y=0; y< this.board.length; y++) {
        if (this.board[x][y] === color) {
          score += 1;
        }
      }
    }
    return score;
  }

  getMoves(color) {
    const moves = [];
    for (let x=0; x < this.board.length; x++) {
      for (let y=0; y< this.board.length; y++) {
        if (this.isValidMove(color, x, y)) {
          moves.push([x, y]);
        }
      }
    }
    return moves;
  }

  isValidMove(color, x, y) {
    const currentSpace = this.board[x][y];
    if (currentSpace) {
      return false;
    }

    const otherColor = color === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
    // Check each of the eight directions
    for (const [dx, dy] of DIRECTIONS) {
      let nextX = x+dx;
      let nextY = y+dy
      let nextSquare = this.getSquare(nextX, nextY);
      if (nextSquare !== otherColor) {
        continue;
      }
      while(nextSquare === otherColor) {
        nextX += dx;
        nextY += dy;
        nextSquare = this.getSquare(nextX, nextY);
      }
      if (nextSquare === color) {
        return true;
      }
    }
    return false;
  }

  getSquare(x, y) {
    const row = this.board[x];
    if (!row) {
      return null;
    }
    return row[y];
  }

  makeMove(color, x, y) {
    if (!this.isValidMove(color, x, y)) {
      return false;
    }
    const currentColor = color;
    const otherColor = currentColor === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
    // Changing state
    this.board[x][y] = color;
    for (const [dx, dy] of DIRECTIONS) {
      let nextX = x+dx;
      let nextY = y+dy
      let nextSquare = this.getSquare(nextX, nextY);
      if (nextSquare !== otherColor) {
        continue;
      }
      while(nextSquare === otherColor) {
        nextX += dx;
        nextY += dy;
        nextSquare = this.getSquare(nextX, nextY);
      }
      if (nextSquare === currentColor) {
        // loop back and make changes
        while (nextX !== x || nextY !== y) {
          this.board[nextX][nextY] = currentColor;
          nextX -= dx;
          nextY -= dy;
        }
      }
    }
    return true;
  }

}

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new BoardState(),
      currentColor: PLAYER.BLACK,
    }
  }

  makeMove(x,y) {
    const boardCopy = this.state.board.copy();
    const success = boardCopy.makeMove(this.state.currentColor, x, y);
    const otherColor = this.state.currentColor === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
    if (success) {
      this.setState({
        board: boardCopy,
        currentColor: otherColor,
      })
    }
  }

  render() {
    return (
      <div className="game">
        <ScoreBoard
          board={this.state.board}
          currentColor={this.state.currentColor}
        />
        <Board
          board={this.state.board}
          currentColor={this.state.currentColor}
          onClick={(x,y) => this.makeMove(x,y)}
        />
      </div>
    )
  }
}

class ScoreBoard extends React.Component {
  render() {
    const whiteScore = this.props.board.getScore(PLAYER.WHITE);
    const blackScore = this.props.board.getScore(PLAYER.BLACK);
    const classCurrentPlayer = 'currentPlayer ' + this.props.currentColor;
    return (
      <div className="scoreboard">
        <div className="white">
          ● {whiteScore}
        </div>
        <div className={classCurrentPlayer}>
          ●
        </div>
        <div className="black">
          ● {blackScore}
        </div>
      </div>
    )
  }
}


class Board extends React.Component {
  render() {
    const rows = this.props.board.board.map((row, x) => {
      const cells = row.map((cell, y) => {
        return (
          <Square
            value={cell}
            validMove={this.props.board.isValidMove(this.props.currentColor, x, y)}
            onClick={() => {this.props.onClick(x,y)}}
            key={x*8+y}
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
    let value = this.props.value ? '●' : '';

    let className = 'square';
    if (this.props.validMove) {
      className += ' valid';
    }
    if (this.props.value === PLAYER.BLACK) {
      className += ' black';
    } else if (this.props.value === PLAYER.WHITE) {
      className += ' white';
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