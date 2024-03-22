import { FunctionComponent, ReactNode } from 'react';

import styled from '@emotion/styled';
import { useIsMobile } from 'hooks';

import LinksList from './pagesComponents/LinksList';

import HeaderContainer from 'containers/HeaderContainer';

import { theme } from 'styles/theme';

import MarketingClaim from './MarketingClaim';

const Section = styled.section`
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  & > main {
    display: flex;
    flex-direction: column;
  }
`;

const Main = styled.main`
  max-width: ${theme.breakpoints.sm};
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

const Footer = styled.footer`
  max-width: ${theme.breakpoints.sm};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${theme.space.sm};
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: 0;
  }
`;

interface LayoutProps {
  main: ReactNode;
  isLinkOnly?: boolean;
  alwaysShowMarketingClaim?: boolean;
  isMintSelected?: boolean;
  setIsMintSelected?: (state: boolean) => void;
  isTransactionLoading?: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({
  main,
  isLinkOnly,
  alwaysShowMarketingClaim,
  isMintSelected,
  setIsMintSelected,
  isTransactionLoading,
}) => {
  const isMobile = useIsMobile();

  return (
    <Section>
      <HeaderContainer
        isLinkOnly={isLinkOnly}
        isMintSelected={isMintSelected}
        setIsMintSelected={setIsMintSelected}
        isTransactionLoading={isTransactionLoading}
      />
      <Main>
        {(alwaysShowMarketingClaim || !isMobile) && <MarketingClaim />}
        {main}
      </Main>
      <Footer>
        <LinksList />
      </Footer>
    </Section>
  );
};

export default Layout;
