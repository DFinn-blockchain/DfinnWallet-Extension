// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageWrapper, WalletConnect } from '@subwallet/extension-koni-ui/components';
import { DISCORD_URL, EXTENSION_VERSION, PRIVACY_AND_POLICY_URL, TELEGRAM_URL, TERMS_OF_SERVICE_URL, TWITTER_URL, WEB_BUILD_NUMBER, WEBSITE_URL, WIKI_URL } from '@subwallet/extension-koni-ui/constants/common';
import { ScreenContext } from '@subwallet/extension-koni-ui/contexts/ScreenContext';
import { WebUIContext } from '@subwallet/extension-koni-ui/contexts/WebUIContext';
import useNotification from '@subwallet/extension-koni-ui/hooks/common/useNotification';
import useTranslation from '@subwallet/extension-koni-ui/hooks/common/useTranslation';
import useUILock from '@subwallet/extension-koni-ui/hooks/common/useUILock';
import useIsPopup from '@subwallet/extension-koni-ui/hooks/dom/useIsPopup';
import useDefaultNavigate from '@subwallet/extension-koni-ui/hooks/router/useDefaultNavigate';
import { windowOpen } from '@subwallet/extension-koni-ui/messaging';
import { Theme, ThemeProps } from '@subwallet/extension-koni-ui/types';
import { openInNewTab } from '@subwallet/extension-koni-ui/utils';
import { BackgroundIcon, Button, ButtonProps, Icon, SettingItem, SwHeader, SwIconProps } from '@subwallet/react-ui';
import { ArrowRight ,ArrowsOut, ArrowSquareOut,User, Wallet, BookBookmark, BookOpen, CaretRight, Coin, DiscordLogo, FileX, FrameCorners, GlobeHemisphereEast, Lock, ShareNetwork, ShieldCheck, TelegramLogo, TwitterLogo, X } from 'phosphor-react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

type Props = ThemeProps

type SettingItemType = {
  key: string,
  leftIcon: SwIconProps['phosphorIcon'] | React.ReactNode,
  leftIconBgColor: string,
  rightIcon: SwIconProps['phosphorIcon'],
  title: string,
  onClick?: () => void,
  isHidden?: boolean,
};

type SettingGroupItemType = {
  key: string,
  label?: string,
  items: SettingItemType[],
};

const isReactNode = (element: unknown): element is React.ReactNode => {
  return React.isValidElement(element);
};

function generateLeftIcon (backgroundColor: string, icon: SwIconProps['phosphorIcon'] | React.ReactNode): React.ReactNode {
  const isNode = isReactNode(icon);

  return (
    <BackgroundIcon
      backgroundColor={backgroundColor}
      customIcon={isNode ? icon : undefined}
      phosphorIcon={isNode ? undefined : icon}
      size='lg'
      type={isNode ? 'customIcon' : 'phosphor'}
    />
  );
}

function generateRightIcon (icon: SwIconProps['phosphorIcon']): React.ReactNode {
  return (
    <Icon
      className='__right-icon'
      customSize={'20px'}
      phosphorIcon={icon}
      type='phosphor'
    />
  );
}

function Component ({ className = '' }: Props): React.ReactElement<Props> {
  const navigate = useNavigate();
  const { token } = useTheme() as Theme;
  const isPopup = useIsPopup();
  const notify = useNotification();
  const location = useLocation();
  const { goHome } = useDefaultNavigate();
  const { t } = useTranslation();
  const [locking, setLocking] = useState(false);
  const { isWebUI } = useContext(ScreenContext);
  const { setTitle } = useContext(WebUIContext);

  const { isUILocked, lock, unlock } = useUILock();

  const onLock = useCallback(() => {
    if (isUILocked) {
      unlock();
      goHome();
    } else {
      setLocking(true);
      lock()
        .then(() => {
          goHome();
        })
        .catch((e: Error) => {
          notify({
            message: e.message,
            type: 'error'
          });
        }).finally(() => {
          setLocking(false);
        });
    }
  }, [goHome, isUILocked, lock, notify, unlock]);

  // todo: i18n all titles, labels below
  const SettingGroupItemType = useMemo((): SettingGroupItemType[] => ([
    {
      key: 'general',
      items: [
        {
          key: 'expand-view',
          leftIcon: FrameCorners,
          leftIconBgColor: token.colorPrimary,
          rightIcon: ArrowsOut,
          title: t('Expand view'),
          onClick: () => {
            windowOpen({ allowedPath: '/' }).catch(console.error);
          },
          isHidden: !isPopup
        },
        {
          key: 'general-settings',
          leftIcon: User,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowRight,
          title: t('Accounts'),
          onClick: () => {
            navigate('/settings/general');
          }
        },
        {
          key: 'security-settings',
          leftIcon: ShieldCheck,
          leftIconBgColor: '#d1defe',
          rightIcon: ArrowRight,
          title: t('Security'),
          onClick: () => {
            navigate('/settings/security', { state: true });
          }
        },
        {
          key: 'manage-address-book',
          leftIcon: BookBookmark,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowRight,
          title: t('Manage Address Book'),
          onClick: () => {
            navigate('/settings/address-book');
          }
        },
        {
          key: 'wallet-connect',
          leftIcon: Wallet,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowRight,
          title: t('WalletConnect'),
          onClick: () => {
            navigate('/wallet-connect/list');
          },
          isHidden: isWebUI
        }
      ]
    },
    {
      key: 'networks-&-tokens',
      label: t('Networks & tokens'),
      items: [
        {
          key: 'manage-networks',
          leftIcon: ShareNetwork,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowRight,
          title: t('Networks'),
          onClick: () => {
            navigate('/settings/chains/manage');
          }
        },
        {
          key: 'manage-tokens',
          leftIcon: Coin,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowRight,
          title: t('Manage tokens'),
          onClick: () => {
            navigate('/settings/tokens/manage');
          }
        }
      ]
    },
    // {
    //   key: 'community-&-support',
    //   label: t('Community & support'),
    //   items: [
    //     {
    //       key: 'twitter',
    //       leftIcon: TwitterLogo,
    //       leftIconBgColor: token['blue-6'],
    //       rightIcon: ArrowSquareOut,
    //       title: t('Twitter'),
    //       onClick: openInNewTab(TWITTER_URL)
    //     },
    //     {
    //       key: 'discord',
    //       leftIcon: DiscordLogo,
    //       leftIconBgColor: token['geekblue-8'],
    //       rightIcon: ArrowSquareOut,
    //       title: t('Discord'),
    //       onClick: openInNewTab(DISCORD_URL)
    //     },
    //     {
    //       key: 'telegram',
    //       leftIcon: TelegramLogo,
    //       leftIconBgColor: token['blue-5'],
    //       rightIcon: ArrowSquareOut,
    //       title: t('Telegram'),
    //       onClick: openInNewTab(TELEGRAM_URL)
    //     }
    //   ]
    // },
    {
      key: 'about',
      label: t('About'),
      items: [
        {
          key: 'website',
          leftIcon: ShieldCheck,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowSquareOut,
          title: t('Website'),
          onClick: openInNewTab(WEBSITE_URL)
        },
        // {
        //   key: 'user-manual',
        //   leftIcon: Book,
        //   leftIconBgColor: token['green-6'],
        //   rightIcon: ArrowSquareOut,
        //   title: t('User guide'),
        //   onClick: openInNewTab(WIKI_URL)
        // },
        {
          key: 'term-of-service',
          leftIcon: BookOpen,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowSquareOut,
          title: t('Terms of service'),
          onClick: openInNewTab(TERMS_OF_SERVICE_URL)
        },
        {
          key: 'privacy-policy',
          leftIcon: BookBookmark,
          leftIconBgColor: '#fedafa',
          rightIcon: ArrowSquareOut,
          title: t('Privacy policy'),
          onClick: openInNewTab(PRIVACY_AND_POLICY_URL)
        }
      ]
    }
  ]), [isPopup, isWebUI, navigate, t, token]);

  const headerIcons = useMemo<ButtonProps[]>(() => {
    return [
      {
        icon: (
          <Icon
            customSize={'24px'}
            phosphorIcon={X}
            type='phosphor'
            weight={'bold'}
            iconColor={'white'}
          />
        ),
        onClick: goHome
      }
    ];
  }, [goHome]);

  useEffect(() => {
    if (location.pathname === '/settings' || location.pathname === '/settings/list') {
      setTitle(t('Settings'));
    }
  }, [location.pathname, setTitle, t]);

  return (
    <PageWrapper className={`settings ${className}`}>
      <>
        {!isWebUI && (
          <SwHeader
            className='__header-icons'
            left='logo'
            onClickLeft={goHome}
            paddingVertical
            rightButtons={headerIcons}
            showLeftButton={true}
          >
            {t('Settings')}
          </SwHeader>
        )}

        <div className={'__content-container'}>
          {
            SettingGroupItemType.map((group) => {
              return (
                <div
                  className={'__group-container'}
                  key={group.key}
                >
                  {!!group.label && (<div className='__group-label'>{group.label}</div>)}

                  <div className={'__group-content'}>
                    {group.items.map((item) => item.isHidden
                      ? null
                      : (
                        <SettingItem
                          className={'__setting-item'}
                          key={item.key}
                          leftItemIcon={generateLeftIcon(item.leftIconBgColor, item.leftIcon)}
                          name={item.title}
                          onPressItem={item.onClick}
                          rightItem={generateRightIcon(item.rightIcon)}
                        />
                      ))}
                  </div>
                </div>
              );
            })
          }

          <Button
            block
            icon={
              <Icon
                phosphorIcon={Lock}
                type='phosphor'
                weight={'fill'}
              />
            }
            loading={locking}
            onClick={onLock}
            schema={'secondary'}
          >
            {t('Lock')}
          </Button>

          <div className={'__version'}>
          Dfinnwallet Web 1.0
          </div>
        </div>

        <Outlet />
      </>
    </PageWrapper>
  );
}

export const Settings = styled(Component)<Props>(({ theme: { extendToken, token } }: Props) => {
  return ({
    height: '100%',
    backgroundColor: token.colorBgDefault,
    display: 'flex',
    flexDirection: 'column',

    '.__header-icons': {
      '& button': {
        background: 'transparent',
        outline: 'none !important'
      }
    },

    '.ant-sw-header-container': {
      backgroundColor: token.colorBgDefault,
      minHeight: 'auto',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },

    '.web-ui-enable &, .web-ui-enable & .ant-sw-header-container': {
      backgroundColor: 'transparent'
    },

    '.ant-sw-header-center-part': {
      color: token.colorTextLight1,
      fontSize: token.fontSizeHeading4,
      lineHeight: token.lineHeightHeading4,
      fontWeight: token.headingFontWeight
    },

    '.custom-header': {
      paddingTop: token.paddingLG,
      paddingBottom: token.paddingLG
    },

    '.__content-container': {
      paddingTop: token.padding,
      paddingRight: token.padding,
      paddingLeft: token.padding,
      paddingBottom: token.paddingLG,

      '.web-ui-enable &': {
        paddingTop: 0,
        paddingBottom: token.paddingLG,
        margin: '0 auto',
        width: extendToken.bigOneColumnWidth,
        maxWidth: '100%'
      }
    },

    '.__group-label': {
      color: token.colorTextLight3,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeightSM,
      marginBottom: token.margin,
      textTransform: 'uppercase'
    },

    '.__group-container': {
      paddingBottom: token.paddingLG
    },

    '.__setting-item + .__setting-item': {
      marginTop: token.marginXS
    },

    '.ant-web3-block-right-item': {
      minWidth: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: -token.marginXS,
      color: token['gray-4']
    },

    '@media (max-width: 991px)': {
      '.__setting-item': {
        backgroundColor: '#252525',
        padding: '5px'
      },
      '.__setting-item:hover': {
        backgroundColor: '#252525'
      },
      '.__setting-item .ant-web3-block-right-item': {
        color: token['colorWhite'],
        backgroundColor: 'black',
        borderRadius: 50,
        marginRight: 5
      },
    },

    '.__setting-item:hover .ant-web3-block-right-item': {
      color: token['gray-6']
    },

    '.__version': {
      paddingTop: token.padding,
      textAlign: 'center',
      color: token.colorTextLight3,
      fontSize: token.size,
      lineHeight: token.lineHeight
    }
  });
});

export default Settings;
