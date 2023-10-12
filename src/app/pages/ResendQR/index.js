import React, { useEffect } from 'react';
import AuthLayout from '../../shared/components/authLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Formik, replace } from 'formik';
import { initialValues, Schema } from './helper';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resendQR } from '../../services/BAuth';
import { ClipLoader } from 'react-spinners';
import Modal from '@mui/material/Modal';

const ResendQR = ({ open, onClose }) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.resendQRLoading?.loading);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          try {
            dispatch(
              resendQR(values, function (res) {
                if (res) {
                  resetForm();
                  onClose();
                }
              })
            );
          } catch (e) {}
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <AuthLayout>
            <Box>
              <Typography variant="h4" gutterBottom>
                Resend QR
              </Typography>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                No worries, We'll send you QR instructions on your email
              </Typography>
              <form autoComplete="off" onSubmit={props.handleSubmit}>
                <Box py={2} my={2}>
                  <TextField
                    fullWidth
                    placeholder="Enter your Email"
                    name="email"
                    type="email"
                    required
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    value={props.values.email}
                    error={props.touched.email && Boolean(props.errors.email)}
                    // helperText={props.touched.email && props.errors.email}
                  />
                  {/* <FErrorMessage name="email" /> */}
                </Box>
                <Button
                  className="containedPrimary"
                  variant="contained"
                  sx={{ width: '100%', marginTop: '30px' }}
                  onClick={props.handleSubmit}
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    'Resend QR'
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
                <Button variant="text" onClick={() => onClose()}>
                  <ArrowBack /> Back to Login
                </Button>
              </Box>
            </Box>
          </AuthLayout>
        )}
      </Formik>
    </Modal>
  );
};

export default ResendQR;
