import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDT: Address;
  SOPHIE_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: import.meta.env.VITE_TOKEN_MANAGER_ADDRESS as Address,
  MATIC: import.meta.env.VITE_MATIC_ADDRESS as Address,
  USDT: import.meta.env.VITE_USDT_ADDRESS as Address,
  SOPHIE_TOKEN: import.meta.env.VITE_SOPHIE_TOKEN_ADDRESS as Address,
};

export default addresses;
