import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from '@mui/material/Container';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../TempComponents/LoadingBox'
import AlertBox from '../TempComponents/AlertBox'
import { getError } from '../../utils'
import { Store } from '../Store';
import Link from '@mui/material/Link';
import MessageDialog from '../TempComponents/MessageDialog'



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DOGDETAIL':
      return { ...state, loading: true };
    case 'FETCH_DOGDETAIL_SUCCESS':
      return { ...state, dog: action.payload, loading: false };
    case 'FETCH_DOGDETAIL_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_DOGDETAIL':
        return { ...state,  message: '', error: '', deleteError: '' };
    case 'DELETE_DOGDETAIL_SUCCESS':
        return { ...state,  message: action.payload };
    case 'DELETE_DOGDETAIL_FAIL':
        return { ...state,  deleteError: action.payload };
    case 'CHANGE_FAV':
        return {...state, isFav: action.payload};
    default:
      return state;
  }
};

export default function DogDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const { dogId } = params;

    const dogDelete = async (e) => {
        e.preventDefault();
        dispatch({type:"DELETE_DOGDETAIL"});
        try{
            const response = await API.delete(
                `/dogs/${dogId}`,
                {
                    headers: {Authorization: `Bearer ${userInfo.token}` }
                }
            );
            if(response){
                dispatch({type: "DELETE_DOGDETAIL_SUCCESS", payload: response.data.message})
                setTimeout(() => {
                        navigate(`/`);
                 }, 2000);
            }
        }catch(error){
                dispatch({type: "DELETE_DOGDETAIL_FAIL", payload: getError(error)})
        }
    }

    const [{loading, error, dog, message, deleteError, isFav}, dispatch] = 
    React.useReducer(reducer, {
        dog:[],
        loading: true,
        error: '',
        message: '',
        deleteError: '',
        isFav: false
    })

    React.useEffect(() => {
        const fetchData = async () =>{
            dispatch({type: "FETCH_DOGDETAIL"});
            try{
                const response = await API.get(`/dogs/${dogId}`);
                dispatch({type: "FETCH_DOGDETAIL_SUCCESS", payload: response.data});
            }catch(error){
                dispatch({type: "FETCH_DOGDETAIL_FAIL", payload: getError(error)})
            }
        };

        const chkFav = async () =>{
            try{
                const response = await API.get(`/fav/${dogId}`,
                {
                    headers: {Authorization: `Bearer ${userInfo.token}` }
                });
                if(response){
                    console.log("asd" + response.data.result)
                    dispatch({type:"CHANGE_FAV", payload: response.data.result})
                }
            }catch(error){
                dispatch({type: "CHANGE_FAV", payload: false})
            }
        }


        fetchData();
        chkFav();
    }, [dogId]);

    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;
    const  addToFav = async (e) => {
        e.preventDefault();
        try{
            const response = await API.post("/fav/",
            {
                dogId: dogId
            },
            {
                headers: {Authorization: `Bearer ${userInfo.token}` }
            })
            if(response){
                dispatch({type:"CHANGE_FAV", payload: response.data.result})
            }
        }catch(error){
            dispatch({type: "CHANGE_FAV", payload: false})
        }
    }

    const  deleteFromFav = async (e) => {
        e.preventDefault();
        try{
            const response = await API.delete(`/fav/${dogId}`,
            {
                headers: {Authorization: `Bearer ${userInfo.token}` }
            })
            if(response){
                dispatch({type:"CHANGE_FAV", payload: response.data.result})
            }
        }catch(error){
            dispatch({type: "CHANGE_FAV", payload: false})
        }
    }

    return loading ? (
        <LoadingBox />
    ) : message ? (
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <AlertBox type="success">{message}</AlertBox>
        </Container>
    ): error ? (
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <AlertBox type="error">{error}</AlertBox>
        </Container>
    ) : (
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
            { deleteError ? (
                <AlertBox type="error">{deleteError}</AlertBox>
                ) : null
            }
            
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={8}>
                    <Grid item xs={6} >
                        <Box width="640" height="500">
                                <img
                                    className="img-large"
                                    width="100%" 
                                    height="100%"
                                    src={dog.pic ? dog.pic : "/img/no-image.jpg"}
                                    alt={dog.name}
                                ></img>
                        </Box>
                        
                    </Grid>
                    <Grid item xs={3} >
                        <Stack
                            direction="column"
                            justifyContent="center"
                            divider={<Divider orientation="horizontal" flexItem />}
                            alignItems="stretch"
                            spacing={2}
                        >
                            <ListItem>Name: {dog.name}</ListItem>
                            <ListItem>Sex: {dog.sex}</ListItem>
                            <ListItem>Breed: {dog.breed}</ListItem>
                            <ListItem>Age: {dog.age}</ListItem>
                            <ListItem>Introduction: {dog.intro}</ListItem>
                            { userInfo && userInfo.isAdmin ? (
                                <Box>
                                    <ListItemButton
                                        key="EditDog"
                                        sx={{ py: 0, minHeight: 40, width:"70%", color: 'rgba(0,0,0,.8)' }}
                                        component={Link}
                                        href={`../admin/dogs/${dogId}/edit`}

                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            <EditIcon sx={{ color: "black" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                        primary="Edit"
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
                                     <ListItemButton
                                        key="DeleteDog"
                                        sx={{ py: 0, minHeight: 40, width:"70%", color: 'rgba(0,0,0,.8)' }}
                                        onClick={dogDelete}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            <DeleteIcon sx={{ color: "black" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                        primary="Delete"
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
                                    
                                </Box>
                                
                            ) : userInfo && isFav ? (
                                <Box>
                                    <ListItemButton
                                        key="Favourite"
                                        sx={{ py: 0, minHeight: 40, width:"70%", color: 'rgba(0,0,0,.8)' }}
                                        onClick={deleteFromFav}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                        <FavoriteIcon sx={{ color: "red" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                        primary="Favourite"
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
                                    <MessageDialog type="send" />
                                </Box>
                            ) : userInfo && !isFav ? (
                                <Box>
                                    <ListItemButton
                                        key="Favourite"
                                        sx={{ py: 0, minHeight: 40, width:"70%", color: 'rgba(0,0,0,.8)' }}
                                        onClick={addToFav}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                        <FavoriteBorderIcon sx={{ color: "red" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                        primary="Add to Favourite"
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
                                    <MessageDialog type="send"/>
                                </Box>
                            ) : (
                                <ListItem>If you have interest, please&nbsp;<Link href={`/login?redirect=/dogs/${dogId}`}>login</Link></ListItem>
                            )                            
                            }
                            
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}