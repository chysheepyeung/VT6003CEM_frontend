import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Typography from '../TempComponents/Typography';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../TempComponents/LoadingBox'
import AlertBox from '../TempComponents/AlertBox'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Store } from '../Store';
import SearchIcon from '@mui/icons-material/Search';
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from '../Form/RFTextField';
import FormButton from '../Form/FormButton';
import MenuItem from '@mui/material/MenuItem';
import { getError } from '../../utils'
import axios from 'axios';
import Grid from '@mui/material/Grid';

const ImageBackdrop = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: '#000',
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    marginRight: "30px",
    marginBottom: "30px",
    [theme.breakpoints.down('md')]: {
        width: '100% !important',
        height: 100,
    },
    '&:hover': {
        zIndex: 1,
    },
    '&:hover .imageBackdrop': {
        opacity: 0.15,
    },
    '&:hover .imageMarked': {
        opacity: 0,
    },
    '&:hover .imageTitle': {
        border: '4px solid currentColor',
    },
    '& .imageTitle': {
        position: 'relative',
        padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
    },
    '& .imageMarked': {
        height: 3,
        width: 18,
        background: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
}));


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DOGS':
      return { ...state, loading: true };
    case 'FETCH_DOGS_SUCCESS':
      return { ...state, dogs: action.payload, loading: false };
    case 'FETCH_DOGS_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_BREEDLIST':
        return { ...state,  breedList:[] };
    case 'FETCH_BREEDLIST_SUCCESS':
      return { ...state, breedList: action.payload };
    case 'FETCH_BREEDLIST_FAIL':
      return { ...state, breedList:[] };
    case 'SEARCH_DOG':
        return {...state, name: action.payload.name, age: action.payload.age, sex: action.payload.sex, breed:action.payload.breed};
    default:
      return state;
  }
};

export default function DogList() {
    const navigate = useNavigate();
    const [{loading, error, dogs, breedList, name, age, sex, breed}, dispatch] = React.useReducer(reducer, {
        dogs: [],
        loading: true,
        error: '',
        breedList:[],
        name:'',
        breed:'',
        sex:'',
        age:''
    })

    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;


    const onDogClick = function(id) {
        navigate(`/dogs/${id}`);
    }

    const handleSubmit = function(values){
        dispatch({type: 'SEARCH_DOG', payload: values})
    }


    React.useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_DOGS'})
            try{
                const response = await API.get('/dogs');
                if(response){
                    dispatch({type: 'FETCH_DOGS_SUCCESS', payload: response.data})
                }
            }catch(error){
                dispatch({type: 'FETCH_DOGS_FAIL', payload: error.message})
            }
        }

        fetchData();
    }, []);

     React.useEffect(() => {
        const fetchBreedList = async () =>{
            dispatch({type: "FETCH_BREEDLIST"});
            try{
                const response = await axios.get("https://dog.ceo/api/breeds/list/all");
                if(response){
                    var breedObj = response.data.message;
                    var breedList = [];
                    for (const [key, value] of Object.entries(breedObj)) {
                        if(value.length >= 1){
                            value.forEach((subBreed) => {
                                breedList.push({name: `${subBreed} ${key.toString()}`, value: `${key.toString()}-${subBreed}`})
                            })
                        }else{
                            breedList.push({name: `${key.toString()}`, value: `${key.toString()}`})
                        }
                    }
                    dispatch({type: "FETCH_BREEDLIST_SUCCESS", payload: breedList});
                }
            }catch(error){
                dispatch({type: "FETCH_BREEDLIST_FAIL", payload: getError(error)})
            }
        };

        fetchBreedList();
    }, []);

    return  (
        <Container component="section" sx={{ mt: 8, mb: 4 }}>

            <Form
                            onSubmit={handleSubmit}
                            sx={{display: "flex"}}
                            >
                            {({ handleSubmit: handleSubmit, submitting }) => (
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 6 }}>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                    <Grid item xs={6}>
                                        <Field
                                            autoFocus
                                            component={RFTextField}
                                            fullWidth
                                            label="Name"
                                            margin="normal"
                                            name="name"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                size="small"
                                                component={RFTextField}
                                                name="sex"
                                                label="Sex"
                                                select
                                                margin="normal"
                                            >
                                                <MenuItem key="" value="">
                                                    All
                                                </MenuItem>
                                                <MenuItem key="Male" value="M">
                                                    Male
                                                </MenuItem>
                                                <MenuItem key="Female" value="F">
                                                    Female
                                                </MenuItem>
                                            </Field>
                                    </Grid>

                                    <Grid item xs={6}>
                                             <Field
                                            component={RFTextField}
                                            fullWidth
                                            label="Breed"
                                            margin="normal"
                                            name="breed"
                                            select
                                            size="small"
                                        >
                                            <MenuItem key="" value="">
                                                    All
                                                </MenuItem>
                                            { breedList.map((breed) =>(
                                                <MenuItem key={breed.value} value={breed.value}>
                                                    {breed.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Field
                                    component={RFTextField}
                                    fullWidth
                                    label="Age"
                                    margin="normal"
                                    name="age"
                                    type="number"
                                    size="small"
                                />
                                    </Grid>
                                </Grid>
                                <FormButton
                                    sx={{ mt: 3, mb: 2 }}
                                    size="large"
                                    color="secondary"
                                    fullWidth
                                >
                                    {'Search'}
                                </FormButton>
                                </Box>
                            )}
                        </Form>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <AlertBox type="error">{error}</AlertBox>
            ):(
                <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap' }}>
                {dogs.filter((dog) => {
                    var chk = true;
                    if(name){
                        if(!dog.name.toUpperCase().includes(name.toUpperCase())){
                            chk = false;
                        }
                    }

                    if(sex){
                        if(dog.sex != sex){
                            chk = false;
                        }
                    }

                    if(age){
                        if(dog.age != age){
                            chk = false;
                        }
                    }

                    if(breed){
                        if(dog.breed != breed){
                            chk = false;
                        }
                    }

                    if(chk){
                        return dog;
                    }
                }).map((dog) => (
                    <ImageIconButton
                        key={dog.name}
                        style={{
                            width: "30%",
                        }}
                        onClick={() => onDogClick(dog._id)}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 40%',
                                backgroundImage: dog.pic ? `url(${dog.pic})` : `url(/img/no-image.jpg)`,
                            }}
                        />
                        <ImageBackdrop className="imageBackdrop" />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'common.white',
                            }}
                        >
                            <Typography
                                component="h3"
                                variant="h6"
                                color="inherit"
                                className="imageTitle"
                            >
                                {dog.name}
                                <div className="imageMarked" />
                            </Typography>
                        </Box>
                    </ImageIconButton>
                ))}
            </Box>
            )}
        </Container>
    );
}
