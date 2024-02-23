import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDC_MUMBAI: Address;
  USDC: Address;
  SOFI_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: '0x87ca38b5971e9c3905ca91c1f236d48de4cb4bec',
  MATIC: '0x0000000000000000000000000000000000001010',
  USDC_MUMBAI: '0xb79399e8a168291ed7039f6daece274c0f68caa7',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  SOFI_TOKEN: '0x8e774d5ea848cca19027bb0b5263b2e4a8760378',
};

export default addresses;
