import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDC: Address;
  SOFI_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: import.meta.env.VITE_TOKEN_MANAGER_ADDRESS as Address,
  MATIC: import.meta.env.VITE_MATIC_ADDRESS as Address,
  USDC: import.meta.env.VITE_USDC_ADDRESS as Address,
  SOFI_TOKEN: import.meta.env.VITE_SOFI_TOKEN_ADDRESS as Address,
};

export default addresses;
