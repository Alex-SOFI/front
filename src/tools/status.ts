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
  resetStatus: boolean;
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
  resetStatus,
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
        text: statusTexts.MAX_VALUE,
        error: true,
      };

    case !isApproveButtonVisible && (isPending || isTransactionLoading):
      return {
        color: theme.colors.info,
        text: statusTexts.MINT_LOADING,
        error: false,
      };

    case !isApproveButtonVisible && error:
      return {
        color: theme.colors.error,
        text: statusTexts.MINT_FAILED,
        error: false,
      };

    case !isApproveButtonClicked && success && !isTransactionLoading:
      setActiveInputValue('');
      return {
        color: theme.colors.success,
        text: statusTexts.MINT_SUCCESSFUL,
        error: false,
      };

    case isTransactionError:
      return {
        color: theme.colors.error,
        text: statusTexts.TRANSACTION_ERROR,
        error: true,
      };

    case resetStatus:
    default:
      return null;
  }
};

export default status;
