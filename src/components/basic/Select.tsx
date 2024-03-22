/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';

import {
  default as BasicSelect,
  SelectChangeEvent,
} from '@mui/material/Select';

interface SelectProps extends PropsWithChildren {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  labelId?: string;
  gridColumn?: number;
  textColor?: string;
  readOnly: boolean;
  [x: string]: any;
}

const Select: FunctionComponent<SelectProps> = ({
  value,
  onChange,
  children,
  labelId,
  readOnly,
  ...props
}) => {
  return (
    <BasicSelect
      sx={{
        boxShadow: 0,
        maxHeight: '2.719rem',
        ...props,
      }}
      onChange={onChange}
      labelId={labelId}
      aria-label={labelId}
      fullWidth
      value={value}
      readOnly={readOnly}
    >
      {children}
    </BasicSelect>
  );
};

export default Select;
