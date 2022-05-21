import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MessageIcon from '@mui/icons-material/Message';
import API from '../api';
import { Store } from '../Store';

export default function MessageDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');
//   const [type] = React.useState(props.type)

  const { state, dispatch: ctxDispatch } = React.useContext(Store);
  const { userInfo } = state;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = async () => {
      try{
          let response = null;
          if (props.type == "send"){
            response = await API.post(`/message/send`,
                {
                    message: msg
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}` }
                }
            )
          }else{
               response = await API.post(`/message/reply`,
                {
                    message: msg,
                    user: props.user
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}` }
                }
            )
          }
       
        if(response){
            alert('Message send success')
        }
      }catch(error){
        console.log(error)
      }

    setOpen(false);
    setMsg("");
  };

  return (
    <div>
      <ListItemButton
            key="ContactUs"
            sx={{ py: 0, minHeight: 40, width:"70%", color: 'rgba(0,0,0,.8)', mt:2 }}
            onClick={handleClickOpen}
        >
            <ListItemIcon sx={{ color: 'inherit' }}>
            <MessageIcon sx={{ color: "black" }} />
            </ListItemIcon>
            {!props.notext ? (
                <ListItemText
                    primary="Contact Us"
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                />
            ) : null}
            
        </ListItemButton>
      <Dialog open={open} onClose={handleClose} fullWidth="true" maxWidth="lg">
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please leave a message.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            fullWidth
            variant="standard"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}