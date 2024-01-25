import { Chain, polygon, polygonMumbai } from 'viem/chains';

export const chains: [Chain, ...Chain[]] = [polygon, polygonMumbai];

export const projectId = 'd7e2f2c56641271add62d05d11d04eaa';

export const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  verifyUrl: '',
};
