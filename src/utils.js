import { ethers } from "ethers";

export function getPrivateKeyFromSeedPhrase(mnemonic){
  let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  return mnemonicWallet.privateKey;
}
