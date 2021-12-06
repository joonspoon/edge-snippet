import { EdgeSwapRequest, SwapCurrencyError, EdgeCurrencyWallet } from './edgery.js';
import { ChainId, Token, Fetcher, Route, Trade, TokenAmount, TradeType } from "@uniswap/sdk";
import { ethers } from "ethers";
import * as Utils from './utils.js';

import * as Token1 from './tokenAddresses.js';

const chainId = ChainId.Rinkeby;
const rinkebyProvider = ethers.providers.getDefaultProvider('rinkeby');

export async function fetchSwapQuote(swapRequest: EdgeSwapRequest): Promise<string> {//EdgeSwapPluginQuote
  // const chainId = ChainId.MAINNET;
  const sourceTokenAddress = Utils.getAddressFromCurrencyCode(swapRequest.fromCurrencyCode);
  const sourceToken = await Fetcher.fetchTokenData(chainId, sourceTokenAddress);
  const destinationTokenAddress = Utils.getAddressFromCurrencyCode(swapRequest.toCurrencyCode);
  const destinationToken = await Fetcher.fetchTokenData(chainId, destinationTokenAddress);
  try {
    const pair = await Fetcher.fetchPairData(sourceToken, destinationToken);
    const route = new Route([pair], sourceToken);
    const trade = new Trade(
      route,
      new TokenAmount(sourceToken, swapRequest.nativeAmount),
      TradeType.EXACT_INPUT
    );
    console.log("executionPrice: ", trade.executionPrice.toSignificant(6));
    console.log("nextMidPrice: ", trade.nextMidPrice.toSignificant(6));
    console.log("midPrice.invert: ", route.midPrice.invert().toSignificant(6));
    return trade.executionPrice.toSignificant(6);
  } catch (error) {
    console.log("ERRRROR", error)
    throw new SwapCurrencyError({displayName: 'Uniswap'}, swapRequest.fromCurrencyCode, swapRequest.toCurrencyCode);
  }
}

export async function performSwap(swapRequest: EdgeSwapRequest): Promise<string> {
  const proxyContractAddress = '0x4e127a4E9b1Fec0D6c4b27402Fdd3313E4833fFD'; //Rinkeby testnet
  const proxyContractInterface = [
    "function swap(address _tokenIn, address _tokenOut, uint _amountIn, uint _amountOutMin, address _to)"
  ];

  const edgeWallet: EdgeCurrencyWallet = swapRequest.fromWallet;
  const ethersWallet = new ethers.Wallet(edgeWallet.keys.ethereumKey, rinkebyProvider);
  const signedContract = new ethers.Contract(proxyContractAddress, proxyContractInterface, ethersWallet);

  const sourceTokenAddress = Utils.getRinkebyAddressFromCurrencyCode(swapRequest.fromCurrencyCode);
  const destinationTokenAddress = Utils.getRinkebyAddressFromCurrencyCode(swapRequest.toCurrencyCode);
  let amountToSwap = ethers.utils.parseEther("0.1");

  await Utils.approveTokenForSpend(sourceTokenAddress, swapRequest.nativeAmount, ethersWallet);
  var gasOptions = { gasPrice: 1000000000, gasLimit: 250000};
  const swapResult = await signedContract.swap(sourceTokenAddress, destinationTokenAddress, swapRequest.nativeAmount, 10, ethersWallet.address, gasOptions);
  const { hash } = swapResult;
  const transactionURL = "https://rinkeby.etherscan.io/tx/" + hash;
  // console.log(swapResult);
  //window.open(transactionURL);
  return transactionURL;
}
