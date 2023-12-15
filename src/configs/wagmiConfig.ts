import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { publicProvider } from '@wagmi/core/providers/public';
import { configureChains, createConfig, mainnet } from 'wagmi';

const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
});

export default wagmiConfig;
