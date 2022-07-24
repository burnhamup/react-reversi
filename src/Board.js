import React from 'react';
import './board.css';

const PLAYER = {
  BLACK: 'black',
  WHITE: 'white',
}

const GAME_STATE = {
  PLAYER_TURN: 'player_turn',
  ANIMATING: 'animating',
}

const ANIMATION_SPEED = 300;

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

  setSquare(color, x, y) {
    this.board[x][y] = color;
  }

  makeMove(color, x, y) {
    const swaps = [];
    if (!this.isValidMove(color, x, y)) {
      return swaps;
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
        nextX -= dx;
        nextY -= dy;
        while (nextX !== x || nextY !== y) {
          this.board[nextX][nextY] = currentColor;
          swaps.unshift([nextX, nextY]);
          nextX -= dx;
          nextY -= dy;
        }
      }
    }
    swaps.unshift([x,y]);
    return swaps;
  }

}

export class Game extends React.Component {
  constructor(props) {
    super(props);
    const board = new BoardState();
    this.state = {
      board: new BoardState(),
      visualBoard: board.copy(),
      visualColor: PLAYER.BLACK,
      currentColor: PLAYER.BLACK,
      currentState: GAME_STATE.PLAYER_TURN,
    }
  }

  makeMove(x,y) {
    if (this.state.currentState !== GAME_STATE.PLAYER_TURN) {
      return;
    }
    const boardCopy = this.state.board.copy();
    const swaps = boardCopy.makeMove(this.state.currentColor, x, y);
    if (swaps.length) {
      let otherColor = this.state.currentColor === PLAYER.WHITE ? PLAYER.BLACK : PLAYER.WHITE;
      if (!boardCopy.getMoves(otherColor).length) {
        // Skipping a turn if the other player doesn't have moves
        // If neither player has moves, the game is over... and I should formally detect it.
        otherColor = this.state.currentColor;
      }
      this.swaps = swaps;
      this.setState({
        board: boardCopy,
        currentColor: otherColor,
        currentState: GAME_STATE.ANIMATING,
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentState === GAME_STATE.ANIMATING && prevState.currentState === GAME_STATE.PLAYER_TURN) {
      this.animation_tick();
    }
  }

  animation_tick() {
    if (this.state.currentState !== GAME_STATE.ANIMATING) {
      return;
    }
    if (this.swaps.length) {
      const move = this.swaps.shift();
      const boardCopy = this.state.visualBoard.copy()
      boardCopy.setSquare(this.state.visualColor, move[0], move[1]);
      this.setState({
        visualBoard: boardCopy,
      })
      this.animationTimeout = setTimeout(() => this.animation_tick(), ANIMATION_SPEED);
    } else {
      this.setState({
        visualBoard: this.state.board.copy(),
        visualColor: this.state.currentColor,
        currentState: GAME_STATE.PLAYER_TURN,
      })
      clearInterval(this.animationTimeout);
    }
  }

  render() {
    return (
      <div className="game">
        <ScoreBoard
          board={this.state.visualBoard}
          currentColor={this.state.visualColor}
        />
        <Board
          board={this.state.visualBoard}
          currentColor={this.state.visualColor}
          currentState={this.state.currentState}
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
          <div className='disc'>{blackScore}</div>
        </div>
        <div className={classCurrentPlayer}>
          <div className='disc'></div>
        </div>
        <div className="black">
          <div className='disc'>
            {blackScore}
          </div>
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
            validMove={ this.props.currentState === GAME_STATE.PLAYER_TURN ? this.props.board.isValidMove(this.props.currentColor, x, y) : false}
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
    let value = this.props.value ? (<div className='disc'></div>) : '';

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