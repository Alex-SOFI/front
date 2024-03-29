import { ChangeEvent, Dispatch, SetStateAction } from 'react';

const handleInputChange = (
  event: ChangeEvent<HTMLInputElement>,
  setValue: Dispatch<SetStateAction<string>>,
  decimals: number,
) => {
  if (
    ((event.target.value.length === 1 && event.target.value === '.') ||
      (!isNaN(Number(event.target.value)) &&
        Number(event.target.value) >= 0)) &&
    Number(event.target.value) <= Number.MAX_SAFE_INTEGER
  ) {
    const float = event.target.value.split('.')?.[1];
    if (!float || (float && float?.length <= decimals)) {
      setValue(event.target.value.trim());
    }
  }
};

export default handleInputChange;
