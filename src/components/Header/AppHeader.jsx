import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../Store.jsx';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../TempComponents/AppBar';
import Toolbar from '../TempComponents/Toolbar';
import AccountMenu from '../TempComponents/AccountMenu.jsx';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};


function AppHeader() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

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
          
          
              {userInfo? (
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <AccountMenu />
                        {/* <Link
                            color="inherit"
                            variant="h6"
                            underline="none"
                            href="/login/"
                            sx={rightLink}
                            >
                            {userInfo.fname}
                        </Link> */}
                        {/* <Link
                            variant="h6"
                            underline="none"
                            onClick={signoutHandler}
                            sx={{ ...rightLink, color: 'secondary.main' }}
                            >
                            {'Logout'}
                        </Link> */}
                    </Box>
                ): (
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
              )}
          </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppHeader;

