import * as Utils from './utils.js';
import { ethers } from "ethers";
import fs from 'fs';
import * as Token from './tokenAddresses.js';

const wallet = Utils.getWallet();
const proxyContractAddress = '0x4e127a4E9b1Fec0D6c4b27402Fdd3313E4833fFD'; //Rinkeby testnet
const proxyContractABI = JSON.parse(fs.readFileSync('../proxy-contract/artifacts/contracts/Swap.sol/Swap.json', 'utf8')).abi;
const signedContract = new ethers.Contract(proxyContractAddress, proxyContractABI, wallet);

let amountToSwap = ethers.utils.parseEther("0.1");
await Utils.approveTokenForSpend(Token.WETH, amountToSwap, wallet);

var gasOptions = { gasPrice: 1000000000, gasLimit: 250000};
await signedContract.swap(Token.WETH, Token.DAI, amountToSwap, 10, wallet.address, gasOptions);
