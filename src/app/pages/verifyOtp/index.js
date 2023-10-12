import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, InputLabel } from '@mui/material';
import { Formik } from 'formik';
import { initialValues, Schema } from './helper';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import AuthLayout from '../../shared/components/authLayout';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  pharmacyResendVerificationOtp,
  pharmacyVerificationOtp,
} from '../../services/BAuth';
const VerifyOtp = () => {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state?.auth?.pharmacyVerifyOtp?.loading
  );
  const reLoading = useSelector(
    (state) => state?.auth?.resendVerifyOtp?.loading
  );
  const location = useLocation();
  const navigate = useNavigate();

  const email = location?.state?.email;
  const businessId = location?.state?.id;

  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(1);
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSec) => prevSec - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
        } else {
          setMinutes((prevMinute) => prevMinute - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [seconds, minutes]);
  useEffect(() => {
    if (businessId == undefined) {
      navigate('/login');
    }
  }, []);

  const handleResendOtp = () => {
    dispatch(
      pharmacyResendVerificationOtp(businessId, email, function (response) {
        if (response?.status == 'success') {
          setSeconds(60);
          setMinutes(1);
        }
      })
    );
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          dispatch(pharmacyVerificationOtp(values, businessId, navigate));
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <>
            <AuthLayout>
              <Box mt={5}>
                <Box pb={3}>
                  <Typography
                    fontSize={{ lg: 48, md: 48, sm: 35, xs: 30 }}
                    fontWeight={700}
                    gutterBottom
                  >
                    Verify OTP
                  </Typography>
                  <span>
                    {' '}
                    <Typography
                      color={'#70747E'}
                      fontSize={{ lg: 16, md: 16, sm: 16, xs: 14 }}
                    >
                      We have sent an OTP code to your {email}
                    </Typography>
                  </span>
                  <span>
                    {' '}
                    <Typography
                      color={'#70747E'}
                      fontSize={{ lg: 16, md: 16, sm: 16, xs: 14 }}
                    >
                      {' '}
                      please enter the code below{' '}
                    </Typography>
                  </span>
                </Box>
                <ValidatorForm autoComplete="off" onSubmit={props.handleSubmit}>
                  <InputLabel shrink> Enter 4 Digit OTP</InputLabel>
                  <Box
                    sx={{
                      '& .MuiTextField-root': { mb: 2 },
                    }}
                  >
                    <TextValidator
                      className="authfield"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      variant="outlined"
                      inputProps={{ maxLength: 4 }}
                      name="otp"
                      fullWidth
                      validators={['required']}
                      errorMessages={['OTP is required']}
                      value={props.values.otp}
                    />
                  </Box>

                  <Button
                    className="containedPrimary"
                    variant="contained"
                    size="medium"
                    sx={{ width: '100%' }}
                    onClick={props.handleSubmit}
                  >
                    {loading ? (
                      <ClipLoader size={25} color="white" loading />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                  <ToastContainer />
                </ValidatorForm>
                <Box
                  pt={3}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary" variant="body">
                    Resend OTP in{' '}
                    {minutes === 0 && seconds === 0 ? (
                      <Button
                        onClick={handleResendOtp}
                        sx={{
                          padding: '0px',
                          paddingLeft: '5px',
                          color: '#F04438',
                        }}
                      >
                        {reLoading ? (
                          <ClipLoader size={25} color="#235D5E" reLoading />
                        ) : (
                          'Resend Otp'
                        )}
                      </Button>
                    ) : (
                      <span>
                        0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                    )}
                  </Typography>
                </Box>
              </Box>
            </AuthLayout>
          </>
        )}
      </Formik>
    </>
  );
};

export default VerifyOtp;
