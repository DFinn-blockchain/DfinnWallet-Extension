// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useSelector, useTranslation } from '@subwallet/extension-koni-ui/hooks';
import { reloadCron, saveShowBalance } from '@subwallet/extension-koni-ui/messaging';
import { ThemeProps } from '@subwallet/extension-koni-ui/types';
import { Button, Icon, Number, SwNumberProps, Tag, Typography } from '@subwallet/react-ui';
import CN from 'classnames';
import { ArrowDown, ArrowUpRight, Eye, EyeSlash, PaperPlaneTilt, PlusCircle, ShoppingCartSimple } from 'phosphor-react';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

type Props = ThemeProps & {
  totalValue: SwNumberProps['value'];
  totalChangeValue: SwNumberProps['value'];
  totalChangePercent: SwNumberProps['value'];
  isPriceDecrease: boolean;
  isShrink: boolean;
  onOpenSendFund: () => void;
  onOpenBuyTokens: () => void;
  onOpenReceive: () => void;
};

function Component (
  { className = '',
    isPriceDecrease,
    isShrink,
    onOpenBuyTokens,
    onOpenReceive,
    onOpenSendFund,
    totalChangePercent,
    totalChangeValue,
    totalValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isShowBalance } = useSelector((state) => state.settings);
  const [reloading, setReloading] = useState(false);

  const onChangeShowBalance = useCallback(() => {
    saveShowBalance(!isShowBalance).catch(console.error);
  }, [isShowBalance]);

  const reloadBalance = useCallback(() => {
    setReloading(true);
    reloadCron({ data: 'balance' })
      .catch(console.error)
      .finally(() => {
        setReloading(false);
      });
  }, []);

  return (
    <div className={`tokens-upper-block ${className} ${isShrink ? '-shrink' : ''}`}>
      <div className='__total-balance-value-container'>
        <div
          className='__total-balance-value-content'
          onClick={isShrink ? onChangeShowBalance : undefined}
        >
          <Number
            className={'__total-balance-value'}
            decimal={0}
            decimalOpacity={0.45}
            hide={!isShowBalance}
            intColor='black'
            prefix='$'
            size={38}
            subFloatNumber
            value={totalValue}
          />
        </div>
      </div>
      {!isShrink && (
        <div className={'__balance-change-container'}>
          <div onClick={onChangeShowBalance}>
            <Icon
              phosphorIcon={ !isShowBalance ? Eye : EyeSlash}
              iconColor='black'
              size='l'
            />
          </div>
          <Number
            className={'__balance-change-value'}
            decimal={0}
            decimalColor='black'
            decimalOpacity={1}
            hide={!isShowBalance}
            intColor='black'
            prefix={isPriceDecrease ? '- $' : '+ $'}
            value={totalChangeValue}
          />
          <Tag
            className={`__balance-change-percent ${isPriceDecrease ? '-decrease' : ''}`}
            shape={'round'}
          >
            <Number
              decimal={0}
              decimalOpacity={1}
              prefix={isPriceDecrease ? '-' : '+'}
              suffix={'%'}
              value={totalChangePercent}
              weight={700}
            />
          </Tag>
        </div>
      )}
      <div className={CN('__block-item')}>
        <div className={'__action-button-container'}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              icon={(
                <Icon
                  phosphorIcon={ArrowDown}
                  size={isShrink ? 'sm' : 'md' }
                  weight={'duotone'}
                />
              )}
              onClick={onOpenReceive}
              shape='squircle'
              size={isShrink ? 'xs' : 'md'}
              tooltip={t('Get address')}
            />
            <Typography.Text>{'Receive'}</Typography.Text>
          </div>
          <div className={'__button-space'} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              icon={(
                <Icon
                  phosphorIcon={ArrowUpRight}
                  size={isShrink ? 'sm' : 'md' }
                  weight={'duotone'}
                />
              )}
              onClick={onOpenSendFund}
              shape='squircle'
              size={isShrink ? 'xs' : 'md'}
              tooltip={t('Send tokens')}
            />
            <Typography.Text>{'Send'}</Typography.Text>
          </div>
          <div className={'__button-space'} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              icon={
                <Icon
                  phosphorIcon={PlusCircle}
                  size={isShrink ? 'sm' : 'md' }
                  weight={'duotone'}
                />
              }
              onClick={onOpenBuyTokens}
              shape='squircle'
              size={isShrink ? 'xs' : 'md'}
              tooltip={t('Buy token')}
            />
            <Typography.Text>{'Buy'}</Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export const UpperBlock = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return ({
    padding: '0px 8px 24px 8px',
    display: 'flex',
    flexDirection: 'column',

    '.anticon svg': {
      fill: '#fff0'
    },

    '.__total-balance-value': {
      textAlign: 'center',
      padding: '0px 8px',
      lineHeight: token.lineHeightHeading1,
      fontSize: token.fontSizeHeading1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',

      '.ant-typography': {
        lineHeight: 'inherit'
      }
    },

    '.ant-btn': {
      color: 'transparent',
      transition: 'width, height, padding 0s'
    },

    '.__balance-change-container': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: token.sizeXS,

      '.button-change-show-balance': {
        color: token.colorWhite,

        '&:hover': {
          color: token['gray-5']
        }
      },

      '.ant-typography': {
        lineHeight: 'inherit',
        // todo: may update number component to clear this !important
        color: 'inherit !important',
        fontSize: 'inherit !important'
      }
    },

    '.__balance-change-value': {
      lineHeight: token.lineHeight
    },

    '.__balance-change-percent': {
      backgroundColor: token['cyan-6'],
      color: token['green-1'],
      marginInlineEnd: 0,
      display: 'flex',

      '&.-decrease': {
        backgroundColor: token.colorError,
        color: token.colorTextLight1
      },

      '.ant-number': {
        fontSize: token.fontSizeXS
      }
    },
 
    '.__block-item': {
      gap: token.sizeSM,
      '& span': {
        color: '#000 !important'
      },
      '& button': {
        background: 'transparent',
        outline: 'none !important'
      },
      '& button:hover': {
        background: 'transparent'
      }
    },

    '.__action-button-container': {
      display: 'flex',
      justifyContent: 'center',
      padding: '26px 8px 0 8px'
    },

    '.__button-space': {
      width: token.size
    },

    '&.-shrink': {
      paddingBottom: 32,
      flexDirection: 'row',

      '.__total-balance-value-container': {
        flex: 1
      },

      '.__total-balance-value-content': {
        cursor: 'pointer',
        width: 'fit-content'
      },

      '.__total-balance-value': {
        textAlign: 'left',
        lineHeight: token.lineHeightHeading2,
        fontSize: token.fontSizeHeading2,

        '.ant-number-prefix, .ant-number-integer, .ant-number-hide-content': {
          fontSize: 'inherit !important'
        }
      },

      '.__balance-change-container': {
        display: 'none'
      },

      '.__action-button-container': {
        paddingTop: 0
      },

      '.__button-space': {
        width: token.sizeXS
      }
    }
  });
});
