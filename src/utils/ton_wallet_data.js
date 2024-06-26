const {
  // Slice,
  // StateInit,
  WalletContractV1R1,
  WalletContractV1R2,
  WalletContractV1R3,
  WalletContractV2R1,
  WalletContractV2R2,
  WalletContractV3R1,
  WalletContractV3R2,
  WalletContractV4: WalletContractV4R2,
} = require('@ton/ton');

const { Buffer } = require('buffer');
const { WalletContractV4R1 } = require('./wallet-contract-v4-r1');

function loadWalletV1Data(cs) {
  const seqno = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey };
}

function loadWalletV2Data(cs) {
  const seqno = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey };
}

function loadWalletV3Data(cs) {
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey, walletId };
}

function loadWalletV4Data(cs) {
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  const plugins = cs.loadMaybeRef();
  return {
    seqno, publicKey, walletId, plugins,
  };
}

const knownWallets = [
  { contract: WalletContractV1R1, loadData: loadWalletV1Data },
  { contract: WalletContractV1R2, loadData: loadWalletV1Data },
  { contract: WalletContractV1R3, loadData: loadWalletV1Data },
  { contract: WalletContractV2R1, loadData: loadWalletV2Data },
  { contract: WalletContractV2R2, loadData: loadWalletV2Data },
  { contract: WalletContractV3R1, loadData: loadWalletV3Data },
  { contract: WalletContractV3R2, loadData: loadWalletV3Data },
  { contract: WalletContractV4R1, loadData: loadWalletV4Data },
  { contract: WalletContractV4R2, loadData: loadWalletV4Data },
].map(({ contract, loadData }) => ({
  contract,
  loadData,
  wallet: contract.create({ workchain: 0, publicKey: Buffer.alloc(32) }),
}));

function tryParsePublicKey(stateInit) {
  if (!stateInit.code || !stateInit.data) {
    return null;
  }

  for (const { wallet, loadData } of knownWallets) {
    try {
      if (wallet.init.code.equals(stateInit.code)) {
        return loadData(stateInit.data.beginParse()).publicKey;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

module.exports = {
  tryParsePublicKey,
};
