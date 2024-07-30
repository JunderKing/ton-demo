import TonWeb from "tonweb";

const apiKey = '33dffc056872cce7fa56e47f68ddddfa8404952e9a2ecfb091aeca7e2e087e7c'
const isMainnet = true;
const tonweb = isMainnet ?
  new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey})) :
  new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey}));

const walletAddr = 'UQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HMTS'
const usdtAddr = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'

async function main() {
  const count = 1
  const transactions = await tonweb.provider.getTransactions(walletAddr, count);
  console.log(transactions)
  for (const tx of transactions) {
    handleJettonTx(tx)
  }
}

async function getUsdtJettonWallet() {
  const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: usdtAddr });
  return (await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(walletAddr))).toString(true, true, true)
}

async function handleJettonTx(tx) {
  // {
  //   '@type': 'raw.transaction',
  //   address: {
  //     '@type': 'accountAddress',
  //     account_address: 'EQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HJkX'
  //   },
  //   utime: 1722302239,
  //   data: 'te6cckECBgEAATcAA69xubu6Hn0cdSWyVb08Ku7+dw1zqoAeL/taa6S8aKqTocAAArwQfEfMcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqg/HwABgIAQIDAQGgBACCcpCuyJZa+rsW68PLm0COuucbYY14eIvIDQmENZPKyY2ksmAVcaEpw0GlGmKagtEkMw0jsvuDboG38RG9APNbaCkACQwIQEkgAatIAXHil6zMxuMkQV19ss5lDwhD8ff6f/Ilu5UibezIYtbVAAbm7uh59HHUlslW9PCru/ncNc6qAHi/7WmukvGiqk6HBAQGDCRcAABXgg+I+YzNUH4+wAUAYnNi0JwAAAAAAAAAADDPhQgAoADJTi1F43mK/Hr5nj6/wzHhhxjczQ408MgAiAlZ/uRqxNu4',
  //   transaction_id: {
  //     '@type': 'internal.transactionId',
  //     lt: '48108059000007',
  //     hash: 'de2kNuSI6Ll0sdDj42/B8MMTZ++4tDPslsspdbIpg7A='
  //   },
  //   fee: '0',
  //   storage_fee: '0',
  //   other_fee: '0',
  //   in_msg: {
  //     '@type': 'raw.message',
  //     source: 'EQC48UvWZmNxkiCuvtlnMoeEIfj7_T_5Et3KkTb2ZDFrag7o',
  //     destination: 'EQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HJkX',
  //     value: '1',
  //     fwd_fee: '397870',
  //     ihr_fee: '0',
  //     created_lt: '48108059000006',
  //     body_hash: 'IGc7bKX6pYNIiNCDjXUXeKZghpTslyRoaorkpjfTVzg=',
  //     msg_data: [Object],
  //     message: 'c2LQnAAAAAAAAAAAMM+FCACgAMlOLUXjeYr8evmePr/DMeGHGNzNDjTwyACICVn+5A==\n'
  //   },
  //   out_msgs: []
  // }
  const sourceAddress = tx.in_msg.source;
  if (!sourceAddress) {
      return;
  }
  const myJettonWallet = await getUsdtJettonWallet()
  if (sourceAddress != myJettonWallet) {
    return;
  }

  if (!tx.in_msg.msg_data || tx.in_msg.msg_data['@type'] !== 'msg.dataRaw' || !tx.in_msg.msg_data.body) {
      return;
  }

  const msgBody = TonWeb.utils.base64ToBytes(tx.in_msg.msg_data.body);

  const cell = TonWeb.boc.Cell.oneFromBoc(msgBody);
  const slice = cell.beginParse();
  const op = slice.loadUint(32);
  if (!op.eq(new TonWeb.utils.BN(0x7362d09c))) return;
  const queryId = slice.loadUint(64);
  const amount = slice.loadCoins();
  const from = slice.loadAddress();
  const fromAddr = new TonWeb.utils.Address(from).toString(true)
  const comment = ""

  // const maybeRef = slice.loadBit();
  // const payload = maybeRef ? slice.loadRef() : slice;
  // console.log(payload)
  // const payloadOp = payload.loadUint(32);
  // if (!payloadOp.eq(new TonWeb.utils.BN(0))) {
  //     console.log('no text comment in transfer_notification');
  //     return;
  // }
  // let payloadBytes = [];
  //   while (payload) {
  //       payloadBytes = [...payloadBytes, ...payload.loadBits(payload.getFreeBits())];
  //       payload = payload.loadRef();
  //   }
  // comment = new TextDecoder().decode(new Uint8Array(payloadBytes));

  console.log('Got USDT jetton deposit ' + amount.toString() + ` from ${fromAddr} units with text comment ""`);
}

main()