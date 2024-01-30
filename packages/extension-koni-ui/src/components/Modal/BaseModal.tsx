// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ScreenContext } from '@subwallet/extension-koni-ui/contexts/ScreenContext';
import { ThemeProps } from '@subwallet/extension-koni-ui/types';
import { SwModal } from '@subwallet/react-ui';
import { SwModalProps } from '@subwallet/react-ui/es/sw-modal/SwModal';
import CN from 'classnames';
import React, { useContext } from 'react';
import styled from 'styled-components';

type Props = ThemeProps &
  SwModalProps & {
    fullSizeOnMobile?: boolean;
    center?: boolean;
  };

function Component({ center, children, className, fullSizeOnMobile, motion, width, ...props }: Props): React.ReactElement<Props> {
  const { isWebUI } = useContext(ScreenContext);

  const _motion = motion || (isWebUI && !center ? 'move-right' : undefined);
  const _width = width || (center ? (!isWebUI ? '100%' : undefined) : '100%');

  return (
    <SwModal
      {...props}
      className={CN(className, {
        '-desktop': isWebUI && !center,
        '-mobile': !isWebUI,
        '-full-size-on-mobile': fullSizeOnMobile
      })}
      motion={_motion}
      width={_width}
    >
      {children}
    </SwModal>
  );
}

export const BaseModal = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    '.ant-sw-modal-content.ant-sw-modal-content': {
      width: '100%',
      borderRadius: '32px !important'
    },

    '.ant-web3-block': {
      '& div:hover': {
        backgroundImage: 'none !important'
      }
    },

    '.ant-setting-item, .wallet-item, .ant-web3-block': {
      backgroundImage: 'radial-gradient(113.12% 113.12% at 50.52% 50.52%, #292929 0%, #000 100%)',
      backgroundColor: 'transparent',
      borderRadius: '32px !important',
      transition: 'background-image, transform 0.3s ease',
      ':hover': {
        // backgroundImage: 'radial-gradient(113.12% 113.12% at 50.52% 50.52%, #3d3d3d 0%, #111 100%) !important',
        borderRadius: '32px !important'
      }
    },

    '.wallet-item': {
      paddingRight: '0px !important'
    },

    '.ant-web3-block-right-item': {
      marginRight: '8px'
    },

    '&.-desktop': {
      left: 'auto',
      right: token.paddingLG,
      bottom: token.paddingLG,
      top: token.paddingLG,
      maxWidth: 404,
      animationDuration: '0.45s',
      '.ant-sw-modal-content': {
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        paddingLeft: token.paddingLG,
        paddingRight: token.paddingLG,
        borderRadius: '8px 0 0 8px'
      },

      '.ant-sw-list-section .ant-sw-list-wrapper': {
        flexBasis: 'auto'
      }
    },

    '&.-mobile': {
      justifyContent: 'flex-end',

      '.ant-sw-modal-content': {
        maxHeight: '95%'
      }
    },

    '&.-mobile.-full-size-on-mobile': {
      '.ant-sw-modal-content': {
        height: '100%',
        maxHeight: '100%',
        borderRadius: 0
      }
    }
  };
});
