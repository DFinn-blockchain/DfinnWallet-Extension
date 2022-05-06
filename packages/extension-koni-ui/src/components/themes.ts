// Copyright 2019-2022 @polkadot/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

const colors = {
  primary1: '#004BFF',
  primary2: '#42C59A'
};

const darkTheme = {
  accountAuthorizeRequest: '#151A30',
  accountBackground: '#1A1B20',
  accountDotsIconColor: '#8E8E8E',
  accountHoverBackground: 'rgba(255, 255, 255, 0.05)',
  addAccountImageBackground: '#1A1B20',
  backButtonBackground: '#3A3B41',
  backButtonBackgroundHover: '#3a3b41ad',
  backButtonTextColor: '#FFFFFF',
  backDropColor: 'rgba(255, 255, 255, 0.5)',
  background: '#010414',
  backgroundAccountAddress: '#262C4A',
  backgroundDropdownSeclection: 'rgba(0, 7, 45, .7)',
  backgroundItemColor: 'rgba(255, 255, 255, 0.05)',
  bodyColor: '#20222A',
  borderColor2: '#212845',
  borderColor: '#EEEEEE',
  borderRadius: '3px',
  borderSuccess: '#42C59A',
  boxBorderColor: '#212845',
  boxMargin: '0.75rem 0',
  boxPadding: '0 0.25rem',
  boxShadow2: '0px 0px 7px rgba(4, 193, 183, 0.4)',
  boxShadow: 'rgba(0, 0, 0, 0.86)',
  buttonBackground1: '#181E42',
  buttonBackground2: colors.primary2,
  buttonBackground: colors.primary1,
  buttonBackgroundDanger: '#AF1111',
  buttonBackgroundDangerHover: '#D93B3B',
  buttonBackgroundHover: '#ED9329',
  buttonTextColor2: colors.primary2,
  buttonTextColor3: '#00072D',
  buttonTextColor: '#FFFFFF',
  chainBackgroundColor: 'rgba(237, 132, 61, 0.2)',
  chainTextColor: '#ED843D',
  checkDotColor: colors.primary1,
  checkboxBorderColor: 'rgba(145, 150, 171, 0.3)',
  checkboxColor: '#262C4A',
  crowdloanActiveStatus: '#F7A21B',
  crowdloanFailStatus: '#F5000E',
  crowdloanWinnerStatus: '#42C59A',
  dangerBackgroundColor: 'rgba(175, 17, 17, 0.25)',
  errorBorderColor: '#7E3530',
  errorColor: '#E42F2F',
  extensionBorder: '#030E45',
  fontFamily: 'Lexend',
  fontSize2: '15px',
  fontSize3: '13px',
  fontSize: '16px',
  headerBoxShadow: '0px 5px 40px #051258',
  highlightedAreaBackground: '#EFEFEF',
  iconDangerColor: '#AF1111',
  iconHoverColor: colors.primary2,
  iconNeutralColor: '#7B8098',
  iconWarningColor: '#FF7D01',
  id: 'dark',
  identiconBackground: '#F4F5F8',
  inputBackground: '#111218',
  inputBackgroundColor: '#262C4A',
  inputBorderColor: '#2D365C',
  inputLabelFontSize: '14px',
  labelColor: '#9F9E99',
  labelDarkThemeColor: '#FFFFFF',
  labelFontSize: '15px',
  labelLightThemeColor: '#9196AB',
  labelLineHeight: '26px',
  layoutBackground: '#262C4A',
  lineHeight2: '24px',
  lineHeight: '26px',
  loadingBackground1: '#181E42',
  loadingBackground2: colors.primary2,
  manageWebsiteAccessColor: '#9196AB',
  menuBoxShadow: '0px 0px 7px rgba(4, 193, 183, 0.4)',
  menuItemsBorder: '#262C4A',
  overlayBackground: '#00072D',
  parentLabelColor: '#4A7463',
  popupBackground: '#181E42',
  primaryColor: colors.primary2,
  readonlyInputBackground: '#1A1B20',
  scrollBarThumb: 'rgba(128, 135, 139, .8)',
  scrollBarThumbHover: '#9196AB',
  scrollBarThumbInactive: 'rgba(145, 150, 171, .5)',
  subTextColor: '#DDD',
  successFilter: 'invert(60%) sepia(92%) saturate(292%) hue-rotate(109deg) brightness(94%) contrast(83%)',
  tabContentBorderBottomColor: '#343849',
  tableChainLogoBackground: '#000000',
  tableHeader: '#004BFF',
  tableSeparator: '#151A30',
  textColor2: '#7B8098',
  textColor3: colors.primary2,
  textColor: '#FFFFFF',
  textColorDanger: '#FF8686',
  textColorFilter2: 'invert(55%) sepia(15%) saturate(461%) hue-rotate(192deg) brightness(89%) contrast(88%)',
  textDecrease: '#B5131C',
  textIncrease: '#26A975',
  toggleInactiveBgc: '#262C4A',
  toggleInactiveThumbBoxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
  toggleInactiveThumbColor: '#9196AB',
  uploadFileBorderColor: 'rgba(0, 75, 255, 0.2)',
  warningBackgroundColor: 'rgba(231, 185, 23, 0.2)'
};

export declare type Theme = typeof darkTheme;

const lightTheme: Theme = {
  ...darkTheme,
  // buttonTextColor2: colors.primary1,
  accountAuthorizeRequest: '#F5F5F5',
  accountBackground: '#FFFFFF',
  accountHoverBackground: '#f2f3f4',
  addAccountImageBackground: '#FFF',
  backButtonBackground: '#D7D7D7',
  backButtonBackgroundHover: '#d7d7d7ad',
  backButtonTextColor: '#454545',
  backDropColor: 'rgba(0, 0, 0, 0.5)',
  background: '#FFFFFF',
  backgroundAccountAddress: '#F5F5F5',
  backgroundDropdownSeclection: 'rgba(0,0,0,.03)',
  backgroundItemColor: 'rgba(255, 255, 255, 0.05)',
  bodyColor: '#FFFFFF',
  borderColor2: '#EEEEEE',
  boxBorderColor: '#EEEEEE',
  boxShadow2: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 20px 60px rgba(0, 0, 0, 0.15)',
  boxShadow: 'rgba(0, 0, 0, 0.3)',
  buttonBackground1: '#F0F4FF',
  buttonBackgroundDanger: '#B5131C',
  checkboxBorderColor: '#DDDDDD',
  checkboxColor: '#F5F5F5',
  dangerBackgroundColor: 'rgba(175, 17, 17, 0.1)',
  errorBorderColor: '#E42F2F',
  extensionBorder: '#EDEDED',
  headerBoxShadow: '0px 10px 40px rgba(0, 0, 0, 0.08)',
  highlightedAreaBackground: '#212226',
  iconDangerColor: '#DC2222',
  iconNeutralColor: '#939CB1',
  id: 'light',
  inputBackground: '#FFFFFF',
  inputBorderColor: '#EDEDED',
  labelColor: '#333333',
  labelDarkThemeColor: '#666666',
  labelLightThemeColor: '#00072D',
  loadingBackground1: '#F0F4FF',
  loadingBackground2: colors.primary1,
  manageWebsiteAccessColor: '#666666',
  menuBoxShadow: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 20px 60px rgba(0, 0, 0, 0.15)',
  menuItemsBorder: '#EEEEEE',
  overlayBackground: '#FFFFFF',
  parentLabelColor: '#215B4F',
  popupBackground: '#FFFFFF',
  readonlyInputBackground: '#FFF',
  scrollBarThumb: 'rgba(0, 0, 0, .25)',
  subTextColor: '#454545',
  tabContentBorderBottomColor: 'transparent',
  textColor2: '#888888',
  textColor3: colors.primary1,
  textColor: '#00072D',
  textColorDanger: '#F24A4A',
  toggleInactiveBgc: '#ddd',
  toggleInactiveThumbBoxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
  toggleInactiveThumbColor: '#fff',
  warningBackgroundColor: 'rgba(231, 185, 23, 0.1)'
};

export const themes = {
  dark: darkTheme,
  light: lightTheme
};

export declare type AvailableThemes = keyof typeof themes;

export function chooseTheme (): AvailableThemes {
  const preferredTheme = localStorage.getItem('theme');

  if (preferredTheme) {
    return preferredTheme === 'dark'
      ? 'dark'
      : 'light';
  }

  // return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
  //   ? 'light'
  //   : 'dark';

  return 'dark';
}
