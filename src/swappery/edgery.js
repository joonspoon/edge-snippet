export type EdgeCurrencyWallet = {
  +id: string,
//  +keys: JsonObject,
  +type: string,
}


// export type JsonObject = {
//   [name: string]: any // TODO: this needs to become `mixed`
// }
//
// export type EdgeWalletInfo = {
//   id: string,
//   type: string,
//   keys: JsonObject
// }


export type EdgeSwapQuote = {
  +isEstimate: boolean,
  +fromNativeAmount: string,
  +toNativeAmount: string,
  +networkFee: EdgeNetworkFee,

  +pluginId: string,
  +expirationDate?: Date,

  approve(): Promise<EdgeSwapResult>,
  close(): Promise<void>
}

export type EdgeSwapPlugin = {
  +swapInfo: EdgeSwapInfo,

  checkSettings?: (userSettings: JsonObject) => EdgeSwapPluginStatus,
  fetchSwapQuote(
    request: EdgeSwapRequest,
    userSettings: JsonObject | void,
    opts: { promoCode?: string }
  ): Promise<EdgeSwapQuote>
}

export type EdgeNetworkFee = {
  +currencyCode: string,
  +nativeAmount: string
}

export class SwapCurrencyError extends Error {
  name: string
  +pluginId: string
  +fromCurrency: string
  +toCurrency: string

  constructor(
    swapInfo: EdgeSwapInfo,
    fromCurrency: string,
    toCurrency: string
  ) {
    super(
      `${swapInfo.displayName} does not support ${fromCurrency} to ${toCurrency}`
    )
    this.name = 'SwapCurrencyError'
    this.pluginId = swapInfo.pluginId
    this.fromCurrency = fromCurrency
    this.toCurrency = toCurrency
  }
}
