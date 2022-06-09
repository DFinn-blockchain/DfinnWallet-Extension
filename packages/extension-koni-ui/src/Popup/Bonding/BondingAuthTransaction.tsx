// Copyright 2019-2022 @subwallet/extension-koni authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ValidatorInfo } from '@subwallet/extension-base/background/KoniTypes';
import Identicon from '@subwallet/extension-koni-ui/components/Identicon';
import Tooltip from '@subwallet/extension-koni-ui/components/Tooltip';
import useGetNetworkJson from '@subwallet/extension-koni-ui/hooks/screen/home/useGetNetworkJson';
import useTranslation from '@subwallet/extension-koni-ui/hooks/useTranslation';
import Header from '@subwallet/extension-koni-ui/partials/Header';
import { parseBalanceString } from '@subwallet/extension-koni-ui/Popup/Bonding/utils';
import { ThemeProps } from '@subwallet/extension-koni-ui/types';
import { toShort } from '@subwallet/extension-koni-ui/util';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

interface Props extends ThemeProps {
  className?: string;
}

const validatorInfo: ValidatorInfo = {
  address: '5GTD7ZeD823BjpmZBCSzBQp7cvHR1Gunq7oDkurZr9zUev2n',
  blocked: true,
  commission: 0,
  expectedReturn: 22.56074522099225,
  identity: 'Parity Westend validator 6',
  isVerified: false,
  minBond: 1,
  nominatorCount: 2,
  otherStake: 54635.096605487954,
  ownStake: 11555.529114384852,
  totalStake: 66190.6257198728
};

function BondingAuthTransaction ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const networkJson = useGetNetworkJson('westend');
  const [showDetail, setShowDetail] = useState(false);

  const handleOnClick = useCallback(() => {
    setShowDetail(!showDetail);
  }, [showDetail]);

  return (
    <div className={className}>
      <Header
        showBackArrow
        showSubHeader
        subHeaderName={t<string>('Staking action')}
        to='/'
      />

      <div className={'bonding-auth-container'}>
        <div className={'selected-validator'}>Selected Validator</div>

        <div className={'selected-validator-view'}>
          <div
            className={'validator-item-container'}
            onClick={handleOnClick}
          >
            <div className={'validator-header'}>
              <Identicon
                className='identityIcon'
                genesisHash={networkJson.genesisHash}
                prefix={networkJson.ss58Format}
                size={20}
                value={validatorInfo.address}
              />

              <div
                data-for={`identity-tooltip-${validatorInfo.address}`}
                data-tip={true}
              >
                {validatorInfo.identity ? validatorInfo.identity : toShort(validatorInfo.address)}
              </div>
              {
                validatorInfo.identity && <Tooltip
                  place={'top'}
                  text={toShort(validatorInfo.address)}
                  trigger={`identity-tooltip-${validatorInfo.address}`}
                />
              }
              {
                validatorInfo.isVerified && <FontAwesomeIcon
                  className={'validator-verified'}
                  data-for={`verify-tooltip-${validatorInfo.address}`}
                  data-tip={true}
                  icon={faCircleCheck}
                />
              }
              {
                validatorInfo.isVerified && <Tooltip
                  place={'top'}
                  text={'Verified'}
                  trigger={`verify-tooltip-${validatorInfo.address}`}
                />
              }
            </div>
            <div className={'validator-footer'}>
              <div
                className={'validator-expected-return'}
                data-for={`validator-return-tooltip-${validatorInfo.address}`}
                data-tip={true}
              >
                {validatorInfo.expectedReturn.toFixed(1)}%
              </div>
              <Tooltip
                place={'top'}
                text={'Expected return'}
                trigger={`validator-return-tooltip-${validatorInfo.address}`}
              />

              <div className={'validator-item-toggle-container'}>
                <div
                  className={'validator-item-toggle'}
                  style={{ transform: showDetail ? 'rotate(45deg)' : 'rotate(-45deg)' }}
                />
              </div>
            </div>
          </div>

          {
            showDetail && <div className={'validator-detail-container'}>
              <div className={'validator-att-container'}>
                <div className={'validator-att'}>
                  <div className={'validator-att-title'}>Total stake</div>
                  <div className={'validator-att-value'}>{parseBalanceString(validatorInfo.totalStake, networkJson.nativeToken as string)}</div>
                </div>

                <div className={'validator-att'}>
                  <div className={'validator-att-title'}>
                    Own stake
                  </div>
                  <div className={'validator-att-value'}>{parseBalanceString(validatorInfo.ownStake, networkJson.nativeToken as string)}</div>
                </div>
              </div>

              <div className={'validator-att-container'}>
                <div className={'validator-att'}>
                  <div className={'validator-att-title'}>
                    Nominators count
                  </div>
                  <div className={'validator-att-value'}>{validatorInfo.nominatorCount}</div>
                </div>

                <div className={'validator-att'}>
                  <div className={'validator-att-title'}>
                    Commission
                  </div>
                  <div className={'validator-att-value'}>{validatorInfo.commission}%</div>
                </div>
              </div>

              <div className={'validator-att-container'}>
                <div className={'validator-att'}>
                  <div className={'validator-att-title'}>
                    Minimum bonding
                  </div>
                  <div className={'validator-att-value'}>{parseBalanceString(validatorInfo.minBond, networkJson.nativeToken as string)}</div>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </div>
  );
}

export default React.memo(styled(BondingAuthTransaction)(({ theme }: Props) => `
  .selected-validator-view {
    margin-top: 20px;
    background: ${theme.accountAuthorizeRequest};
    border-radius: 8px;
  }

  .validator-att-value {
    color: ${theme.textColor3};
    font-size: 14px;
  }

  .validator-att-value-error {
    color: ${theme.errorColor};
    font-size: 14px;
  }

  .validator-att-value-warning {
    color: ${theme.iconWarningColor};
    font-size: 14px;
  }

  .validator-att {
    width: 50%;
  }

  .validator-att-container {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    gap: 20px;
  }

  .validator-detail-container {
    background: ${theme.accountAuthorizeRequest};
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 8px 8px;
  }

  .validator-item-toggle {
    border-style: solid;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 2.5px;
  }

  .validator-item-toggle-container {
    display: flex;
    align-items: center;
  }

  .validator-expected-return {
    font-size: 14px;
    color: ${theme.textColor3};
  }

  .validator-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .identityIcon {
    border: 2px solid ${theme.checkDotColor};
  }

  .validator-header {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .validator-item-container {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${theme.backgroundAccountAddress};
    padding: 10px 15px;
    border-radius: 8px;
    gap: 10px;
  }

  .selected-validator {
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
  }

  .bonding-input-filter-container {
    padding: 0 15px 12px;
  }

  .bonding-auth-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
`));
