import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../TempComponents/AppBar';
import Toolbar from '../TempComponents/Toolbar';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem.getItem("userInfo")) : null
}

function AppHeader() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24 }}
          >
            {'The Canine Shelter'}
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="/login/"
              sx={rightLink}
            >
              {'Log In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              href="/register"
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Register'}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppHeader;
