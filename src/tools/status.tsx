import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
} from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Address } from 'viem';

import statusTexts from 'constants/statusTexts';

import { Button, Text } from 'components/basic';

import { theme } from 'styles/theme';

import copyToClipboard from './copyToClipboard';
import noop from './noop';

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
  hash: Address | undefined;
}

interface TextWithHashProps {
  color: string;
  text: string;
  hash: Address | undefined;
}

const TextWithHash: FunctionComponent<TextWithHashProps> = ({
  color,
  text,
  hash,
}) => {
  const copyAddress = useCallback(
    () => (hash ? copyToClipboard(hash) : noop),
    [hash],
  );

  return (
    <Text sx={{ gridColumn: 2 }} variant='body2' color={color} ml='1rem'>
      {text}
      {hash ? (
        <>
          &nbsp;
          <Button
            onClick={copyAddress}
            variant='text'
            maxWidth='11rem'
            minHeight='0rem'
            verticalAlign='baseline'
          >
            <Text
              sx={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              variant='h1'
              color={color}
              fontSize='18px'
            >
              {hash}
            </Text>
            <ContentCopyIcon
              sx={{
                marginRight: '0.5rem',
                fontSize: '18px',
              }}
            />
          </Button>
        </>
      ) : (
        ''
      )}
    </Text>
  );
};

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
  hash,
}: Status) => {
  switch (true) {
    case isWrongNetwork:
      return {
        text: (
          <TextWithHash
            text={statusTexts.UNSUPPORTED_NETWORK}
            color={theme.colors.error}
            hash={hash}
          />
        ),
        error: true,
      };

    case isMaxValueError:
      return {
        text: isMintSelected ? (
          <TextWithHash
            text={statusTexts.MAX_USDC_VALUE}
            color={theme.colors.error}
            hash={hash}
          />
        ) : (
          <TextWithHash
            text={statusTexts.MAX_SOFI_VALUE}
            color={theme.colors.error}
            hash={hash}
          />
        ),
        error: true,
      };

    case isFunctionCalled &&
      !isApproveButtonVisible &&
      (isPending || isTransactionLoading):
      return {
        text: isMintSelected ? (
          <TextWithHash
            text={statusTexts.MINT_LOADING}
            color={theme.colors.info}
            hash={hash}
          />
        ) : (
          <TextWithHash
            text={statusTexts.REDEEM_LOADING}
            color={theme.colors.info}
            hash={hash}
          />
        ),
        error: false,
      };

    case isFunctionCalled && !isApproveButtonVisible && error:
      return {
        text: isMintSelected ? (
          <TextWithHash
            text={statusTexts.MINT_FAILED}
            color={theme.colors.error}
            hash={hash}
          />
        ) : (
          <TextWithHash
            text={statusTexts.REDEEM_FAILED}
            color={theme.colors.error}
            hash={hash}
          />
        ),
        error: false,
      };

    case isFunctionCalled &&
      !isApproveButtonClicked &&
      success &&
      !isTransactionLoading:
      setActiveInputValue('');
      return {
        text: isMintSelected ? (
          <TextWithHash
            text={statusTexts.MINT_SUCCESSFUL}
            color={theme.colors.success}
            hash={hash}
          />
        ) : (
          <TextWithHash
            text={statusTexts.REDEEM_SUCCESSFUL}
            color={theme.colors.success}
            hash={hash}
          />
        ),
        error: false,
      };

    case isTransactionError:
      return {
        text: (
          <TextWithHash
            text={statusTexts.TRANSACTION_ERROR}
            color={theme.colors.error}
            hash={hash}
          />
        ),
        error: true,
      };

    default:
      return null;
  }
};

export default status;
