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
  textAlign?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
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
}) => {
  return (
    <TextField
      size='small'
      sx={{ paddingLeft, marginRight }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled || false}
      inputProps={{ readOnly, style: { textAlign: textAlign || 'right' } }}
      fullWidth
      autoComplete='off'
    />
  );
};

export default TextInput;
