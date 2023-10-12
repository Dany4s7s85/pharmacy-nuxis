import React from "react";
import AuthLayout from "../../shared/components/authLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, InputLabel, TextField } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getResetPasswordDetails } from "../../services/BAuth";
import { ClipLoader } from "react-spinners";

const ResetPassword = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.resetPassword?.loading);

  return (
    <AuthLayout>
      <Box>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={(values) => {
            dispatch(getResetPasswordDetails(values, id, navigate));
          }}
          validationSchema={Schema}
        >
          {(props) => (
            <Box>
              <Box pt={{ xs: 2 }}>
                <Typography
                  fontSize={{ lg: 44, md: 44, sm: 34, xs: 30 }}
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Reset Password
                </Typography>
              </Box>
              <form autoComplete="off" onSubmit={props.handleSubmit}>
                <Box pt={2}>
                  <InputLabel shrink>Password</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Password"
                    className="authfield"
                    value={props.values.password}
                    type="password"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    name="password"
                    error={
                      props.touched.password && Boolean(props.errors.password)
                    }
                    helperText={props.touched.password && props.errors.password}
                    required
                  />
                  <Box pt={2}>
                    <InputLabel shrink>Confirm Password</InputLabel>
                  </Box>
                  <TextField
                    fullWidth
                    className="authfield"
                    placeholder="Confirm Password"
                    value={props.values.confirmPassword}
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    name="confirmPassword"
                    error={
                      props.touched.confirmPassword &&
                      Boolean(props.errors.confirmPassword)
                    }
                    type="password"
                    helperText={
                      props.touched.confirmPassword &&
                      props.errors.confirmPassword
                    }
                    required
                  />
                </Box>
                <Box pt={2}>
                  <Button
                    className="containedPrimaryAuth"
                    variant="contained"
                    size="large"
                    onClick={props.handleSubmit}
                  >
                    {loading ? (
                      <ClipLoader size={25} color="white" loading />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Box>
              </form>
              <Box
                pt={{ lg: 3, md: 3, sm: 2, xs: 1 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  size="large"
                  variant="contained"
                  className="containedPrimaryWhite"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
    </AuthLayout>
  );
};

export default ResetPassword;
