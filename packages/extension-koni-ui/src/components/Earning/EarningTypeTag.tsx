// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { YieldPoolType } from '@subwallet/extension-base/background/KoniTypes';
import { useTranslation } from '@subwallet/extension-koni-ui/hooks';
import { EarningTagType, ThemeProps } from '@subwallet/extension-koni-ui/types';
import { convertHexColorToRGBA } from '@subwallet/extension-koni-ui/utils';
import { Icon, Tag } from '@subwallet/react-ui';
import CN from 'classnames';
import { Medal, MegaphoneSimple } from 'phosphor-react';
import React, { useMemo } from 'react';
import styled from 'styled-components';

interface Props extends ThemeProps {
  type?: YieldPoolType;
  comingSoon?: boolean;
}

const Component: React.FC<Props> = (props: Props) => {
  const { className, comingSoon } = props;

  const { t } = useTranslation();

  const earningTag = useMemo((): EarningTagType =>
    comingSoon
      ? ({
        color: 'default',
        label: t('Coming soon'),
        icon: MegaphoneSimple,
        weight: 'fill',
        bgColor: ''
      })
      : ({
        color: 'lime',
        label: t('Exclusive rewards'),
        icon: Medal,
        weight: 'fill',
        bgColor: ''
      })
  , [comingSoon, t]);

  return (
    <Tag
      bgType={'default'}
      className={CN(className)}
      color={earningTag.color}
      icon={(
        <Icon
          phosphorIcon={earningTag.icon}
          weight={earningTag.weight}
        />
      )}
    >
      {earningTag.label}
    </Tag>
  );
};

const EarningTypeTag = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    '&.ant-tag-default': {
      backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1)
    }
  };
});

export default EarningTypeTag;
