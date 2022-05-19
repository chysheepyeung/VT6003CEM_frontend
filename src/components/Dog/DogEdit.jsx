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
    case 'NO_NEED_FETCH_DOGDETAIL':
      return { ...state, loading: false };
    case 'UPDATE_DOGDETAIL':
        return { ...state,  message: '', error: '', updateError: '', sent: true };
    case 'UPDATE_DOGDETAIL_SUCCESS':
        return { ...state,  message: action.payload, sent: false };
    case 'UPDATE_DOGDETAIL_FAIL':
        return { ...state,  updateError: action.payload, sent: false };
    case 'FETCH_BREEDLIST':
        return { ...state,  breedList:[] };
    case 'FETCH_BREEDLIST_SUCCESS':
      return { ...state, breedList: action.payload };
    case 'FETCH_BREEDLIST_FAIL':
      return { ...state, breedList:[] };
    case 'UPLOAD_IMAGE_SUCCESS':
      return { ...state, dog: {...state.dog, pic: action.payload.fullPath}};
    case 'UPLOAD_IMAGE_FAIL':
      return { ...state, updateError: "Image upload fail, please try again"};
    default:
      return state;
  }
};

export default function DogDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const { dogId, type } = params;

    // const [name, setName] = React.useState('asd');
    // const [sex, setSex] = React.useState('M');
    // const [breed, setBreed] = React.useState('');
    const [pic, setPic] = React.useState('');
    // const [age, setAge] = React.useState('');
    // const [intro, setIntro] = React.useState('');

    const validate = (values) => {
    const errors = required(['name', 'sex', 'breed', 'age'], values);   

    return errors;
  };


    async function handleSubmit(values){
        if(dog.pic){
           values.pic = dog.pic;
        }
        if(type == "edit"){
            dispatch({type:"UPDATE_DOGDETAIL"});
            try{
                const response = await API.post(
                    `/dogs/${dogId}`,
                    values,
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}` }
                    }
                );
                if(response){
                    dispatch({type: "UPDATE_DOGDETAIL_SUCCESS", payload: response.data.message});
                    setTimeout(() => {
                        navigate(`/dogs/${dogId}`);
                    }, 2000);
                    
                }
            }catch(error){
                    dispatch({type: "UPDATE_DOGDETAIL_FAIL", payload: getError(error)});
            }
        }else if (type == "create"){
            dispatch({type:"UPDATE_DOGDETAIL"});
            try{
                const response = await API.post(
                    `/dogs`,
                    values,
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}` }
                    }
                );
                if(response){
                    console.log(response.data)
                    dispatch({type: "UPDATE_DOGDETAIL_SUCCESS", payload: response.data.message});
                    setTimeout(() => {
                        navigate(`/dogs/${response.data._id}`);
                    }, 2000);
                    
                }
            }catch(error){
                    dispatch({type: "UPDATE_DOGDETAIL_FAIL", payload: getError(error)});
            }
        }
    }

    const [{loading, error, dog, breedList, message, updateError, sent, submitError}, dispatch] = 
    React.useReducer(reducer, {
        dog:[],
        loading: true,
        error: '',
        message: '',
        updateError: '',
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
        if(type == "edit"){
            fetchData();
        }else if (type == "create"){
            dispatch({type: "NO_NEED_FETCH_DOGDETAIL"});
        }
        
    }, [dogId]);

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

    const { state, dispatch: ctxDispatch } = React.useContext(Store);
    const { userInfo } = state;

    const handlePhoto = async (e) =>{
        try{
         const formData = new FormData();
            formData.append('pic', e.target.files[0]);
            const response = await API.post(
                    `/image`,
                    formData,
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}` }
                    }
            );
            if (response){
                 dispatch({type: "UPLOAD_IMAGE_SUCCESS", payload: response.data});

            }
        }catch(error){
             dispatch({type: "UPLOAD_IMAGE_FAIL"});
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
            { updateError ? (
                <AlertBox type="error">{updateError}</AlertBox>
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
                        <Form
                            onSubmit={handleSubmit}
                            subscription={{ submitting: true }}
                            validate={validate}
                            initialValues={{ name: dog.name, sex: dog.sex, breed: dog.breed, age: dog.age, intro: dog.intro }}
                            enctype="multipart/form-data"
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
                                
                                {/* <ImageAudioVideo /> */}

                                <input  
                                    type="file"
                                    accept='.png, .jpg, .jpeg'
                                    name='pic'
                                    onChange={handlePhoto}
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