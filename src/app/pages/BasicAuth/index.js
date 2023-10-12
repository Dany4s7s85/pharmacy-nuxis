import React, { useEffect, useState } from "react";
import { Button, TextField, IconButton, InputLabel } from "@mui/material";
import { Box, Grid, Typography } from "@mui/material";
import { InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../shared/components/authLayout";
import { authLoginRequest } from "../../services/BAuth";
import { ClipLoader } from "react-spinners";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import QRModal from "./QRModal";
import useDialogModal from "../../hooks/useDialogModal";
import ResendQRModal from "../ResendQR";
import { addProducts } from "../../services/cart";
import { useLocation } from "react-router-dom";
import eye from "../../assets/images/autheye.svg";
import FErrorMessage from "../../shared/components/FErrorMessage";
const Signin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const loading = useSelector((state) => state?.auth?.pharmacyLogin?.loading);
  const { user } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const [qrImg, setQRImage] = useState("");
  const [is_qr, setIs_Qr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [
    ResendQRModalDialog,
    showResendQRModalDialog,
    closeResendQRModalDialog,
  ] = useDialogModal(ResendQRModal);
  const [QRModalDetailDialog, showPharmacyDetailDialog, closePharmacyDialog] =
    useDialogModal(QRModal);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    let products = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
      }

      dispatch(addProducts(products));
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          setAuthLoading(true);
          dispatch(
            authLoginRequest(
              values,
              navigate,
              toast,
              function (obj) {
                if (obj.response && obj.is_qr) {
                  if (obj?.response?.data?.token != "false") {
                    setQRImage(obj?.response?.data?.token);
                    showPharmacyDetailDialog();
                    setIs_Qr(true);
                  } else {
                    setIs_Qr(true);
                  }
                } else {
                  setAuthLoading(false);
                }
              },
              location,
              function (err) {
                setAuthLoading(false);
              }
            )
          );
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <>
            <AuthLayout>
              <Box>
                <Box>
                  <Typography
                    fontSize={{ lg: 34, md: 34, sm: 30, xs: 25 }}
                    sx={{
                      fontWeight: "700",
                      color: "#000000",
                    }}
                  >
                    {is_qr ? "Enter QR Code" : "Authenticate Yourself"}
                  </Typography>
                  <Typography
                    fontSize={{ lg: 16, md: 16, sm: 14, xs: 12 }}
                    sx={{
                      fontWeight: "400",
                      color: "#70747E",
                    }}
                  >
                    {is_qr
                      ? "Use the token generated by the app in the code section"
                      : "Get Authenticated to use NxusRx"}
                  </Typography>
                </Box>
                <form onSubmit={props.handleSubmit}>
                  <Box pt={3}>
                    {!is_qr ? (
                      <>
                        <InputLabel shrink>Email</InputLabel>
                        <TextField
                          fullWidth
                          placeholder="Email"
                          className="authfield"
                          value={props.values.email}
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          name="email"
                          error={
                            props.touched.email && Boolean(props.errors.email)
                          }
                          type="email"
                          required
                        />
                        <FErrorMessage name="email" />
                        <Box pt={2}>
                          <InputLabel shrink>Password</InputLabel>
                        </Box>
                        <TextField
                          fullWidth
                          placeholder="password"
                          value={props.values.password}
                          type={showPassword ? "text" : "password"}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          name="password"
                          className="authfield"
                          error={
                            props.touched.password &&
                            Boolean(props.errors.password)
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box pr={1}>
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
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          required
                        />
                        <FErrorMessage name="password" />
                      </>
                    ) : (
                      <>
                        <>
                          <Box pt={2}>
                            <InputLabel shrink>Authenticator Code</InputLabel>
                          </Box>
                          <TextField
                            className="authfield"
                            fullWidth
                            placeholder="Enter Authenticator Code"
                            value={props.values.code}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            name="token"
                            type="text"
                          />
                          <FErrorMessage name="token" />
                          <Box sx={{ cursor: "pointer" }} mt={2}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              onClick={() => showResendQRModalDialog()}
                            >
                              Didn't get the code
                            </Typography>
                          </Box>
                        </>
                      </>
                    )}
                  </Box>

                  {!is_qr && (
                    <>
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              style={{
                                color: "#235D5E",
                                "&.Mui-checked": {
                                  color: "#D3DFDF",
                                },
                              }}
                            />
                          }
                          label="Remember me"
                        />
                      </Box>
                    </>
                  )}

                  <Button
                    disabled={loading}
                    className="containedPrimaryAuth"
                    size="large"
                    sx={{ marginTop: "16px", width: "100% !important" }}
                    variant="contained"
                    onClick={props.handleSubmit}
                  >
                    {authLoading ? (
                      <ClipLoader size={25} color="white" loading />
                    ) : (
                      "Get Authenticated"
                    )}
                  </Button>
                </form>

                <QRModalDetailDialog qrImage={qrImg} />
                <ResendQRModalDialog />
              </Box>
            </AuthLayout>
          </>
        )}
      </Formik>
    </>
  );
};

export default Signin;
