import { ChangeEventHandler, FunctionComponent } from 'react';

import TextField from '@mui/material/TextField';

interface TextInputProps {
  paddingLeft?: string | number;
  marginRight?: string | number;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  paddingLeft,
  marginRight,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
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
      autoComplete='off'
    />
  );
};

export default TextInput;
