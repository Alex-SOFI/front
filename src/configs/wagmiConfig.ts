import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { chains, metadata, projectId } from 'constants/wagmiConfig';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

export default wagmiConfig;
