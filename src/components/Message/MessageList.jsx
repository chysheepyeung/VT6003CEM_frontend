import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingBox from '../TempComponents/LoadingBox'
import AlertBox from '../TempComponents/AlertBox'
import MessageDialog from '../TempComponents/MessageDialog'
import API from '../api';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_MSG':
      return { ...state, loading: true };
    case 'FETCH_MSG_SUCCESS':
      return { ...state, messages: action.payload, loading: false };
    case 'FETCH_MSG_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'MSG_DEL':
      return { ...state,  trigger: !state.trigger};
      case 'MSG_DEL_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default function MessageList() {
    const [{loading, error, messages, trigger}, dispatch] = React.useReducer(reducer, {
        messages: [],
        loading: true,
        error: '',
        trigger: false
    })

    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;


    const onDelClick = async function(e, id) {
        e.preventDefault();
         try{
            const response = await API.delete(`/message/${id}`,
            {
                headers: {Authorization: `Bearer ${userInfo.token}` }
            })
            if(response){
                dispatch({type:"MSG_DEL"})
            }
        }catch(error){
            // dispatch({type: "MSG_DEL_FAIL", payload: "Message delete fail"})
            alert(error)
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_MSG'})
            try{
                const response = await API.get('/message',
                {
                    headers: {Authorization: `Bearer ${userInfo.token}` }
                });
                if(response){
                    dispatch({type: 'FETCH_MSG_SUCCESS', payload: response.data})
                }
            }catch(error){
                dispatch({type: 'FETCH_MSG_FAIL', payload: "No Message Yet"})
            }
        }

        fetchData();
    }, [trigger]);


  return (
        <Container component="section" sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" marked="center" align="center" component="h2">
                Message List
            </Typography>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <AlertBox type="error">{error}</AlertBox>
            ):(
                <Box>
                    <List>
                        {messages.map((msg) => (
                            <Box>
                                <ListItem
                                key={msg._id.toString()}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={(e) => {onDelClick(e, msg._id)}}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                >
                                    <ListItemAvatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        onClick={(e) => {onMsgClick(e, msg._id)}}
                                        primary={msg.msg}
                                        secondary={ userInfo.isAdmin ? `By ${msg.user.fname} ${msg.user.lname} on ${msg.createdAt.toString().substring(0, 10)} at ${msg.createdAt.toString().substring(11, 16)}` : `By Admin on ${msg.createdAt.toString().substring(0, 10)} at ${msg.createdAt.toString().substring(11, 16)}`}
                                    />
                                    {userInfo.isAdmin? (
                                    <MessageDialog key={msg._id + "1"} type="reply" user={msg.user._id}  notext="true"/>
                                ): (
                                    <MessageDialog key={msg._id + "2"} type="send" notext="true"/>
                                )}
                                </ListItem>
                                
                                
                            </Box>
                        ))}
                        
                    </List>
                </Box>
                )
            }
        </Container>
    
  );
}
