import { EdgeSwapRequest, currencyInfo, SwapCurrencyError } from './edgery.js';
import { ChainId, Token, Fetcher, Route, Trade, TokenAmount, TradeType } from "@uniswap/sdk";

export async function fetchSwapQuote(swapRequest: EdgeSwapRequest): Promise<string> {//EdgeSwapPluginQuote
  const chainId = ChainId.MAINNET;
  const sourceTokenAddress = currencyInfo.metaTokens.find(token => token.currencyCode == swapRequest.fromCurrencyCode).contractAddress;
  const sourceToken = await Fetcher.fetchTokenData(chainId, sourceTokenAddress);
  const destinationTokenAddress = currencyInfo.metaTokens.find(token => token.currencyCode == swapRequest.toCurrencyCode).contractAddress;
  const destinationToken = await Fetcher.fetchTokenData(chainId, destinationTokenAddress);
  try {
    const pair = await Fetcher.fetchPairData(sourceToken, destinationToken);
    const route = new Route([pair], sourceToken);
    const trade = new Trade(
      route,
      new TokenAmount(sourceToken, "1000000000000000000"),
      TradeType.EXACT_INPUT
    );
    console.log("executionPrice: ", trade.executionPrice.toSignificant(6));
    console.log("nextMidPrice: ", trade.nextMidPrice.toSignificant(6));
    console.log("midPrice.invert: ", route.midPrice.invert().toSignificant(6)); // 0.00496756
    return trade.executionPrice.toSignificant(6); // 201.306
  } catch (error) {
    console.log("ERRRROR", error)
    throw new SwapCurrencyError({displayName: 'Uniswap'}, swapRequest.fromCurrencyCode, swapRequest.toCurrencyCode);
  }
}
