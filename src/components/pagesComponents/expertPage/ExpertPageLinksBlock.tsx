import { FunctionComponent, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { Link } from 'components/basic';

import { theme } from 'styles/theme';

const ExpertPageLinksBlock: FunctionComponent = () => {
  /* TODO: Add hrefs */
  const listItemLink = useCallback(
    (link: JSX.Element) => <ListItem disablePadding>{link}</ListItem>,
    [],
  );
  return (
    <Box
      sx={{
        maxWidth: theme.breakpoints.sm,
        paddingTop: theme.space.sm,
        paddingBottom: theme.space.sm,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      <List
        sx={{
          maxWidth: theme.breakpoints.sm,
          paddingTop: theme.space.sm,
          paddingBottom: theme.space.sm,
          display: 'grid',
          gridTemplateRows: 'repeat(4, 1fr)',
          alignItems: 'center',
          marginLeft: '1rem',
        }}
      >
        {listItemLink(
          <Link href='#' ariaLabel='Link opens Docs in a new window.'>
            Docs
          </Link>,
        )}
        {listItemLink(
          <Link href='#' ariaLabel='Link opens WhitePaper in a new window.'>
            WhitePaper
          </Link>,
        )}
        {listItemLink(
          <Link href='#' ariaLabel='Link opens Contracts in a new window.'>
            Contracts
          </Link>,
        )}
        {listItemLink(
          <Link
            href='#'
            ariaLabel='Link opens SOFI&#039;s Github repository in a new window.'
          >
            Github
          </Link>,
        )}
      </List>
      <List
        sx={{
          maxWidth: theme.breakpoints.sm,
          paddingTop: theme.space.sm,
          paddingBottom: theme.space.sm,
          display: 'grid',
          gridTemplateRows: 'repeat(4, 1fr)',
          alignItems: 'center',
          justifyContent: 'end',
          marginRight: '1rem',
        }}
      >
        {listItemLink(
          <Link href='#' ariaLabel='Link opens Linkedin in a new window..'>
            Linkedin
          </Link>,
        )}
        {listItemLink(
          <Link
            href='https://discord.com/invite/kXp55tyk'
            ariaLabel='Link opens invitation to SOFI&#039;s Discord server in a new window.'
          >
            Discord
          </Link>,
        )}
        {listItemLink(
          <Link
            href='https://twitter.com/alex_borene'
            ariaLabel='Link opens to Alex Borene&#039;s Twitter in a new window.'
          >
            Twitter
          </Link>,
        )}
        {listItemLink(
          <Link
            href='https://t.me/+sYuFM9QSvxhhYzA8'
            ariaLabel='Link opens invitation to SOFI&#039;s Telegram group in a new window.'
          >
            Telegram
          </Link>,
        )}
      </List>
    </Box>
  );
};

export default ExpertPageLinksBlock;
