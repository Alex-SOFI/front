import { Address, erc20Abi } from 'viem';

import addresses from './addresses';
import SOFIabi from './sofiAbi';

export const tokenManagerContract = {
  address: addresses.TOKEN_MANAGER,
  abi: SOFIabi,
};

export const tokenContract = (address: Address) => ({
  address,
  abi: erc20Abi,
});

/* export const tokenContract = (isMintSelected: boolean) => ({
  address: isMintSelected ? addresses.USDC : addresses.SOFI_TOKEN,
  abi: erc20Abi,
}); */
