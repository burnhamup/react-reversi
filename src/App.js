import React from 'react';

import {Game} from './Board';
import './App.css';
import {Menu} from "./Menu";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 'showMenu'
    }
  }
  startGame(menuState) {
    this.setState({
      currentState: 'game',
      whitePlayerType: menuState.whitePlayerType,
      blackPlayerType: menuState.blackPlayerType,
    })
  }

  renderMenu() {
    return (<Menu
      startGame={(menuState) => this.startGame(menuState)}
    />)
  }
  renderGame() {
    return (<Game
      whitePlayerType={this.state.whitePlayerType}
      blackPlayerType={this.state.blackPlayerType}
    />)
  }

  render() {
    switch (this.state.currentState){
      case 'showMenu':
        return this.renderMenu();
      case 'game':
        return this.renderGame()
      default:
        return (<div>Error</div>)
    }
  }
}
