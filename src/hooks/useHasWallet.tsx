import { useEffect, useState } from 'react';

const useHasWallet = () => {
  const hasWallet: boolean | null = JSON.parse(
    localStorage.getItem('hasWallet') as string,
  );
  const [userHasWallet, setUserHasWallet] = useState(hasWallet);

  useEffect(() => {
    setUserHasWallet(hasWallet);
  }, [hasWallet]);

  return userHasWallet;
};

export default useHasWallet;
