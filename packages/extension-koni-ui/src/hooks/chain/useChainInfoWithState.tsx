// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { _ChainInfo, _ChainStatus } from '@subwallet/chain-list/types';
import { _ChainState } from '@subwallet/extension-base/services/chain-service/types';
import { CustomLogoMap } from '@subwallet/extension-koni-ui/extras/TokenMap';
import { RootState } from '@subwallet/extension-koni-ui/stores';
import { updateLogoMaps } from '@subwallet/extension-koni-ui/stores/utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type ChainInfoWithState = _ChainInfo & _ChainState;

export default function useChainInfoWithState ({ filterStatus = true } = {} as {filterStatus?: boolean}): ChainInfoWithState[] {
  const chainInfoMap = useSelector((state: RootState) => state.chainStore.chainInfoMap);
  const chainStateMap = useSelector((state: RootState) => state.chainStore.chainStateMap);
  const logoMaps = useSelector((state: RootState) => state.settings.logoMaps);

  const chainInfoList: ChainInfoWithState[] = useMemo(() => {
    const updatedLogoMaps = { ...logoMaps };
    const rs = Object.values(chainInfoMap).map((item) => {
      const newItem = { ...item };

      if (newItem.slug.includes('custom')) {
        newItem.icon = CustomLogoMap[newItem.slug];
        updatedLogoMaps.chainLogoMap = {
          [newItem.slug]: CustomLogoMap[newItem.slug]
        };
        updateLogoMaps(updatedLogoMaps);
      }

      const newState = chainStateMap[newItem.slug] || {};

      return { ...newItem, ...newState };
    });

    if (filterStatus) {
      return rs.filter((item) => item.chainStatus === _ChainStatus.ACTIVE);
    } else {
      return rs;
    }
  }, [chainInfoMap, chainStateMap, filterStatus]);

  return chainInfoList;
}
