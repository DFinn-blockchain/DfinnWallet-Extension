// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

// export const EXTENSION_VERSION = chrome.runtime.getManifest().version;
import * as process from 'process';

export const EXTENSION_VERSION = process.env.PKG_VERSION || '0.0.0';
export const WEB_BUILD_NUMBER = process.env.PKG_BUILD_NUMBER || '000001';
export const WIKI_URL = 'https://dfinn-wallet.gitbook.io/dfinn-wallet-documentation/';
export const PRIVACY_AND_POLICY_URL = 'https://docs.subwallet.app/privacy-and-security/privacy-policy';
export const TERMS_OF_SERVICE_URL = 'https://docs.subwallet.app/privacy-and-security/terms-of-service';
export const FAQS_URL = 'https://docs.subwallet.app/main/extension-user-guide/faqs';
export const WEBSITE_URL = 'https://dfinnwallet.app/';
export const TELEGRAM_URL = 'https://t.me/dfinnwallet';
export const TWITTER_URL = ' https://twitter.com/dfinnwallet';
export const DISCORD_URL = 'https://discord.gg/avdFTg87';
export const EXTENSION_URL = 'https://subwallet.app/download.html';
export const CONTACT_US = 'https://t.me/dfinnwallet';
export const ALL_KEY = 'all';
export const HELP_URL = 'https://docs.dfinnwallet.app/';
