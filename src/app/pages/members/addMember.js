import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { initialValues, Schema } from "./helper";
import { ClipLoader } from "react-spinners";
import {
  FormControlLabel,
  Grid,
  OutlinedInput,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import {
  addMember,
  getPharmacyMembers,
  getMemberDetail,
  updateMember,
} from "../../services/members";
import { getAllPharms, getAllPermissions } from "../../services/BAuth";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "react-google-autocomplete";
import FErrorMessage from "../../shared/components/FErrorMessage";
import { usePlacesWidget } from "react-google-autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Masonry } from "@mui/lab";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PhoneInput from "react-phone-input-2";

const AddMember = ({ open, onClose, id, setMemberId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const [countryData, setCountryData] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const submitRef = useRef();
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const loading = useSelector((state) => state?.members?.memberDetail?.loading);
  const updateLoading = useSelector(
    (state) => state?.members?.updateMember?.loading
  );
  const [pharmacies, setPharmacies] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [permissions, setPermissions] = useState([]);
  const [bPermissions, setBPermissons] = useState([]);
  const [pPermissions, setPPermissons] = useState([]);
  const [inValues, setInValues] = useState(initialValues);

  const addMemberloading = useSelector(
    (state) => state?.members?.addMember?.loading
  );

  useEffect(() => {
    dispatch(
      getAllPharms(function (res) {
        setPharmacies(
          res?.data?.stores?.filter((el) => el.status == "approved")
        );
      })
    );
    dispatch(
      getAllPermissions(function (res) {
        setPermissions(res?.data?.permissions);
        setBPermissons(
          res?.data?.permissions.filter((el) => el.portal == "business")
        );
        setPPermissons(
          res?.data?.permissions.filter((el) => el.portal == "store")
        );
      })
    );

    if (id) {
      dispatch(
        getMemberDetail(id, function (res) {
          if (res) {
            setInValues(res?.data?.member);
          }
        })
      );
    } else {
      setInValues({
        first_name: "",
        last_name: "",
        mobile_no: "",
        location: "",
        email: "",
        role: "",
        allowed_stores: [],
        permissions: [],
        business: { permissions: ["profile.nav", "stores.nav"] },
      });
    }
  }, [id]);

  const handleChange = (id, props) => {
    let allowedValues = props?.values?.allowed_stores;
    let allPerms = props?.values?.permissions;

    if (allowedValues.includes(id)) {
      let idIndex = allowedValues.findIndex((el) => el == id);
      allowedValues.splice(idIndex, 1);
      let permIndex = allPerms.findIndex((el) => el?.store?.id == id);
      allPerms.splice(permIndex, 1);
    } else {
      allPerms.push({
        permissions: ["store-profile.nav", "preOrders.nav"],
        store: {
          id: id,
          store_name: pharmacies?.find((el) => el.id == id)?.store_name,
        },
      });
      allowedValues.push(id);
    }

    props.setValues({
      ...props.values,
      allowed_stores: allowedValues,
      permissions: allPerms,
    });
  };
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handCheckBoxChange = (perm, i, props) => {
    let allPerms = props?.values?.permissions;
    let selectedPerm = props?.values?.permissions[i]?.permissions || [];

    if (selectedPerm.find((el) => el == perm)) {
      let permIndex = selectedPerm?.findIndex((el) => el == perm);

      selectedPerm?.splice(permIndex, 1);
    } else {
      selectedPerm?.push(perm);
    }
    allPerms[i].permissions = selectedPerm;
    props.setValues({ ...props.values, permissions: allPerms });
  };

  const handleCheckAll = (e, i, props) => {
    const checked = e.target.checked;
    let allPerms = props?.values?.permissions;
    let selectedPerm = props?.values?.permissions[i]?.permissions || [];
    if (checked) {
      selectedPerm = [];
      selectedPerm = pPermissions.map((el) => el?.can);
    } else {
      selectedPerm = ["store-profile.nav"];
    }
    allPerms[i].permissions = selectedPerm;
    props.setValues({ ...props.values, permissions: allPerms });
  };

  const handleCheckAllBusiness = (e, props) => {
    const checked = e.target.checked;
    let allPerms = props?.values?.business?.permissions || [];
    let bus = props?.values?.business;

    if (checked) {
      allPerms = [];
      allPerms = bPermissions.map((el) => el?.can);
    } else {
      allPerms = ["profile.nav", "stores.nav"];
    }
    bus.permissions = allPerms;
    props.setValues({ ...props.values, business: bus });
  };

  const handCheckBoxChangeBusiness = (perm, props) => {
    let allPerms = props?.values?.business?.permissions || [];
    let bus = props?.values?.business;

    if (allPerms.find((el) => el == perm)) {
      let permIndex = allPerms?.findIndex((el) => el == perm);

      allPerms?.splice(permIndex, 1);
    } else {
      allPerms?.push(perm);
    }

    bus.permissions = allPerms;
    props.setValues({ ...props.values, business: bus });
  };

  const handleSelect = async (value, props) => {
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

    props.setFieldValue("location", value?.formatted_address);
    setCity(city.long_name);
    setCountry(country.long_name);
    setProvince(state.long_name);
    setZipCode(postalCode.postcode);
  };

  useEffect(() => {
    window.onresize = () => setWindowWidth(window.innerWidth);
    (() => (window.onresize = () => setWindowWidth(window.innerWidth)))();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.onresize = handleResize;
  }, []);

  return (
    <Dialog
      open={open}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {loading ? (
        <Box
          display="flex "
          alignItems="center "
          justifyContent="center"
          sx={{
            height: "300px",
            width: "300px",
          }}
        >
          <CircularProgress
            sx={{
              color: "#235D5E",
              textAlign: "center",
            }}
          />
        </Box>
      ) : (
        <>
          <DialogTitle className="dialog-title">
            {id ? "Edit Member" : "Add Member"}
          </DialogTitle>
          <DialogContent dividers sx={{ borderTop: "none" }}>
            <DialogContentText
              id="scroll-dialog-description"
              // ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Formik
                initialValues={inValues}
                enableReinitialize={true}
                validationSchema={Schema}
                onSubmit={(values, { resetForm }) => {
                  let data = {
                    ...values,
                    ...(city && { city }),
                    ...(country && { country }),
                    ...(province && { province }),
                    ...(coordinates && {
                      lat_long: [coordinates?.lat, coordinates?.lng],
                    }),
                  };
                  if (id) {
                    dispatch(
                      updateMember(id, data, function (res) {
                        if (res) {
                          dispatch(
                            getPharmacyMembers("", "", 1, 10, function (res) {
                              setInValues(initialValues);
                              setMemberId("");
                            })
                          );
                          toast.success("Member updated successfully");
                          onClose();
                        }
                      })
                    );
                  } else {
                    dispatch(
                      addMember(data, function (res) {
                        if (res) {
                          dispatch(
                            getPharmacyMembers("", "", 1, 10, function (res) {
                              setInValues(initialValues);
                              setMemberId("");
                            })
                          );
                          toast.success("Member created successfully");
                          onClose();
                        }
                      })
                    );
                  }
                }}
              >
                {(props) => (
                  <form onSubmit={props.handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink>First Name</InputLabel>
                        <TextField
                          fullWidth
                          placeholder="First Name"
                          className="authfield"
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          value={props?.values?.first_name}
                          name="first_name"
                          error={
                            props.touched.first_name &&
                            Boolean(props.errors.first_name)
                          }
                          required
                        />
                        <FErrorMessage name="first_name" />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink>Last Name</InputLabel>
                        <TextField
                          fullWidth
                          placeholder="Last Name"
                          className="authfield"
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          value={props?.values?.last_name}
                          name="last_name"
                          error={
                            props.touched.last_name &&
                            Boolean(props.errors.last_name)
                          }
                          required
                        />
                        <FErrorMessage name="last_name" />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink>Email</InputLabel>
                        <TextField
                          fullWidth
                          placeholder="Email"
                          className="authfield"
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          value={props?.values?.email}
                          name="email"
                          error={
                            props.touched.email && Boolean(props.errors.email)
                          }
                          required
                        />
                        <FErrorMessage name="email" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel shrink>Address</InputLabel>
                        <Autocomplete
                          apiKey="AIzaSyB16e8txgjkiAtEUxYTXlQGLVWw3pbSdHw"
                          language="en"
                          options={{
                            types: "address",
                            componentRestrictions: { country: "ca" },
                          }}
                          defaultValue={props?.values?.location}
                          libraries="places"
                          // onChange={(ad) => {
                          //   props.setFieldValue("location", ad.target.value);
                          // }}
                          value={props.values.location}
                          onChange={(event, value) => {
                            props.setFieldValue("location", value);
                          }}
                          // Handle onBlur event to show validation errors on touch
                          onBlur={props.handleBlur("location")}
                          onPlaceSelected={(place) => {
                            setCoordinates({
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                            handleSelect(place, props);

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
                            // backgroundColor: "#edebff",
                            borderRadius: "8px",
                          }}
                        />
                        {props?.errors?.location &&
                          props?.touched?.location && (
                            <div
                              style={{ color: "#d32f2f", fontSize: "0.75rem" }}
                            >
                              <span>{props?.errors?.location}</span>
                            </div>
                          )}
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink>Mobile Number</InputLabel>
                        <PhoneInput
                          international
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
                      <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink>Select Role</InputLabel>
                        <Select
                          input={<OutlinedInput notched={false} />}
                          placeholder="Select Role"
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className="membersSelect"
                          id="demo-simple-select"
                          name="role"
                          value={props.values.role}
                          onChange={(e) =>
                            props.setFieldValue("role", e.target.value)
                          }
                          error={
                            props.touched.role && Boolean(props.errors.role)
                          }
                          required
                        >
                          <MenuItem disabled value="">
                            <>Select Role</>
                          </MenuItem>
                          <MenuItem value={"technician"}>Technician</MenuItem>
                          <MenuItem value={"pharmacist"}>Pharmacist</MenuItem>
                        </Select>
                        <FErrorMessage name="role" />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel shrink>Select Stores</InputLabel>
                        <Select
                          input={<OutlinedInput notched={false} />}
                          placeholder="Select Stores"
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className="membersSelect"
                          multiple
                          name="allowed_stores"
                          label="Select Stores"
                          value={props.values.allowed_stores}
                          error={
                            props.touched.allowed_stores &&
                            Boolean(props.errors.allowed_stores)
                          }
                          required
                        >
                          <MenuItem disabled value="">
                            <>Select Stores</>
                          </MenuItem>
                          {pharmacies?.map((name, i) => (
                            <MenuItem
                              key={i}
                              value={name?._id}
                              onClick={(e) => handleChange(name?._id, props)}
                            >
                              {name?.store_name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FErrorMessage name="allowed_stores" />
                      </Grid>
                      <Grid item xs={12}>
                        {props?.values?.permissions?.length > 0 && (
                          <Masonry
                            columns={windowWidth >= 900 ? 2 : 1}
                            spacing={2}
                            sx={{
                              "& > div": {
                                width:
                                  windowWidth >= 900
                                    ? "calc(50% - 9px) !important"
                                    : "100% !important",
                              },
                            }}
                          >
                            {props?.values?.permissions?.length > 0 && (
                              <Paper>
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography>
                                      Business Page Permissions
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ padding: "0px" }}>
                                    <FormControlLabel
                                      sx={{
                                        borderBottom: "1px solid #E8EAEE",
                                        padding: "5px",
                                        width: "100%",
                                        margin: "0",
                                      }}
                                      control={
                                        <Checkbox
                                          style={{
                                            color: "#235D5E",
                                          }}
                                          checked={
                                            props?.values?.business?.permissions
                                              ?.length == bPermissions?.length
                                          }
                                          onChange={(e) =>
                                            handleCheckAllBusiness(e, props)
                                          }
                                          defaultChecked
                                        />
                                      }
                                      label="Select All"
                                    />

                                    <List
                                      sx={{
                                        width: "100%",
                                        maxWidth: 360,
                                        bgcolor: "background.paper",
                                        height: "250px",
                                        overflow: "auto",
                                      }}
                                    >
                                      {bPermissions?.map((perm, index) => {
                                        const labelId = `checkbox-list-label-${perm?.id}`;

                                        return (
                                          <ListItem
                                            sx={{
                                              borderBottom: "1px solid #E8EAEE",
                                              padding: "5px 16px",
                                            }}
                                            key={index}
                                            secondaryAction={
                                              <IconButton
                                                edge="end"
                                                aria-label="comments"
                                              ></IconButton>
                                            }
                                            disablePadding
                                          >
                                            <ListItemButton
                                              sx={{
                                                padding: "0px",
                                                paddingRight: "5px !important",
                                              }}
                                              role={undefined}
                                              onClick={handleToggle(perm)}
                                              dense
                                            >
                                              <ListItemIcon
                                                sx={{ minWidth: "auto" }}
                                              >
                                                <Checkbox
                                                  style={{
                                                    color: "#235D5E",
                                                    "&.MuiCheckbox-root.Mui-disabled":
                                                      {
                                                        color:
                                                          "rgba(0, 0, 0, 0.26) !important",
                                                      },
                                                  }}
                                                  disabled={
                                                    perm?.can ==
                                                      "profile.nav" ||
                                                    perm?.can == "stores.nav"
                                                  }
                                                  onChange={(e) =>
                                                    handCheckBoxChangeBusiness(
                                                      perm?.can,
                                                      props
                                                    )
                                                  }
                                                  edge="start"
                                                  checked={props?.values?.business?.permissions?.includes(
                                                    perm?.can
                                                  )}
                                                  tabIndex={-1}
                                                  disableRipple
                                                  inputProps={{
                                                    "aria-labelledby": labelId,
                                                  }}
                                                />
                                              </ListItemIcon>
                                              <ListItemText
                                                id={labelId}
                                                primary={`${perm?.description}`}
                                              />
                                            </ListItemButton>
                                          </ListItem>
                                        );
                                      })}
                                    </List>
                                  </AccordionDetails>
                                </Accordion>
                              </Paper>
                            )}

                            <FieldArray name="permissions">
                              {() =>
                                props?.values?.permissions &&
                                props?.values?.permissions?.length
                                  ? props?.values?.permissions?.map(
                                      (module, i) => {
                                        const permissionsErrors =
                                          (props?.errors?.permissions?.length &&
                                            props?.errors?.permissions[i]) ||
                                          {};
                                        const moduleTouched =
                                          (props.touched?.modules?.length &&
                                            props?.touched?.permissions[i]) ||
                                          {};

                                        return (
                                          <Paper key={i}>
                                            <Accordion>
                                              <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                              >
                                                <Typography>
                                                  {module?.store?.store_name}
                                                </Typography>
                                              </AccordionSummary>
                                              <AccordionDetails
                                                sx={{ padding: "0px" }}
                                              >
                                                <FormControlLabel
                                                  sx={{
                                                    borderBottom:
                                                      "1px solid #E8EAEE",
                                                    padding: "5px",
                                                    width: "100%",
                                                    margin: "0",
                                                  }}
                                                  control={
                                                    <Checkbox
                                                      style={{
                                                        color: "#235D5E",
                                                      }}
                                                      checked={
                                                        module?.permissions
                                                          ?.length ==
                                                        pPermissions?.length
                                                      }
                                                      onChange={(e) =>
                                                        handleCheckAll(
                                                          e,
                                                          i,
                                                          props
                                                        )
                                                      }
                                                      defaultChecked
                                                    />
                                                  }
                                                  label="Select All"
                                                />

                                                <List
                                                  sx={{
                                                    width: "100%",
                                                    maxWidth: 360,
                                                    bgcolor: "background.paper",
                                                    height: "250px",
                                                    overflow: "auto",
                                                  }}
                                                >
                                                  {pPermissions?.map(
                                                    (perm, index) => {
                                                      const labelId = `checkbox-list-label-${perm?.id}`;

                                                      return (
                                                        <ListItem
                                                          sx={{
                                                            borderBottom:
                                                              "1px solid #E8EAEE",
                                                            padding: "5px 16px",
                                                          }}
                                                          key={index}
                                                          secondaryAction={
                                                            <IconButton
                                                              edge="end"
                                                              aria-label="comments"
                                                            ></IconButton>
                                                          }
                                                          disablePadding
                                                        >
                                                          <ListItemButton
                                                            sx={{
                                                              padding: "0px",
                                                              paddingRight:
                                                                "5px !important",
                                                            }}
                                                            role={undefined}
                                                            onClick={handleToggle(
                                                              perm
                                                            )}
                                                            dense
                                                          >
                                                            <ListItemIcon
                                                              sx={{
                                                                minWidth:
                                                                  "auto",
                                                              }}
                                                            >
                                                              <Checkbox
                                                                style={{
                                                                  color:
                                                                    "#235D5E",
                                                                  "&.MuiCheckbox-root.Mui-disabled":
                                                                    {
                                                                      color:
                                                                        "rgba(0, 0, 0, 0.26) !important",
                                                                    },
                                                                }}
                                                                disabled={
                                                                  perm?.can ==
                                                                    "store-profile.nav" ||
                                                                  perm?.can ==
                                                                    "preOrders.nav"
                                                                }
                                                                onChange={(e) =>
                                                                  handCheckBoxChange(
                                                                    perm?.can,
                                                                    i,
                                                                    props
                                                                  )
                                                                }
                                                                edge="start"
                                                                checked={module?.permissions?.includes(
                                                                  perm?.can
                                                                )}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{
                                                                  "aria-labelledby":
                                                                    labelId,
                                                                }}
                                                              />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                              id={labelId}
                                                              primary={`${perm?.description}`}
                                                            />
                                                          </ListItemButton>
                                                        </ListItem>
                                                      );
                                                    }
                                                  )}
                                                </List>
                                              </AccordionDetails>
                                            </Accordion>
                                          </Paper>
                                        );
                                      }
                                    )
                                  : ""
                              }
                            </FieldArray>
                          </Masonry>
                        )}
                        <Button
                          sx={{ display: "none" }}
                          hidden
                          onClick={props.handleSubmit}
                          ref={submitRef}
                        ></Button>
                      </Grid>
                    </Grid>
                  </form>
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
                onClose();
                setMemberId("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="containedPrimary"
              variant="contained"
              size="large"
              onClick={() => submitRef?.current?.click()}
              disabled={addMemberloading || updateLoading}
            >
              {addMemberloading || updateLoading ? (
                <ClipLoader size={25} color="white" loading />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AddMember;
