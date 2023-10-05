// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NominatorMetadata, YieldPoolInfo, YieldPoolType, YieldPositionInfo } from '@subwallet/extension-base/background/KoniTypes';
import { isSameAddress } from '@subwallet/extension-base/utils';
import { EarningCalculatorModal, EarningToolbar, EmptyList, HorizontalEarningItem, Layout } from '@subwallet/extension-koni-ui/components';
import YieldPositionDetailModal from '@subwallet/extension-koni-ui/components/Modal/Earning/YieldPositionDetailModal';
import YieldStakingDetailModal from '@subwallet/extension-koni-ui/components/Modal/Earning/YieldStakingDetailModal';
import { CANCEL_UN_YIELD_TRANSACTION, DEFAULT_CANCEL_UN_YIELD_PARAMS, DEFAULT_UN_YIELD_PARAMS, DEFAULT_WITHDRAW_YIELD_PARAMS, DEFAULT_YIELD_PARAMS, STAKING_CALCULATOR_MODAL, UN_YIELD_TRANSACTION, WITHDRAW_YIELD_TRANSACTION, YIELD_POSITION_DETAIL_MODAL, YIELD_STAKING_DETAIL_MODAL, YIELD_TRANSACTION } from '@subwallet/extension-koni-ui/constants';
import { BaseModal, EarningCalculatorModal, EarningManagementDetailModal, EarningToolbar, EmptyList, HorizontalEarningItem, Layout } from '@subwallet/extension-koni-ui/components';
import EarningInfoModal from '@subwallet/extension-koni-ui/components/Modal/Earning/EarningInfoModal';
import YieldStakingDetailModal from '@subwallet/extension-koni-ui/components/Modal/Earning/YieldPositionDetailModal';
import { CANCEL_UN_YIELD_TRANSACTION, DEFAULT_CANCEL_UN_YIELD_PARAMS, DEFAULT_FAST_WITHDRAW_YIELD_PARAMS, DEFAULT_UN_YIELD_PARAMS, DEFAULT_WITHDRAW_YIELD_PARAMS, DEFAULT_YIELD_PARAMS, EARNING_INFO_MODAL, FAST_WITHDRAW_YIELD_TRANSACTION, STAKING_CALCULATOR_MODAL, TRANSACTION_YIELD_CANCEL_UNSTAKE_MODAL, TRANSACTION_YIELD_FAST_WITHDRAW_MODAL, TRANSACTION_YIELD_UNSTAKE_MODAL, TRANSACTION_YIELD_WITHDRAW_MODAL, UN_YIELD_TRANSACTION, WITHDRAW_YIELD_TRANSACTION, YIELD_POSITION_DETAIL_MODAL, YIELD_STAKING_DETAIL_MODAL, YIELD_TRANSACTION } from '@subwallet/extension-koni-ui/constants';
import { ScreenContext } from '@subwallet/extension-koni-ui/contexts/ScreenContext';
import { useFilterModal, useTranslation } from '@subwallet/extension-koni-ui/hooks';
import { RootState } from '@subwallet/extension-koni-ui/stores';
import { ThemeProps } from '@subwallet/extension-koni-ui/types';
import { isAccountAll } from '@subwallet/extension-koni-ui/utils';
import { ModalContext, SwList } from '@subwallet/react-ui';
import CN from 'classnames';
import { Vault } from 'phosphor-react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

import Transaction from '../../Transaction/Transaction';
import YieldCancelUnstake from '../../Transaction/variants/Yield/YieldCancelUnstake';
import YieldUnstake from '../../Transaction/variants/Yield/YieldUnstake';
import YieldWithdraw from '../../Transaction/variants/Yield/YieldWithdraw';
import YieldWithdrawPosition from '../../Transaction/variants/Yield/YieldWithdrawPosition';

type Props = ThemeProps;

const FILTER_MODAL_ID = 'earning-filter-modal';

enum SortKey {
  TOTAL_VALUE = 'total-value',
}

const Component: React.FC<Props> = (props: Props) => {
  const { className } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { poolInfo: poolInfoMap, yieldPosition: yieldPositionList } = useSelector((state: RootState) => state.yieldPool);
  const { currentAccount } = useSelector((state: RootState) => state.accountState);

  const { activeModal, inactiveModal } = useContext(ModalContext);
  const { isWebUI } = useContext(ScreenContext);

  const [{ selectedYieldPoolInfo, selectedYieldPosition }, setSelectedItem] = useState<{ selectedYieldPosition: YieldPositionInfo | undefined, selectedYieldPoolInfo: YieldPoolInfo | undefined }>({ selectedYieldPosition: undefined, selectedYieldPoolInfo: undefined });
  const [sortSelection, setSortSelection] = useState<SortKey>(SortKey.TOTAL_VALUE);
  const { filterSelectionMap, onApplyFilter, onChangeFilterOption, onCloseFilterModal, selectedFilters } = useFilterModal(FILTER_MODAL_ID);

  const [, setYieldStorage] = useLocalStorage(YIELD_TRANSACTION, DEFAULT_YIELD_PARAMS);
  const [, setUnYieldStorage] = useLocalStorage(UN_YIELD_TRANSACTION, DEFAULT_UN_YIELD_PARAMS);
  const [, setCancelUnYieldStorage] = useLocalStorage(CANCEL_UN_YIELD_TRANSACTION, DEFAULT_CANCEL_UN_YIELD_PARAMS);
  const [, setWithdrawStorage] = useLocalStorage(WITHDRAW_YIELD_TRANSACTION, DEFAULT_WITHDRAW_YIELD_PARAMS);
  const [, setFastWithdrawStorage] = useLocalStorage(FAST_WITHDRAW_YIELD_TRANSACTION, DEFAULT_FAST_WITHDRAW_YIELD_PARAMS);

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

  const onChangeSortOpt = useCallback((value: string) => {
    setSortSelection(value as SortKey);
  }, []);

  const onResetSort = useCallback(() => {
    setSortSelection(SortKey.TOTAL_VALUE);
  }, []);

  const onClickCalculatorBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });
      activeModal(STAKING_CALCULATOR_MODAL);
    };
  }, [activeModal, poolInfoMap]);

  const onClickInfoBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });
      activeModal(EARNING_INFO_MODAL);
    };
  }, [activeModal, poolInfoMap]);

  const onClickStakeBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });

      const address = currentAccount ? isAccountAll(currentAccount.address) ? '' : currentAccount.address : '';

      setYieldStorage({
        ...DEFAULT_YIELD_PARAMS,
        method: poolInfo.slug,
        from: address,
        chain: poolInfo.chain,
        asset: poolInfo.inputAssets[0]
      });

      navigate('/transaction/earn');
    };
  }, [currentAccount, navigate, poolInfoMap, setYieldStorage]);

  const onClickUnStakeBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });

      const address = currentAccount ? isAccountAll(currentAccount.address) ? '' : currentAccount.address : '';

      setUnYieldStorage({
        ...DEFAULT_UN_YIELD_PARAMS,
        from: address,
        chain: poolInfo.chain,
        method: poolInfo.slug,
        asset: poolInfo.inputAssets[0]
      });

      if (isWebUI) {
        activeModal(TRANSACTION_YIELD_UNSTAKE_MODAL);
      } else {
        navigate('/transaction/un-yield');
      }
    };
  }, [activeModal, currentAccount, isWebUI, navigate, poolInfoMap, setUnYieldStorage]);

  const onClickCancelUnStakeBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });

      const address = currentAccount ? isAccountAll(currentAccount.address) ? '' : currentAccount.address : '';

      setCancelUnYieldStorage({
        ...DEFAULT_CANCEL_UN_YIELD_PARAMS,
        from: address,
        chain: poolInfo.chain,
        method: poolInfo.slug,
        asset: poolInfo.inputAssets[0]
      });

      if (isWebUI) {
        activeModal(TRANSACTION_YIELD_CANCEL_UNSTAKE_MODAL);
      } else {
        navigate('/transaction/cancel-un-yield');
      }
    };
  }, [activeModal, currentAccount, isWebUI, navigate, poolInfoMap, setCancelUnYieldStorage]);

  const onClickWithdrawBtn = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });

      const address = currentAccount ? isAccountAll(currentAccount.address) ? '' : currentAccount.address : '';

      const isStaking = [YieldPoolType.NATIVE_STAKING, YieldPoolType.NOMINATION_POOL].includes(poolInfo.type);

      if (isStaking) {
        setWithdrawStorage({
          ...DEFAULT_WITHDRAW_YIELD_PARAMS,
          from: address,
          chain: poolInfo.chain,
          method: poolInfo.slug,
          asset: poolInfo.inputAssets[0]
        });

        if (isWebUI) {
          activeModal(TRANSACTION_YIELD_WITHDRAW_MODAL);
        } else {
          navigate('/transaction/withdraw-yield');
        }
      } else {
        setFastWithdrawStorage({
          ...DEFAULT_FAST_WITHDRAW_YIELD_PARAMS,
          from: address,
          chain: poolInfo.chain,
          method: poolInfo.slug,
          asset: poolInfo.inputAssets[0]
        });

        if (isWebUI) {
          activeModal(TRANSACTION_YIELD_FAST_WITHDRAW_MODAL);
        } else {
          navigate('/transaction/yield-withdraw-position');
        }
      }
    };
  }, [activeModal, currentAccount, isWebUI, navigate, poolInfoMap, setFastWithdrawStorage, setWithdrawStorage]);

  const onClickItem = useCallback((item: YieldPositionInfo) => {
    return () => {
      const poolInfo = poolInfoMap[item.slug];

      setSelectedItem({ selectedYieldPosition: item, selectedYieldPoolInfo: poolInfo });

      if (selectedYieldPoolInfo && [YieldPoolType.NATIVE_STAKING, YieldPoolType.NOMINATION_POOL].includes(selectedYieldPoolInfo.type)) {
        activeModal(YIELD_STAKING_DETAIL_MODAL);
      } else {
        activeModal(YIELD_POSITION_DETAIL_MODAL);
      }
    };
  }, [activeModal, poolInfoMap, selectedYieldPoolInfo]);

  const renderEarningItem = useCallback((item: YieldPositionInfo) => {
    const poolInfo = poolInfoMap[item.slug];
    const key = [item.slug, item.address].join('-');

    return (
      <HorizontalEarningItem
        key={key}
        onClickCalculatorBtn={onClickCalculatorBtn(item)}
        onClickCancelUnStakeBtn={onClickCancelUnStakeBtn(item)}
        onClickInfoBtn={onClickInfoBtn(item)}
        onClickItem={onClickItem(item)}
        onClickStakeBtn={onClickStakeBtn(item)}
        onClickUnStakeBtn={onClickUnStakeBtn(item)}
        onClickWithdrawBtn={onClickWithdrawBtn(item)}
        yieldPoolInfo={poolInfo}
        yieldPositionInfo={item}
      />
    );
  }, [poolInfoMap, onClickCalculatorBtn, onClickCancelUnStakeBtn, onClickInfoBtn, onClickItem, onClickStakeBtn, onClickUnStakeBtn, onClickWithdrawBtn]);

  const resultList = useMemo((): YieldPositionInfo[] => {
    return [...yieldPositionList]
      .filter((item) => {
        const address = currentAccount?.address || '';
        const isAll = isAccountAll(address);

        if (isAll) {
          return true;
        } else {
          return isSameAddress(address, item.address);
        }
      })
      .sort((a: YieldPositionInfo, b: YieldPositionInfo) => {
        const aPoolInfo = poolInfoMap[a.slug];
        const bPoolInfo = poolInfoMap[b.slug];

        switch (sortSelection) {
          case SortKey.TOTAL_VALUE:
            if (aPoolInfo.stats && bPoolInfo.stats && aPoolInfo.stats.tvl && bPoolInfo.stats.tvl) {
              return parseFloat(aPoolInfo.stats.tvl) - parseFloat(bPoolInfo.stats.tvl);
            } else {
              return 0;
            }

          default:
            return 0;
        }
      });
  }, [yieldPositionList, currentAccount?.address, poolInfoMap, sortSelection]);

  const renderWhenEmpty = useCallback(() => {
    return (
      <EmptyList
        emptyMessage={t('Need message')}
        emptyTitle={t('Need message')}
        phosphorIcon={Vault}
      />
    );
  }, [t]);

  const handleCloseUnstake = useCallback(() => {
    inactiveModal(TRANSACTION_YIELD_UNSTAKE_MODAL);
  }, [inactiveModal]);

  const handleCloseCancelUnstake = useCallback(() => {
    inactiveModal(TRANSACTION_YIELD_CANCEL_UNSTAKE_MODAL);
  }, [inactiveModal]);

  const handleCloseWithdraw = useCallback(() => {
    inactiveModal(TRANSACTION_YIELD_WITHDRAW_MODAL);
  }, [inactiveModal]);

  const handleCloseFastWithdraw = useCallback(() => {
    inactiveModal(TRANSACTION_YIELD_FAST_WITHDRAW_MODAL);
  }, [inactiveModal]);

  return (
    <Layout.Base
      className={className}
      showSubHeader={true}
      subHeaderBackground={'transparent'}
      subHeaderCenter={false}
      // subHeaderIcons={subHeaderButton}
      subHeaderPaddingVertical={true}
      title={t('Earning')}
    >
      <EarningToolbar
        filterSelectionMap={filterSelectionMap}
        onApplyFilter={onApplyFilter}
        onChangeFilterOption={onChangeFilterOption}
        onChangeSortOpt={onChangeSortOpt}
        onCloseFilterModal={onCloseFilterModal}
        onResetSort={onResetSort}
        selectedFilters={selectedFilters}
        showAdd={true}
      />
      <SwList.Section
        className={CN('earning-management__container')}
        enableSearchInput={false}
        filterBy={filterFunction}
        list={resultList}
        renderItem={renderEarningItem}
        renderOnScroll={true}
        renderWhenEmpty={renderWhenEmpty}
        searchMinCharactersCount={2}
      />

      {selectedYieldPoolInfo && <EarningCalculatorModal defaultItem={selectedYieldPoolInfo} />}
      {selectedYieldPoolInfo && <EarningInfoModal defaultItem={selectedYieldPoolInfo} />}

      {
        selectedYieldPosition && selectedYieldPoolInfo && (
          [YieldPoolType.NOMINATION_POOL, YieldPoolType.NATIVE_STAKING].includes(selectedYieldPoolInfo.type)
            ? (
              <YieldStakingDetailModal
                nominatorMetadata={selectedYieldPosition.metadata as NominatorMetadata}
                yieldPoolInfo={selectedYieldPoolInfo}
              />
            )
            : (
              <YieldPositionDetailModal
                positionInfo={selectedYieldPosition}
                yieldPoolInfo={selectedYieldPoolInfo}
              />
            )
        )
      }
      <BaseModal
        className={'right-side-modal'}
        destroyOnClose={true}
        id={TRANSACTION_YIELD_UNSTAKE_MODAL}
        onCancel={handleCloseUnstake}
        title={t('Unbond')}
      >
        <Transaction
          modalContent={isWebUI}
        >
          <YieldUnstake />
        </Transaction>
      </BaseModal>
      <BaseModal
        className={'right-side-modal'}
        destroyOnClose={true}
        id={TRANSACTION_YIELD_CANCEL_UNSTAKE_MODAL}
        onCancel={handleCloseCancelUnstake}
        title={t('Cancel unstake')}
      >
        <Transaction
          modalContent={isWebUI}
        >
          <YieldCancelUnstake />
        </Transaction>
      </BaseModal>
      <BaseModal
        className={'right-side-modal'}
        destroyOnClose={true}
        id={TRANSACTION_YIELD_WITHDRAW_MODAL}
        onCancel={handleCloseWithdraw}
        title={t('Withdraw')}
      >
        <Transaction
          modalContent={isWebUI}
        >
          <YieldWithdraw />
        </Transaction>
      </BaseModal>
      <BaseModal
        className={'right-side-modal'}
        destroyOnClose={true}
        id={TRANSACTION_YIELD_FAST_WITHDRAW_MODAL}
        onCancel={handleCloseFastWithdraw}
        title={t('Withdraw')}
      >
        <Transaction
          modalContent={isWebUI}
        >
          <YieldWithdrawPosition />
        </Transaction>
      </BaseModal>
    </Layout.Base>
  );
};

const EarningManagement = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return ({
    display: 'flex',

    '.earning-management__container .ant-sw-list': {
      paddingLeft: 0,
      paddingRight: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding
    },

    '.earning-filter-icon': {
      width: '12px',
      height: '12px'
    }
  });
});

export default EarningManagement;