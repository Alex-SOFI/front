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
  USDC_MUMBAI: '0x0c86A754A29714C4Fe9C6F1359fa7099eD174c0b',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  SOFI_TOKEN: '0x8e774d5ea848cca19027bb0b5263b2e4a8760378',
};

export default addresses;
