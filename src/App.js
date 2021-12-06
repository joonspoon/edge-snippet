import React, { Component } from "react";
import logo from "./uni.png";
import './App.css';
import "antd/dist/antd.css";
import { EdgeCurrencyWallet, currencyInfo } from './swappery/edgery.js';
import * as UniswapPlugin from './swappery/uniswap.js';
import { ethers } from "ethers";
import * as Utils from './swappery/utils.js';
import { Select, Button } from 'antd';

const { Option } = Select;

const rawKeys:JsonObject = {
  ethereumKey: Utils.getTestPrivateKey(),
}

const ethWallet: EdgeCurrencyWallet = {
  id: 'uni-magic',
  keys: rawKeys.ethereumKey,
  type: 'wallet:ethereum'
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      sourceAsset: 'DAI',
      destinationAsset: 'WBTC',
      errorMessage: ''
    };
  }

   updateDest(value){
     this.setState({destinationAsset: value})
   }

   updateSource(value){
     this.setState({sourceAsset: value})
   }

   async getQuote(){
     this.setState({errorMessage: ''})

     const swapRequest: EdgeSwapRequest = {
       // Where?
       fromWallet: ethWallet,
       toWallet: ethWallet,

       // What?
       fromCurrencyCode: this.state.sourceAsset,
       toCurrencyCode: this.state.destinationAsset,

       // How much?
       nativeAmount: '100000000000000000',
       quoteFor: 'from'
     }

     UniswapPlugin.fetchSwapQuote(swapRequest)
      .then(result => this.setState({ data: result }))
      .catch (error => {
        this.setState({ errorMessage: error.message })
        this.setState({ data: '?' })
      })

   }

  render() {
    const tokenList = currencyInfo.metaTokens.map(token => {
      return <Option key={token.currencyCode}>{ token.currencyName + " - " + token.currencyCode}</Option>;
    });

    return (
      <React.Fragment>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          1 {this.state.sourceAsset} = {this.state.data} {this.state.destinationAsset}
        </p>
        <Select defaultValue={this.state.sourceAsset} onChange={this.updateSource.bind(this)}>
          {tokenList}
        </Select>
        <Select defaultValue={this.state.destinationAsset}  onChange={this.updateDest.bind(this)}>
          {tokenList}
        </Select>
        <Button style={{background: 'HotPink'}} onClick={this.getQuote.bind(this)}>Get Quote</Button>
        {this.state.errorMessage}
      </header>
    </React.Fragment>
    );
  }
}
export default App;
