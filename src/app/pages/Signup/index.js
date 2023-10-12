import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, TextField, IconButton, OutlinedInput } from "@mui/material";
import Autocomplete from "react-google-autocomplete";
import AuthLayout from "../../shared/components/authLayout";
import { InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import FErrorMessage from "../../shared/components/FErrorMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./signUp.scss";
import { pharmacySignupDetails } from "../../services/auth";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import SignaturePad from "../../shared/components/signaturePad";
import SignaturePreview from "../../shared/components/signaturePreview";
import { removeImageFromFireBase } from "../../helpers/imageResizer";
import eye from "../../assets/images/autheye.svg";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showSigPad, setShowSigPad] = useState(false);

  const [storeCountryCode, setStoreCountryCode] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [storeCoordinates, setStoreCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [store_country, setStoreCountry] = useState("");
  const [store_province, setStoreProvince] = useState("");
  const [store_city, setStoreCity] = useState("");
  const [store_postcode, setPostCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(
    (state) => state.auth.pharmacySignupDetails?.loading
  );
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

  const handleSelect = async (value) => {
    let country = {};
    let city = {};
    let state = {};
    let postalCode = {};
    // getTimezone(value?.geometry.location.lat(), value?.geometry.location.lng());
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

  const handlePharmacySelect = async (value) => {
    let store_country = {};
    let store_city = {};
    let store_state = {};
    let store_postcode = {};
    for (let i = 0; i < value.address_components.length; i++) {
      if (value.address_components[i].types.includes("locality")) {
        store_city.long_name = value.address_components[i].long_name;
        store_city.short_name = value.address_components[i].short_name;
      } else if (
        value.address_components[i].types.includes(
          "administrative_area_level_1"
        )
      ) {
        store_state.long_name = value.address_components[i].long_name;
        store_state.short_name = value.address_components[i].short_name;
      } else if (value.address_components[i].types.includes("country")) {
        store_country.long_name = value.address_components[i].long_name;
        store_country.short_name = value.address_components[i].short_name;
      } else if (value.address_components[i].types.includes("postal_code")) {
        store_postcode.postcode = value.address_components[i].long_name;
      }
    }

    setStoreCity(store_city.long_name);
    setStoreCountry(store_country.long_name);
    setStoreProvince(store_state.long_name);
    setPostCode(store_postcode.postcode);
  };

  const getTimezone = async (latitude, longitude) => {
    const apiKey = "AIzaSyB16e8txgjkiAtEUxYTXlQGLVWw3pbSdHw&libraries";
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(
      Date.now() / 1000
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const { timeZoneId } = response.data;
      // Handle the timezone data here
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  };

  const handleDefault = (e, props) => {
    const values = {
      ...props.values,
    };
    if (e) {
      values.store_name = values.business_name;
      values.store_owner = values.business_owner_name;
      values.store_mobile_no = values.mobile_no;
      values.store_landline_num = values.business_landline_num;
      values.store_fax_no = values.fax_no;
      values.store_location = values.location;
      setStoreCity(city);
      setStoreCountry(country);
      setStoreProvince(province);
      setPostCode(zipCode);
      setStoreCountryCode(countryData);
      setStoreCoordinates(coordinates);
    } else {
      values.store_name = "";
      values.store_owner = "";
      values.store_mobile_no = "";
      values.store_landline_num = "";
      values.store_fax_no = "";
      values.store_location = "";
    }
    props.setValues({
      ...values,
    });
    setChecked(e);
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
  const handleProfession = (e, props) => {
    const value = e.target.checked;

    props.setFieldValue("is_pharmacist", value);

    if (props?.values?.signature && !value) {
      removeImageFromFireBase(props.values.signature);
      props.setFieldValue("signature", "");
      props.setFieldValue("license_number", "");
    }
  };

  const handleDelete = (props) => {
    if (props?.values?.signature) {
      removeImageFromFireBase(props.values.signature);
      props.setFieldValue("signature", "");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          dispatch(
            pharmacySignupDetails(
              values,
              coordinates,
              country,
              province,
              city,
              zipCode,
              countryData,
              storeCoordinates,
              store_country,
              store_province,
              store_city,
              store_postcode,
              storeCountryCode,
              navigate,
              toast
            )
          );
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <AuthLayout>
            <Box mt={6} className="signup-box">
              <Box>
                <Typography className="auth-signup-heading">
                  Business Signup
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  gutterBottom
                  sx={{
                    fontSize: "16px",
                    fontWeight: "400",
                    color: "#70747E",
                  }}
                >
                  Business signup for stores
                </Typography>
              </Box>

              <form onSubmit={props.handleSubmit}>
                <Box pt={3}>
                  <Box mb={2}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: "500",
                        fontSize: "18px",
                      }}
                    >
                      Business Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Business Name</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Business Name"
                        value={props.values.business_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="business_name"
                        error={
                          props.touched.business_name &&
                          Boolean(props.errors.business_name)
                        }
                        required
                      />
                      <FErrorMessage name="business_name" />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink htmlFor="owner-input">
                        Business Owner Name
                      </InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Business Owner Name "
                        value={props.values.business_owner_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="business_owner_name"
                        error={
                          props.touched.business_owner_name &&
                          Boolean(props.errors.business_owner_name)
                        }
                        required
                      />
                      <FErrorMessage name="business_owner_name" />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink htmlFor="email-input">
                        Email
                      </InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Email"
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
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink htmlFor="address-input">
                        Address
                      </InputLabel>

                      <Autocomplete
                        apiKey="AIzaSyB16e8txgjkiAtEUxYTXlQGLVWw3pbSdHw"
                        className="authfield"
                        language="en"
                        options={{
                          types: "address",
                          componentRestrictions: { country: "ca" },
                        }}
                        // Set the value of the field
                        value={props.values.location}
                        // Handle value change and setFieldValue
                        onChange={(event, value) => {
                          props.setFieldValue("location", value);
                        }}
                        // Handle onBlur event to show validation errors on touch
                        onBlur={props.handleBlur("location")}
                        libraries="places"
                        defaultValue={props?.values?.location}
                        // onChange={(ad) => {
                        //   props.setFieldValue("location", ad.target.value);
                        // }}
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
                          height: "45px",
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
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Phone Number</InputLabel>

                      <PhoneInput
                        international
                        className="authfield"
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="mobile_no"
                        autoComplete="mobile_no"
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
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Landline</InputLabel>

                      <PhoneInput
                        international
                        className="authfield"
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="business_landline_num"
                        autoComplete="business_landline_num"
                        variant="filled"
                        onChange={(phone, country) => {
                          setCountryData(country);
                          props.setFieldValue("business_landline_num", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={props?.values?.business_landline_num}
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
                            label="Landline"
                            name="business_landline_num"
                            value={props.values.business_landline_num}
                            error={
                              props.touched.business_landline_num &&
                              Boolean(props.errors.business_landline_num)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="business_landline_num" />
                    </Grid>
                    {/* <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Landline</InputLabel>

                      <TextField
                        fullWidth
                        type="number"
                        className="authfield"
                        placeholder="LandLine"
                        name="business_landline_num"
                        value={props.values.business_landline_num}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.business_landline_num &&
                          Boolean(props.errors.business_landline_num)
                        }
                        inputProps={{ maxlength: 10 }}
                        required
                      />
                      <FErrorMessage name="business_landline_num" />
                    </Grid> */}
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Fax Number</InputLabel>

                      <PhoneInput
                        international
                        className="authfield"
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="fax_no"
                        autoComplete="fax_no"
                        variant="filled"
                        onChange={(phone, country) => {
                          setCountryData(country);
                          props.setFieldValue("fax_no", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={props?.values?.fax_no}
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
                            label="Fax Number"
                            name="fax_no"
                            value={props.values.fax_no}
                            error={
                              props.touched.fax_no &&
                              Boolean(props.errors.fax_no)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="fax_no" />
                    </Grid>
                    {/* <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Fax No</InputLabel>

                      <TextField
                        fullWidth
                        type="number"
                        className="authfield"
                        placeholder="Fax Number"
                        name="fax_no"
                        value={props.values.fax_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.fax_no && Boolean(props.errors.fax_no)
                        }
                        inputProps={{ maxlength: 10 }}
                        required
                      />
                      <FErrorMessage name="fax_no" />
                    </Grid> */}
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Password</InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Password"
                        value={props.values.password}
                        type={showPassword ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="password"
                        error={
                          props.touched.password &&
                          Boolean(props.errors.password)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box pr={2}>
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
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Confirm Password</InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Confirm Password"
                        value={props.values.confirmPassword}
                        type={showConfirmPassword ? "text" : "password"}
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
                              <Box pr={2}>
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
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        required
                      />
                      <FErrorMessage name="confirmPassword" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} alignSelf="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(e) =>
                              handleDefault(e.target.checked, props)
                            }
                            sx={{
                              "&.Mui-checked": {
                                color: "#235D5E",
                              },
                            }}
                          />
                        }
                        label="Save as Default Store"
                      />
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={props?.values?.is_pharmacist}
                            name={"is_pharmacist"}
                            checked={props?.values?.is_pharmacist}
                            onChange={(e) => handleProfession(e, props)}
                            sx={{
                              "&.Mui-checked": {
                                color: "#235D5E",
                              },
                            }}
                          />
                        }
                        sx={{ whiteSpace: "nowrap" }}
                        label="Are you a pharmacist?"
                      />
                    </Grid>
                    {props?.values &&
                    props?.values?.is_pharmacist &&
                    !props?.values?.signature ? (
                      <Grid item sm={6} xs={12}>
                        <Button
                          variant="outlined"
                          className="outlined-primary"
                          style={{
                            borderColor:
                              props.errors.signature &&
                              props.touched.signature &&
                              "#D32F2F",
                          }}
                          onClick={() => setShowSigPad(true)}
                          fullWidth
                          size="large"
                        >
                          Upload your signatures
                        </Button>
                        <FErrorMessage name="signature" />
                      </Grid>
                    ) : (
                      <>
                        {props?.values && props?.values?.signature ? (
                          <Grid item xs={12}>
                            <SignaturePreview
                              delete={true}
                              handleDelete={() => handleDelete(props)}
                              url={props?.values?.signature}
                            />
                          </Grid>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                    {props?.values && props?.values?.is_pharmacist ? (
                      <Grid item sm={6} xs={12}>
                        <InputLabel shrink>License Number</InputLabel>
                        <TextField
                          fullWidth
                          className="authfield"
                          placeholder="Enter License Number"
                          value={props.values.license_number}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          name="license_number"
                          error={
                            props.touched.license_number &&
                            Boolean(props.errors.license_number)
                          }
                          required
                        />
                        <FErrorMessage name="license_number" />
                      </Grid>
                    ) : (
                      ""
                    )}
                    <Grid item xs={12}>
                      <Box className="txt-divider">
                        <Typography
                          variant="body"
                          sx={{
                            color: "#101828",
                            fontWeight: "500",
                            fontSize: "18px",
                          }}
                        >
                          Store Details
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item sm={6} xs={12}>
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
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Store Owner Name</InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Store Owner Name"
                        value={props.values.store_owner}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="store_owner"
                        error={
                          props.touched.store_owner &&
                          Boolean(props.errors.store_owner)
                        }
                        required
                      />
                      <FErrorMessage name="store_owner" />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>License Nunber</InputLabel>

                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Enter Store License Nunber"
                        value={props.values.store_license_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="store_license_number"
                        error={
                          props.touched.store_license_number &&
                          Boolean(props.errors.store_license_number)
                        }
                      />
                      <FErrorMessage name="store_license_number" />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} pt={2}>
                      <InputLabel shrink>Select Store Type</InputLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="type"
                        displayEmpty
                        input={<OutlinedInput />}
                        className="membersSelect"
                        label="Select Store Type"
                        value={props.values.type}
                        // onChange={(e)=>handleChange(e,props)}
                        error={props.touched.type && Boolean(props.errors.type)}
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
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink id="demo-simple-select-label">
                        Store Address
                      </InputLabel>
                      <Autocomplete
                        apiKey="AIzaSyDo5VoxC6mMlbcvlrGJzvWpr_4FxEk0jHE"
                        className="authfield"
                        language="en"
                        value={props.values.store_location}
                        options={{
                          types: "address",
                          componentRestrictions: { country: "ca" },
                        }}
                        libraries="places"
                        // onChange={(ad) => {
                        //   props.setFieldValue(
                        //     "store_location",
                        //     ad.target.value
                        //   );
                        // }}
                        onChange={(event, value) => {
                          props.setFieldValue("store_location", value);
                        }}
                        // Handle onBlur event to show validation errors on touch
                        onBlur={props.handleBlur("store_location")}
                        defaultValue={props?.values?.store_location}
                        // value={props.values.store_location}
                        onPlaceSelected={(place) => {
                          setStoreCoordinates({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                          });
                          handlePharmacySelect(place);

                          props.setFieldValue(
                            "store_location",
                            place.formatted_address
                          );
                        }}
                        placeholder="Store Address"
                        style={{
                          width: "100%",
                          height: "45px",
                          padding: "10px",
                          color: "#333",
                          border: "1px solid #d0d5dd",
                          boxShadow: " 0px 1px 2px rgba(16, 24, 40, 0.05)",
                          borderRadius: "8px",
                        }}
                      />
                      {props?.errors?.store_location &&
                        props?.touched?.store_location && (
                          <div
                            style={{ color: "#d32f2f", fontSize: "0.75rem" }}
                          >
                            <span>{props?.errors?.store_location}</span>
                          </div>
                        )}
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Phone Number</InputLabel>

                      <PhoneInput
                        international
                        country="ca"
                        preferredCountries={["ca"]}
                        excludeCountries={["us"]}
                        disableInitialCountryGuess={false}
                        name="store_mobile_no"
                        autoComplete="store_mobile_no"
                        variant="filled"
                        onChange={(phone, country) => {
                          setStoreCountryCode(country);
                          props.setFieldValue("store_mobile_no", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={
                          checked
                            ? props?.values?.mobile_no
                            : props?.values?.store_mobile_no
                        }
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
                            className="authfield"
                            name="store_mobile_no"
                            value={props.values.store_mobile_no}
                            error={
                              props.touched.store_mobile_no &&
                              Boolean(props.errors.store_mobile_no)
                            }
                            required
                          />
                        )}
                      </PhoneInput>
                      <FErrorMessage name="store_mobile_no" />
                    </Grid>

                    {/* <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Store Landline</InputLabel>

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

                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Store Landline</InputLabel>

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
                          setStoreCountryCode(country);
                          props.setFieldValue("store_landline_num", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={
                          checked
                            ? props?.values?.business_landline_num
                            : props?.values?.store_landline_num
                        }
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
                            label="Store Landline"
                            className="authfield"
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

                    {/* <Grid item sm={6} xs={12}>
                      <InputLabel shrink>Store Fax No</InputLabel>

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

                    <Grid item sm={6} xs={12} md={6} lg={6}>
                      <InputLabel shrink>Store Fax No</InputLabel>

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
                          setStoreCountryCode(country);
                          props.setFieldValue("store_fax_no", phone);
                        }}
                        onBlur={props.handleBlur}
                        value={
                          checked
                            ? props?.values?.fax_no
                            : props?.values?.store_fax_no
                        }
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
                            label="Store Fax No"
                            className="authfield"
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
                      <InputLabel shrink>GST</InputLabel>

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
                      <InputLabel shrink>PST</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
                        placeholder="Enter PST Number"
                        value={props.values.PST_NO}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="PST_NO"
                        // error={
                        //   props.touched.PST_NO && Boolean(props.errors.PST_NO)
                        // }
                        // required
                      />
                      {/* <FErrorMessage name="PST_NO" /> */}
                    </Grid>
                    <SignaturePad
                      showSigPad={showSigPad}
                      setShowSigPad={setShowSigPad}
                      props={props}
                    />
                  </Grid>
                </Box>
                <Button
                  className="containedPrimary"
                  variant="contained"
                  sx={{ marginTop: "16px", width: "100% " }}
                  onClick={props.handleSubmit}
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <ToastContainer />
              </form>
              <Box
                pt={1}
                mb={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary" variant="body">
                  Already have an account?
                </Typography>
                <Button
                  variant="text"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#03AD54",
                    textTransform: "capitalize",
                  }}
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </AuthLayout>
        )}
      </Formik>
    </>
  );
};

export default Signup;
