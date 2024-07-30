import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";

// 1. 生成助记词
let words = [
]
// words = await tonMnemonic.generateMnemonic();
console.log('助记词', words.join(' '))
console.log(process.env.TEST)

// 2. 生成秘钥对
const seed = await tonMnemonic.mnemonicToSeed(words);
const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
// const keyPair = TonWeb.utils.nacl.sign.keyPair();
console.log('公钥', Buffer.from(keyPair.publicKey).toString('hex'))
console.log('私钥', Buffer.from(keyPair.secretKey).toString('hex'))

// 3. 获取钱包地址
const tonweb = new TonWeb();
const WalletClass = tonweb.wallet.all.v3R2;
const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });
const address = await wallet.getAddress();
console.log('钱包地址', address.toString(true, true, false)); 

// 助记词 [
//   'wheel',    'turtle',  'chicken',
//   'quantum',  'salad',   'season',
//   'satisfy',  'child',   'purchase',
//   'document', 'wink',    'dial',
//   'confirm',  'erosion', 'junk',
//   'clown',    'clarify', 'juice',
//   'mind',     'sort',    'fiscal',
//   'merit',    'ready',   'sign'
// ]
// 公钥 7b89b22f5d225fcf366b27eb281241e517653d7de60123aa73c7e03d074b6f39
// 私钥 7b7c1696fc2f2c47d068809f6acc8dea2879f3d0c2ca2ece4af2a690424ca6537b89b22f5d225fcf366b27eb281241e517653d7de60123aa73c7e03d074b6f39
// 钱包地址 UQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HMTS

// 助记词 [
//   'meat',    'club',    'wedding',
//   'object',  'olympic', 'uniform',
//   'toast',   'symbol',  'sausage',
//   'patch',   'left',    'general',
//   'lecture', 'enrich',  'flee',
//   'garden',  'rain',    'indicate',
//   'direct',  'token',   'speed',
//   'news',    'curtain', 'what'
// ]
// 公钥 1a8e7a07c8ae55b8538e16c1ab18fc7fdcbb7596902c1db180e03f7c9778397f
// 私钥 b48f8ad82834628274968e1f7c0a7274e49458b00153648dfe4ff672ca7b6e9c1a8e7a07c8ae55b8538e16c1ab18fc7fdcbb7596902c1db180e03f7c9778397f
// 钱包地址 UQBMgJhlhOKmBDTXemechRDxuZctzEo-8uxdbUHalnDy8lQk