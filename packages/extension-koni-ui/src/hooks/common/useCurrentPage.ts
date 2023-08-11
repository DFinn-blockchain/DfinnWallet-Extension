// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CURRENT_PAGE } from '@subwallet/extension-koni-ui/constants/localStorage';
import { useLocalStorage } from 'usehooks-ts';

const useCurrentPage = () => {
  return useLocalStorage<string>(CURRENT_PAGE, '/');
};

export default useCurrentPage;