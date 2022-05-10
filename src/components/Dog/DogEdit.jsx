import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../TempComponents/LoadingBox'
import AlertBox from '../TempComponents/AlertBox'
import { getError } from '../../utils'
import { Store } from '../Store';
import { email,required } from '../Form/validation';
import { Field, Form, FormSpy } from 'react-final-form';
import RFTextField from '../Form/RFTextField';
import FormButton from '../Form/FormButton';
import FormFeedback from '../Form/FormFeedback';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';




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
    case 'FETCH_BREEDLIST':
        return { ...state,  breedList:[] };
    case 'FETCH_BREEDLIST_SUCCESS':
      return { ...state, breedList: action.payload };
    case 'FETCH_BREEDLIST_FAIL':
      return { ...state, breedList:[] };
    default:
      return state;
  }
};

export default function DogDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const { dogId, type } = params;

    const [name, setName] = React.useState('');
    const [sex, setSex] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [pic, setPic] = React.useState('');
    const [age, setAge] = React.useState('');
    const [intro, setIntro] = React.useState('');

    const validate = (values) => {
    const errors = required(['name', 'sex', 'breed', 'age'], values);
    

    return errors;
  };

    async function handleSubmit(values){
        console.log(values)
    }

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
                console.log(response)
                dispatch({type: "DELETE_DOGDETAIL_SUCCESS", payload: response.data.message})
            }
        }catch(error){
                dispatch({type: "DELETE_DOGDETAIL_FAIL", payload: getError(error)})
        }
    }

    const [{loading, error, dog, breedList, message, deleteError, sent, submitError}, dispatch] = 
    React.useReducer(reducer, {
        dog:[],
        loading: true,
        error: '',
        message: '',
        deleteError: '',
        sent: false,
        submitError: false,
        breedList: []
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
        fetchData();
    }, [dogId]);

    React.useEffect(() => {
        const fetchData = async () =>{
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
        fetchData();
    }, []);

    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;

    return loading ? (
        <LoadingBox />
    ) : message ? (
        <AlertBox type="success">{message}</AlertBox>
    ): error ? (
        <AlertBox type="error">{error}</AlertBox>
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
                                    src={dog.pic}
                                    alt={dog.name}
                                ></img>
                        </Box>
                        
                    </Grid>
                    <Grid item xs={3} >
                        <Form
                            onSubmit={handleSubmit}
                            subscription={{ submitting: true }}
                            validate={validate}
                            >
                            {({ handleSubmit: handleSubmit, submitting }) => (
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 6 }}>
                                <Field
                                    autoFocus
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    name="name"
                                    required
                                    size="small"
                                />
                                <Field
                                    fullWidth
                                    size="small"
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    required
                                    name="sex"
                                    label="Sex"
                                    select
                                    margin="normal"
                                >
                                    <MenuItem key="Male" value="M">
                                        Male
                                    </MenuItem>
                                    <MenuItem key="Female" value="F">
                                        Female
                                    </MenuItem>
                                </Field>
                                    
                                <Field
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Breed"
                                    margin="normal"
                                    name="breed"
                                    required
                                    select
                                    size="small"
                                >
                                    { breedList.map((breed) =>(
                                        <MenuItem key={breed.value} value={breed.value}>
                                            {breed.name}
                                        </MenuItem>
                                    ))}
                                </Field>

                                <Field
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Age"
                                    margin="normal"
                                    name="age"
                                    required
                                    type="number"
                                    size="small"
                                />

                                <Field
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Introduction"
                                    margin="normal"
                                    name="intro"
                                    size="small"
                                />
                                <FormSpy>
                                    {({ submitErrorr }) =>
                                    submitError ? (
                                        <FormFeedback error sx={{ mt: 2 }}>
                                        {submitError.toString()}
                                        </FormFeedback>
                                    ) : null
                                    }
                                </FormSpy>
                                <FormButton
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={submitting || sent}
                                    size="large"
                                    color="secondary"
                                    fullWidth
                                >
                                    {submitting || sent ? 'In progress…' : 'Submit'}
                                </FormButton>
                                </Box>
                            )}
                        </Form>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}