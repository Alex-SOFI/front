import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { chains, metadata } from 'constants/wagmiConfig';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  metadata,
});

export default wagmiConfig;
