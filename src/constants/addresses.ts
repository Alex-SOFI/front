import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDC_MUMBAI: Address;
  USDC: Address;
  SOFI_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: '0xf4672851f2ae8b3e73378e34a620caf42659e741',
  MATIC: '0x0000000000000000000000000000000000001010',
  USDC_MUMBAI: '0xb79399e8a168291ed7039f6daece274c0f68caa7',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  SOFI_TOKEN: '0x9283cf1aed41d19ec03cd50423f4da3fd4f48168',
};

export default addresses;
