// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { YieldCompoundingPeriod, YieldPoolInfo, YieldPoolType } from '@subwallet/extension-base/background/KoniTypes';
import { calculateReward } from '@subwallet/extension-base/koni/api/yield';
import { _getSubstrateGenesisHash, _isChainEvmCompatible } from '@subwallet/extension-base/services/chain-service/utils';
import { EarningCalculatorModal, EarningItem, EarningToolbar, EmptyList } from '@subwallet/extension-koni-ui/components';
import EarningInfoModal from '@subwallet/extension-koni-ui/components/Modal/Earning/EarningInfoModal';
import { BN_TEN, CREATE_RETURN, DEFAULT_ROUTER_PATH, DEFAULT_YIELD_PARAMS, EARNING_INFO_MODAL, STAKING_CALCULATOR_MODAL, YIELD_TRANSACTION } from '@subwallet/extension-koni-ui/constants';
import { useFilterModal, useTranslation } from '@subwallet/extension-koni-ui/hooks';
import { RootState } from '@subwallet/extension-koni-ui/stores';
import { ThemeProps } from '@subwallet/extension-koni-ui/types';
import { isAccountAll } from '@subwallet/extension-koni-ui/utils';
import { ModalContext, SwList } from '@subwallet/react-ui';
import BigN from 'bignumber.js';
import CN from 'classnames';
import { Vault } from 'phosphor-react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

import { isEthereumAddress } from '@polkadot/util-crypto';

type Props = ThemeProps;

const FILTER_MODAL_ID = 'earning-filter-modal';

enum SortKey {
  TOTAL_VALUE = 'total-value',
  APY = 'apy',
  INCENTIVE = 'incentive'
}

interface SortOption {
  label: string;
  value: SortKey;
  desc: boolean;
}

const Component: React.FC<Props> = (props: Props) => {
  const { className } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { poolInfo } = useSelector((state: RootState) => state.yieldPool);
  const { currentAccount, isNoAccount } = useSelector((state: RootState) => state.accountState);
  const { chainInfoMap, chainStateMap } = useSelector((state: RootState) => state.chainStore);
  const { assetRegistry } = useSelector((state: RootState) => state.assetRegistry);

  const { activeModal } = useContext(ModalContext);

  const sortOptions = useMemo((): SortOption[] => {
    return [
      {
        desc: true,
        label: t('Total value staked'),
        value: SortKey.TOTAL_VALUE
      },
      {
        desc: true,
        label: t('APY'),
        value: SortKey.APY
      },
      {
        desc: true,
        label: t('Incentive'),
        value: SortKey.INCENTIVE
      }
    ];
  }, [t]);

  const [selectedItem, setSelectedItem] = useState<YieldPoolInfo | undefined>(undefined);
  const [sortSelection, setSortSelection] = useState<SortKey>(SortKey.TOTAL_VALUE);
  const { filterSelectionMap, onApplyFilter, onChangeFilterOption, onCloseFilterModal, selectedFilters } = useFilterModal(FILTER_MODAL_ID);
  const [, setYieldStorage] = useLocalStorage(YIELD_TRANSACTION, DEFAULT_YIELD_PARAMS);
  const [, setReturnStorage] = useLocalStorage(CREATE_RETURN, DEFAULT_ROUTER_PATH);

  const onChangeSortOpt = useCallback((value: string) => {
    setSortSelection(value as SortKey);
  }, []);

  const onResetSort = useCallback(() => {
    setSortSelection(SortKey.TOTAL_VALUE);
  }, []);

  const filterFunction = useMemo<(item: YieldPoolInfo) => boolean>(() => {
    return (item) => {
      if (!selectedFilters.length) {
        return true;
      }

      for (const filter of selectedFilters) {
        if (filter === '') {
          return true;
        }

        if (filter === YieldPoolType.NOMINATION_POOL) {
          if (item.type === YieldPoolType.NOMINATION_POOL) {
            return true;
          }
        } else if (filter === YieldPoolType.NATIVE_STAKING) {
          if (item.type === YieldPoolType.NATIVE_STAKING) {
            return true;
          }
        } else if (filter === YieldPoolType.LIQUID_STAKING) {
          if (item.type === YieldPoolType.LIQUID_STAKING) {
            return true;
          }
        } else if (filter === YieldPoolType.LENDING) {
          if (item.type === YieldPoolType.LENDING) {
            return true;
          }
        } else if (filter === YieldPoolType.PARACHAIN_STAKING) {
          if (item.type === YieldPoolType.PARACHAIN_STAKING) {
            return true;
          }
        } else if (filter === YieldPoolType.SINGLE_FARMING) {
          if (item.type === YieldPoolType.SINGLE_FARMING) {
            return true;
          }
        }
      }

      return false;
    };
  }, [selectedFilters]);

  const onClickCalculatorBtn = useCallback((item: YieldPoolInfo) => {
    return () => {
      setSelectedItem(item);
      activeModal(STAKING_CALCULATOR_MODAL);
    };
  }, [activeModal]);

  const onClickInfoBtn = useCallback((item: YieldPoolInfo) => {
    return () => {
      setSelectedItem(item);
      activeModal(EARNING_INFO_MODAL);
    };
  }, [activeModal]);

  const onClickStakeBtn = useCallback((item: YieldPoolInfo) => {
    return () => {
      if (isNoAccount) {
        setReturnStorage('/home/earning/');
        navigate('/welcome');
      } else {
        setSelectedItem(item);
        const address = currentAccount ? isAccountAll(currentAccount.address) ? '' : currentAccount.address : '';

        setYieldStorage({
          ...DEFAULT_YIELD_PARAMS,
          method: item.slug,
          from: address,
          chain: item.chain,
          asset: item.inputAssets[0]
        });

        navigate('/transaction/earn');
      }
    };
  }, [currentAccount, isNoAccount, navigate, setReturnStorage, setYieldStorage]);

  const renderEarningItem = useCallback((item: YieldPoolInfo) => {
    return (
      <EarningItem
        item={item}
        key={item.slug}
        onClickCalculatorBtn={onClickCalculatorBtn(item)}
        onClickInfoBtn={onClickInfoBtn(item)}
        onClickStakeBtn={onClickStakeBtn(item)}
      />
    );
  }, [onClickCalculatorBtn, onClickInfoBtn, onClickStakeBtn]);

  const resultList = useMemo((): YieldPoolInfo[] => {
    return [...Object.values(poolInfo)]
      .filter((value) => {
        if (!chainStateMap[value.chain].active) {
          return false;
        }

        if (!currentAccount) {
          return true;
        }

        const availableGen: string[] = currentAccount.availableGenesisHashes || [];
        const isEvmAddress = isEthereumAddress(currentAccount.address);
        const chain = chainInfoMap[value.chain];

        if (isEvmAddress !== _isChainEvmCompatible(chain)) {
          return false;
        }

        if (currentAccount?.isHardware) {
          if (isEvmAddress) {
            return false;
          } else {
            if (chain && !availableGen.includes(_getSubstrateGenesisHash(chain))) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a: YieldPoolInfo, b: YieldPoolInfo) => {
        const aInputSlug = a.inputAssets[0];
        const aInputAsset = assetRegistry[aInputSlug];
        const aInputDecimals = aInputAsset.decimals || 0;
        const aTotalValue = new BigN(a.stats?.tvl || '0').div(BN_TEN.pow(aInputDecimals));
        const aTotalApy = a.stats?.totalApy ?? calculateReward(a.stats?.totalApr || 0, 0, YieldCompoundingPeriod.YEARLY).apy ?? 0;

        const bInputSlug = b.inputAssets[0];
        const bInputAsset = assetRegistry[bInputSlug];
        const bInputDecimals = bInputAsset.decimals || 0;
        const bTotalValue = new BigN(b.stats?.tvl || '0').div(BN_TEN.pow(bInputDecimals));
        const bTotalApy = b.stats?.totalApy ?? calculateReward(b.stats?.totalApr || 0, 0, YieldCompoundingPeriod.YEARLY).apy ?? 0;

        switch (sortSelection) {
          case SortKey.TOTAL_VALUE:
            return new BigN(bTotalValue).minus(aTotalValue).toNumber();

          case SortKey.APY:
            return bTotalApy - aTotalApy;

          default:
            return 0;
        }
      });
  }, [assetRegistry, chainInfoMap, chainStateMap, currentAccount, poolInfo, sortSelection]);

  const renderWhenEmpty = useCallback(() => {
    return (
      <EmptyList
        emptyMessage={t('Try turning on networks or switch to another account')}
        emptyTitle={t('No earning pools found')}
        phosphorIcon={Vault}
      />
    );
  }, [t]);

  return (
    <div className={className}>
      <EarningToolbar
        filterSelectionMap={filterSelectionMap}
        onApplyFilter={onApplyFilter}
        onChangeFilterOption={onChangeFilterOption}
        onChangeSortOpt={onChangeSortOpt}
        onCloseFilterModal={onCloseFilterModal}
        onResetSort={onResetSort}
        selectedFilters={selectedFilters}
        selectedSort={sortSelection}
        sortOptions={sortOptions}
      />
      <SwList.Section
        className={CN('nft_collection_list__container')}
        displayGrid={true}
        enableSearchInput={false}
        filterBy={filterFunction}
        gridGap={'14px'}
        list={resultList}
        minColumnWidth={'384px'}
        renderItem={renderEarningItem}
        renderOnScroll={true}
        renderWhenEmpty={renderWhenEmpty}
        searchMinCharactersCount={2}
      />

      {selectedItem && <EarningCalculatorModal defaultItem={selectedItem} />}
      {selectedItem && <EarningInfoModal defaultItem={selectedItem} />}
    </div>
  );
};

const EarningOverviewContent = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return ({
    '.ant-sw-list-wrapper': {
      marginLeft: -token.margin,
      marginRight: -token.margin,
      flexBasis: 'auto'
    },

    '.earning-filter-icon': {
      width: '12px',
      height: '12px'
    },

    '.earning-wrapper': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: token.padding
    }
  });
});

export default EarningOverviewContent;