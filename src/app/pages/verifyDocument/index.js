import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, Grid } from '@mui/material';
import AuthLayout from '../../shared/components/authLayout';
import { Formik } from 'formik';
import { initialValues, Schema } from './helper';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import PreviewImage from '../../modules/adminDashboard/profileSettings/PreviewImage';
import FErrorMessage from '../../shared/components/FErrorMessage';
import { uploadVerificationDocsDetails } from '../../services/BAuth';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import './verifydocument.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { resizeFile } from '../../helpers/imageResizer';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../../firebase';
import IconButton from '@mui/material/IconButton';
import { Clear } from '@mui/icons-material';
import upload from '../../assets/images/upload.svg';
import UnderReview from '../Signin/underReview';

const VerifyDocument = () => {
  let params = useParams();
  const id = params?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [progresspercent, setProgresspercent] = useState(0);
  const [fieldName, setFieldName] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  const loading = useSelector(
    (state) => state.auth.uploadVerificationDocs?.loading
  );
  const frontPictureRef = useRef(null);
  const location = useLocation();
  const backPictureRef = useRef(null);
  const storeId = location?.state?.pharmacyId;

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
      'state_changed',
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
          if (fieldName == 'front_picture') {
            props.setFieldValue('front_picture', downloadURL);
          } else {
            props.setFieldValue('back_picture', downloadURL);
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
          if (fieldName == 'front_picture') {
            props.setFieldValue('front_picture', '');
          } else {
            props.setFieldValue('back_picture', '');
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          dispatch(
            uploadVerificationDocsDetails(
              values,
              id ? id : storeId,
              toast,
              navigate,
              id ? true : false
            )
          );
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <>
            <AuthLayout>
              <Box mt={4} pr={6} pl={6}>
                <Box>
                  <Typography
                    fontSize={{ lg: 48, md: 36, sm: 38, xs: 24 }}
                    fontWeight={700}
                  >
                    Verify Document
                  </Typography>
                  <Typography
                    fontSize={{ lg: 14, md: 14, sm: 14, xs: 11 }}
                    sx={{
                      fontWeight: '400',
                      color: '#70747E',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Please upload Photo of one of your document
                  </Typography>
                </Box>
                <form autoComplete="off" onSubmit={props.handleSubmit}>
                  <Box py={2}>
                    <InputLabel shrink>Select Identity type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      className="membersSelect"
                      id="demo-simple-select"
                      name="id_type"
                      value={props.values.id_type}
                      onChange={props.handleChange}
                      error={
                        props.touched.id_type && Boolean(props.errors.id_type)
                      }
                      helperText={props.touched.id_type && props.errors.id_type}
                      required
                    >
                      <MenuItem value={'NIC Card'}>NIC Card</MenuItem>
                      <MenuItem value={'Driving License'}>
                        Driving License
                      </MenuItem>
                      <MenuItem value={'Passport'}>Passport</MenuItem>
                    </Select>

                    <Grid
                      // sx={{
                      //   display: 'flex',
                      //   flexDirection: 'row',
                      //   justifyContent: 'center',
                      // }}
                      container
                      spacing={2}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        margin={{ lg: '15px 0px', md: '15px 0px' }}
                      >
                        <Typography
                          variant="body"
                          fontSize={14}
                          fontWeight={500}
                          fontStyle={'normal'}
                          color={'#101828 !important'}
                          textAlign={'center'}
                        >
                          Front Picture
                        </Typography>
                        {props.values.front_picture ? (
                          <>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                              }}
                            >
                              <PreviewImage file={props.values.front_picture} />
                              <IconButton
                                onClick={() =>
                                  handleRemoveImage(
                                    props.values.front_picture,
                                    'front_picture',
                                    '',
                                    props
                                  )
                                }
                                aria-label="delete picture"
                                className="delete-picture"
                              >
                                <Clear />
                              </IconButton>
                            </Box>
                          </>
                        ) : (
                          <Card className="upload-image-card">
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
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
                                  {fieldName == 'front_picture' &&
                                  imageLoading ? (
                                    <Box
                                      sx={{
                                        width: '55px',
                                        height: '55px',
                                      }}
                                    >
                                      <CircularProgressbar
                                        value={progresspercent}
                                        text={`${progresspercent}%`}
                                        styles={buildStyles({
                                          backgroundColor: '#235D5E',
                                          pathColor: `rgba(35,93,94,${
                                            progresspercent / 100
                                          })`,
                                          textColor: '#235D5E',
                                          textSize: '20px',
                                        })}
                                      />
                                    </Box>
                                  ) : (
                                    <img src={upload} />
                                  )}
                                </IconButton>
                              </Box>
                            </Box>
                            <CardContent sx={{ padding: '10px 0px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      color: '#235D5E',
                                      fontSize: '14px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    Click to upload
                                  </Typography>

                                  <Typography
                                    pl={1}
                                    sx={{
                                      color: '#70747E',
                                      fontSize: '14px',
                                      fontWeight: '400',
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
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    color: '#878B93',
                                  }}
                                >
                                  File Format: SVG, PNG, JPG or GIF. (Maximum
                                  file size: 5MB)
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
                              'front_picture',
                              props
                            )
                          }
                          ref={frontPictureRef}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        margin={{
                          lg: '15px 0px',
                          md: '15px 0px',
                        }}
                      >
                        <Typography
                          variant="body"
                          fontSize={14}
                          fontWeight={500}
                          fontStyle={'normal'}
                          color={'#101828 !important'}
                        >
                          Back Picture
                        </Typography>
                        {props?.values?.back_picture ? (
                          <>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                              }}
                            >
                              <PreviewImage file={props.values.back_picture} />
                              <IconButton
                                onClick={() =>
                                  handleRemoveImage(
                                    props.values.back_picture,
                                    'back_picture',
                                    '',
                                    props
                                  )
                                }
                                aria-label="delete picture"
                                className="delete-picture"
                              >
                                <Clear />
                              </IconButton>
                            </Box>
                          </>
                        ) : (
                          <Card className="upload-image-card">
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}
                            >
                              <Box>
                                <IconButton
                                  color="primary"
                                  aria-label="upload picture"
                                  onClick={() => backPictureRef.current.click()}
                                >
                                  {fieldName == 'back_picture' &&
                                  imageLoading ? (
                                    <Box
                                      sx={{
                                        width: '55px',
                                        height: '55px',
                                      }}
                                    >
                                      <CircularProgressbar
                                        value={progresspercent}
                                        text={`${progresspercent}%`}
                                        styles={buildStyles({
                                          backgroundColor: '#235D5E',
                                          pathColor: `rgba(35,93,94,${
                                            progresspercent / 100
                                          })`,
                                          textColor: '#235D5E',
                                          textSize: '20px',
                                        })}
                                      />
                                    </Box>
                                  ) : (
                                    <img src={upload} />
                                  )}
                                </IconButton>
                              </Box>
                            </Box>
                            <CardContent sx={{ padding: '10px 0px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      color: '#235D5E',
                                      fontSize: '14px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    Click to upload
                                  </Typography>

                                  <Typography
                                    pl={1}
                                    sx={{
                                      color: '#70747E',
                                      fontSize: '14px',
                                      fontWeight: '400',
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
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    color: '#878B93',
                                  }}
                                >
                                  File Format: SVG, PNG, JPG or GIF. (Maximum
                                  file size: 5MB)
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
                              'back_picture',
                              props
                            )
                          }
                          ref={backPictureRef}
                        />
                      </Grid>
                    </Grid>
                    <Box pt={2}>
                      <Button
                        className="containedPrimary"
                        variant="contained"
                        sx={{ width: '100%' }}
                        onClick={props.handleSubmit}
                      >
                        {loading ? (
                          <ClipLoader size={25} color="white" loading />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </Box>

                    <ToastContainer />
                  </Box>
                </form>
              </Box>
            </AuthLayout>
          </>
        )}
      </Formik>
    </>
  );
};

export default VerifyDocument;
