const pow = (value: string, decimals: number) => {
  const [beforeDot, afterDot] = value.split('.');
  const decimalsAfterDot = afterDot ? afterDot.length : 0;
  const formattedValue = afterDot ? `${beforeDot}${afterDot}` : beforeDot;

  return BigInt(formattedValue) * BigInt(10 ** (decimals - decimalsAfterDot));
};

export default pow;
