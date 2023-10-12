import React, { useRef, useState, useContext } from "react";
import "./profile.scss";
import { resizeFile } from "../../helpers/imageResizer";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CardHeader,
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
import { initialValues, Schema } from "./helper";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import FErrorMessage from "../../shared/components/FErrorMessage";
import {
  getUpdateProfileDetails,
  pharmacyLoginSuccess,
} from "../../services/BAuth";

import camera from "../../assets/images/camera.svg";

import { useLocation } from "react-router-dom";
import avatar from "../../assets/images/pharmacyAvatar.jpg";
import { AuthContext } from "../../context/authContext";
import { capitalize } from "../../helpers/formatting";
export const Profile = () => {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { hasPermission } = useContext(AuthContext);
  const location = useLocation();
  const { user } = useSelector((state) => state?.auth);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.updateProfile?.loading);
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

    const image = await resizeFile(file, 500, 500);

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
          if (fieldName == "store_photo") {
            props.setFieldValue("store_photo", downloadURL);
            dispatch(
              getUpdateProfileDetails(
                downloadURL,

                function (response) {
                  if (response?.status === "success") {
                    delete response?.data?.token;
                    dispatch(
                      pharmacyLoginSuccess({
                        data: {
                          ...user,
                          store: {
                            ...user.store,
                            store_photo: response?.data?.store_photo,
                          },
                        },
                      })
                    );
                  }
                }
              )
            );
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
          if (fieldName == "store_photo") {
            props.setFieldValue("store_photo", "");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <>
      <Box className="admin-layout" component="div">
        <Typography className="profile-heading">Store Profile</Typography>

        <Box className="profile-background"></Box>

        <Formik
          initialValues={user && user?.store ? user?.store : initialValues}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            dispatch(
              getUpdateProfileDetails(values, function (response) {
                if (response?.status === "success") {
                  delete response?.data?.token;
                  dispatch(
                    pharmacyLoginSuccess({
                      data: {
                        ...user,
                        ...response?.data,
                        store_photo: response?.data?.store_photo,
                      },
                    })
                  );
                }
              })
            );
          }}
          validationSchema={Schema}
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
                    {props?.values?.store_photo == undefined ? (
                      <img src={avatar} className="profileAvatar" />
                    ) : (
                      <img
                        src={props.values.store_photo}
                        className="profileAvatar"
                      />
                    )}
                    {hasPermission("store-profile.updateProfile") && (
                      <IconButton
                        className="edit-image"
                        onClick={() => fileRef.current.click()}
                      >
                        <img src={camera} />
                      </IconButton>
                    )}
                    {fieldName == "store_photo" && imageLoading && (
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
                </Box>
              </Box>

              {props?.values?.store_photo && (
                <>
                  <IconButton
                    onClick={() =>
                      handleRemoveImage(
                        props.values.store_photo,
                        "store_photo",
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
                  handleImageUpload(e.target.files[0], "store_photo", props)
                }
                ref={fileRef}
              />

              <FErrorMessage name="store_photo" />

              <Grid container mt={2} spacing={3}>
                <Grid item xs={6} sm={6} md={2} lg={2}></Grid>
                <Grid item xs={12} sm={12} md={10} lg={10}>
                  <Box>
                    <Card className="profile-card">
                      <CardHeader
                        className="card-heading"
                        title="Store Information"
                        sx={{ flex: 1 }}
                      ></CardHeader>

                      <CardContent>
                        <Grid container spacing={2} xs={12} md={8}>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Store Name
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {capitalize(user?.store?.store_name)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              className="profile-text-heading"
                              variant="subtitle2"
                            >
                              Owner Name
                            </Typography>
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
                                {capitalize(
                                  user?.business?.business_owner_name
                                )}
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
                            <Typography
                              variant="subtitle1"
                              className="profile-text-ans"
                            >
                              {capitalize(user?.state)}
                            </Typography>
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
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Profile;
