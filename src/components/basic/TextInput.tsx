import {
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
} from 'react';

import TextField from '@mui/material/TextField';

interface TextInputProps {
  paddingLeft?: string | number;
  marginRight?: string | number;
  value: string;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  placeholder: string;
  disabled?: boolean;
  readOnly?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  paddingLeft,
  marginRight,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  onKeyDown,
}) => {
  return (
    <TextField
      size='small'
      sx={{ paddingLeft, marginRight }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled || false}
      inputProps={{ readOnly }}
      fullWidth
      {...(onKeyDown ? { onKeyDown } : {})}
    />
  );
};

export default TextInput;
