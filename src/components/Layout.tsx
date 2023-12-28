import { FunctionComponent, ReactNode } from 'react';

import styled from '@emotion/styled';

import HeaderContainer from 'containers/HeaderContainer';

import { theme } from 'styles/theme';

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
  margin-bottom: ${theme.space.primaryMd};
  width: 100%;
`;

const Footer = styled.footer`
  max-width: ${theme.breakpoints.sm};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${theme.space.lg};
  width: 100%;
`;

interface LayoutProps {
  main: ReactNode;
  footer?: ReactNode;
  isLinkOnly?: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({
  main,
  footer,
  isLinkOnly,
}) => {
  return (
    <Section>
      <HeaderContainer isLinkOnly={isLinkOnly} />
      <Main>{main}</Main>
      {footer && <Footer>{footer}</Footer>}
    </Section>
  );
};

export default Layout;
