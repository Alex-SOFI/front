import { useEffect, useState } from 'react';

const useIsUserConnected = () => {
  const connectedWithWallet: boolean | null = JSON.parse(
    localStorage.getItem('connectedWithWallet') as string,
  );
  const connectedWithMagicLink: boolean | null = JSON.parse(
    localStorage.getItem('connectedWithMagicLink') as string,
  );

  const [userConnectedWithWallet, setUserConnectedWithWallet] =
    useState(connectedWithWallet);
  const [userConnectedWithMagicLink, setUserConnectedWithMagicLink] = useState(
    connectedWithMagicLink,
  );

  useEffect(() => {
    setUserConnectedWithWallet(connectedWithWallet);
    setUserConnectedWithMagicLink(connectedWithMagicLink);
  }, [connectedWithWallet, connectedWithMagicLink]);

  return { userConnectedWithWallet, userConnectedWithMagicLink };
};

export default useIsUserConnected;
