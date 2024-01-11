import { Address } from 'viem';

interface IAddresses {
  TOKEN_MANAGER: Address;
  MATIC: Address;
  USDC_MUMBAI: Address;
  USDC: Address;
  SOFI_TOKEN: Address;
}

const addresses: IAddresses = {
  TOKEN_MANAGER: '0xd370ea571a4d5a40eb06e89eb1e420343b9cc95d',
  MATIC: '0x0000000000000000000000000000000000001010',
  USDC_MUMBAI: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  SOFI_TOKEN: '0x389d3eff27612aaa9963b6c8196711ab7affdad4',
};

export default addresses;
