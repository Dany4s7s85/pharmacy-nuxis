import React, { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import {
  Button,
  TextField,
  IconButton,
  OutlinedInput,
  CardContent,
  Card,
} from "@mui/material";
import { initialValues, Schema } from "./helper";
import FErrorMessage from "../FErrorMessage";
import PreviewImage from "../../../pages/profile/PreviewImage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebase";
import { Typography, Box, Divider } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { resizeFile } from "../../../helpers/imageResizer";
import { Clear, DocumentScanner } from "@mui/icons-material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDispatch, useSelector } from "react-redux";
import {
  getKycDocumentDetails,
  uploadKycDocumentDetails,
} from "../../../services/members";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { ClipLoader } from "react-spinners";
import { pharmacyLoginSuccess } from "../../../services/BAuth";
import SignaturePad from "../signaturePad";
import SignaturePreview from "../signaturePreview";
import { removeImageFromFireBase } from "../../../helpers/imageResizer";
import Grid from "@mui/material/Grid";
import upload from "../../../assets/images/upload.svg";
import { width } from "@mui/system";
const KycDocument = ({ memberId }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [showSigPad, setShowSigPad] = useState(false);
  const { user } = useSelector((state) => state?.auth);
  const [progresspercent, setProgresspercent] = useState(0);
  const [fieldName, setFieldName] = useState("");
  const [documents, setDocuments] = useState(null);

  const frontPictureRef = useRef(null);
  const backPictureRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state?.members?.uploadKycDocument?.loading
  );
  const getKycLoading = useSelector(
    (state) => state?.members?.getKycDocument?.loading
  );
  useEffect(() => {
    dispatch(
      getKycDocumentDetails(function (response) {
        if (response?.data?.documents == null) {
          setDocuments(null);
        } else {
          if (
            !user?.is_verified &&
            response?.data?.documents?.status == "approved"
          ) {
            user.is_verified = true;
            if (response?.data?.documents?.signature) {
              user.signature = response?.data?.documents?.signature;
            }

            if (response?.data?.documents?.role) {
              user.role = response?.data?.documents?.role;
            }
            dispatch(pharmacyLoginSuccess({ data: { ...user } }));
          } else {
            if (response?.data?.documents?.role) {
              user.role = response?.data?.documents?.role;
            }
            dispatch(
              pharmacyLoginSuccess({
                data: {
                  ...user,
                  ...((response?.data?.documents &&
                    response?.data?.documents?.status != "approved") ||
                    (!response?.data?.documents?.status && {
                      is_verified: false,
                    })),
                },
              })
            );
          }

          setDocuments(response?.data?.documents);
        }
      })
    );
  }, []);
  const handleImageUpload = async (file, fieldName, props, index) => {
    if (!file) return;
    setFieldName(fieldName);
    setImageLoading(true);

    const image = await resizeFile(file, 500, 500);

    const storageRef = ref(
      storage,
      `member/verfication_docs/${file.name}-${Date.now()}`
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

  if (initialValues && user?.role == "pharmacist") {
    initialValues.is_pharmacist = true;
  }

  const handleDelete = (props) => {
    if (props?.values?.signature) {
      removeImageFromFireBase(props.values.signature);
      props.setFieldValue("signature", "");
    }
  };
  return (
    <Formik
      initialValues={documents ? documents : initialValues}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        dispatch(
          uploadKycDocumentDetails(values, memberId, function (response) {
            if (response?.status == "success") {
              dispatch(
                getKycDocumentDetails(function (response) {
                  if (response?.status == "success") {
                    setDocuments(response?.data?.documents);
                  }
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
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Typography fontSize={24} fontWeight={700} color={"#101828"}>
              Upload KYC Document
            </Typography>
          </Box>
          {getKycLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ClipLoader color="#235D5E" />
            </Box>
          ) : (
            <>
              <Box sx={{ marginY: "30px" }}>
                <Box mb={2}>
                  {documents?.status == "approved" ? null : (
                    <>
                      {user?.role == "pharmacist" ? (
                        <>
                          <Typography
                            fontSize={"18px"}
                            color={"#101828"}
                            fontWeight={"bold"}
                            mb={1}
                          >
                            Note :
                          </Typography>

                          <Typography
                            fontSize={"14px"}
                            maxWidth={"385px"}
                            lineHeight={"22px"}
                          >
                            {documents?.status == "rejected"
                              ? "Reupload your verification documents and signatures to get approval from Nxus"
                              : "Upload your verification documents and signatures to get approval from Nxus"}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          fontSize={"14px"}
                          maxWidth={"385px"}
                          lineHeight={"22px"}
                        >
                          {documents?.status == "rejected"
                            ? "ReUpload your verification documents to get approval from Nxus"
                            : "Upload your verification documents to get approval from Nxus"}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item sm={6} width="100%">
                    <InputLabel shrink>Select Identity type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="Select Identity type"
                      id="demo-simple-select"
                      name="id_type"
                      className="membersSelect"
                      input={<OutlinedInput notched={false} />}
                      placeholder="Status"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      value={props.values.id_type}
                      onChange={props.handleChange}
                      error={
                        props.touched.id_type && Boolean(props.errors.id_type)
                      }
                      helperText={props.touched.id_type && props.errors.id_type}
                      required
                      disabled={
                        documents?.status === "approved" ||
                        documents?.status == "pending"
                          ? true
                          : false
                      }
                    >
                      <MenuItem value={"NIC Card"}>NIC Card</MenuItem>
                      <MenuItem value={"Driving License"}>
                        Driving License
                      </MenuItem>
                      <MenuItem value={"Passport"}>Passport</MenuItem>
                    </Select>
                  </Grid>
                  {props?.values && props?.values?.is_pharmacist ? (
                    <Grid item sm={6} xs={12}>
                      <InputLabel shrink>NIC Number</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter License Number"
                        value={props.values.license_no}
                        onChange={props.handleChange}
                        className="authfield"
                        onBlur={props.handleBlur}
                        disabled={
                          documents?.status === "approved" ||
                          documents?.status == "pending"
                            ? true
                            : false
                        }
                        name="license_no"
                        error={
                          props.touched.license_no &&
                          Boolean(props.errors.license_no)
                        }
                        helperText={
                          props.touched.license_no && props.errors.license_no
                        }
                        required
                      />
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography
                      variant="body"
                      fontSize={14}
                      fontWeight={500}
                      fontStyle={"normal"}
                      color={"#101828 !important"}
                      marginBottom="8px !important"
                    >
                      Front Picture
                    </Typography>
                    {props.values.front_picture ? (
                      <>
                        <Box
                          marginTop="8px"
                          position="relative"
                          width="100%"
                          textAlign="center"
                        >
                          <PreviewImage file={props.values.front_picture} />
                          {documents?.status == "approved" ||
                          documents?.status == "pending" ? null : (
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
                                top: "0",
                                right: "0",
                                color: "red",
                              }}
                            >
                              <Clear />
                            </IconButton>
                          )}
                        </Box>
                      </>
                    ) : (
                      <>
                        {documents?.status == "approved" ? null : (
                          <Card
                            sx={{ marginTop: "10px !important" }}
                            className="upload-image-card"
                          >
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
                                  onClick={() =>
                                    frontPictureRef.current.click()
                                  }
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
                                <Box>
                                  <Typography
                                    sx={{
                                      color: "#235D5E",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Click to upload
                                  </Typography>

                                  <Typography
                                    pl={1}
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
                                  File Format: SVG, PNG, JPG or GIF. (Maximum
                                  file size: 5MB)
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </>
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
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
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
                            marginTop: "8px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <PreviewImage file={props.values.back_picture} />
                          {documents?.status == "approved" ||
                          documents?.status == "pending" ? null : (
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
                                top: "0",
                                right: "0",
                                color: "red",
                              }}
                            >
                              <Clear />
                            </IconButton>
                          )}
                        </Box>
                      </>
                    ) : (
                      <>
                        {documents?.status == "approved" ? null : (
                          <Card
                            sx={{ marginTop: "10px !important" }}
                            className="upload-image-card"
                          >
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
                                  {fieldName == "back_picture" &&
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
                                <Box>
                                  <Typography
                                    sx={{
                                      color: "#235D5E",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Click to upload
                                  </Typography>

                                  <Typography
                                    pl={1}
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
                                  File Format: SVG, PNG, JPG or GIF. (Maximum
                                  file size: 5MB)
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </>
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
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {props?.values &&
                  props?.values?.is_pharmacist &&
                  !props?.values?.signature ? (
                    <Box>
                      <Typography
                        variant="body"
                        fontSize={14}
                        fontWeight={500}
                        fontStyle={"normal"}
                        color={"#101828 !important"}
                      >
                        Signatures
                      </Typography>
                      <Card
                        sx={{ marginTop: "10px !important" }}
                        className="upload-image-card"
                      >
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
                              onClick={() => setShowSigPad(true)}
                            >
                              <img src={upload} />
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
                            <Box>
                              <Typography
                                sx={{
                                  color: "#235D5E",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                }}
                              >
                                Click to upload
                              </Typography>

                              <Typography
                                pl={1}
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
                    </Box>
                  ) : (
                    <>
                      {props?.values &&
                      props?.values?.is_pharmacist &&
                      props?.values?.signature ? (
                        <Box>
                          <SignaturePreview
                            delete={
                              documents?.status == "approved" ||
                              documents?.status == "pending"
                                ? false
                                : true
                            }
                            handleDelete={() => handleDelete(props)}
                            url={props?.values?.signature}
                          />
                        </Box>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                  <SignaturePad
                    showSigPad={showSigPad}
                    setShowSigPad={setShowSigPad}
                    props={props}
                  />
                </Grid>
              </Grid>

              {documents?.status == "approved" ||
              documents?.status == "pending" ? null : (
                <Button
                  sx={{
                    marginTop: "10px !important",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  className="containedPrimary"
                  variant="contained"
                  onClick={props.handleSubmit}
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    "Upload"
                  )}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </Formik>
  );
};
export default KycDocument;
