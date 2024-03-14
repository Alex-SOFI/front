import { FunctionComponent, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { Link } from 'components/basic';

import { theme } from 'styles/theme';

const LinksList: FunctionComponent = () => {
  const listItemLink = useCallback(
    (link: JSX.Element) => <ListItem disablePadding>{link}</ListItem>,
    [],
  );
  return (
    <Box
      sx={{
        maxWidth: theme.breakpoints.sm,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      <List
        sx={{
          maxWidth: theme.breakpoints.sm,
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          alignItems: 'center',
          marginLeft: '1rem',
        }}
      >
        {listItemLink(
          <Link
            href='https://www.notion.so/Sophie-Whitepaper-1ad05c0d6720475aaaaa500fd89af777'
            ariaLabel='Link opens SOPHIE&#039;s WhitePaper in a new window.'
          >
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
            href='https://github.com/Alex-SOFI'
            ariaLabel='Link opens SOPHIE&#039;s Github repository in a new window.'
          >
            Github
          </Link>,
        )}
      </List>
      <List
        sx={{
          maxWidth: theme.breakpoints.sm,
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          alignItems: 'center',
          justifyContent: 'end',
          marginRight: '1rem',
        }}
      >
        {listItemLink(
          <Link
            href='https://discord.gg/8W3Qb8XzPJ'
            ariaLabel='Link opens invitation to SOPHIE&#039;s Discord server in a new window.'
          >
            Discord
          </Link>,
        )}
        {listItemLink(
          <Link
            href='https://twitter.com/SophieCryp72198'
            ariaLabel='Link opens to SophieCryp72198&#039;s Twitter in a new window.'
          >
            Twitter
          </Link>,
        )}
        {listItemLink(
          <Link
            href='https://t.me/sophietoken'
            ariaLabel='Link opens invitation to SOPHIE&#039;s Telegram group in a new window.'
          >
            Telegram
          </Link>,
        )}
      </List>
    </Box>
  );
};

export default LinksList;
