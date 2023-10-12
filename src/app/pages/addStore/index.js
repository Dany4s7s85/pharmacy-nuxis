import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import PreviewImage from "../../modules/adminDashboard/profileSettings/PreviewImage";
import {
  Button,
  TextField,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  OutlinedInput,
  Card,
  CardContent,
} from "@mui/material";
import Autocomplete from "react-google-autocomplete";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import FErrorMessage from "../../shared/components/FErrorMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { addBusinessPharmacy } from "../../services/auth";
import { getCurrentUserPharmacies } from "../../services/BAuth";
import Grid from "@mui/material/Grid";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { resizeFile } from "../../helpers/imageResizer";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import "./addpharmacy.scss";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Clear } from "@mui/icons-material";
import ButtonGroup from "@mui/material/ButtonGroup";
import upload from "../../assets/images/upload.svg";
const AddPharmacy = ({ handleClose }) => {
  const [countryData, setCountryData] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.businessPharmacy?.loading);

  const frontPictureRef = useRef(null);
  const backPictureRef = useRef(null);

  const [progresspercent, setProgresspercent] = useState(0);
  const [fieldName, setFieldName] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const submitRef = useRef();
  const handleImageUpload = async (file, fieldName, props, index) => {
    if (!file) return;
    setFieldName(fieldName);
    setImageLoading(true);
    const image = await resizeFile(file, 500, 500);
    const storageRef = ref(
      storage,
      `pharmacy/verfication_docs/${file.name}-${Date.now()}`
    );
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
          if (fieldName == "front_picture") {
            props.setFieldValue("front_picture", downloadURL);
          } else {
            props.setFieldValue("back_picture", downloadURL);
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
          if (fieldName == "front_picture") {
            props.setFieldValue("front_picture", "");
          } else {
            props.setFieldValue("back_picture", "");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

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
  const store_types = [
    {
      name: "pharmacy",
      id: "pharmacy",
    },
    {
      name: "dentist_clinic",
      id: "dentist_clinic",
    },
  ];

  return (
    <>
      <DialogContent dividers sx={{ borderTop: "none" }}>
        <DialogContentText
          id="scroll-dialog-description"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => {
              dispatch(
                addBusinessPharmacy(
                  values,
                  coordinates,
                  country,
                  province,
                  city,
                  zipCode,
                  countryData,
                  navigate,
                  toast,
                  function (res) {
                    if (res) {
                      handleClose();
                      dispatch(
                        getCurrentUserPharmacies(
                          "",
                          "",
                          "1",
                          "10",
                          function (res) {}
                        )
                      );
                    }
                  }
                )
              );
            }}
            validationSchema={Schema}
          >
            {(props) => (
              <>
                <form
                  autoComplete="off"
                  onSubmit={props.handleSubmit}
                  style={{ overflow: "auto" }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12} sm={12}>
                      <Typography
                        fontSize={16}
                        fontWeight={500}
                        color={"#101828 !important"}
                        gutterBottom
                      >
                        Store Details
                      </Typography>
                    </Grid>

                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Store Name</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Store Name"
                        value={props.values.store_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="store_name"
                        error={
                          props.touched.store_name &&
                          Boolean(props.errors.store_name)
                        }
                        required
                      />
                      <FErrorMessage name="store_name" />
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Email</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Email"
                        value={props.values.email}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="email"
                        error={
                          props.touched.email && Boolean(props.errors.email)
                        }
                        required
                      />
                      <FErrorMessage name="email" />
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Store License Nunber</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Store License Nunber"
                        value={props.values.store_license_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="store_license_number"
                        error={
                          props.touched.store_license_number &&
                          Boolean(props.errors.store_license_number)
                        }
                        required
                      />
                      <FErrorMessage name="store_license_number" />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} sm={12}>
                      <InputLabel shrink htmlFor="address-input">
                        Address
                      </InputLabel>
                      <Autocomplete
                        apiKey="AIzaSyB16e8txgjkiAtEUxYTXlQGLVWw3pbSdHw"
                        language="en"
                        options={{
                          types: "address",
                          componentRestrictions: { country: "ca" },
                        }}
                        value={props.values.location}
                        onChange={(event, value) => {
                          props.setFieldValue("location", value);
                        }}
                        onBlur={props.handleBlur("location")}
                        libraries="places"
                        onPlaceSelected={(place) => {
                          setCoordinates({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                          });
                          handleSelect(place);

                          props.setFieldValue(
                            "location",
                            place.formatted_address
                          );
                        }}
                        placeholder="Address"
                        style={{
                          width: "100%",
                          height: "44px",
                          padding: "10px",
                          color: "#333",
                          border: "1px solid #d0d5dd",
                          boxShadow: " 0px 1px 2px rgba(16, 24, 40, 0.05)",
                          borderRadius: "8px",
                        }}
                      />
                      {props?.errors?.location && props?.touched?.location && (
                        <div style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
                          <span>{props?.errors?.location}</span>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sm={12}>
                      <Box>
                        <InputLabel shrink pt={2}>
                          Select Store Type
                        </InputLabel>
                        <Select
                          input={<OutlinedInput notched={false} />}
                          placeholder=" Select Store Type"
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className="membersSelect"
                          id="demo-simple-select"
                          name="type"
                          value={props.values.type}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          error={
                            props.touched.type && Boolean(props.errors.type)
                          }
                          required
                        >
                          <MenuItem disabled value="">
                            <>Store type</>
                          </MenuItem>
                          {store_types?.map((name, i) => (
                            <MenuItem
                              key={i}
                              value={name?.name}
                              onClick={(e) =>
                                props.setFieldValue("type", name?.name)
                              }
                            >
                              {name?.name}
                            </MenuItem>
                          ))}
                        </Select>

                        <FErrorMessage name="type" />
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="phone-input">
                        Phone Number
                      </InputLabel>
                      <PhoneInput
                        international
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="phone_number"
                        autoComplete="phone_number"
                        variant="filled"
                        onChange={(phone, country) => {
                          setCountryData(country);
                          props.setFieldValue("mobile_no", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={props?.values?.mobile_no}
                        required
                        style={{
                          height: "45px",
                          color: "#333",
                          border: "1px solid #d0d5dd",
                          boxShadow: " 0px 1px 2px rgba(16, 24, 40, 0.05)",
                          borderRadius: "8px",
                        }}
                        inputStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                          padding: "8px 0px 8px 60px",
                          width: "100%",
                        }}
                        buttonStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            label="Phone"
                            name="mobile_no"
                            value={props.values.mobile_no}
                            error={
                              props.touched.mobile_no &&
                              Boolean(props.errors.mobile_no)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="mobile_no" />
                    </Grid>
                    {/* <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="phone-input">
                        Landline
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="number"
                        className="authfield"
                        placeholder="LandLine"
                        name="store_landline_num"
                        value={props.values.store_landline_num}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.store_landline_num &&
                          Boolean(props.errors.store_landline_num)
                        }
                        inputProps={{ maxlength: 10 }}
                        required
                      />
                      <FErrorMessage name="store_landline_num" />
                    </Grid> */}

                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="phone-input">
                        Landline
                      </InputLabel>
                      <PhoneInput
                        international
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="store_landline_num"
                        autoComplete="store_landline_num"
                        variant="filled"
                        onChange={(phone, country) => {
                          setCountryData(country);
                          props.setFieldValue("store_landline_num", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={props?.values?.store_landline_num}
                        required
                        style={{
                          height: "45px",
                          color: "#333",
                          border: "1px solid #d0d5dd",
                          boxShadow: " 0px 1px 2px rgba(16, 24, 40, 0.05)",
                          borderRadius: "8px",
                        }}
                        inputStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                          padding: "8px 0px 8px 60px",
                          width: "100%",
                        }}
                        buttonStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            label="LandLine"
                            name="store_landline_num"
                            value={props.values.store_landline_num}
                            error={
                              props.touched.store_landline_num &&
                              Boolean(props.errors.store_landline_num)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="store_landline_num" />
                    </Grid>

                    {/* <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="phone-input">
                        Fax No
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="number"
                        className="authfield"
                        placeholder="Fax Number"
                        name="store_fax_no"
                        value={props.values.store_fax_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.store_fax_no &&
                          Boolean(props.errors.store_fax_no)
                        }
                        inputProps={{ maxlength: 10 }}
                        required
                      />
                      <FErrorMessage name="store_fax_no" />
                    </Grid> */}
                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="phone-input">
                        Fax No
                      </InputLabel>
                      <PhoneInput
                        international
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="store_fax_no"
                        autoComplete="store_fax_no"
                        variant="filled"
                        onChange={(phone, country) => {
                          setCountryData(country);
                          props.setFieldValue("store_fax_no", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={props?.values?.store_fax_no}
                        required
                        style={{
                          height: "45px",
                          color: "#333",
                          border: "1px solid #d0d5dd",
                          boxShadow: " 0px 1px 2px rgba(16, 24, 40, 0.05)",
                          borderRadius: "8px",
                        }}
                        inputStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                          padding: "8px 0px 8px 60px",
                          width: "100%",
                        }}
                        buttonStyle={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          background: "none",
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            label=" Fax No"
                            name="store_fax_no"
                            value={props.values.store_fax_no}
                            error={
                              props.touched.store_fax_no &&
                              Boolean(props.errors.store_fax_no)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="store_fax_no" />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink htmlFor="phone-input">
                        GST
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Enter GST Number"
                        value={props.values.GST_NO}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="GST_NO"
                        error={
                          props.touched.GST_NO && Boolean(props.errors.GST_NO)
                        }
                        required
                      />
                      <FErrorMessage name="GST_NO" />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink htmlFor="phone-input">
                        PST
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Enter PST Number"
                        value={props.values.PST_NO}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="PST_NO"
                      />
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                      <InputLabel shrink>Select Identity type</InputLabel>
                      <Select
                        input={<OutlinedInput notched={false} />}
                        placeholder=" Select Identity type"
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="membersSelect"
                        id="demo-simple-select"
                        name="id_type"
                        value={props.values.id_type}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.id_type && Boolean(props.errors.id_type)
                        }
                        required
                      >
                        <MenuItem disabled value="">
                          <>Select Identity type</>
                        </MenuItem>
                        <MenuItem value={"NIC Card"}>NIC Card</MenuItem>
                        <MenuItem value={"Driving License"}>
                          Driving License
                        </MenuItem>
                        <MenuItem value={"Passport"}>Passport</MenuItem>
                      </Select>
                      <FErrorMessage name="id_type" />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sm={12}>
                      <Typography
                        variant="body"
                        fontSize={14}
                        fontWeight={500}
                        fontStyle={"normal"}
                        color={"#101828 !important"}
                      >
                        Front Picture
                      </Typography>
                      {props.values.front_picture ? (
                        <>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <PreviewImage file={props.values.front_picture} />
                            <IconButton
                              onClick={() =>
                                handleRemoveImage(
                                  props.values.front_picture,
                                  "front_picture",
                                  "",
                                  props
                                )
                              }
                              aria-label="delete picture"
                              sx={{
                                position: "absolute",
                                top: "0px",
                                left: "110px",
                                color: "red",
                              }}
                            >
                              <Clear />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <Card className="upload-image-card">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <Box>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                onClick={() => frontPictureRef.current.click()}
                              >
                                {fieldName == "front_picture" &&
                                imageLoading ? (
                                  <Box
                                    sx={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  >
                                    <CircularProgressbar
                                      value={progresspercent}
                                      text={`${progresspercent}%`}
                                      styles={buildStyles({
                                        backgroundColor: "#235D5E",
                                        pathColor: `rgba(35,93,94,${
                                          progresspercent / 100
                                        })`,
                                        textColor: "#235D5E",
                                        textSize: "20px",
                                      })}
                                    />
                                  </Box>
                                ) : (
                                  <img src={upload} />
                                )}
                              </IconButton>
                            </Box>
                          </Box>
                          <CardContent sx={{ padding: "10px 0px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{ display: { xs: "block", sm: "flex" } }}
                              >
                                <Typography
                                  pr={1}
                                  sx={{
                                    color: "#235D5E",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Click to upload
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "#70747E",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  or drag and drop
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                textAlign="center"
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  color: "#878B93",
                                }}
                              >
                                File Format: SVG, PNG, JPG or GIF. (Maximum file
                                size: 5MB)
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}

                      <FErrorMessage name="front_picture" />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files[0],
                            "front_picture",
                            props
                          )
                        }
                        ref={frontPictureRef}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Typography
                        variant="body"
                        fontSize={14}
                        fontWeight={500}
                        fontStyle={"normal"}
                        color={"#101828 !important"}
                      >
                        Back Picture
                      </Typography>
                      {props?.values?.back_picture ? (
                        <>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <PreviewImage file={props.values.back_picture} />
                            <IconButton
                              onClick={() =>
                                handleRemoveImage(
                                  props.values.back_picture,
                                  "back_picture",
                                  "",
                                  props
                                )
                              }
                              aria-label="delete picture"
                              sx={{
                                position: "absolute",
                                top: "0px",
                                left: "110px",
                                color: "red",
                              }}
                            >
                              <Clear />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <Card className="upload-image-card">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <Box>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                onClick={() => backPictureRef.current.click()}
                              >
                                {fieldName == "back_picture" && imageLoading ? (
                                  <Box
                                    sx={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  >
                                    <CircularProgressbar
                                      value={progresspercent}
                                      text={`${progresspercent}%`}
                                      styles={buildStyles({
                                        backgroundColor: "#235D5E",
                                        pathColor: `rgba(35,93,94,${
                                          progresspercent / 100
                                        })`,
                                        textColor: "#235D5E",
                                        textSize: "20px",
                                      })}
                                    />
                                  </Box>
                                ) : (
                                  <img src={upload} />
                                )}
                              </IconButton>
                            </Box>
                          </Box>
                          <CardContent sx={{ padding: "10px 0px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{ display: { xs: "block", sm: "flex" } }}
                              >
                                <Typography
                                  pr={1}
                                  sx={{
                                    color: "#235D5E",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Click to upload
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "#70747E",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  or drag and drop
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                textAlign="center"
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  color: "#878B93",
                                }}
                              >
                                File Format: SVG, PNG, JPG or GIF. (Maximum file
                                size: 5MB)
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}

                      <FErrorMessage name="back_picture" />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files[0],
                            "back_picture",
                            props
                          )
                        }
                        ref={backPictureRef}
                      />
                    </Grid>

                    <Button
                      hidden
                      sx={{ display: "none" }}
                      onClick={(_) => props?.handleSubmit()}
                      ref={submitRef}
                    />
                  </Grid>
                </form>
              </>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px " }}>
        <Button
          className="containedPrimaryWhite"
          variant="contained"
          size="large"
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          className="containedPrimary"
          variant="contained"
          size="large"
          disabled={loading}
          onClick={() => submitRef?.current?.click()}
        >
          {loading ? (
            <ClipLoader size={25} color="white" loading />
          ) : (
            "Add Store"
          )}
        </Button>
      </DialogActions>
    </>
  );
};

export default AddPharmacy;
