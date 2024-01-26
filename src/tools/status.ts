import { Dispatch, SetStateAction } from 'react';

import statusTexts from 'constants/statusTexts';

import { theme } from 'styles/theme';

interface Status {
  isWrongNetwork: boolean;
  isMaxValueError: boolean;
  isApproveButtonVisible: boolean;
  isPending: boolean;
  isTransactionLoading: boolean;
  error: boolean;
  isApproveButtonClicked: boolean;
  setActiveInputValue: Dispatch<SetStateAction<string>>;
  success: boolean;
  isTransactionError: boolean;
  isMintSelected: boolean;
  isFunctionCalled: boolean;
}

const status = ({
  isWrongNetwork,
  isMaxValueError,
  isApproveButtonVisible,
  isPending,
  isTransactionLoading,
  error,
  isApproveButtonClicked,
  setActiveInputValue,
  success,
  isTransactionError,
  isMintSelected,
  isFunctionCalled,
}: Status) => {
  switch (true) {
    case isWrongNetwork:
      return {
        color: theme.colors.error,
        text: statusTexts.UNSUPPORTED_NETWORK,
        error: true,
      };

    case isMaxValueError:
      return {
        color: theme.colors.error,
        text: isMintSelected
          ? statusTexts.MAX_USDC_VALUE
          : statusTexts.MAX_SOFI_VALUE,
        error: true,
      };

    case isFunctionCalled &&
      !isApproveButtonVisible &&
      (isPending || isTransactionLoading):
      return {
        color: theme.colors.info,
        text: isMintSelected
          ? statusTexts.MINT_LOADING
          : statusTexts.REDEEM_LOADING,
        error: false,
      };

    case isFunctionCalled && !isApproveButtonVisible && error:
      return {
        color: theme.colors.error,
        text: isMintSelected
          ? statusTexts.MINT_FAILED
          : statusTexts.REDEEM_FAILED,
        error: false,
      };

    case isFunctionCalled &&
      !isApproveButtonClicked &&
      success &&
      !isTransactionLoading:
      setActiveInputValue('');
      return {
        color: theme.colors.success,
        text: isMintSelected
          ? statusTexts.MINT_SUCCESSFUL
          : statusTexts.REDEEM_SUCCESSFUL,
        error: false,
      };

    case isTransactionError:
      return {
        color: theme.colors.error,
        text: statusTexts.TRANSACTION_ERROR,
        error: true,
      };

    default:
      return null;
  }
};

export default status;
