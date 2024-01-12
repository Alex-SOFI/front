import { injected } from '@wagmi/connectors';
import { polygon, polygonMumbai } from 'viem/chains';
import { createConfig, http } from 'wagmi';

const wagmiConfig = createConfig({
  chains: [polygon, polygonMumbai],
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
});

export default wagmiConfig;
