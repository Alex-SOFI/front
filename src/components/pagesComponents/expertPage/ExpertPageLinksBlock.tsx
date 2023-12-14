import { FunctionComponent } from 'react';

import Box from '@mui/material/Box';

import { theme } from '../../../styles/theme';
import { Link } from '../../basic';

const ExpertPageLinksBlock: FunctionComponent = () => {
  /* TODO: Add hrefs */
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
      <Box
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
        <Link href='#' ariaLabel='Link opens Docs in a new window.'>
          Docs
        </Link>
        <Link href='#' ariaLabel='Link opens WhitePaper in a new window.'>
          WhitePaper
        </Link>
        <Link href='#' ariaLabel='Link opens Contracts in a new window.'>
          Contracts
        </Link>
        <Link
          href='#'
          ariaLabel='Link opens SOFI&#039;s Github repository in a new window.'
        >
          Github
        </Link>
      </Box>
      <Box
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
        <Link href='#' ariaLabel='Link opens Linkedin in a new window..'>
          Linkedin
        </Link>
        <Link
          href='https://discord.com/invite/kXp55tyk'
          ariaLabel='Link opens invitation to SOFI&#039;s Discord server in a new window.'
        >
          Discord
        </Link>
        <Link
          href='https://twitter.com/alex_borene'
          ariaLabel='Link opens to Alex Borene&#039;s Twitter in a new window.'
        >
          Twitter
        </Link>
        <Link
          href='https://t.me/+sYuFM9QSvxhhYzA8'
          ariaLabel='Link opens invitation to SOFI&#039;s Telegram group in a new window.'
        >
          Telegram
        </Link>
      </Box>
    </Box>
  );
};

export default ExpertPageLinksBlock;
