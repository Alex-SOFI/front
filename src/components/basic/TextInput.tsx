import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import TextField from '@mui/material/TextField';

interface TextInputProps {
  paddingLeft?: string | number;
  marginRight?: string | number;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  disabled?: boolean;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  paddingLeft,
  marginRight,
  value,
  setValue,
  placeholder,
  disabled,
}) => {
  return (
    <TextField
      size='small'
      sx={{ paddingLeft, marginRight }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      disabled={disabled || false}
    />
  );
};

export default TextInput;
