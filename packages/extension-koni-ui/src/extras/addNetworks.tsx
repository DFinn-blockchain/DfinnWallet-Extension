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
      existentialDeposit: '10000000000000',
    },
  },
  {
    chainEditInfo: {
      blockExplorer: 'https://edgscan.ink',
      crowdloanUrl: '',
      currentProvider: 'Commonwealth Labs',
      providers: {
        'Commonwealth Labs': 'wss://mainnet2.edgewa.re',
        Dwellir: 'wss://edgeware-rpc.dwellir.com',
        JelliedOwl: 'wss://edgeware.jelliedowl.net',
      },
      slug: 'edgeware',
    },
    mode: 'update',
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: '',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'wss://wss-testnet.5ire.network' },
      blockExplorer: 'https://explorer.5ire.network/',
      crowdloanUrl: '',
      symbol: '5IRE',
      chainType: 'Substrate',
      name: 'Thunder Testnet',
      priceId: '5ire',
    },
    chainSpec: {
      genesisHash: '0x8b62eb793be6ac641ec0e9ff33ba83a8e2d2a7b569f41e24956a8404d6cbaf35',
      decimals: 18,
      addressPrefix: 42,
      paraId: 0,
      evmChainId: 997,
      existentialDeposit: '10000000000000',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: '5ire_testnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://rpc-testnet.5ire.network' },
      blockExplorer: 'https://5irescan.live',
      crowdloanUrl: '',
      symbol: '5ire',
      chainType: 'EVM',
      name: '5ireChain Thunder',
      priceId: '5ire',
    },
    chainSpec: {
      genesisHash: '0x8b62eb793be6ac641ec0e9ff33ba83a8e2d2a7b569f41e24956a8404d6cbaf35',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 997,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'edgeware_evm',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://edgeware-evm.jelliedowl.net' },
      blockExplorer: 'https://edgscan.live',
      crowdloanUrl: '',
      symbol: 'EDG',
      chainType: 'EVM',
      name: 'Edgeware EVM',
      priceId: 'edgeware',
    },
    chainSpec: {
      genesisHash: '0x742a2ca70c2fda6cee4f8df98d64c4c670a052d9568058982dad9d5a7a135c5b',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 2021,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'beresheet_evm',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://beresheet-evm.jelliedowl.net' },
      blockExplorer: 'https://testnet.edgscan.live',
      crowdloanUrl: '',
      symbol: 'EDG',
      chainType: 'EVM',
      name: 'Beresheet EVM',
      priceId: 'edgeware',
    },
    chainSpec: {
      genesisHash: '0x8da6a03e0989154ff8c1977cbc0cbd55f6879d8759c272a4f3c078cef794bf5f',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 2022,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'palm_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://palm-mainnet.public.blastapi.io' },
      blockExplorer: 'https://explorer.palm.io/',
      crowdloanUrl: '',
      symbol: 'PALM',
      chainType: 'EVM',
      name: 'Palm EVM',
      priceId: 'palm',
    },
    chainSpec: {
      genesisHash: '0x53e7a791805a1bc24788fb99e1c1c42dcbf84f3e30be94fb2907709ee19fbb14',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 11297108109,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'avalanche_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc' },
      blockExplorer: 'https://snowtrace.io',
      crowdloanUrl: '',
      symbol: 'AVAX',
      chainType: 'EVM',
      name: 'Avalanche C-Chain',
      priceId: 'avalanche',
    },
    chainSpec: {
      genesisHash: '0x31ced5b9beb7f8782b014660da0cb18cc409f121f408186886e1ca3e8eeca96b',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 43114,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'fantom_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://fantom-mainnet.public.blastapi.io' },
      blockExplorer: 'https://ftmscan.com',
      crowdloanUrl: '',
      symbol: 'FTM',
      chainType: 'EVM',
      name: 'Fantom Mainnet',
      priceId: 'fantom',
    },
    chainSpec: {
      genesisHash: '0x00000000000003e83fddf1e9330f0a8691d9f0b2af57b38c3bb85488488a40df',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 250,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'aurora_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://aurora-mainnet.infura.io/v3/ad9312ce634f4d1983ac0e7c035cba2d' },
      blockExplorer: 'https://explorer.aurora.dev/',
      crowdloanUrl: '',
      symbol: 'AETH',
      chainType: 'EVM',
      name: 'Aurora Mainnet',
      priceId: 'ethereum',
    },
    chainSpec: {
      genesisHash: '0x8058d7fe544fdcac6836faa5f84c68291da1773594216957374708a7109a6336',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 1313161554,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'celo_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://celo-mainnet.infura.io/v3/ad9312ce634f4d1983ac0e7c035cba2d' },
      blockExplorer: 'https://explorer.celo.org',
      crowdloanUrl: '',
      symbol: 'CELO',
      chainType: 'EVM',
      name: 'Celo Mainnet',
      priceId: 'celo',
    },
    chainSpec: {
      genesisHash: '0x19ea3339d3c8cda97235bc8293240d5b9dadcdfbb5d4b0b90ee731cac1bd11c3',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 42220,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'gnosis_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://gnosis-mainnet.public.blastapi.io' },
      blockExplorer: 'https://gnosisscan.io/',
      crowdloanUrl: '',
      symbol: 'XDAI',
      chainType: 'EVM',
      name: 'Gnosis Mainnet',
      priceId: 'xdai',
    },
    chainSpec: {
      genesisHash: '0x4f1dd23188aab3a76b463e4af801b52b1248ef073c648cbdc4c9333d3da79756',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 100,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'aptos_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://aptos-mainnet.public.blastapi.io' },
      blockExplorer: 'https://explorer.aptoslabs.com/',
      crowdloanUrl: '',
      symbol: 'APT',
      chainType: 'EVM',
      name: 'Aptos Mainnet',
      priceId: 'aptos',
    },
    chainSpec: {
      genesisHash: '0xf650d76ea0a3176f0412b7e6bea5eb6fbf1d7adb0c39ab18e378adefb9247309',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 1,
      existentialDeposit: '0',
    },
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
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'arbitrum_nova_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://arbitrum-nova.public.blastapi.io' },
      blockExplorer: 'https://nova-explorer.arbitrum.io/',
      crowdloanUrl: '',
      symbol: 'ETH',
      chainType: 'EVM',
      name: 'Arbitrum Nova',
      priceId: 'ethereum',
    },
    chainSpec: {
      genesisHash: '0x2ad24e03026118f9b3a48626f0636e38c93660e90a6812e853a99aa8c5371561',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 42170,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'dapps_1.x',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://dapps.shardeum.org' },
      blockExplorer: 'https://explorer-dapps.shardeum.org',
      crowdloanUrl: '',
      symbol: 'SHM',
      chainType: 'EVM',
      name: 'Shardeum Sphinx Dapp 1.X',
      priceId: 'shardeum',
    },
    chainSpec: {
      genesisHash: '0xbe24b69315f537f47d2ac573f4913e937a852e3123abb21ee793ff9be0a8e980',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 8081,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'linea',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://linea-mainnet.infura.io/v3/9acab0738fcc4f959fca4f91ab73c495' },
      blockExplorer: 'https://lineascan.build/',
      crowdloanUrl: '',
      symbol: 'ETH',
      chainType: 'EVM',
      name: 'Linea Mainnet',
      priceId: 'ethereum',
    },
    chainSpec: {
      genesisHash: '0xb6762a65689107b2326364aefc18f94cda413209fab35c00d4af51eaa20ffbc6',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 59144,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'zeta_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://zeta.rpcgrid.com' },
      blockExplorer: 'https://zetachain.blockscout.com',
      crowdloanUrl: '',
      symbol: 'ZETA',
      chainType: 'EVM',
      name: 'Zetachain',
      priceId: 'zetachain',
    },
    chainSpec: {
      genesisHash: '0x60da6194a8e29e0e36c74544037918dd7a3a8a406f8e9f24d37c79623ee69690',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 7000,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'mantle_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://rpc.mantle.xyz' },
      blockExplorer: 'https://explorer.mantle.xyz',
      crowdloanUrl: '',
      symbol: 'MNT',
      chainType: 'EVM',
      name: 'Mantle Mainnet',
      priceId: 'mantle',
    },
    chainSpec: {
      genesisHash: '0xcba4c2424de0e27745ebb24c53d79ddd8ded25aa7dbd14405e70aa5c194191dc',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 5000,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'manta_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://pacific-rpc.manta.network/http' },
      blockExplorer: 'https://pacific-explorer.manta.network/',
      crowdloanUrl: '',
      symbol: 'ETH',
      chainType: 'EVM',
      name: 'Manta Pacific',
      priceId: 'ethereum',
    },
    chainSpec: {
      genesisHash: '0x72750db7b1513920067f27f3074cdd25f07c9a7461c20bcb313ec71bda741327',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 169,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'root_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://root.rootnet.live/ ' },
      blockExplorer: 'https://explorer.rootnet.live/',
      crowdloanUrl: '',
      symbol: 'XRP',
      chainType: 'EVM',
      name: 'Root Network',
      priceId: 'xrp',
    },
    chainSpec: {
      genesisHash: '0x046e7cb5cdfee1b96e7bd59e051f80aeba61b030ce8c9275446e0209704fd338',
      decimals: 6,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 7668,
      existentialDeposit: '0',
    },
  },
  {
    mode: 'insert',
    chainEditInfo: {
      slug: 'neon_mainnet',
      currentProvider: 'DfinnProvider',
      providers: { DfinnProvider: 'https://neon-proxy-mainnet.solana.p2p.org' },
      blockExplorer: 'https://neonscan.org',
      crowdloanUrl: '',
      symbol: 'NEON',
      chainType: 'EVM',
      name: 'Neon Mainnet',
      priceId: 'neon',
    },
    chainSpec: {
      genesisHash: '0xa8adff68131a25801bd2f6a6db0706d2f057f3546cd6abcb7a99952926e35d68',
      decimals: 18,
      addressPrefix: 0,
      paraId: 0,
      evmChainId: 245022934,
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
