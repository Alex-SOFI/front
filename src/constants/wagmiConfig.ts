import { Chain, polygon, polygonMumbai } from 'viem/chains';

export const chains: [Chain, ...Chain[]] = [polygon, polygonMumbai];

export const projectId = 'd987c79808d3dd59ef85664fb3ac2373';

export const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  verifyUrl: '',
};
