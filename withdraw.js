import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";

const apiKey = '33dffc056872cce7fa56e47f68ddddfa8404952e9a2ecfb091aeca7e2e087e7c'
const isMainnet = false;
const tonweb = isMainnet ?
  new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey})) :
  new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey}));

async function withdraw() {
  const words = [
  ]
  const seed = await tonMnemonic.mnemonicToSeed(words);
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
  const toAddr = 'UQBMgJhlhOKmBDTXemechRDxuZctzEo-8uxdbUHalnDy8lQk'
  const amount = TonWeb.utils.toNano('0.01')

  // 获取钱包实例
  const WalletClass = tonweb.wallet.all.v3R2;
  const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });
  // 获取序列号
  const seqno = await wallet.methods.seqno().call() || 0;
  console.log({ seqno })
  // 获取钱包余额
  const balance = await tonweb.provider.getBalance((await wallet.getAddress()).toString(true, true, true))
  console.log({ balance })
  // 构造转账
  const transfer = wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: toAddr,
    amount: amount,
    seqno: seqno,
    payload: 'MESSAGE'
  });
  // 广播交易
  const result = await transfer.send();
  console.log({ result })
}

withdraw()