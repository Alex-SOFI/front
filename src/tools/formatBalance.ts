const formatBalance = (balance: string, decimals: number) => {
  const [beforeDot, afterDot] = balance.split('.');
  return afterDot ? beforeDot + '.' + afterDot.slice(0, decimals) : beforeDot;
};

export default formatBalance;
