// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { DataContext } from '@subwallet/extension-koni-ui/contexts/DataContext';
import applyPreloadStyle from '@subwallet/extension-koni-ui/preloadStyle';
import { RootState } from '@subwallet/extension-koni-ui/stores';
import { generateTheme, SW_THEME_CONFIGS, SwThemeConfig } from '@subwallet/extension-koni-ui/themes';
import { ConfigProvider, theme as reactUiTheme } from '@subwallet/react-ui';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle, ThemeProvider as StyledComponentThemeProvider } from 'styled-components';

import { Theme } from '../types';
import buttonBackground from '../assets/button-background.svg';
import blockItemBackground from '../assets/block-item-background.svg';
import buttonBackgroundSwitch from '../assets/switch-button-checked-background.png';
import arrowIcon from '../assets/arrow-icon.png'


interface Props {
  children: React.ReactNode;
  themeConfig: SwThemeConfig;
}

const { useToken } = reactUiTheme;

const GlobalStyle = createGlobalStyle<ThemeProps>(({ theme }) => {
  const { extendToken, token } = theme as Theme;

  applyPreloadStyle(extendToken.bodyBackgroundColor);

  return {
    'body *': {
      fontFamily: token.fontFamily,
      fontWeight: token.bodyFontWeight
    },

    button: {
      color: '#000'
    },

    pre: {
      fontFamily: 'inherit',
      whiteSpace: 'pre-wrap'
    },
//
    '.__select-account-type .ant-web3-block-right-item': {
      display: 'none'
    },

    '.ant-setting-item-name': {
      color: '#fff !important'
    },

    '.common-header': {
      '.anticon svg': {
        color: '#000'
      }
    },

    '.__footer-button-content': {
      '& .__footer-button-title, .__footer-button-subtitle': {
        color: '#000 !important'
      }
    },

    '.web-header.ant-sw-sub-header-container.ant-sw-header-container': {
      gap: '20px'
    },

    '.__dapp-item': {

      '& .__item-title-group, .__item-description': {
        overflow: 'hidden !important'
      },

      '& .__star-button': {
        minWidth: '25px !important',
        height: '25px !important',
        marginRight: '5px !important'
      }
    },

    '.settings': {
      '& .__setting-item': {
        backgroundColor: '#141414',
        borderRadius: '32px',

        '&:hover, .ant-setting-item-content:hover': {
          borderRadius: '32px',
        }
      }
    },

    '.__earning-toolbar .button-group': {
      '& .ant-btn': {
        color: '#000 !important',
        borderRadius: '40px !important',
        border: '2px solid #000',
        outline: '3px solid #fff',
        background: `url(${buttonBackground}) no-repeat, lightgray !important`,
        backgroundSize: 'cover !important',
        backgroundPosition: '50% 50% !important',
        transition: 'transform 0.3s ease',
      }
    },

    '.title-group': {
      gap: '20px'
    },

    '.earning-item-content-wrapper': {

      '& .earning-item-name, .earning-item-reward-sub-text, .earning-item-not-available-title': {
        color: '#fff !important',
      },

      '& .ant-number': {
        '& span': {
          color: '#fff !important'
        }
      }
    },

    '.items-container': {
    
      '& .ant-setting-item': {
        position: 'relative',
        height: '70px',

        '&::after': {
          content: '""',
          display: 'inline-block',
          width: '35px',
          height: '35px',
          background: `url(${arrowIcon}) no-repeat`,
          backgroundPosition: 'center',
          borderRadius: '50%',
          position: 'absolute',
          right: '-7px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }
      },

      '& .ant-setting-item-content': {
        height: '70px'
      }
    },

    '.ant-web3-block.ant-account-item.all-account-selection:hover': {
      borderRadius: '8px !important'
    },

    '.portfolio-balance': {
      background: `url(${blockItemBackground}) no-repeat, lightgray !important`,
      backgroundSize: 'cover !important',
      borderRadius: '34px !important',
    },

    '.ant-switch': {
      background: '#000000 !important',
      border: '2px solid #191919 !important',
    },

    '.ant-switch .ant-switch-handle': {
      insetInlineStart: '5px !important'
    },

    '.ant-switch-handle': {
      width: '22px !important',
      height: '22px !important',
    },

    '.ant-switch-checked .ant-switch-handle':{
      insetInlineStart: 'calc(100% - 26px) !important',
      width: '23px !important',
      height: '23px !important',
    },

    '.ant-switch-checked .ant-switch-handle::before': {
      background: `url(${buttonBackgroundSwitch}) no-repeat, lightgray !important`,
      backgroundSize: 'cover !important',
      backgroundPosition: '50% 50% !important',
      borderRadius: '19px !important',
    },

    '.ant-switch .ant-switch-handle::before': {
      border: '1px solid #191919 !important',
      background: 'radial-gradient(113.12% 113.12% at 50.52% 50.52%, #292929 0%, #000 100%)',
      backgroundSize: 'cover !important',
      backgroundPosition: '50% 50% !important',
      borderRadius: '19px !important',
    },

    '.portfolio-balance .__block-item': {
      padding: '30px',

      '& span': {
        color: '#000 !important'
      },

      '& button': {
        background: 'transparent',
        outline: 'none !important'
      }
    },

    '.web-layout-sidebar .-expanded, .web-layout-sidebar .-collapsed': {
      background: 'rgba(21, 22, 23, 0.40) !important'
    },

    
    '.side-menu .side-menu-item:hover': {
      backgroundColor: 'inherit'
    },

    '.side-menu .side-menu-item': {
      transition: 'transform 0.3s ease',

        '& .__icon, .__label': {
          color: '#fff !important'
        },
    },

    '.side-menu .-activated': {
      transition: 'transform 0.3s ease',
      background: 'linear-gradient(white,white) padding-box,linear-gradient(19deg, rgb(48 205 100), rgb(178, 217, 190), rgb(58, 140, 74)) border-box',
      borderRadius: '50em',
      border: '4px solid transparent',

      '& .__icon, .__label': {
        color: '#000 !important'
      }
    },

    

    '.web-layout-header-simple': {

      '& .__logo': {
      borderRadius: '10px',
      }
    },

    '.logo-container .ant-image': {
      borderRadius: '10px',
      boxShadow: '0px 0px 20px 7px rgba(255, 255, 255, 0.5)'
    },

    '.button-group .ant-btn': {
      backgroundImage: 'radial-gradient(113.12% 113.12% at 50.52% 50.52%, #3d3d3d 0%, #111 100%) !important',

        '& svg': {
          fill: 'rgb(37,149,230)',
        }
    },

    '.ant-background-icon': {
      borderRadius: '10px !important'
    },

    '.ant-sw-modal-body .wallet-item, .ant-sw-modal-body .ant-web3-block, .ant-sw-modal-body .ant-setting-item': {
      border: '1.8px solid #191919',
      background: 'rgba(0, 0, 0, 0.50) !important',
      backgroundImage: 'none !important',

      '& :hover': {
        backgroundImage: 'none !important',

      }
    },

    '.ant-sw-list .ant-web3-block': {
      transition: 'transform 0.3s ease',
    },

    '.ant-table.ant-table-content table.ant-table-row.ant-table-cell': {
      backgroundColor: '#000'
    },

    '.ant-btn.__sidebar-collapse-trigger, .action-group span': {
      color: '#fff !important'
    },

    '.welcome-import-button-title, .earning-item-reward *, .welcome-import-button-content *, .earning-item-name, .earning-item-reward, .button-group *': {
      color: '#000 !important'
    },

    '.ant-sw-modal-title, .ant-sw-screen-layout-body, .web-layout-content, .ant-sw-screen-layout-container, .web-layout-content *': {
      overflow: 'visible !important'
    },

    '.ant-web3-block-right-item .ant-btn.ant-btn-ghost:hover': {
      background: `url(${buttonBackground}) no-repeat, lightgray !important`,
      backgroundSize: 'cover !important',
      backgroundPosition: '50% 50% !important',
    },

    '.ant-btn, .setting-item': {
      color: '#000 !important',
      borderRadius: '40px !important',
      border: '2px solid #000',
      outline: '3px solid #fff',
      background: `url(${buttonBackground}) no-repeat, lightgray`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      transition: 'transform 0.3s ease',

      '& .ant-setting-item-name': {
        color: '#000'
      },

      '& .ant-web3-block:hover': {
        backgroundColor: 'transparent !important'
      }
    },

    '.ant-btn:hover, .setting-item:hover, .ant-sw-list .ant-setting-item:hover, .items-container .ant-setting-item:hover, .side-menu .side-menu-item:hover': {
      transform: 'translate(0, -3px)'
    },

    '.ant-btn:active, button:disabled, .ant-setting-item:active, .side-menu .side-menu-item:active': {
      filter: 'brightness(0.5)'
    },

    'ant-btn-ghost:hover': {
      transform: 'none !important'
    },

    '.ant-input-container, .-shape-default:before, .ant-select-modal-item .ant-setting-item, .phrase-number-selector-input, .type-warning, .term-box': {
      backgroundImage: 'radial-gradient(113.12% 113.12% at 50.52% 50.52%, #292929 0%, #000 100%) !important',
      backgroundColor: 'transparent !important',
      borderRadius: '32px !important',
      transition: 'background-image, transform 0.3s ease'
    },

    '.ant-select-modal-item .ant-web3-block:hover, .ant-network-item, ant-network-item:hover, .ant-select-modal-item .ant-account-item': {
      borderRadius: '32px !important',
    },

    '.ant-input-container:hover, wallet-item:hover, .ant-select-modal-input-container:hover::before': {
      borderRadius: '32px !important'
    },

    '.ant-squircle': {
      mask: 'none !important'
    },

    '.social-button svg': {
        fill: '#000'
    },
//

    '.loading-icon': {
      fontSize: token.size
    },

    '.main-page-container': {
      border: `${token.lineWidth}px ${token.lineType} ${token.colorBgInput}`,
      boxSizing: 'border-box'
    },

    '.main-page-container.web-ui-enable': {
      border: 0
    },

    '.ant-sw-modal .ant-sw-modal-header': {
      borderRadius: '24px 24px 0 0'
    },

    '.ant-sw-modal': {
      '&, &.ant-sw-qr-scanner': {
        '.ant-sw-modal-content': {
          width: 390 - token.lineWidth * 2,
          left: token.lineWidth,
          bottom: 0,
          borderBottom: `1px solid ${token.colorBgInput}`
        }
      },

      '&.modal-full, &.ant-sw-qr-scanner': {
        '.ant-sw-modal-content': {
          top: 1,
          height: 600 - token.lineWidth * 2
        }
      }
    },
    '.web-confirmation': {
      '.ant-sw-modal-content': {
        padding: 0,
        '.ant-sw-modal-header': {
          borderRadius: 0
        }
      }
    },
    '.modal-full': {
      '.ant-sw-modal-content': {
        '.ant-sw-modal-header': {
          borderRadius: 0
        }
      }
    },
    '.general-modal.-mobile': {
      justifyContent: 'flex-end',
      '.ant-sw-modal-content': {
        maxHeight: '95%',
        width: '100%'
      }
    },
    '.text-secondary': {
      color: token.colorTextSecondary
    },

    '.text-tertiary': {
      color: token.colorTextTertiary
    },

    '.text-light-2': {
      color: token.colorTextLight2
    },

    '.text-light-4': {
      color: token.colorTextLight4
    },

    '.common-text': {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight
    },

    '.sm-text': {
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeightSM
    },

    '.lg-text': {
      fontSize: token.fontSizeLG,
      lineHeight: token.lineHeightLG
    },

    '.mono-text': {
      fontFamily: token.monoSpaceFontFamily
    },

    '.ml-xs': {
      marginLeft: token.marginXS
    },

    '.mr-xs': {
      marginRight: token.marginXS
    },

    '.ml-xxs': {
      marginLeft: token.marginXXS
    },

    '.text-danger': {
      color: token.colorError
    },

    '.h3-text': {
      fontSize: token.fontSizeHeading3,
      lineHeight: token.lineHeightHeading3,
      fontWeight: token.headingFontWeight
    },

    '.h4-text': {
      fontSize: token.fontSizeHeading4,
      lineHeight: token.lineHeightHeading4,
      fontWeight: token.headingFontWeight
    },

    '.h5-text': {
      fontWeight: token.headingFontWeight,
      fontSize: token.fontSizeHeading5,
      lineHeight: token.lineHeightHeading5
    },

    '.form-space-xs': {
      '.ant-form-item': {
        marginBottom: token.marginXS
      }
    },

    '.form-space-sm': {
      '.ant-form-item': {
        marginBottom: token.marginSM
      }
    },

    '.form-space-xxs': {
      '.ant-form-item': {
        marginBottom: token.marginXXS
      }
    },

    '.form-row': {
      display: 'flex',
      gap: token.sizeSM,

      '.ant-form-item': {
        flex: 1,
        overflow: 'hidden'
      }
    },

    '.item-disabled': {
      opacity: 0.4,
      cursor: 'not-allowed !important',
      backgroundColor: `${token.colorBgSecondary} !important`
    },

    '.mb-0': {
      marginBottom: 0
    },

    '.ant-checkbox': {
      top: 0
    },

    '.ant-notification-top': {
      '.ant-notification-notice': {
        marginInlineEnd: 'auto'
      }
    },

    '.ant-input-affix-wrapper': {
      overflow: 'hidden',

      '.ant-input': {
        overflow: 'hidden'
      },

      '.ant-input-suffix>span:last-child:empty': {
        marginRight: token.marginXS
      }
    },

    '.ant-tooltip-placement-bottom, .ant-tooltip-placement-bottomLeft, .ant-tooltip-placement-bottomRight': {
      '.ant-tooltip-arrow': {
        top: 1
      }
    },

    '.ant-select-modal-input-content': {
      '.ant-select-modal-input-placeholder': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: 'block',
        'white-space': 'nowrap'
      }
    },

    '.ant-sw-header-left-part + .ant-sw-header-center-part .ant-sw-sub-header-title': {
      display: 'block',
      textAlign: 'center'
    },

    '.ant-sw-qr-scanner-camera-items-container.ant-select-modal': {
      maxWidth: 404,
      width: '100% !important',

      '@media (min-width: 992px)': {
        left: 'auto',
        right: token.paddingLG,
        bottom: token.paddingLG,
        top: token.paddingLG,

        '.ant-sw-modal-content': {
          height: '100%',
          maxHeight: '100%',
          width: '100%',
          paddingLeft: token.paddingLG,
          paddingRight: token.paddingLG
        },

        '.ant-sw-list-section .ant-sw-list-wrapper': {
          flexBasis: 'auto'
        }
      }
    }
  };
});

function ThemeGenerator ({ children, themeConfig }: Props): React.ReactElement<Props> {
  const { token } = useToken();

  // Generate theme from config
  const theme = useMemo<Theme>(() => {
    return generateTheme(themeConfig, token);
  }, [themeConfig, token]);

  return (
    <StyledComponentThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      {children}
    </StyledComponentThemeProvider>
  );
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const getModalContainer = () => document.getElementById('popup-container') || document.body;
const getPopupContainer = () => document.getElementById('tooltip-container') || document.body;

const TooltipContainer = styled.div({
  '& > div': {
    zIndex: 10000
  }
});

export function ThemeProvider ({ children }: ThemeProviderProps): React.ReactElement<ThemeProviderProps> {
  const dataContext = useContext(DataContext);
  const themeName = useSelector((state: RootState) => state.settings.theme);
  const logoMaps = useSelector((state: RootState) => state.settings.logoMaps);
  const [themeReady, setThemeReady] = useState(false);

  const themeConfig = useMemo(() => {
    const config = SW_THEME_CONFIGS[themeName];

    Object.assign(config.logoMap.network, logoMaps.chainLogoMap);
    Object.assign(config.logoMap.symbol, logoMaps.assetLogoMap);

    return config;
  }, [logoMaps, themeName]);

  useEffect(() => {
    dataContext.awaitStores(['settings']).then(() => {
      setThemeReady(true);
    }).catch(console.error);
  }, [dataContext]);

  // Reduce number of re-rendering
  if (!themeReady) {
    return <></>;
  }

  return (
    <ConfigProvider
      getModalContainer={getModalContainer}
      getPopupContainer={getPopupContainer}
      theme={themeConfig}
    >
      <ThemeGenerator themeConfig={themeConfig}>
        <TooltipContainer id='tooltip-container' />
        {children}
      </ThemeGenerator>
    </ConfigProvider>
  );
}
