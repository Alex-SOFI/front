import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDC_MUMBAI: Address;
  USDC: Address;
  SOFI_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: '0x0d7a642f995890c4D728b8ece72127b7F2175C07',
  MATIC: '0x0000000000000000000000000000000000001010',
  USDC_MUMBAI: '0xb79399e8a168291ed7039f6daece274c0f68caa7',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  SOFI_TOKEN: '0xFB87CDFE6c3d405D47D524c68a61ba69427187d1',
};

export default addresses;
