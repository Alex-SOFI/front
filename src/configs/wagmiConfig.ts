/* import { injected } from '@wagmi/connectors'; */
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

/* import { createConfig, http } from 'wagmi'; */
import { chains, metadata, projectId } from 'constants/wagmiConfig';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

/* const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected({
      target: 'metaMask',
      shimDisconnect: true,
    }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
}); */

export default wagmiConfig;
