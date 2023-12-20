import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { publicProvider } from '@wagmi/core/providers/public';
import { polygon, polygonMumbai } from 'viem/chains';
import { configureChains, createConfig } from 'wagmi';

const { chains, publicClient } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()],
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        // eslint-disable-next-line camelcase
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ],
  publicClient,
});

export default wagmiConfig;
