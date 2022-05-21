import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from './Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Store } from '../Store.jsx';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';

export default function AccountMenu() {
    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const signoutHandler = (e) => {
        e.preventDefault();
        ctxDispatch({type: 'LOGOUT'})
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Box color="white" variant="h6" underline="none"sx={{  }}>{userInfo.fname +' ' + userInfo.lname}</Box>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem>
          <Avatar />My Favourite List
        </MenuItem> */}
        { !userInfo.isAdmin ? (
            <Box>
            <MenuItem  onClick={() => {navigate('/favourite')}} >
            <ListItemIcon><FavoriteIcon sx={{ color: "red" }}/></ListItemIcon> My Favourite List
            </MenuItem>
            <MenuItem  onClick={() => {navigate('/message')}} >
            <ListItemIcon><MessageIcon sx={{ color: "black" }}/></ListItemIcon> Message
            </MenuItem>
            <Divider />
            </Box>
        ) : (
            <Box>
            <MenuItem  onClick={() => {navigate('/message')}} >
            <ListItemIcon><MessageIcon sx={{ color: "black" }}/></ListItemIcon> Message
            </MenuItem>
            <Divider />
            </Box>
        ) } 
        
        <MenuItem onClick={signoutHandler}>
          <ListItemIcon>
            <Logout fontSize="small"  />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}