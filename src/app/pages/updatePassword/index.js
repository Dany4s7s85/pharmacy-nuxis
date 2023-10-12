import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField, Grid, IconButton, InputLabel } from '@mui/material';
import { InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ArrowBack } from '@mui/icons-material';
import { Formik } from 'formik';
import { initialValues, Schema } from '../resetPassword/helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUpdatePasswordDetails,
  updateBusinessPasswordDetails,
  updateMemberPasswordDetails,
} from '../../services/BAuth';
import { ClipLoader } from 'react-spinners';
import FErrorMessage from '../../shared/components/FErrorMessage';
import { useNavigate } from 'react-router-dom';
import eye from '../../assets/images/autheye.svg';
const UpdatePassword = ({ location, role, handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.updatePassword?.loading);
  const busLoading = useSelector(
    (state) => state?.auth?.updateBusinessPassword?.loading
  );
  const memberLoading = useSelector(
    (state) => state?.auth?.updateMemberPassword?.loading
  );
  useEffect(() => {}, [dispatch]);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        if (location.pathname.includes('bus') && role == 'super_admin') {
          dispatch(updateBusinessPasswordDetails(values, resetForm, navigate));
        } else if (role !== 'super_admin') {
          dispatch(updateMemberPasswordDetails(values, resetForm, navigate));
        } else {
          dispatch(getUpdatePasswordDetails(values, resetForm, navigate));
        }
      }}
      validationSchema={Schema}
    >
      {(props) => (
        <>
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <Box className="modal-content-mui" sx={{ height: '360px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel shrink> Current Password</InputLabel>
                  <TextField
                    fullWidth
                    className="authfield"
                    value={props.values.currentPassword}
                    type={showCurrentPassword ? 'text' : 'password'}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    name="currentPassword"
                    error={
                      props.touched.currentPassword &&
                      Boolean(props.errors.currentPassword)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <img src={eye} />
                            ) : (
                              <img src={eye} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                  <FErrorMessage name="currentPassword" />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel shrink>New Password</InputLabel>
                  <TextField
                    fullWidth
                    className="authfield"
                    value={props.values.password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    name="password"
                    error={
                      props.touched.password && Boolean(props.errors.password)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <img src={eye} />
                            ) : (
                              <img src={eye} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                  <FErrorMessage name="password" />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel shrink>Confirm Password</InputLabel>
                  <TextField
                    fullWidth
                    className="authfield"
                    value={props.values.confirmPassword}
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    name="confirmPassword"
                    error={
                      props.touched.confirmPassword &&
                      Boolean(props.errors.confirmPassword)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <img src={eye} />
                            ) : (
                              <img src={eye} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                  <FErrorMessage name="confirmPassword" />
                </Grid>
              </Grid>
            </Box>
            <Box className="modal-footer-mui">
              <Button
                className="contained contained-primary"
                variant="contained"
                onClick={props.handleSubmit}
                sx={{ padding: '7px 12px !important' }}
              >
                {busLoading || loading || memberLoading ? (
                  <ClipLoader size={25} color="white" loading />
                ) : (
                  'Update Password'
                )}
              </Button>
              <Button
                variant="contained"
                className="contained contained-default"
                style={{ marginLeft: '10px' }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </form>
          {location?.pathname.includes('profile') ? null : (
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
                onClick={() => navigate('/login', { replace: true })}
              >
                <ArrowBack /> Back to Login
              </Button>
            </Box>
          )}
        </>
      )}
    </Formik>
  );
};

export default UpdatePassword;
