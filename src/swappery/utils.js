import { ethers } from "ethers";
// import fs from 'fs';
import secrets from './secrets.json';
import { EdgeSwapRequest, currencyInfo, SwapCurrencyError, EdgeCurrencyWallet } from './edgery.js';

export function getPrivateKeyFromSeedPhrase(mnemonic){
  let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  return mnemonicWallet.privateKey;
}

export function getTestPrivateKey(){
  return getPrivateKeyFromSeedPhrase(secrets.seedPhrase);
}

export async function approveTokenForSpend(tokenAddress, amount, wallet) {
  const abi = [
    "function approve(address spender, uint256 amount) external returns (bool)"
  ];
  const provider = ethers.providers.getDefaultProvider('rinkeby');// can provider be gotten from wallet?
  const tokenContract = new ethers.Contract(tokenAddress, abi, wallet);
  const proxyContractAddress = '0x84F4d73e9D679fc487cC819f02069096b4aBE210'; //Rinkeby testnet
  const transactionResponse = await tokenContract.approve(proxyContractAddress, amount);
  const { gasLimit } = transactionResponse;
  return gasLimit;
}

export function getWallet(){
  // This wallet address is 0xeBf5C62481B5F65E5994317cE7EB71AafE82E8bb
  const provider = ethers.providers.getDefaultProvider('rinkeby');
  const secrets = JSON.parse(fs.readFileSync('../proxy-contract/secrets.json', 'utf8'));
  let privateKey = getPrivateKeyFromSeedPhrase(secrets.seedPhrase);
  return new ethers.Wallet(privateKey, provider);
}

export function getRinkebyAddressFromCurrencyCode(currencyCode: string) {
  return currencyInfo.metaTokens.find(token => token.currencyCode == currencyCode).rinkebyAddress;
}

export function getAddressFromCurrencyCode(currencyCode: string) {
  return currencyInfo.metaTokens.find(token => token.currencyCode == currencyCode).contractAddress;
}

export function calculateTransactionCost(gasPriceInGwei: number){
  const costOfApproval = 26256;
  const costOfSwap = 134715;
  return (costOfApproval + costOfSwap + 40000)*gasPriceInGwei;
}
