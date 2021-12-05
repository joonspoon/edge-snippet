import React, { Component } from "react";
import logo from "./uni.png";
import './App.css';
import { EdgeCurrencyWallet } from './swappery/edgery.js';
import * as UniswapPlugin from './swappery/uniswap.js';
import { ethers } from "ethers";

class App extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  async componentDidMount() {

    const edgeWallet: EdgeCurrencyWallet = {
      id: 'string',
    //  +keys: JsonObject,
      type: ''
    }

    //console.log(ethers.utils.parseEther("0.1").toString());

    const swapRequest: EdgeSwapRequest = {
      // Where?
      fromWallet: edgeWallet,
      toWallet: edgeWallet,

      // What?
      fromCurrencyCode: 'WETH',
      toCurrencyCode: 'DAI',

      // How much?
      nativeAmount: '100000000000000000',
      quoteFor: 'from'
    }

    const result = await UniswapPlugin.fetchSwapQuote();
    this.setState({ data: result });
    console.log(result);
  }

  render() {
    return (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.data}
          </p>
        </header>
    );
  }
}
export default App;
