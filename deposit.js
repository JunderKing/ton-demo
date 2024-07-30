import TonWeb from "tonweb";

const apiKey = '33dffc056872cce7fa56e47f68ddddfa8404952e9a2ecfb091aeca7e2e087e7c'
const isMainnet = false;
const tonweb = isMainnet ?
  new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey})) :
  new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey}));

const walletAddr = 'UQBMgJhlhOKmBDTXemechRDxuZctzEo-8uxdbUHalnDy8lQk'

async function main() {
  const count = 10
  const transactions = await tonweb.provider.getTransactions(walletAddr, count);
  for (const tx of transactions) {
    handleTx(tx)
  }
}

async function handleTx(tx) {
  // {
  //   '@type': 'raw.transaction',
  //   address: {
  //     '@type': 'accountAddress',
  //     account_address: 'EQBMgJhlhOKmBDTXemechRDxuZctzEo-8uxdbUHalnDy8gnh'
  //   },
  //   utime: 1722299668,
  //   data: 'te6cckECBQEAAQ4AA690yAmGWE4qYENNd6Z5yFEPG5ly3MSj7y7F1tQdqWcPLyAAAWBWbHh8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqg1FAABgIAQIDAQGgBACCcpCuyJZa+rsW68PLm0COuucbYY14eIvIDQmENZPKyY2kZGjqf/DSjJEaGmo/ggGQSIvXyMSfmB6PExi/hJJhHFwADQwI5iWgASAAvUgANzd3Q8+jjqS2SrenhV3fzuGudVADxf9rTXSXjRVSdDkAEyAmGWE4qYENNd6Z5yFEPG5ly3MSj7y7F1tQdqWcPLyOYloABggjWgAALArNUgaEzVBqHAAAAAAYmRnAft3fqA==',
  //   transaction_id: {
  //     '@type': 'internal.transactionId',
  //     lt: '24212455000001',
  //     hash: 'FxeB/jWcQf4E+kLajc1G0n1ZQ6AFzIOzXlWfXqN10XU='
  //   },
  //   fee: '0',
  //   storage_fee: '0',
  //   other_fee: '0',
  //   in_msg: {
  //     '@type': 'raw.message',
  //     source: 'EQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HJkX',
  //     destination: 'EQBMgJhlhOKmBDTXemechRDxuZctzEo-8uxdbUHalnDy8gnh',
  //     value: '10000000',
  //     fwd_fee: '266669',
  //     ihr_fee: '0',
  //     created_lt: '24212453000002',
  //     body_hash: 'RRX6Iutz2vyeGY/qiIsLFHUZNTL1pTkPV+H/wH4Xaws=',
  //     msg_data: [Object],
  //     message: '123'
  //   },
  //   out_msgs: []
  // }
  console.log(tx.in_msg)
  if (tx.in_msg.source && tx.out_msgs.length === 0) {
    if (tx.in_msg.msg_data && tx.in_msg.msg_data['@type'] !== 'msg.dataText') {
      return;
    }
    const value = tx.in_msg.value;
    const senderAddress = tx.in_msg.source;
    const payload = tx.in_msg.message;
    console.log(`Receive ${TonWeb.utils.fromNano(value)} TON from ${senderAddress} with comment "${payload}"`);
  }
}

main()