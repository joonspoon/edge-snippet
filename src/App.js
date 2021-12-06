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

const amountToSwap = ethers.utils.parseEther("100");

const ethWallet: EdgeCurrencyWallet = {
  id: 'uni-magic',
  keys: rawKeys,
  type: 'wallet:ethereum'
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      quote: '',
      swapStatus: '',
      sourceAsset: 'DAI',
      destinationAsset: 'WETH',
      errorMessage: ''
    };
  }

   updateDest(value){
     this.setState({destinationAsset: value})
   }

   updateSource(value){
     this.setState({sourceAsset: value})
   }

   async swap(){
     this.setState({errorMessage: ''})
     this.setState({swapStatus: ''})

     const swapRequest: EdgeSwapRequest = {
       fromWallet: ethWallet,
       fromCurrencyCode: this.state.sourceAsset,
       toCurrencyCode: this.state.destinationAsset,
       nativeAmount: amountToSwap,
     }

     UniswapPlugin.performSwap(swapRequest)
      .then(result => this.setState({ swapStatus: result}))
      .catch (error => {
        this.setState({ errorMessage: error.message })
        this.setState({ data: '?' })
      })
   }

   async getQuote(){
     this.setState({errorMessage: ''})
     this.setState({swapStatus: ''})

     const swapRequest: EdgeSwapRequest = {
       fromCurrencyCode: this.state.sourceAsset,
       toCurrencyCode: this.state.destinationAsset,
       nativeAmount: amountToSwap,
     }

     UniswapPlugin.fetchSwapQuote(swapRequest)
      .then(result => this.setState({ quote: result }))
      .catch (error => {
        this.setState({ errorMessage: error.message })
        this.setState({ data: '?' })
      })

   }

  render() {
    const tokenList = currencyInfo.metaTokens
      .filter(token => token.rinkebyAddress)
      .map(token => {
        return <Option key={token.currencyCode}>{ token.currencyName + " - " + token.currencyCode}</Option>;
      });

    return (
      <React.Fragment>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          1 {this.state.sourceAsset} = {this.state.quote} {this.state.destinationAsset}
        </p>
        <Select defaultValue={this.state.sourceAsset} onChange={this.updateSource.bind(this)}>
          {tokenList}
        </Select>
        <Select defaultValue={this.state.destinationAsset} onChange={this.updateDest.bind(this)}>
          {tokenList}
        </Select>
        <Button style={{background: 'HotPink'}} onClick={this.getQuote.bind(this)}>Get Quote</Button>
        <Button style={{background: 'HotPink'}} onClick={this.swap.bind(this)}>Swap</Button>
        {this.state.errorMessage}
        {this.state.swapStatus ? <a href={this.state.swapStatus}>etherscan</a>:''}
      </header>
    </React.Fragment>
    );
  }
}
export default App;
