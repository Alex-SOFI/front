import {
  Address,
  Client,
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  getContract,
  http,
} from 'viem';
import { arbitrum, polygonMumbai } from 'viem/chains';

import addresses from './addresses';
import sophieAbi from './sophieAbi';

export const tokenManagerContract = {
  address: addresses.TOKEN_MANAGER,
  abi: sophieAbi,
};

export const tokenContract = (address: Address) => ({
  address,
  abi: erc20Abi,
});

export const publicClient = createPublicClient({
  chain: import.meta.env.VITE_ENV === 'staging' ? polygonMumbai : arbitrum,
  transport: http(),
});

export const walletClient = (provider: never) =>
  createWalletClient({
    chain: import.meta.env.VITE_ENV === 'staging' ? polygonMumbai : arbitrum,
    transport: custom(provider),
  });

export const contractInstance = (address: Address, walletClient: Client) =>
  getContract({
    address,
    abi: erc20Abi,
    client: { public: publicClient, wallet: walletClient },
  });
