const pow = (value: string | bigint, decimals: number) => {
  return Number(value) * 10 ** (decimals / 2) * 10 ** (decimals / 2);
};

export default pow;
