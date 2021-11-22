import { ethers } from "ethers";
import fs from 'fs';

export function getPrivateKeyFromSeedPhrase(mnemonic){
  let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  return mnemonicWallet.privateKey;
}

export async function approveTokenForSpend(tokenAddress, amount, wallet){
  const abi = [
    "function approve(address spender, uint256 amount) external returns (bool)"
  ];
  const provider = ethers.providers.getDefaultProvider('rinkeby');// can provider be gotten from wallet?
  const tokenContract = new ethers.Contract(tokenAddress, abi, wallet);
  const proxyContractAddress = '0x4e127a4E9b1Fec0D6c4b27402Fdd3313E4833fFD'; //Rinkeby testnet
  await tokenContract.approve(proxyContractAddress, amount);
}

export function getWallet(){
  // This wallet address is 0xeBf5C62481B5F65E5994317cE7EB71AafE82E8bb
  const provider = ethers.providers.getDefaultProvider('rinkeby');
  const secrets = JSON.parse(fs.readFileSync('../proxy-contract/secrets.json', 'utf8'));
  let privateKey = getPrivateKeyFromSeedPhrase(secrets.seedPhrase);
  return new ethers.Wallet(privateKey, provider);
}
