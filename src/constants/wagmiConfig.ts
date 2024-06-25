import { Chain, arbitrum, polygonMumbai } from 'viem/chains';

export const chains: [Chain, ...Chain[]] = [arbitrum, polygonMumbai];

export const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal',
  url: 'https://sofi-t-1823e8891b19.herokuapp.com/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  verifyUrl: '',
};
