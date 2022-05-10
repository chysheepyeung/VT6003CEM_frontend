import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../Store.jsx';
import API from '../api';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '../TempComponents/Typography';
import AppForm from '../Form/AppForm';
import { email, required } from '../Form/validation';
import RFTextField from '../Form/RFTextField';
import FormButton from '../Form/FormButton';
import FormFeedback from '../Form/FormFeedback';
import withRoot from '../withRoot';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const [sent, setSent] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const navigate = useNavigate();
  const {search} = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

   const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

  const validate = (values) => {
    const errors = required(['email', 'password'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  

  async function handleSubmit(values){
    setSent(true);
    try{
        const response = await API.post('/login', values);
        ctxDispatch({ type: 'REGISTER', payload: response.data });
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        console.log(search)
        console.log(redirectInUrl)
        navigate(redirect || '/');
    }catch(error){
        setSubmitError(error.response.data.message);
        setSent(false);
    }
  };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

  return (
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Log In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <Link
              href="/register"
              align="center"
              underline="always"
            >
              Register
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit, submitting }) => (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 6 }}>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
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
                {submitting || sent ? 'In progress…' : 'Sign In'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
  );
}

export default withRoot(Login);
