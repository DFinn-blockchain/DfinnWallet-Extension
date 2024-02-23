/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { upsertChain, validateCustomChain } from '../messaging';

const networks = [
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'beresheet_testnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'wss://beresheet.jelliedowl.net' },
      blockExplorer: 'https://beresheet.edgscan.live',
      crowdloanUrl: '',
      symbol: 'EDG',
      chainType: 'Substrate',
      name: 'Beresheet Testnet',
      priceId: 'edgeware',
    },
    chainSpec: {
      genesisHash: '0x8da6a03e0989154ff8c1977cbc0cbd55f6879d8759c272a4f3c078cef794bf5f',
      decimals: 18,
      addressPrefix: 7,
      paraId: 0,
      evmChainId: 2022,
      existentialDeposit: '10000000000000'
    }
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'kava_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://evm.kava.io' },
      blockExplorer: 'https://kavascan.com',
      crowdloanUrl: '',
      symbol: 'KAVA',
      chainType: 'EVM',
      name: 'Kava Mainnet',
      priceId: 'kava',
    },
    chainSpec: {
      genesisHash: '0x67de4ea26107488b36dbb25bb18d0bf9a9968f3cc1eaa0fac578120911eed708',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 2222,
      existentialDeposit: '0'
    }
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'metis_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://metis-mainnet.public.blastapi.io' },
      blockExplorer: 'https://metis.tokenview.io/',
      crowdloanUrl: '',
      symbol: 'METIS',
      chainType: 'EVM',
      name: 'Metis Mainnet',
      priceId: 'metis-token',
    },
    chainSpec: {
      genesisHash: '0x2824a3d7b66d916c9de002e4482954b5be2c0acc1752abfd280ef17d13fc6ac2',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 1088,
      existentialDeposit: '0'
    }
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'opbnb_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://opbnb.publicnode.com' },
      blockExplorer: 'https://opbnbscan.com/',
        crowdloanUrl: '',
        symbol: 'BNB',
        chainType: 'EVM',
        name: 'OpBNB Mainnet',
        priceId: 'bnb',
      },
      chainSpec: {
        genesisHash: '0x4dd61178c8b0f01670c231597e7bcb368e84545acd46d940a896d6a791dd6df4',
        decimals: 18,
        addressPrefix: 0,
        paraId: 0,
        evmChainId: 204,
        existentialDeposit: '0',
      },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'cronos_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://evm.cronos.org' },
      blockExplorer: 'https://explorer.cronos.org',
      crowdloanUrl: '',
      symbol: 'CRO',
      chainType: 'EVM',
      name: 'Cronos Mainnet',
      priceId: 'cronos',
    },
    chainSpec: {
      genesisHash: '0xa7f4e603aa51239a15e0a3fafb15c6e4c6d6f2c39c55770330efd2fa5afc12a9',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 25,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'dogecoin_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://rpc.dogechain.dog' },
      blockExplorer: 'https://explorer.dogechain.dog',
      crowdloanUrl: '',
      symbol: 'DOGE',
      chainType: 'EVM',
      name: 'Dogecoin Mainnet',
      priceId: 'dogecoin',
    },
    chainSpec: {
      genesisHash: '0x5ee4e79b3d798f8bd5a3a5f92e24f62198888aed028354ad5463aea8e5da5b74',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 2000,
      existentialDeposit: '0',
    },
  },
];

const getArrayOfResponses = async () => {
  const requests = networks.map((network) => {
    return new Promise((resolve, reject) => {
      if (network.mode === 'update') {
        upsertChain(network)
          .then((r) => resolve(r))
          .catch((e) => reject(e));
      }

      validateCustomChain(network.chainEditInfo.providers[network.chainEditInfo.currentProvider])
        .then((result) => {
          console.log('consolelogi',network);

          // network.chainEditInfo.slug = '';
          if (result.evmChainId) {
            network.chainEditInfo.chainType = 'EVM';
            network.chainSpec.evmChainId = result.evmChainId;
            network.chainSpec.genesisHash = '';
          } else {
            network.chainSpec.addressPrefix = Number(result.addressPrefix);
            network.chainSpec.paraId = result.paraId || 0;
            network.chainEditInfo.chainType = 'Substrate';
            network.chainSpec.genesisHash = result.genesisHash;
            network.chainSpec.existentialDeposit = result.existentialDeposit;
          }

          // network.chainEditInfo.name = result.name;
          network.chainEditInfo.symbol = result.symbol;
          network.chainSpec.decimals = result.decimals;

          if (network.chainEditInfo.name.length !== 0 && result.success) {
            upsertChain(network)
              .then((r) => {
                if (r) {
                  resolve(r);
                // console.log('Added:- ', network.chainEditInfo.name);
                } else {
                  reject('An error occurred, please try again ' + network.chainEditInfo.name);
                }

                // if (AddedMap[key].active) enableNetworkMap(key).catch(e => console.log('Added Enabling error:- ', e.message));
                resolve(r);
              })
              .catch((e) => reject(e));
          }
        })
        .catch((e) => reject(e));
    });
  });

  return await Promise.all(requests);
};
console.log(networks[0].chainEditInfo,'net')
export const insertChains = async () => {
  try {
    await getArrayOfResponses();
    console.log('====================================');
    console.log('Added networks successfully');
    console.log('====================================');
  } catch (error) {
    console.log('====================================');
    console.log('Failed to add networks:- ', error.message);
    console.log('====================================');
  }
};
