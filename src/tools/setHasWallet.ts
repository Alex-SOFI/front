const setHasWallet = (value: string) =>
  window.localStorage.setItem('hasWallet', value);

export default setHasWallet;
