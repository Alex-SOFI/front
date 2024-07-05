/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventHandler, FunctionComponent } from 'react';

import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';

import { theme } from 'styles/theme';

interface TextInputProps {
  paddingLeft?: string | number;
  marginRight?: string | number;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder: string;
  disabled?: boolean;
  readOnly?: boolean;
  textAlign?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  helperText?: string;
  [x: string]: any;
  usdValue?: string;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  paddingLeft,
  marginRight,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  textAlign,
  helperText,
  usdValue,
  ...props
}) => {
  return (
    <TextField
      size='small'
      sx={{ paddingLeft, marginRight, ...props }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled || false}
      InputProps={{
        readOnly,
        style: { textAlign: textAlign || 'right' },
        ...(usdValue
          ? {
              endAdornment: (
                <InputAdornment position='end'>{usdValue}$</InputAdornment>
              ),
            }
          : null),
      }}
      fullWidth
      autoComplete='off'
      FormHelperTextProps={{ sx: { color: theme.colors.error } }}
      {...(helperText ? { helperText } : {})}
    />
  );
};

export default TextInput;
