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
    default:
      return state;
  }
};

export default function ProductCategories() {
    const navigate = useNavigate();
    const [{loading, error, dogs}, dispatch] = React.useReducer(reducer, {
        dogs: [],
        loading: true,
        error: ''
    })

    const onDogClick = function(id) {
        console.log(id);
        navigate(`/dogs/${id}`);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_DOGS'})
            try{
                const response = await API.get('/dogs');
                if(response){
                    dispatch({type: 'FETCH_DOGS_SUCCESS', payload: response.data})
                    console.log(dogs)
                }
            }catch(error){
                console.log(error)
                dispatch({type: 'FETCH_DOGS_FAIL', payload: error.message})
            }
        }

        fetchData();
    }, []);

    return  (
        <Container component="section" sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" marked="center" align="center" component="h2">
                For All Dogs
            </Typography>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <AlertBox type="error">{error}</AlertBox>
            ):(
                <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap' }}>
                {dogs.map((dog) => (
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
                                backgroundImage: `url(${dog.pic})`,
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
