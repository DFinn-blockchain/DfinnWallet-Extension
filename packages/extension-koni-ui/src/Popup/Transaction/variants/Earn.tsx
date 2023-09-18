// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { _ChainInfo } from '@subwallet/chain-list/types';
import { ExtrinsicStatus, SubmitJoinNativeStaking, SubmitJoinNominationPool, ValidatorInfo, YieldAssetExpectedEarning, YieldCompoundingPeriod, YieldPoolInfo, YieldPoolType, YieldStepDetail, YieldTokenBaseInfo } from '@subwallet/extension-base/background/KoniTypes';
import { AccountJson } from '@subwallet/extension-base/background/types';
import { calculateReward } from '@subwallet/extension-base/koni/api/yield';
import { _getAssetDecimals, _isChainEvmCompatible } from '@subwallet/extension-base/services/chain-service/utils';
import { SWTransactionResponse } from '@subwallet/extension-base/services/transaction-service/types';
import { isSameAddress } from '@subwallet/extension-base/utils';
import { AccountSelector, AmountInput, MetaInfo, MultiValidatorSelector, PageWrapper, PoolSelector } from '@subwallet/extension-koni-ui/components';
import EarningProcessItem from '@subwallet/extension-koni-ui/components/EarningProcessItem';
import { DataContext } from '@subwallet/extension-koni-ui/contexts/DataContext';
import { ScreenContext } from '@subwallet/extension-koni-ui/contexts/ScreenContext';
import { useFetchChainState, useGetChainPrefixBySlug, useHandleSubmitTransaction } from '@subwallet/extension-koni-ui/hooks';
import { getOptimalYieldPath } from '@subwallet/extension-koni-ui/messaging';
import StakingProcessModal from '@subwallet/extension-koni-ui/Popup/Home/Earning/Overview/StakingProcessModal';
import { fetchEarningChainValidators, handleYieldStep } from '@subwallet/extension-koni-ui/Popup/Transaction/helper/earning/earningHandler';
import { TransactionContent } from '@subwallet/extension-koni-ui/Popup/Transaction/parts';
import FreeBalanceToStake from '@subwallet/extension-koni-ui/Popup/Transaction/parts/FreeBalanceToStake';
import { TransactionContext } from '@subwallet/extension-koni-ui/Popup/Transaction/Transaction';
import { RootState } from '@subwallet/extension-koni-ui/stores';
import { FormCallbacks, FormFieldData, Theme, ThemeProps } from '@subwallet/extension-koni-ui/types';
import { convertFieldToObject, parseNominations, simpleCheckForm } from '@subwallet/extension-koni-ui/utils';
import { ActivityIndicator, Button, Divider, Form, Icon, Logo, Number, Typography } from '@subwallet/react-ui';
import CN from 'classnames';
import { ArrowCircleRight, CheckCircle } from 'phosphor-react';
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

import { isEthereumAddress } from '@polkadot/util-crypto';

import useGetNativeTokenBasicInfo from '../../../hooks/common/useGetNativeTokenBasicInfo';

interface Props extends ThemeProps {
  item: YieldPoolInfo;
}

enum FormFieldName {
  FROM = 'from',
  NOMINATE = 'nominate',
  POOL = 'pool',
}

const formFieldPrefix = 'amount-';

interface StakingFormProps extends Record<`amount-${number}`, string> {
  [FormFieldName.FROM]: string;
  [FormFieldName.NOMINATE]: string;
  [FormFieldName.POOL]: string;
}

interface YieldProcessState {
  steps: YieldStepDetail[],
  feeStructure: YieldTokenBaseInfo[],
  currentStep: number,
  stepResults: SWTransactionResponse[]
}

const DEFAULT_YIELD_PROCESS: YieldProcessState = {
  steps: [],
  feeStructure: [],
  currentStep: 0,
  stepResults: []
};

enum ProcessReducerActionType {
  SET_CURRENT_STEP = 'SET_CURRENT_STEP',
  SET_YIELD_PROCESS = 'SET_YIELD_PROCESS',
  UPDATE_STEP_RESULT = 'UPDATE_STEP_RESULT'
}

interface ProcessReducerAction {
  payload: unknown,
  type: ProcessReducerActionType
}

function processReducer (state: YieldProcessState, action: ProcessReducerAction): YieldProcessState {
  switch (action.type) {
    case ProcessReducerActionType.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload as number
      };

    case ProcessReducerActionType.SET_YIELD_PROCESS: {
      const { fee, steps } = action.payload as Record<string, unknown>;

      return {
        ...state,
        steps: steps as YieldStepDetail[],
        feeStructure: fee as YieldTokenBaseInfo[]
      };
    }

    case ProcessReducerActionType.UPDATE_STEP_RESULT: {
      const _stepResult = action.payload as SWTransactionResponse;
      const result = state.stepResults;

      result.push(_stepResult);

      return {
        ...state,
        stepResults: result
      };
    }

    default:
      throw Error('Unknown action');
  }
}

const Component = () => {
  const { t } = useTranslation();
  const { token } = useTheme() as Theme;
  const { slug: _methodSlug } = useParams();

  const { isWebUI } = useContext(ScreenContext);
  const methodSlug = useMemo(() => {
    return _methodSlug || '';
  }, [_methodSlug]);
  const navigate = useNavigate();
  const poolInfoMap = useSelector((state: RootState) => state.yieldPool.poolInfo);
  const chainInfoMap = useSelector((state: RootState) => state.chainStore.chainInfoMap);
  const priceMap = useSelector((state: RootState) => state.price.priceMap);
  const chainAsset = useSelector((state: RootState) => state.assetRegistry.assetRegistry);
  const { setChain, setShowRightBtn } = useContext(TransactionContext);
  const { currentAccount, isAllAccount } = useSelector((state: RootState) => state.accountState);
  const { nominationPoolInfoMap, validatorInfoMap } = useSelector((state: RootState) => state.bonding);

  const [processState, dispatchProcessState] = useReducer(processReducer, DEFAULT_YIELD_PROCESS);

  const [isBalanceReady, setIsBalanceReady] = useState<boolean>(true);

  const [forceFetchValidator, setForceFetchValidator] = useState<boolean>(false);
  const [poolLoading, setPoolLoading] = useState<boolean>(false);
  const [validatorLoading, setValidatorLoading] = useState<boolean>(false);

  const [isSubmitDisable, setIsSubmitDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm<StakingFormProps>();

  const currentAmount = Form.useWatch(`${formFieldPrefix}0`, form);
  const currentFrom = Form.useWatch(FormFieldName.FROM, form);
  const currentPoolInfo = useMemo(() => poolInfoMap[methodSlug], [methodSlug, poolInfoMap]);

  const chainState = useFetchChainState(currentPoolInfo.chain);
  const { decimals, symbol } = useGetNativeTokenBasicInfo(currentPoolInfo.chain);
  const chainNetworkPrefix = useGetChainPrefixBySlug(currentPoolInfo.chain);

  const onDone = useCallback((extrinsicHash: string) => {
    const chainType = isEthereumAddress(currentFrom) ? 'ethereum' : 'substrate';

    navigate(`/transaction-done/${chainType}/${currentPoolInfo.chain}/${extrinsicHash}`, { replace: true });
  }, [currentFrom, currentPoolInfo.chain, navigate]);

  const { onError, onSuccess } = useHandleSubmitTransaction(onDone);

  const formDefault: StakingFormProps = useMemo(() => {
    return {
      [FormFieldName.FROM]: !isAllAccount ? currentAccount?.address || '' : '',
      [FormFieldName.POOL]: '',
      [FormFieldName.NOMINATE]: ''
    };
  }, [currentAccount?.address, isAllAccount]);

  useEffect(() => {
    setChain(currentPoolInfo.chain);
  }, [currentPoolInfo, setChain]);

  useEffect(() => {
    setShowRightBtn(true);
  }, [setShowRightBtn]);

  useEffect(() => {
    let unmount = false;

    // fetch validators when change chain
    // _stakingType is predefined form start
    if ((!!currentPoolInfo.chain && !!currentFrom && chainState?.active) || forceFetchValidator) {
      fetchEarningChainValidators(currentPoolInfo, unmount, setPoolLoading, setValidatorLoading, setForceFetchValidator);
    }

    return () => {
      unmount = true;
    };
  }, [currentPoolInfo, currentFrom, chainState?.active, forceFetchValidator]);

  useEffect(() => {
    setIsLoading(true);

    getOptimalYieldPath({
      amount: currentAmount,
      poolInfo: currentPoolInfo
    })
      .then((res) => {
        dispatchProcessState({
          payload: {
            steps: res.steps,
            fee: res.totalFee
          },
          type: ProcessReducerActionType.SET_YIELD_PROCESS
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentPoolInfo, currentAmount]);

  const _assetEarnings: Record<string, YieldAssetExpectedEarning> = useMemo(() => {
    const yearlyEarnings: Record<string, YieldAssetExpectedEarning> = {};
    const currentAmountNumb = currentAmount ? parseFloat(currentAmount) / (10 ** decimals) : 0;

    if (currentPoolInfo?.stats?.assetEarning) {
      currentPoolInfo?.stats?.assetEarning.forEach((assetEarningStats) => {
        const assetApr = assetEarningStats?.apr || 0;
        const assetSlug = assetEarningStats.slug;

        yearlyEarnings[assetSlug] = calculateReward(assetApr, currentAmountNumb, YieldCompoundingPeriod.YEARLY);
      });
    }

    return yearlyEarnings;
  }, [currentAmount, currentPoolInfo?.stats?.assetEarning, decimals]);

  const estimatedFee = useMemo(() => {
    let _totalFee = 0;

    if (processState.feeStructure) {
      processState.feeStructure.forEach((fee) => {
        const asset = chainAsset[fee.slug];
        const feeDecimals = _getAssetDecimals(asset);
        const priceValue = asset.priceId ? priceMap[asset.priceId] : 0;
        const feeNumb = priceValue * (fee.amount ? (parseFloat(fee.amount) / (10 ** feeDecimals)) : 0);

        _totalFee += feeNumb;
      });
    }

    return _totalFee;
  }, [chainAsset, priceMap, processState.feeStructure]);

  const accountFilterFunc = (chainInfoMap: Record<string, _ChainInfo>): ((account: AccountJson) => boolean) => {
    return (account: AccountJson) => {
      const chain = chainInfoMap[currentPoolInfo.chain];
      const isEvmChain = _isChainEvmCompatible(chain);
      const isEvmAddress = isEthereumAddress(account.address);

      return isEvmChain === isEvmAddress;
    };
  };

  const onFieldsChange: FormCallbacks<StakingFormProps>['onFieldsChange'] = useCallback((changedFields: FormFieldData[], allFields: FormFieldData[]) => {
    const { error } = simpleCheckForm(allFields);

    const allMap = convertFieldToObject<StakingFormProps>(allFields);
    // const changesMap = convertFieldToObject<StakingFormProps>(changedFields);
    const checkEmpty: Record<string, boolean> = {};

    for (const [key, value] of Object.entries(allMap)) {
      checkEmpty[key] = !!value;
    }

    if (currentPoolInfo.type === YieldPoolType.NOMINATION_POOL) {
      checkEmpty.nominate = true;
    } else if (currentPoolInfo.type === YieldPoolType.NATIVE_STAKING) {
      checkEmpty.pool = true;
    }

    setIsSubmitDisable(error || Object.values(checkEmpty).some((value) => !value));
  }, [currentPoolInfo.type]);

  const renderMetaInfo = useCallback(() => {
    return (
      <MetaInfo
        labelColorScheme={'gray'}
        valueColorScheme={'gray'}
      >
        <MetaInfo.Number
          label={t('Yearly rewards')}
          suffix={'%'}
          value={(Object.values(_assetEarnings)[0].apy || 0) * 100}
        />
        <MetaInfo.Number
          label={t('Estimated earnings')}
          suffix={`${symbol}/Year`}
          value={Object.values(_assetEarnings)[0].rewardInToken || 0}
        />
        <MetaInfo.Number
          decimals={0}
          label={t('Estimated fee')}
          prefix={'$'}
          value={estimatedFee}
        />
      </MetaInfo>
    );
  }, [t, _assetEarnings, symbol, estimatedFee]);

  const getSelectedValidators = useCallback((nominations: string[]) => {
    const validatorList = validatorInfoMap[currentPoolInfo.chain];

    if (!validatorList) {
      return [];
    }

    const result: ValidatorInfo[] = [];

    validatorList.forEach((validator) => {
      if (nominations.some((nomination) => isSameAddress(nomination, validator.address))) { // remember the format of the address
        result.push(validator);
      }
    });

    return result;
  }, [currentPoolInfo.chain, validatorInfoMap]);

  const getSelectedPool = useCallback((poolId?: string) => {
    const nominationPoolList = nominationPoolInfoMap[currentPoolInfo.chain];

    for (const pool of nominationPoolList) {
      if (String(pool.id) === poolId) {
        return pool;
      }
    }

    return undefined;
  }, [nominationPoolInfoMap, currentPoolInfo.chain]);

  const isProcessDone = useMemo(() => {
    return processState.currentStep === processState.steps.length - 1;
  }, [processState.currentStep, processState.steps.length]);

  const onClick = useCallback(() => {
    setSubmitLoading(true);
    dispatchProcessState({
      type: ProcessReducerActionType.UPDATE_STEP_RESULT,
      payload: { status: ExtrinsicStatus.QUEUED }
    });

    const { from, nominate, pool } = form.getFieldsValue();
    let data;

    if (currentPoolInfo.type === YieldPoolType.NOMINATION_POOL && pool) {
      const selectedPool = getSelectedPool(pool);

      data = {
        amount: currentAmount,
        selectedPool
      } as SubmitJoinNominationPool;
    } else {
      const selectedValidators = getSelectedValidators(parseNominations(nominate));

      data = {
        amount: currentAmount,
        selectedValidators
      } as SubmitJoinNativeStaking;
    }

    const nextStep = processState.currentStep === processState.steps.length - 1 ? processState.currentStep : processState.currentStep + 1;

    const submitPromise: Promise<SWTransactionResponse> = handleYieldStep(
      from,
      currentPoolInfo,
      {
        steps: processState.steps,
        totalFee: processState.feeStructure
      },
      nextStep,
      data);

    if (!isProcessDone) {
      dispatchProcessState({
        type: ProcessReducerActionType.SET_CURRENT_STEP,
        payload: nextStep
      });
    }

    setTimeout(() => {
      submitPromise
        .then((rs) => {
          dispatchProcessState({
            type: ProcessReducerActionType.UPDATE_STEP_RESULT,
            payload: processState.stepResults[processState.currentStep].status = ExtrinsicStatus.SUCCESS
          });
          onSuccess(rs);
        })
        .catch((error: Error) => {
          dispatchProcessState({
            type: ProcessReducerActionType.UPDATE_STEP_RESULT,
            payload: processState.stepResults[processState.currentStep].status = ExtrinsicStatus.FAIL
          });
          onError(error);
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    }, 300);
  }, [
    currentAmount,
    currentPoolInfo,
    form,
    getSelectedPool,
    getSelectedValidators,
    isProcessDone,
    onError,
    onSuccess,
    processState
  ]);

  return (
    <div className={'earning-wrapper'}>
      <div className={'__transaction-block'}>
        <TransactionContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: token.paddingSM, paddingTop: token.paddingXS }}>
            {/* <EarningBtn icon={<Logo className={'earning-calculator-tag'} size={16} network={'polkadot'} />} size={'xs'}> */}
            {/*  {'DOT'} */}
            {/* </EarningBtn> */}

            <Form
              className={'form-container form-space-sm earning-calculator-form-container'}
              form={form}
              initialValues={formDefault}
              onFieldsChange={onFieldsChange}
            >
              {/* <Form.Item */}
              {/*  name={FormFieldName.METHOD} */}
              {/*  label={t('Select method')} */}
              {/*  colon={false} */}
              {/* > */}
              {/*  <EarningMethodSelector items={Object.values(poolInfo)} /> */}
              {/* </Form.Item> */}

              {/* <Divider className={'staking-modal-divider'} /> */}

              {processState.steps && (
                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: token.paddingSM }}>
                  {isLoading
                    ? (
                      <ActivityIndicator
                        prefixCls={'ant'}
                        size={'24px'}
                      />
                    )
                    : (
                      <Typography.Text
                        size={'lg'}
                        style={{ fontWeight: '600' }}
                      >
                        {t('Step {{step}}: {{label}}', {
                          replace: { step: processState.currentStep + 1, label: processState.steps[processState.currentStep]?.name }
                        })}
                      </Typography.Text>
                    )}
                </div>
              )}

              <Form.Item
                // className={CN({ hidden: !isAllAccount })}
                name={'from'}
              >
                <AccountSelector
                  addressPrefix={chainNetworkPrefix}
                  disabled={!isAllAccount || processState.currentStep !== 0}
                  filter={accountFilterFunc(chainInfoMap)}
                />
              </Form.Item>

              {currentPoolInfo.inputAssets.map((asset, index) => {
                const name = formFieldPrefix + String(index);
                const _asset = chainAsset[asset];
                const assetDecimals = _asset ? _getAssetDecimals(_asset) : 0;
                const priceValue = _asset && _asset.priceId ? priceMap[_asset.priceId] : 0;
                const transformAmount = currentAmount ? (parseFloat(currentAmount) / (10 ** assetDecimals)) * priceValue : 0;

                return (
                  <div
                    key={name}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <FreeBalanceToStake
                      address={currentFrom}
                      chain={currentPoolInfo.chain}
                      className={'account-free-balance'}
                      label={t('Available to stake:')}
                      onBalanceReady={setIsBalanceReady}
                      tokenSlug={asset}
                    />

                    <Form.Item
                      colon={false}
                      name={name}
                      rules={[{ required: true, message: t('Amount is required') }]}
                      statusHelpAsTooltip={true}
                    >
                      <AmountInput
                        decimals={decimals}
                        disabled={processState.currentStep !== 0}
                        maxValue={'1'}
                        prefix={<Logo
                          className={'amount-prefix'}
                          size={20}
                          token={asset.split('-')[2].toLowerCase()}
                        />}
                        showMaxButton={true}
                        tooltip={t('Amount')}
                      />
                    </Form.Item>

                    <Number
                      className={'earn-transform-amount'}
                      decimal={0}
                      decimalColor={token.colorTextLight4}
                      intColor={token.colorTextLight4}
                      prefix={'$'}
                      unitColor={token.colorTextLight4}
                      value={transformAmount}
                    />
                  </div>
                );
              })}

              <Form.Item
                hidden={currentPoolInfo.type !== YieldPoolType.NOMINATION_POOL}
                name={FormFieldName.POOL}
              >
                <PoolSelector
                  chain={currentPoolInfo.chain}
                  disabled={processState.currentStep !== 0}
                  from={currentFrom}
                  label={t('Select pool')}
                  loading={poolLoading}
                  setForceFetchValidator={setForceFetchValidator}
                />
              </Form.Item>

              <Form.Item
                hidden={currentPoolInfo.type !== YieldPoolType.NATIVE_STAKING}
                name={FormFieldName.NOMINATE}
              >
                <MultiValidatorSelector
                  chain={currentPoolInfo.chain}
                  disabled={processState.currentStep !== 0}
                  from={currentFrom}
                  loading={validatorLoading}
                  setForceFetchValidator={setForceFetchValidator}
                />
              </Form.Item>
            </Form>
          </div>

          <Button
            block
            disabled={submitLoading || isSubmitDisable || !isBalanceReady}
            icon={
              <Icon
                phosphorIcon={isProcessDone ? CheckCircle : ArrowCircleRight}
                weight={'fill'}
              />
            }
            loading={submitLoading}
            onClick={onClick}
          >
            {processState.currentStep === 0 ? t('Submit') : (!isProcessDone ? t('Continue') : t('Finish'))}
          </Button>

          <Divider className={'staking-modal-divider'} />

          {renderMetaInfo()}

          <Divider className={'staking-modal-divider'} />

          <Typography.Text style={{ color: token.colorTextLight4 }}>
            {t('This content is for informational purposes only and does not constitute a guarantee. All rates are annualized and are subject to change.')}
          </Typography.Text>
        </TransactionContent>
      </div>

      {isWebUI && (
        <div className={'__transaction-process'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: token.paddingSM, paddingTop: token.paddingXS }}>

            <Typography.Text className={'earning-calculator-message'}>{t('Staking process:')}</Typography.Text>

            {!isLoading && processState.steps.map((item, index) => {
              const isSelected = processState.currentStep === index;

              return (
                <EarningProcessItem
                  index={index}
                  isSelected={isSelected}
                  key={index}
                  stepName={item.name}
                  stepStatus={processState.stepResults[index] ? processState.stepResults[index].status : undefined}
                />
              );
            })}

            {isLoading && <ActivityIndicator
              prefixCls={'ant'}
              size={'32px'}
            />}
          </div>
          <Divider style={{ backgroundColor: token.colorBgDivider, marginTop: token.marginSM, marginBottom: token.marginSM }} />

          <Typography.Text style={{ color: token.colorTextLight4 }}>
            {t('This content is for informational purposes only and does not constitute a guarantee. All rates are annualized and are subject to change.')}
          </Typography.Text>
        </div>
      )}

      <StakingProcessModal
        currentStep={processState.currentStep}
        yieldSteps={processState.steps}
      />
    </div>
  );
};

const Wrapper: React.FC<Props> = (props: Props) => {
  const { className } = props;

  const dataContext = useContext(DataContext);

  return (
    <PageWrapper
      className={CN(className, 'page-wrapper')}
      resolve={dataContext.awaitStores(['yieldPool', 'price', 'chainStore', 'assetRegistry'])}
    >
      <Component />
    </PageWrapper>
  );
};

const Earn = styled(Wrapper)<Props>(({ theme: { token } }: Props) => {
  return {
    '.earning-wrapper': {
      display: 'flex',
      flex: 1
    },

    '.__transaction-block': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },

    '.web-ui-enable &': {
      '.earning-wrapper': {
        paddingTop: 24,
        maxWidth: 784,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        gap: token.size
      },

      '.__transaction-block': {
        display: 'block',
        maxWidth: 384,
        flex: 1
      },

      '.transaction-content': {
        paddingLeft: 0,
        paddingRight: 0
      },

      '.transaction-footer': {
        paddingTop: 4,
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 0
      },

      '.meta-info': {
        marginBottom: token.marginSM
      }

    },

    '.__transaction-process': {
      flex: 1
    },

    '.ant-form-item-label > label': {
      color: token.colorTextLight4
    },

    '.amount-prefix': {
      marginBottom: token.marginXXS / 2
    },

    '.staking-modal-divider': {
      backgroundColor: token.colorBgDivider,
      marginTop: token.marginSM,
      marginBottom: token.marginSM
    },

    '.earn-transform-amount, .account-free-balance': {
      paddingBottom: token.paddingSM
    },

    '.ant-loading-icon': {
      display: 'flex',
      justifyContent: 'center'
    }
  };
});

export default Earn;