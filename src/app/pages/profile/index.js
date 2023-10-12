import React, { useRef, useState } from "react";
import "./profile.scss";
import { resizeFile } from "../../helpers/imageResizer";
import Modal from "@mui/material/Modal";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Box,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { storage } from "../../firebase";
import { Clear } from "@mui/icons-material";
import { Formik } from "formik";
import {
  initialValues,
  memberInitialValues,
  memberSchema,
  Schema,
} from "./helper";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import FErrorMessage from "../../shared/components/FErrorMessage";
import {
  getUpdateProfileDetails,
  pharmacyLoginSuccess,
  updateBusinessProfileDetails,
} from "../../services/BAuth";
import camera from "../../assets/images/camera.svg";
import { useLocation, useNavigate } from "react-router-dom";
import UpdatePassword from "../updatePassword";
import KycDocument from "../../shared/components/KycDocument";
import { updateMemberProfileDetails } from "../../services/members";
import avatar from "../../assets/images/avatar.png";
import { capitalize } from "../../helpers/formatting";

export const Profile = () => {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const { user } = useSelector((state) => state?.auth);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.updateProfile?.loading);
  const memberLoading = useSelector(
    (state) => state?.members?.updateMemberProfile?.loading
  );
  const busLoading = useSelector(
    (state) => state?.auth?.updateBusinessProfile?.loading
  );

  const response = useSelector((state) => state?.auth?.userLogin?.response);
  const [imageLoading, setImageLoading] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [fieldName, setFieldName] = useState("");

  const handleSelect = async (value) => {
    let country = {};
    let city = {};
    let state = {};
    let postalCode = {};
    for (let i = 0; i < value.address_components.length; i++) {
      if (value.address_components[i].types.includes("locality")) {
        city.long_name = value.address_components[i].long_name;
        city.short_name = value.address_components[i].short_name;
      } else if (
        value.address_components[i].types.includes(
          "administrative_area_level_1"
        )
      ) {
        state.long_name = value.address_components[i].long_name;
        state.short_name = value.address_components[i].short_name;
      } else if (value.address_components[i].types.includes("country")) {
        country.long_name = value.address_components[i].long_name;
        country.short_name = value.address_components[i].short_name;
      } else if (value.address_components[i].types.includes("postal_code")) {
        postalCode.postcode = value.address_components[i].long_name;
      }
    }

    setCity(city.long_name);
    setCountry(country.long_name);
    setProvince(state.long_name);
    setZipCode(postalCode.postcode);
  };
  const handleImageUpload = async (file, fieldName, props, index) => {
    if (!file) return;
    setFieldName(fieldName);
    setImageLoading(true);

    const image = await resizeFile(file, 800, 800);

    const storageRef = ref(storage, `user/profile/${file.name}-${Date.now()}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
        setImageLoading(false);
        setProgresspercent(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (fieldName == "business_photo") {
            props.setFieldValue("business_photo", downloadURL);
            if (
              location?.pathname?.includes("bus") &&
              user?.role == "super_admin"
            ) {
              dispatch(
                updateBusinessProfileDetails(
                  downloadURL,
                  user?.postcode,
                  function (response) {
                    if (response?.status === "success") {
                      delete response?.data?.token;
                      dispatch(
                        pharmacyLoginSuccess({
                          data: { ...user, ...response?.data },
                        })
                      );
                      setToggle(false);
                    }
                  }
                )
              );
            } else if (user.role !== "super_admin") {
              dispatch(
                updateMemberProfileDetails(downloadURL, function (response) {
                  if (response?.status === "success") {
                    delete response?.data?.token;
                    dispatch(
                      pharmacyLoginSuccess({
                        data: { ...user, ...response?.data },
                      })
                    );
                    setToggle(false);
                  }
                })
              );
            } else {
              dispatch(
                getUpdateProfileDetails(
                  downloadURL,
                  user?.postcode,
                  function (response) {
                    if (response?.status === "success") {
                      delete response?.data?.token;
                      dispatch(
                        pharmacyLoginSuccess({
                          data: { ...user, ...response?.data },
                        })
                      );
                      setToggle(false);
                    }
                  }
                )
              );
            }
          }

          setImageLoading(false);
          setProgresspercent(0);
        });
      }
    );
  };
  const handleRemoveImage = (publicId, fieldName, index, props) => {
    if (publicId) {
      let pictureRef = ref(storage, publicId);
      deleteObject(pictureRef)
        .then(() => {
          if (fieldName == "business_photo") {
            props.setFieldValue("business_photo", "");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  const memberValues = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    profile_photo: user?.profile_photo,
  };

  return (
    <>
      <Box className="admin-layout" component="div">
        <Typography className="profile-heading">Profile</Typography>
        <Box className="profile-background"></Box>
        <Formik
          initialValues={
            user.role == "super_admin"
              ? user
                ? user
                : initialValues
              : memberValues
              ? memberValues
              : memberInitialValues
          }
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            try {
              if (
                location?.pathname?.includes("bus") &&
                user?.role == "super_admin"
              ) {
                dispatch(
                  updateBusinessProfileDetails(
                    values,
                    user?.postcode,
                    function (response) {
                      if (response?.status === "success") {
                        delete response?.data?.token;
                        dispatch(
                          pharmacyLoginSuccess({
                            data: { ...user, ...response?.data },
                          })
                        );
                        setToggle(false);
                      }
                    }
                  )
                );
              } else if (user.role !== "super_admin") {
                dispatch(
                  updateMemberProfileDetails(values, function (response) {
                    if (response?.status === "success") {
                      delete response?.data?.token;
                      dispatch(
                        pharmacyLoginSuccess({
                          data: { ...user, ...response?.data },
                        })
                      );
                      setToggle(false);
                    }
                  })
                );
              } else {
                dispatch(
                  getUpdateProfileDetails(
                    values,
                    user?.postcode,
                    function (response) {
                      if (response?.status === "success") {
                        delete response?.data?.token;
                        dispatch(
                          pharmacyLoginSuccess({
                            data: { ...user, ...response?.data },
                          })
                        );
                        setToggle(false);
                      }
                    }
                  )
                );
              }
            } catch (e) {}
          }}
          validationSchema={user?.role == "super_admin" ? Schema : memberSchema}
        >
          {(props) => (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  position: "relative",
                  alignItems: "center",
                  marginBottom: "4rem",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: "1rem", sm: "4rem" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ position: "relative", display: "flex" }}>
                    {(user.role !== "super_admin" &&
                      props?.values?.profile_photo == undefined) ||
                    (user.role == "super_admin" &&
                      props?.values?.business_photo == undefined) ? (
                      <img src={avatar} className="profileAvatar" />
                    ) : user?.role !== "super_admin" ? (
                      <img
                        src={props.values.profile_photo}
                        className="profileAvatar"
                      />
                    ) : (
                      <img
                        src={props.values.business_photo}
                        className="profileAvatar"
                      />
                    )}

                    <IconButton
                      className="edit-image"
                      onClick={() => fileRef.current.click()}
                    >
                      <img src={camera} />
                    </IconButton>
                    {fieldName == "business_photo" && imageLoading && (
                      <CircularProgressbar
                        styles={buildStyles({
                          width: 3000,
                          height: 3000,
                          backgroundColorcolor: "#235D5E",
                          pathColor: `rgba(35,93,94,${progresspercent / 100})`,
                          trailColor: "#235D5E",
                          textColor: "#235D5E",
                          textSize: "25px",
                        })}
                        value={progresspercent}
                        text={`${progresspercent}%`}
                        className="profileImgLoader p-absolute"
                      />
                    )}
                  </Box>

                  <Box sx={{ pt: 10, pl: 2 }}>
                    <Box>
                      <Typography className="profile-heading">
                        {user && user?.role == "super_admin"
                          ? capitalize(user?.business_owner_name)
                          : capitalize(user?.first_name)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="profile-subheading"
                      >
                        {user && user?.role == "super_admin"
                          ? "Business Owner at " +
                            capitalize(user?.business_name)
                          : "Member at " +
                            capitalize(user?.business?.business_name)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {props.values.business_photo && (
                <>
                  {" "}
                  <IconButton
                    onClick={() =>
                      handleRemoveImage(
                        props.values.business_photo,
                        "business_photo",
                        "",
                        props
                      )
                    }
                    aria-label="delete picture"
                    sx={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      color: "red",
                      zIndex: "1",
                      padding: "3px",
                    }}
                  >
                    <Clear />
                  </IconButton>
                </>
              )}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0], "business_photo", props)
                }
                ref={fileRef}
              />

              <FErrorMessage name="business_photo" />

              <Grid container mt={2} spacing={3}>
                <Grid item xs={6} sm={6} md={2} lg={2}>
                  <Box>
                    <nav aria-label="secondary mailbox folders">
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            component="a"
                            onClick={() => navigate("/dash/store-profile")}
                          >
                            <ListItemText
                              primary="Store Profile"
                              className="profile-nav-text"
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton component="a" onClick={handleOpen}>
                            <ListItemText
                              primary="Change Password"
                              className="profile-nav-text"
                            />
                          </ListItemButton>
                        </ListItem>
                        {/* <ListItem disablePadding>
                          <ListItemButton component="a" href="#simple-list">
                            <ListItemText
                              primary="Password"
                              className="profile-nav-text"
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton component="a" href="#simple-list">
                            <ListItemText
                              primary="Data Export"
                              className="profile-nav-text"
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton component="a" href="#simple-list">
                            <ListItemText primary="Social Profiles" />
                          </ListItemButton>
                        </ListItem> */}
                      </List>
                    </nav>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10}>
                  <Box>
                    <Card className="profile-card">
                      <CardHeader
                        className="card-heading"
                        title="User Information"
                        sx={{ flex: 1 }}
                      ></CardHeader>

                      <CardContent>
                        <Grid container spacing={2} xs={12} md={8}>
                          <Grid item xs={12} sm={6}>
                            {user?.role == "super_admin" ? (
                              <Typography
                                className="profile-text-heading"
                                variant="subtitle2"
                              >
                                Business Name
                              </Typography>
                            ) : (
                              <Typography
                                className="profile-text-heading"
                                variant="subtitle2"
                              >
                                First Name
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {user?.role == "super_admin" ? (
                              <Typography
                                variant="body"
                                className="profile-text-ans"
                              >
                                {user?.role !== "super_admin"
                                  ? capitalize(user?.business?.business_name)
                                  : capitalize(user?.business_name)}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body"
                                className="profile-text-ans"
                              >
                                {capitalize(user?.first_name)}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {user?.role == "super_admin" ? (
                              <Typography
                                className="profile-text-heading"
                                variant="subtitle2"
                              >
                                Owner Name
                              </Typography>
                            ) : (
                              <Typography
                                className="profile-text-heading"
                                variant="subtitle2"
                              >
                                Last Name
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {user?.role == "super_admin" ? (
                              <Typography
                                variant="subtitle1"
                                className="profile-text-ans"
                              >
                                {capitalize(user?.business_owner_name)}
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle1"
                                className="profile-text-ans"
                              >
                                {capitalize(user?.last_name)}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Email
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {user?.email}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Role
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {capitalize(user?.role)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Pharmacist
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {user?.is_pharmacist ? "Yes" : "No"}
                            </Typography>
                          </Grid>

                          {user?.license_no && (
                            <>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  className="profile-text-heading"
                                  variant="subtitle2"
                                >
                                  License No
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="subtitle1"
                                  className="profile-text-ans"
                                >
                                  {user?.license_no}
                                </Typography>
                              </Grid>
                            </>
                          )}
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Country
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {capitalize(user?.country)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Province
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {user?.role !== "super_admin" ? (
                              <Typography
                                variant="subtitle1"
                                className="profile-text-ans"
                              >
                                {capitalize(user?.business?.state)}
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle1"
                                className="profile-text-ans"
                              >
                                {capitalize(user?.state)}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              City
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {user?.city}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>

                  <Box mt={2}>
                    <Card className="profile-card">
                      <CardHeader
                        className="card-heading"
                        title="Location"
                        sx={{ flex: 1 }}
                      ></CardHeader>
                      <CardContent>
                        <Grid container spacing={2} xs={12} md={8}>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {user?.location}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Country
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {capitalize(user?.country)}
                            </Typography>
                          </Grid>
                          {user?.store && user?.store?.email && (
                            <>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  className="profile-text-heading"
                                  variant="subtitle2"
                                >
                                  Store Email
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="subtitle1"
                                  className="profile-text-ans"
                                >
                                  {user?.store?.email}
                                </Typography>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>

                  {user?.role !== "super_admin" ? (
                    <Box mt={2}>
                      <Card className="profile-card">
                        <CardContent>
                          <KycDocument memberId={user?.id} />
                        </CardContent>
                      </Card>
                    </Box>
                  ) : null}
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Box
          className="modal-mui"
          sx={{ width: { xs: "90%!important", sm: "450px!important" } }}
        >
          <Box className="modal-header-mui">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Change Password
            </Typography>
            <Divider />
          </Box>

          <UpdatePassword
            location={location}
            passwordToggle={passwordToggle}
            role={user?.role}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </>
  );
};

export default Profile;
//
