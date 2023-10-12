import React from "react";
import AuthLayout from "../../shared/components/authLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, InputLabel, TextField } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getForgotPasswordDetails } from "../../services/BAuth";
import { ClipLoader } from "react-spinners";
import FErrorMessage from "../../shared/components/FErrorMessage";

const ForgetPassword = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.forgotPassword?.loading);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values) => {
        dispatch(getForgotPasswordDetails(values));
      }}
      validationSchema={Schema}
    >
      {(props) => (
        <AuthLayout>
          <Box>
            <Box>
              <Typography
                variant="h4"
                fontSize={{ lg: 44, md: 44, sm: 34, xs: 30 }}
                sx={{
                  fontWeight: "700",
                  color: "#000000",
                }}
              >
                Forget Password
              </Typography>
              <Typography
                fontSize={{ lg: 14, md: 14, sm: 14, xs: 11 }}
                sx={{
                  fontWeight: "400",
                  color: "#70747E",
                }}
              >
                No worries, We'll send you password reset instruction
                <br /> on your email
              </Typography>
            </Box>
            <form onSubmit={props.handleSubmit}>
              <Box pt={3}>
                <InputLabel shrink>Email</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Enter your Email"
                  name="email"
                  type="email"
                  className="authfield"
                  required
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.email}
                  error={props.touched.email && Boolean(props.errors.email)}
                />
                <FErrorMessage name="email" />
              </Box>

              <Button
                className="containedPrimaryAuth"
                variant="contained"
                sx={{ marginTop: "16px", width: "100% !important" }}
                size="large"
                onClick={props.handleSubmit}
              >
                {loading ? (
                  <ClipLoader size={25} color="white" loading />
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button
                className="containedPrimaryWhite"
                variant="contained"
                sx={{ marginTop: "16px", width: "100% !important" }}
                size="large"
                onClick={() => history("/login", { replace: true })}
              >
                Back to Login
              </Button>
            </form>
          </Box>
        </AuthLayout>
      )}
    </Formik>
  );
};

export default ForgetPassword;
