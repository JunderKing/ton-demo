import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";

const isMainnet = false;
const tonweb = isMainnet ?
  new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC')) :
  new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

async function withdraw() {
  const words = [
  ]
  const seed = await tonMnemonic.mnemonicToSeed(words);
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

  const toAddr = 'UQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HMTS'
  const amount = TonWeb.utils.toNano('0.01')
  const usdtAddr = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'

  // 获取钱包实例
  const WalletClass = tonweb.wallet.all.v3R2;
  const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });
  const walletAddr = wallet.getAddress().toString(true, true, false)
  // 获取序列号
  const seqno = await wallet.methods.seqno().call();
  console.log({ seqno })
  // 获取ton余额
  const balance = await tonweb.provider.getBalance((await wallet.getAddress()).toString(true, true, true))
  console.log({ balance })
  // 获取jetton余额
  const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: usdtAddr });
  const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(walletAddr));
  const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, { address: jettonWalletAddress });
  const jettonBalance = (await jettonWallet.getData()).balance;
  console.log({ jettonBalance })
  // 构造转账
  const transfer = wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: jettonWalletAddress.toString(true, true, true),
    amount: TonWeb.utils.toNano('0.05'),
    seqno: seqno,
    payload: await jettonWallet.createTransferBody({
      queryId: seqno,
      jettonAmount: amount,
      toAddress: new TonWeb.utils.Address(toAddr),
      responseAddress: walletAddr,
      forwardPayload: "MESSAGE"
    })
  });
  // 广播交易
  await transfer.send();
}

withdraw()