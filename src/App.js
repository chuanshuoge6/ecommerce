import React, { Component } from 'react';
import './App.css';
import Header from './partials/header';
import Body from './partials/body';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Body />
      </div>
    );
  }
}

export default App;
