const { Buffer } = require('buffer');
const { sha256 } = require('@ton/crypto');
const { sign } = require('tweetnacl');
const {
  // TonClient4,
  Address,
  Cell,
  contractAddress,
  loadStateInit,
} = require('@ton/ton');

const { tryParsePublicKey } = require('./ton_wallet_data');

// const logger = require('./logger');

require('dotenv').config();

exports.verifyTonProof = async (body) => {
  const allowedDomains = [
    'shop3.com',
    'test.shop3.com',
    'localhost:5173',
  ];

  const tonProofPrefix = 'ton-proof-item-v2/';
  const tonConnectPrefix = 'ton-connect';
  const validAuthTime = 15 * 60; // 15 minute

  // let client;
  // TODO: Validate body format later

  // const TonApiServiceCreate = async (network) => {
  //   let newClient;
  //   if (network === '-239') {
  //     newClient = new TonClient4({
  //       endpoint: 'https://mainnet-v4.tonhubapi.com',
  //     });
  //   }
  //   if (network === '-3') {
  //     newClient = new TonClient4({
  //       endpoint: 'https://testnet-v4.tonhubapi.com',
  //     });
  //   }
  //   return newClient;
  // };

  // const checkProof = async (payload, getWalletPublicKey) => {
  const checkProof = async (payload) => {
    try {
      const stateInit = loadStateInit(Cell.fromBase64(payload.proof.state_init).beginParse());

      // 1. First, try to obtain public key via get_public_key get-method on smart contract deployed at Address.
      // 2. If the smart contract is not deployed yet, or the get-method is missing, you need:
      //  2.1. Parse TonAddressItemReply.walletStateInit and get public key from stateInit. You can compare the walletStateInit.code
      //  with the code of standard wallets contracts and parse the data according to the found wallet version.

      // const publicKey = tryParsePublicKey(stateInit) ?? await getWalletPublicKey(payload.address);
      const publicKey = tryParsePublicKey(stateInit) ?? null;
      if (!publicKey) {
        return false;
      }

      // 2.2. Check that TonAddressItemReply.publicKey equals to obtained public key
      const wantedPublicKey = Buffer.from(payload.public_key, 'hex');
      if (!publicKey.equals(wantedPublicKey)) {
        return false;
      }

      // 2.3. Check that TonAddressItemReply.walletStateInit.hash() equals to TonAddressItemReply.address. .hash() means BoC hash.
      const wantedAddress = Address.parse(payload.address);
      const address = contractAddress(wantedAddress.workChain, stateInit);
      if (!address.equals(wantedAddress)) {
        return false;
      }

      if (!allowedDomains.includes(payload.proof.domain.value)) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      if (now - validAuthTime > payload.proof.timestamp) {
        return false;
      }

      const message = {
        workchain: address.workChain,
        address: address.hash,
        domain: {
          lengthBytes: payload.proof.domain.lengthBytes,
          value: payload.proof.domain.value,
        },
        signature: Buffer.from(payload.proof.signature, 'base64'),
        payload: payload.proof.payload,
        stateInit: payload.proof.state_init,
        timestamp: payload.proof.timestamp,
      };

      const wc = Buffer.alloc(4);
      wc.writeUInt32BE(message.workchain, 0);

      const ts = Buffer.alloc(8);
      ts.writeBigUInt64LE(BigInt(message.timestamp), 0);

      const dl = Buffer.alloc(4);
      dl.writeUInt32LE(message.domain.lengthBytes, 0);

      // message = utf8_encode("ton-proof-item-v2/") ++
      //           Address ++
      //           AppDomain ++
      //           Timestamp ++
      //           Payload
      const msg = Buffer.concat([
        Buffer.from(tonProofPrefix),
        wc,
        message.address,
        dl,
        Buffer.from(message.domain.value),
        ts,
        Buffer.from(message.payload),
      ]);

      const msgHash = Buffer.from(await sha256(msg));

      // signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
      const fullMsg = Buffer.concat([
        Buffer.from([0xff, 0xff]),
        Buffer.from(tonConnectPrefix),
        msgHash,
      ]);

      const result = Buffer.from(await sha256(fullMsg));

      return sign.detached.verify(result, message.signature, publicKey);
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // const getWalletPublicKey = async (address) => {
  //   console.log('START_address');
  //   console.log(address);
  //   console.log('END_address');
  //   try {
  //     const masterAt = await client.getLastBlock();
  //     console.log('START_masterAt');
  //     console.log(masterAt);
  //     console.log('END_masterAt');
  //     const result = await client.runMethod(masterAt.last.seqno, Address.parse(address), 'get_public_key', []);
  //     console.log('START_result');
  //     console.log(result);
  //     console.log('END_result');
  //     console.log('XXXXXXXXXXXXXX');
  //     return Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, '0'), 'hex');
  //   } catch (err) {
  //     logger.error(err);
  //     throw err;
  //   }
  // };

  // client = await TonApiServiceCreate(body.network);

  // const isValid = await checkProof(body, (address) => getWalletPublicKey(address));
  const isValid = await checkProof(body);

  return isValid;
};
