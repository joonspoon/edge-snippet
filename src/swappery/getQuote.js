// @flow
import * as Edge from './edgery.js';
const employeeName:string = "John";
// const edgeWallet: EdgeCurrencyWallet = {'',''}

const request:EdgeSwapRequest = {   
  fromCurrencyCode,
  fromWallet: fromCoreWallet, //EdgeCurrencyWallet
  nativeAmount: info.primaryNativeAmount, //string
  quoteFor: info.whichWallet,//'from' | 'to'
  toCurrencyCode, //string
  toWallet: toCoreWallet //EdgeCurrencyWallet
}

export type EdgeSwapRequest = {``
  // Where?
  fromWallet: EdgeCurrencyWallet,
  toWallet: EdgeCurrencyWallet,

  // What?
  fromCurrencyCode: string,
  toCurrencyCode: string,

  // How much?
  nativeAmount: string,
  quoteFor: 'from' | 'to'
}

//const swapInfo = await fetchSwapQuote(state, request)

const fromToken = tokens.find(t => t.symbol === request.fromCurrencyCode)
const toToken = tokens.find(t => t.symbol === request.toCurrencyCode)
if (!fromToken || !toToken) {
  throw new SwapCurrencyError(swapInfo, fromToken, toToken)
}


//getReceiveAddress
//makeSpend(
        //   spendInfo
        // )
        //.currencyInfo.currencyCode,
        //.signTx(tx)
