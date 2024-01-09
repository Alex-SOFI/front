const pow = (value: string, decimals: number) => {
  const [integralPart, fractionalPart] = value.split('.');

  const integralValue = `${integralPart}${fractionalPart || ''}`;
  const fractionalPartLength = fractionalPart?.length || 0;

  return (
    BigInt(integralValue) * BigInt(10 ** (decimals - fractionalPartLength))
  );
};

export default pow;
