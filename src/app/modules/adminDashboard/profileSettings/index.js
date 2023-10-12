import React, { useRef } from "react";
import "./profile.scss";
import {
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  ListItem,
  ListItemIcon,
  TextField,
  Typography,
} from "@mui/material";
import ChangePassword from "../../../assets/images/password.svg";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { useSelector, useDispatch } from "react-redux";
import List from "@mui/material/List";
import PreviewImage from "./PreviewImage";
import FErrorMessage from "../../../shared/components/FErrorMessage";
import { getUpdateProfileDetails } from "../../../services/auth";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state?.auth?.updateProfile?.loading);
  const response = useSelector((state) => state?.auth?.pharmacyLogin?.response);
  const postcode = response?.data?.postcode;
  return (
    <Formik
      initialValues={response.data ? response.data : initialValues}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        try {
          dispatch(getUpdateProfileDetails(values, postcode, toast));
        } catch (e) {}
      }}
      validationSchema={Schema}
    >
      {(props) => (
        <>
          <Card>
            <CardContent>
              <Typography variant="h5">Edit Profile</Typography>
              <Grid
                container
                alignItems="center"
                p={3}
                sx={{ height: "calc(100% - 20px)", overflow: "auto" }}
              >
                <Grid
                  item
                  md={4}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" gutterBottom mb={3}>
                    <img src={response?.data?.pharmacy_photo} />
                  </Typography>
                  {props.values.file && (
                    <PreviewImage file={props.values.file} />
                  )}
                  <input
                    hidden
                    type="file"
                    onChange={(e) => {
                      props.setFieldValue("file", e.target.files[0]);
                    }}
                    ref={fileRef}
                  />

                  <Button
                    sx={{ marginTop: "30px" }}
                    variant="contained"
                    className="containedPrimary"
                    onClick={() => fileRef.current.click()}
                  >
                    Change Image
                  </Button>
                  <FErrorMessage name="file" />
                  <List sx={{ marginTop: "40px" }}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => navigate("/dash/updatePassword")}
                      >
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <img src={ChangePassword} width="24px" />
                        </ListItemIcon>
                        <ListItemText primary="Change Password" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item md={8} xs={12}>
                  <Grid container spacing={3} mt={3}>
                    <Grid item xs={12} mt={3}>
                      <Typography color="text.primary" variant="h6">
                        Pharmacy Information
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Pharmacy Name"
                        name="pharmacy_name"
                        value={response?.data?.pharmacy_name}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        variant="filled"
                        value={response?.data?.location}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        variant="filled"
                        value={response?.data?.country}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        variant="filled"
                        value={response.data?.state}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Postcode"
                        name="postcode"
                        variant="filled"
                        value={response.data?.postcode}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Pharmacy License No"
                        variant="filled"
                        value={response.data?.pharmacy_license_number}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Pharmacy Owner Name"
                        variant="filled"
                        value={response.data?.pharmacy_owner}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions dir={"rtl"}>
              <ButtonGroup
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  "& > *": {
                    mx: 2,
                  },
                }}
              >
                <Button
                  variant="contained"
                  className="containedPrimary"
                  id="long-button"
                  aria-haspopup="true"
                  onClick={props.handleSubmit}
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <ToastContainer />
                <Button
                  variant="contained"
                  className="containedDefault"
                  id="long-button"
                  aria-haspopup="true"
                  onClick={() => props.resetForm()}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default Profile;
