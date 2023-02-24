// Copyright 2019-2022 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PHISHING_PAGE_REDIRECT } from '@subwallet/extension-base/defaults';
import { Root } from '@subwallet/extension-koni-ui/Popup/Root';
import SendFund from '@subwallet/extension-koni-ui/Popup/Transaction/SendFund';
import { i18nPromise } from '@subwallet/extension-koni-ui/util/i18n';
import React from 'react';
import { createHashRouter, Outlet, useLocation, useRouteError } from 'react-router-dom';

const PhishingDetected = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/PhishingDetected'));
const PageWrapper = React.lazy(() => import('../components/Layout/PageWrapper'));
const Welcome = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Welcome'));
const Tokens = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Tokens'));
const Staking = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Staking'));

const NftItemDetail = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Nfts/NftItemDetail'));
const NftCollections = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Nfts/NftCollections'));
const NftCollectionDetail = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Nfts/NftCollectionDetail'));
const NftImport = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Nfts/NftImport'));

const History = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/History'));
const Crowdloans = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Crowdloans'));
const Home = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home'));

const Settings = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings'));
const ManageTokens = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings/Tokens/ManageTokens'));
const FungibleTokenImport = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings/Tokens/FungibleTokenImport'));
const GeneralSetting = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings/GeneralSetting'));
const TokenDetailList = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Home/Tokens/DetailList'));
const ManageWebsiteAccess = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings/ManageWebsiteAccess'));
const ManageWebsiteAccessDetail = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Settings/ManageWebsiteAccess/Detail'));

const NewSeedPhrase = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/NewSeedPhrase'));
const ImportSeedPhrase = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/ImportSeedPhrase'));
const ImportPrivateKey = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/ImportPrivateKey'));
const RestoreJson = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/RestoreJson'));
const AttachReadOnly = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/AttachReadOnly'));
const ConnectParitySigner = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/ConnectQrSigner/ConnectParitySigner'));
const ConnectKeystone = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Account/ConnectQrSigner/ConnectKeystone'));

const Login = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Keyring/Login'));
const CreatePassword = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Keyring/CreatePassword'));
const ChangePassword = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Keyring/ChangePassword'));
const ApplyMasterPassword = React.lazy(() => import('@subwallet/extension-koni-ui/Popup/Keyring/ApplyMasterPassword'));

const ErrorFallback = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <div>
      <h1>An Error Occurred</h1>
      <p>Sorry, something went wrong. Please try again later.</p>
    </div>
  );
};

// A Placeholder page
export function Example () {
  const location = useLocation();

  return <PageWrapper>
    <div style={{ padding: 16 }}>{location.pathname}</div>
  </PageWrapper>;
}

// Todo: Create error page
export const router = createHashRouter([{
  path: '/',
  loader: () => i18nPromise,
  element: <Root />,
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/welcome',
      element: <Welcome title={'Welcome Content'} />
    },
    {
      path: '/home',
      element: <Home />,
      children: [
        {
          path: 'tokens',
          element: <Tokens />
        },
        {
          path: 'token-detail-list',
          element: <TokenDetailList />
        },
        {
          path: 'nfts',
          element: <Outlet />,
          children: [
            {
              path: 'collections',
              element: <NftCollections />
            },
            {
              path: 'collection-detail',
              element: <NftCollectionDetail />
            },
            {
              path: 'item-detail',
              element: <NftItemDetail />
            },
            {
              path: 'import-collection',
              element: <NftImport />
            }
          ]
        },
        {
          path: 'crowdloans',
          element: <Crowdloans />
        },
        {
          path: 'staking',
          element: <Staking />
        },
        {
          path: 'history',
          element: <History />
        }]
    },
    {
      path: '/transaction',
      element: <Outlet />,
      children: [
        {
          path: 'send-fund',
          element: <SendFund />
        },
        {
          path: 'send-nft',
          element: <Example />
        },
        {
          path: 'stake',
          element: <Example />
        },
        {
          path: 'unstake',
          element: <Example />
        },
        {
          path: 'withdraw',
          element: <Example />
        },
        {
          path: 'claim-reward',
          element: <Example />
        },
        {
          path: 'compound',
          element: <Example />
        }
      ]
    },
    {
      path: '/keyring',
      element: <Outlet />,
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'create-password',
          element: <CreatePassword />
        },
        {
          path: 'change-password',
          element: <ChangePassword />
        },
        {
          path: 'migrate-password',
          element: <ApplyMasterPassword />
        }
      ]
    },
    {
      path: '/settings',
      element: <Outlet />,
      children: [
        {
          path: 'list',
          element: <Settings />
        }, {
          path: 'general',
          element: <GeneralSetting />
        }, {
          path: 'dapp-access',
          element: <ManageWebsiteAccess />
        }, {
          path: 'dapp-access-edit',
          element: <ManageWebsiteAccessDetail />
        }, {
          path: 'network',
          element: <Example />
        }, {
          path: 'network-edit',
          element: <Example />
        }, {
          path: 'tokens',
          element: <Outlet />,
          children: [
            {
              path: 'manage',
              element: <ManageTokens />
            },
            {
              path: 'import',
              element: <FungibleTokenImport />
            },
            {
              path: 'detail/:tokenSlug',
              element: <Example />
            }
          ]
        }, {
          path: 'master-password',
          element: <Example />
        }
      ]
    },
    {
      path: 'accounts',
      element: <Outlet />,
      children: [
        {
          path: 'new-seed-phrase',
          element: <NewSeedPhrase />
        },
        {
          path: 'import-seed-phrase',
          element: <ImportSeedPhrase />
        },
        {
          path: 'import-private-key',
          element: <ImportPrivateKey />
        },
        {
          path: 'restore-json',
          element: <RestoreJson />
        },
        {
          path: 'attach-read-only',
          element: <AttachReadOnly />
        },
        {
          path: 'connect-parity-signer',
          element: <ConnectParitySigner />
        },
        {
          path: 'connect-keystone',
          element: <ConnectKeystone />
        }
      ]
    }
  ]
},
{ path: `${PHISHING_PAGE_REDIRECT}/website`, element: <PhishingDetected /> }
]);
