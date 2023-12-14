import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import TextField from '@mui/material/TextField';

interface TextInputProps {
  paddingLeft: string | number;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  paddingLeft,
  value,
  setValue,
}) => {
  return (
    <TextField
      size='small'
      sx={{ paddingLeft }}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default TextInput;
