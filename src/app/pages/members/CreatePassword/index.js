import React, { useEffect } from 'react';
import AuthLayout from '../../../shared/components/authLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField, Grid, InputLabel } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Formik } from 'formik';
import { initialValues, Schema } from './helper';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCreatePasswordDetails } from '../../../services/BAuth';
import { ClipLoader } from 'react-spinners';
import FErrorMessage from '../../../shared/components/FErrorMessage';

const CreatePassword = () => {
  let params = useParams();
  const id = params?.id;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.createPassword?.loading);

  return (
    <AuthLayout>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values) => {
          dispatch(getCreatePasswordDetails(values, id, navigate));
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <Box flex={1}>
            <Box>
              <Typography
                fontSize={48}
                fontWeight={700}
                color={'#101828'}
                gutterBottom
              >
                Create Password
              </Typography>
            </Box>
            <form autoComplete="off" onSubmit={props.handleSubmit}>
              <Box
                pt={2}
                sx={{
                  '& .MuiTextField-root': { mb: 1 },
                }}
              >
                <InputLabel shrink>Password</InputLabel>
                <TextField
                  fullWidth
                  placeholder="password"
                  className="authfield"
                  value={props.values.password}
                  type="password"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="password"
                  error={
                    props.touched.password && Boolean(props.errors.password)
                  }
                  // helperText={props.touched.password && props.errors.password}
                  required
                />
                <FErrorMessage name="password" />
                <InputLabel shrink>Confirm Password</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Confirm Password"
                  className="authfield"
                  value={props.values.confirmPassword}
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  name="confirmPassword"
                  error={
                    props.touched.confirmPassword &&
                    Boolean(props.errors.confirmPassword)
                  }
                  type="password"
                  // helperText={
                  //   props.touched.confirmPassword &&
                  //   props.errors.confirmPassword
                  // }
                  required
                />
                <FErrorMessage name="confirmPassword" />
              </Box>
              <Button
                disabled={loading}
                className="containedPrimary"
                variant="contained"
                sx={{ width: '100%', marginTop: '20px' }}
                onClick={props.handleSubmit}
              >
                {loading ? (
                  <ClipLoader size={25} color="white" loading />
                ) : (
                  'Set Password'
                )}
              </Button>
              <ToastContainer />
            </form>
            <Box
              pt={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="text"
                sx={{ color: '#235D5E' }}
                onClick={() => navigate('/login', { replace: true })}
              >
                <ArrowBack /> Go to Login
              </Button>
            </Box>
          </Box>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default CreatePassword;
