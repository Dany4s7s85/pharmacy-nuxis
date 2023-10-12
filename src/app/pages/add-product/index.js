import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
} from 'react';
import './addproduct.scss';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Add, Clear } from '@mui/icons-material';
import { Formik } from 'formik';
import { Schema } from './helper';
import { toast } from 'react-toastify';
import {
  getProductCategory,
  getRootCategory,
  getProductByDin,
  addProduct,
} from '../../services/products';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import PreviewProductImage from './PreviewImage';
import Divider from '@mui/material/Divider';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../firebase';
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { resizeFile } from '../../helpers/imageResizer';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { generateRandom } from '../../helpers/formatting';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DiscountModal from './DiscountModal';
import Faqs from './faqs';
import { InputLabel } from '@mui/material';
import upload from '../../assets/images/upload.svg';
import { useTheme } from '@mui/material/styles';
import FErrorMessage from '../../shared/components/FErrorMessage';
import checkbox from '../../assets/images/checkbox.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AddProduct = () => {
  const [value, setValue] = React.useState(null);
  const [openDiscount, setOpenDiscount] = React.useState(false);
  const [index, setIndex] = useState('');
  const handleOpen = () => setOpenDiscount(true);
  const dispatch = useDispatch();
  const coverPictureRef = useRef(null);
  const formikRef = useRef(null);
  const onePictureRef = useRef(null);
  const twoPictureRef = useRef(null);
  const threePictureRef = useRef(null);
  const steps = ['Add DIN Number', 'Add Product Information', 'Upload Images'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down('sm'));
  const [showFaqInputs, setShowFaqInputs] = useState(false);
  const [initialValues, setInitialValues] = useState({
    product_name: '',
    quantity: '',
    description: '',
    brand: '',
    imageCover: {},
    product_category_name: '',
    images: [
      { thumbnail: '', full_image: '', public_id: '' },
      { thumbnail: '', full_image: '', public_id: '' },
      { thumbnail: '', full_image: '', public_id: '' },
    ],
    PACKAGING_SIZE: '',
    PRODUCT_FORM: '',
    price: '',
    expiry_date: '',
    DRUG_CODE: '',
    PRODUCT_CATEGORIZATION: '',
    CLASS: '',
    DRUG_IDENTIFICATION_NUMBER: '',
    BRAND_NAME: '',
    DESCRIPTOR: '',
    ADDRESS_BILLING_FLAG: '',
    PEDIATRIC_FLAG: '',
    NUMBER_OF_AIS: '',
    LAST_UPDATE_DATE: '',
    AI_GROUP_NO: '',
    CLASS_F: '',
    BRAND_NAME_F: '',
    DESCRIPTOR_F: '',
    status: [],
    ingredients: [],
    form: [],
    companies: [],
    package: [],
    route: [],
    isAutomatedDiscountApplied: false,
    discountsArray: [],
    faqs: [],
  });
  const [progresspercent, setProgresspercent] = useState(0);
  const [showNotExistText, setShowNotExistText] = useState(false);
  const [imageIndex, setImageIndex] = useState('');
  const { user } = useSelector((state) => state?.auth);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const handleCloseModal = () => {
    setOpenDiscount(false);
    setIndex('');
    setIsEdit(false);
  };
  const navigate = useNavigate();
  const loading = useSelector(
    (state) => state?.product?.uploadProductImage?.loading
  );
  const removeImageloading = useSelector(
    (state) => state?.product?.removeProductImage?.loading
  );
  const addProductloading = useSelector(
    (state) => state?.product?.addProduct?.loading
  );

  const [imageLoading, setImageLoading] = useState(false);
  const storeId = user?.store?._id;

  useEffect(() => {
    dispatch(getRootCategory(toast));
    dispatch(getProductCategory(toast));
  }, [dispatch]);

  const debouncedGetSearch = useCallback(
    debounce((query, props) => {
      dispatch(
        getProductByDin(
          query,
          function (res) {
            if (res && res?.data != null) {
              let data = { ...res.data };
              delete data._id;
              delete data.__v;
              data.product_name = data?.BRAND_NAME;
              data.product_category_name = data?.PRODUCT_CATEGORIZATION
                ? data?.PRODUCT_CATEGORIZATION
                : 'other';
              data.PRODUCT_CATEGORIZATION = data?.PRODUCT_CATEGORIZATION
                ? data?.PRODUCT_CATEGORIZATION
                : 'other';
              data.brand =
                data?.companies && data?.companies?.length
                  ? data?.companies[0]?.COMPANY_NAME
                  : '';
              props.setValues({ ...initialValues, ...data });
              setShowNotExistText(false);
            } else {
              props.setValues({
                ...initialValues,
                DRUG_IDENTIFICATION_NUMBER: query,
              });
              setShowNotExistText(true);
            }
          },
          function (err) {
            if (err) {
              props.setValues({
                ...initialValues,
                DRUG_IDENTIFICATION_NUMBER: query,
              });
              setShowNotExistText(true);
            }
          }
        )
      );
    }, 1000),
    []
  );

  const handleDrugIdentification = (e, props) => {
    debouncedGetSearch(e.target.value, props);
    props.setFieldValue('DRUG_IDENTIFICATION_NUMBER', e.target.value);
  };

  const fullFillmenyOptions = [
    {
      label: 'Willing to drop-off/deliver',
      value: 'Willing to drop-off/deliver',
    },
    { label: 'Willing to ship the item', value: 'Willing to ship the item' },
    { label: 'offer curbside pickup', value: 'offer curbside pickup' },
  ];

  const paymentOptions = [
    { label: 'Offer cashless payment', value: 'Offer cashless payment' },
    { label: 'Cash Accepted', value: 'Cash Accepted' },
  ];

  const handleImageUpload = async (file, fieldName, props, index) => {
    setImageIndex(index);
    setImageLoading(true);
    if (!file) return;
    const image = await resizeFile(file, 600, 600);

    const storageRef = ref(
      storage,
      `pharmacy/products/${file.name}-${Date.now()}`
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (fieldName == 'imageCover') {
            props.setFieldValue('imageCover', { full_image: downloadURL });
          } else {
            let images = [...props.values.images];
            images[index].full_image = downloadURL;
            props.setFieldValue('images', images);
          }
          setImageLoading(false);
          setProgresspercent(0);
        });
      }
    );
  };

  const handleRemoveImage = (publicId, fieldName, index, props) => {
    if (publicId) {
      setImageIndex(index);
      // setImageLoading(flase);
      let images = [props?.values?.images];

      let pictureRef = ref(storage, publicId);
      deleteObject(pictureRef)
        .then(() => {
          if (fieldName == 'imageCover') {
            props.setFieldValue('imageCover', {});
          } else {
            let images = [...props.values.images];
            images[index] = { thumbnail: '', full_image: '', public_id: '' };
            props.setFieldValue('images', images);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const findImageIndex = (publicId, props) => {
    if (publicId) {
      let images = [...props.values.images];
      return images.findIndex((el) => el.full_image == publicId);
    } else {
      return -1;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = async (props) => {
    if (activeStep == 0 && props.values.description == 0) {
      handleClickOpen();
      return;
    }

    if (activeStep == 1) {
      let error = await formikRef.current.validateForm();
      let keys = Object.keys(error).filter((el) => el != 'imageCover');
      for (let i = 0; i < keys?.length; i++) {
        formikRef.current.setFieldTouched(`${keys[i]}`);
      }
      if (keys.length == 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (props) => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDiscountChange = (e, props) => {
    let values = { ...props.values };

    props.setValues({
      ...values,
      discountsArray: !e.target.checked ? [] : [{ month: '', discount: '' }],
      isAutomatedDiscountApplied: e.target.checked,
    });

    setIndex(0);
  };

  const handleRemoveDiscount = (params) => {
    let index = formikRef?.current?.values?.discountsArray?.findIndex(
      (el) => el.month == params.row.month
    );
    let values = { ...formikRef?.current?.values };
    let discountsArray = [...formikRef?.current?.values?.discountsArray];

    discountsArray.splice(index, 1);

    if (discountsArray.length == 0) {
      discountsArray.push({ month: '', discount: '' });
      setIndex(0);
    }

    formikRef?.current?.setValues({
      ...values,
      discountsArray: discountsArray,
    });
  };

  const handleEditRowDiscount = (params) => {
    let index = formikRef?.current?.values?.discountsArray?.findIndex(
      (el) => el.month == params.row.month
    );
    setIndex(`${index}`);
    setIsEdit(true);
    handleOpen();
  };

  let disabled = false;
  const columns = [
    {
      field: 'month',
      headerName: 'Months Left In Expiry',
      flex: 1,
    },

    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      valueGetter: (params) => `${params?.row?.discount}%`,
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        {
          return (
            <Box>
              <IconButton
                variant="contained"
                onClick={() => handleEditRowDiscount(params)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                onClick={() => handleRemoveDiscount(params)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }
      },
    },
  ];

  return (
    <>
      <Box className="admin-card-header">
        <Typography
          variant="h5"
          component="div"
          sx={{
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
          className="addproduct-heading"
        >
          Add Product
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: '50%', sm: '70%' },
          marginTop: '20px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Stepper
          activeStep={activeStep}
          className="createProductSetpper"
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {steps?.map((label, index) => {
            const stepProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel className="stepslabel">{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={(values, { resetForm }) => {
          values.store_id = storeId;
          let data = { ...values };

          dispatch(
            addProduct(data, navigate, function (res) {
              toast.success('Product created successfully');
              navigate('/dash/products');
            })
          );
        }}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <Grid alignItems="flex-start" spacing={4} container mt={1}>
              <Grid container direction="columns" item xs={12}>
                {activeStep == 0 && (
                  <>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box>
                          <Typography className="din-text">
                            DIN Information
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4} lg={3}>
                        <InputLabel shrink>
                          Enter Drug identification No
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="authfieldsignup"
                          value={props?.values?.DRUG_IDENTIFICATION_NUMBER}
                          onBlur={props.handleBlur}
                          onChange={(e) => handleDrugIdentification(e, props)}
                          name="din"
                          error={
                            props.touched.DRUG_IDENTIFICATION_NUMBER &&
                            Boolean(props.errors.DRUG_IDENTIFICATION_NUMBER)
                          }
                          helperText={
                            (props.touched.DRUG_IDENTIFICATION_NUMBER &&
                              props.errors.DRUG_IDENTIFICATION_NUMBER) ||
                            (props?.values?.DRUG_IDENTIFICATION_NUMBER
                              ?.length &&
                              showNotExistText)
                              ? 'No Record Exists Against this DIN'
                              : ''
                          }
                          required
                        />
                      </Grid>

                      {props?.values &&
                        props?.values?.status &&
                        props?.values?.status?.length > 0 && (
                          <>
                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>Product Name</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props?.values?.product_name}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                name="product_name"
                                disabled={disabled}
                                error={
                                  props.touched.product_name &&
                                  Boolean(props.errors.product_name)
                                }
                                // helperText={
                                //   props.touched.product_name &&
                                //   props.errors.product_name
                                // }
                                required
                              />
                              <FErrorMessage name="product_name" />
                            </Grid>
                            {props?.values &&
                              props?.values?.DESCRIPTOR &&
                              props?.values?.DESCRIPTOR?.length > 0 && (
                                <Grid item xs={12} md={4} lg={3}>
                                  <InputLabel shrink>Descriptor</InputLabel>
                                  <TextField
                                    fullWidth
                                    className="authfieldsignup"
                                    value={props.values.DESCRIPTOR}
                                    disabled={disabled}
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    name="DESCRIPTOR"
                                    error={
                                      props.touched.DESCRIPTOR &&
                                      Boolean(props.errors.DESCRIPTOR)
                                    }
                                    // helperText={
                                    //   props.touched.DESCRIPTOR &&
                                    //   props.errors.DESCRIPTOR
                                    // }
                                    required
                                  />
                                  <FErrorMessage name="DESCRIPTOR" />
                                </Grid>
                              )}

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>
                                Product Categorization
                              </InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props.values.PRODUCT_CATEGORIZATION}
                                disabled={disabled}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                name="PRODUCT_CATEGORIZATION"
                                error={
                                  props.touched.PRODUCT_CATEGORIZATION &&
                                  Boolean(props.errors.PRODUCT_CATEGORIZATION)
                                }
                                // helperText={
                                //   props.touched.PRODUCT_CATEGORIZATION &&
                                //   props.errors.PRODUCT_CATEGORIZATION
                                // }
                                required
                              />
                              <FErrorMessage name="PRODUCT_CATEGORIZATION" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>Drug Code</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props.values.DRUG_CODE}
                                disabled={disabled}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                name="DRUG_CODE"
                                error={
                                  props.touched.DRUG_CODE &&
                                  Boolean(props.errors.DRUG_CODE)
                                }
                                // helperText={
                                //   props.touched.DRUG_CODE &&
                                //   props.errors.DRUG_CODE
                                // }
                                required
                              />
                              <FErrorMessage name="DRUG_CODE" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>Class</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props.values.CLASS}
                                disabled={disabled}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                name="CLASS"
                                error={
                                  props.touched.CLASS &&
                                  Boolean(props.errors.CLASS)
                                }
                                // helperText={
                                //   props.touched.CLASS && props.errors.CLASS
                                // }
                                required
                              />
                              <FErrorMessage name="CLASS" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>
                                Product Category Name
                              </InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props?.values?.product_category_name}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                disabled={disabled}
                                name="product_category_name"
                                error={
                                  props.touched.product_category_name &&
                                  Boolean(props.errors.product_category_name)
                                }
                                // helperText={
                                //   props.touched.product_category_name &&
                                //   props.errors.product_category_name
                                // }
                                // required
                              />
                              <FErrorMessage name="product_category_name" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>Brand</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props?.values?.brand}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                disabled={disabled}
                                name="brand"
                                error={
                                  props.touched.brand &&
                                  Boolean(props.errors.brand)
                                }
                                // helperText={
                                //   props.touched.brand && props.errors.brand
                                // }
                                required
                              />
                              <FErrorMessage name="brand" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>AI_GROUP_NO</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props.values.AI_GROUP_NO}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                disabled={disabled}
                                name="AI_GROUP_NO"
                                error={
                                  props.touched.AI_GROUP_NO &&
                                  Boolean(props.errors.AI_GROUP_NO)
                                }
                                // helperText={
                                //   props.touched.AI_GROUP_NO &&
                                //   props.errors.AI_GROUP_NO
                                // }
                                required
                              />
                              <FErrorMessage name="AI_GROUP_NO" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>Pediatric Flag</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                disabled={disabled}
                                value={props.values.PEDIATRIC_FLAG}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                name="PEDIATRIC_FLAG"
                                error={
                                  props.touched.PEDIATRIC_FLAG &&
                                  Boolean(props.errors.PEDIATRIC_FLAG)
                                }
                                // helperText={
                                //   props.touched.PEDIATRIC_FLAG &&
                                //   props.errors.PEDIATRIC_FLAG
                                // }
                                required
                              />
                              <FErrorMessage name="PEDIATRIC_FLAG" />
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                              <InputLabel shrink>NUMBER_OF_AIS</InputLabel>
                              <TextField
                                fullWidth
                                className="authfieldsignup"
                                value={props.values.NUMBER_OF_AIS}
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                disabled={disabled}
                                name="NUMBER_OF_AIS"
                                error={
                                  props.touched.NUMBER_OF_AIS &&
                                  Boolean(props.errors.NUMBER_OF_AIS)
                                }
                                // helperText={
                                //   props.touched.NUMBER_OF_AIS &&
                                //   props.errors.NUMBER_OF_AIS
                                // }
                                required
                              />
                              <FErrorMessage name="NUMBER_OF_AIS" />
                            </Grid>
                          </>
                        )}
                    </Grid>
                    {props?.values &&
                      props?.values?.status &&
                      props?.values?.status?.length > 0 && (
                        <Grid container mt={1} spacing={3}>
                          {props?.values &&
                            props?.values?.status &&
                            props?.values?.status?.length > 0 && (
                              <Grid item xs={12} md={4} lg={3}>
                                <InputLabel shrink>Status</InputLabel>
                                <TextField
                                  fullWidth
                                  className="authfieldsignup"
                                  value={`${props?.values?.status[0]?.CLASS} ${props?.values?.status[0]?.STATUS} `}
                                  disabled={true}
                                  required
                                />
                              </Grid>
                            )}

                          {props?.values &&
                            props?.values?.ingredients &&
                            props?.values?.ingredients?.length > 0 && (
                              <Grid item xs={12} md={4} lg={3}>
                                <InputLabel shrink> Ingredients</InputLabel>
                                <TextField
                                  fullWidth
                                  className="authfieldsignup"
                                  value={
                                    props?.values &&
                                    props?.values?.ingredients &&
                                    props?.values?.ingredients?.length > 0 &&
                                    props?.values?.ingredients?.map(
                                      (el) =>
                                        `${el?.INGREDIENT} ${el?.STRENGTH}${el?.STRENGTH_UNIT} `
                                    )
                                  }
                                  disabled={true}
                                  required
                                />
                              </Grid>
                            )}

                          {props?.values &&
                            props?.values?.form &&
                            props?.values?.form?.length > 0 && (
                              <Grid item xs={12} md={4} lg={3}>
                                <InputLabel shrink>Form</InputLabel>
                                <TextField
                                  fullWidth
                                  className="authfieldsignup"
                                  value={
                                    props?.values &&
                                    props?.values?.form &&
                                    props?.values?.form?.length > 0 &&
                                    props?.values?.form?.map(
                                      (el) => `${el?.PHARMACEUTICAL_FORM} `
                                    )
                                  }
                                  disabled={true}
                                  required
                                />
                              </Grid>
                            )}

                          {props?.values &&
                            props?.values?.route &&
                            props?.values?.route?.length > 0 && (
                              <Grid item xs={12} md={4} lg={3}>
                                <InputLabel shrink> Route</InputLabel>
                                <TextField
                                  fullWidth
                                  className="authfieldsignup"
                                  value={
                                    props?.values &&
                                    props?.values?.route &&
                                    props?.values?.route?.length > 0 &&
                                    props?.values?.route?.map(
                                      (el) => `${el?.ROUTE_OF_ADMINISTRATION} `
                                    )
                                  }
                                  disabled={true}
                                  required
                                />
                              </Grid>
                            )}

                          {props?.values &&
                            props?.values?.companies &&
                            props?.values?.companies?.length > 0 && (
                              <Grid item xs={12} md={4} lg={3}>
                                <InputLabel shrink>Companies</InputLabel>
                                <TextField
                                  fullWidth
                                  className="authfieldsignup"
                                  value={
                                    props?.values &&
                                    props?.values?.companies &&
                                    props?.values?.companies?.length > 0 &&
                                    props?.values?.companies?.map(
                                      (el) => `${el?.COMPANY_NAME} `
                                    )
                                  }
                                  disabled={true}
                                  required
                                />
                              </Grid>
                            )}
                        </Grid>
                      )}
                  </>
                )}

                {activeStep == 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box>
                        <Typography className="productinfo">
                          Product Information
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Description</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        value={props.values.description}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="description"
                        error={
                          props.touched.description &&
                          Boolean(props.errors.description)
                        }
                        // helperText={
                        //   props.touched.description && props.errors.description
                        // }
                        required
                      />
                      <FErrorMessage name="description" />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Product Form</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        value={props.values.PRODUCT_FORM}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="PRODUCT_FORM"
                        error={
                          props.touched.PRODUCT_FORM &&
                          Boolean(props.errors.PRODUCT_FORM)
                        }
                        // helperText={
                        //   props.touched.PRODUCT_FORM &&
                        //   props.errors.PRODUCT_FORM
                        // }
                        required
                      />
                      <FErrorMessage name="PRODUCT_FORM" />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Packaging Size</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        value={props.values.PACKAGING_SIZE}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="PACKAGING_SIZE"
                        error={
                          props.touched.PACKAGING_SIZE &&
                          Boolean(props.errors.PACKAGING_SIZE)
                        }
                        // helperText={
                        //   props.touched.PACKAGING_SIZE &&
                        //   props.errors.PACKAGING_SIZE
                        // }
                        required
                      />
                      <FErrorMessage name="PACKAGING_SIZE" />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <InputLabel shrink>Expiry Date</InputLabel>
                        <DatePicker
                          className="datePickerSelectA"
                          disablePast={true}
                          value={props.values.expiry_date}
                          name="expiry_date"
                          onChange={(newValue) => {
                            props.setFieldValue('expiry_date', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              error={
                                props.touched.expiry_date &&
                                Boolean(props.errors.expiry_date)
                              }
                              // helperText={
                              //   props.touched.expiry_date &&
                              //   props.errors.expiry_date
                              // }
                              required
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <FErrorMessage name="expiry_date" />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Batch Number</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        value={props.values.batch_number}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="batch_number"
                        error={
                          props.touched.batch_number &&
                          Boolean(props.errors.batch_number)
                        }
                        // helperText={
                        //   props.touched.batch_number &&
                        //   props.errors.batch_number
                        // }
                        required
                      />
                      <FErrorMessage name="batch_number" />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Quantity</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        value={props.values.quantity}
                        type="number"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="quantity"
                        error={
                          props.touched.quantity &&
                          Boolean(props.errors.quantity)
                        }
                        // helperText={
                        //   props.touched.quantity && props.errors.quantity
                        // }
                        required
                      />
                      <FErrorMessage name="quantity" />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <InputLabel shrink>Unit Price</InputLabel>
                      <TextField
                        fullWidth
                        className="authfieldsignup"
                        type="number"
                        value={props.values.price}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        name="price"
                        error={
                          props.touched.price && Boolean(props.errors.price)
                        }
                        // helperText={props.touched.price && props.errors.price}
                        required
                      />
                      <FErrorMessage name="price" />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Faqs
                        parentProps={props}
                        showFaqInputs={showFaqInputs}
                        setShowFaqInputs={setShowFaqInputs}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box className="txt-divider">
                        <FormGroup>
                          <FormControlLabel
                            className="apply"
                            inputProps={{ 'aria-label': 'Checkbox demo' }}
                            control={
                              <Checkbox
                                icon={<img src={checkbox} />}
                                // checkedIcon={<img src={checkbox} />}
                                onClick={(e) => handleDiscountChange(e, props)}
                                checked={
                                  props.values.isAutomatedDiscountApplied //a
                                }
                                sx={{ '&.Mui-checked': { color: '#235D5E' } }}
                              />
                            }
                            label="Apply Automated Discount (optional)"
                          />
                        </FormGroup>
                      </Box>
                    </Grid>

                    {props?.values?.isAutomatedDiscountApplied &&
                      props?.values?.discountsArray?.length == 1 &&
                      props?.values?.discountsArray[0]?.discount?.length == 0 &&
                      props?.values?.discountsArray[0]?.month?.length == 0 && (
                        <Grid item xs={12} sm={6}>
                          <Button
                            className="outlined-text faq-button"
                            variant="text"
                            startIcon={<Add className="faq-button" />}
                            onClick={() => {
                              handleOpen();
                              setIndex(0);
                              props.setValues({
                                ...props.values,
                                discountsArray: [{ month: '', discount: '' }],
                              });
                            }}
                          >
                            Add New
                          </Button>
                          {props?.errors &&
                            props?.errors?.discountsArray?.length &&
                            props?.errors?.discountsArray[0] &&
                            props?.errors?.discountsArray[0]?.discount &&
                            props?.errors?.discountsArray[0]?.month &&
                            props?.touched &&
                            props?.touched?.discountsArray && (
                              <div
                                style={{
                                  color: '#d32f2f',
                                  fontSize: '0.75rem',
                                }}
                              >
                                One discount value is mandatory after enabling
                                automated discount
                              </div>
                            )}
                        </Grid>
                      )}

                    {props?.values?.isAutomatedDiscountApplied &&
                      props?.values?.discountsArray?.length > 0 &&
                      props?.values?.discountsArray[0]?.discount &&
                      props?.values?.discountsArray[0]?.month && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            className="txt-divider"
                            sx={{ marginTop: '6px' }}
                          >
                            <Box component="div" sx={{ display: 'flex' }}>
                              <Typography
                                color="text.primary"
                                variant="h6"
                                sx={{ flex: 1 }}
                              >
                                Discount Details
                              </Typography>
                              <Button
                                className="outlined-text faq-button"
                                variant="text"
                                startIcon={<Add className="faq-button" />}
                                onClick={() => {
                                  handleOpen();
                                  setIndex(
                                    `${props?.values?.discountsArray?.length}`
                                  );
                                }}
                              >
                                Add New
                              </Button>
                            </Box>
                            <Divider />
                          </Box>
                          <div
                            style={{
                              height: 300,
                              width: '100%',
                              marginTop: '10px',
                            }}
                          >
                            <DataGrid
                              rows={props?.values?.discountsArray}
                              columns={columns}
                              hideFooter={true}
                              hideFooterRowCount={true}
                              getRowId={(row) => generateRandom()}
                            />
                          </div>
                        </Grid>
                      )}

                    <DiscountModal
                      key={generateRandom()}
                      parentProps={props}
                      handleCloseModal={handleCloseModal}
                      openDiscount={openDiscount}
                      index={index}
                      isEdit={isEdit}
                    />
                  </Grid>
                )}

                {activeStep == 2 && (
                  <>
                    <Box pl={2}>
                      <Typography className="upload-text">
                        Upload Images (Optional)
                      </Typography>
                    </Box>
                    <Grid container spacing={2} pt={2}>
                      <Grid item md={6} lg={6} sm={12} xs={12}>
                        {props?.values?.imageCover &&
                        props?.values?.imageCover?.full_image ? (
                          <>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <PreviewProductImage
                                imgUrl={props?.values?.imageCover?.full_image}
                              />
                              <Box className="cover-box">
                                <Typography className="cover-box-text">
                                  Cover
                                </Typography>
                              </Box>
                              {props?.values?.imageCover &&
                                props?.values?.imageCover?.full_image && (
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveImage(
                                        props?.values?.imageCover?.full_image,
                                        'imageCover',
                                        -1,
                                        props
                                      )
                                    }
                                    aria-label="delete picture"
                                    sx={{
                                      position: 'absolute',
                                      top: '0px',
                                      left: '56%',
                                      color: 'red',
                                    }}
                                  >
                                    <Clear />
                                  </IconButton>
                                )}
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
                              <IconButton
                                aria-label="upload picture"
                                onClick={() => coverPictureRef.current.click()}
                              >
                                {imageLoading && imageIndex == '-1' ? (
                                  <Box sx={{ width: '55px', height: '55px' }}>
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
                            <CardContent sx={{ paddingTop: '8px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                              >
                                <Box sx={{ display: 'flex' }}>
                                  <Typography className="click-text">
                                    Click to upload
                                  </Typography>

                                  <Typography pl={1} className="drag-text">
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
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            handleImageUpload(
                              e?.target?.files[0],
                              'imageCover',
                              props,
                              -1
                            )
                          }
                          ref={coverPictureRef}
                        />
                        {props?.errors &&
                          props?.errors?.imageCover &&
                          props?.touched &&
                          props?.touched?.imageCover &&
                          props?.errors?.imageCover?.full_image && (
                            <span
                              style={{
                                color: 'red',
                                position: 'absolute',
                                top: '113px',
                                fontSize: '10px',
                              }}
                            >
                              {props?.errors?.imageCover?.full_image}
                            </span>
                          )}
                      </Grid>
                      <>
                        {props?.values?.images &&
                          props?.values?.images?.length > 0 &&
                          props?.values?.images?.map((el, index) => {
                            return (
                              <Grid item md={6} lg={6} sm={12} xs={12}>
                                {findImageIndex(el?.full_image, props) > -1 ? (
                                  <>
                                    <Box
                                      sx={{
                                        position: 'relative',
                                        width: '100%',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <PreviewProductImage
                                        key={index}
                                        imgUrl={
                                          props?.values?.images[
                                            findImageIndex(
                                              el?.full_image,
                                              props
                                            )
                                          ]?.full_image
                                        }
                                      />

                                      <IconButton
                                        onClick={() =>
                                          handleRemoveImage(
                                            props?.values?.images[index]
                                              ?.full_image,
                                            'index',
                                            index,
                                            props
                                          )
                                        }
                                        aria-label="delete picture"
                                        sx={{
                                          position: 'absolute',
                                          top: '0px',
                                          left: '56%',
                                          color: 'red',
                                        }}
                                      >
                                        <Clear />
                                      </IconButton>
                                    </Box>
                                  </>
                                ) : (
                                  <Card
                                    className="upload-image-card"
                                    key={index}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <IconButton
                                        onClick={() =>
                                          index == 0
                                            ? onePictureRef.current.click()
                                            : index == 1
                                            ? twoPictureRef.current.click()
                                            : threePictureRef.current.click()
                                        }
                                      >
                                        {imageLoading && imageIndex == index ? (
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
                                      <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        name
                                        multiple
                                        onChange={(e) =>
                                          handleImageUpload(
                                            e?.target?.files[0],
                                            'index',
                                            props,
                                            index
                                          )
                                        }
                                        ref={
                                          index == 0
                                            ? onePictureRef
                                            : index == 1
                                            ? twoPictureRef
                                            : threePictureRef
                                        }
                                      />
                                    </Box>
                                    <CardContent sx={{ paddingTop: '8px' }}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Box sx={{ display: 'flex' }}>
                                          <Typography className="click-text">
                                            Click to upload
                                          </Typography>

                                          <Typography
                                            pl={1}
                                            className="drag-text"
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
                                          File Format: SVG, PNG, JPG or GIF.
                                          (Maximum file size: 5MB)
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                )}
                              </Grid>
                            );
                          })}
                      </>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: '30px',
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{ width: 'auto !important' }}
                className="containedPrimaryWhite"
                disabled={activeStep === 0}
                onClick={() => handleBack(props)}
              >
                Back
              </Button>
              {activeStep < 2 && (
                <Button
                  variant="contained"
                  size="small"
                  className="containedProduct"
                  disabled={props?.values?.PRODUCT_CATEGORIZATION?.length == 0}
                  onClick={() => handleNext(props)}
                  sx={{ marginLeft: '10px', width: 'auto !important' }}
                >
                  {'Next'}
                </Button>
              )}
              {activeStep == 2 && (
                <Button
                  variant="contained"
                  size="small"
                  className="containedProduct"
                  disabled={addProductloading}
                  onClick={props.handleSubmit}
                  sx={{ marginLeft: '10px', width: 'auto !important' }}
                >
                  {addProductloading ? (
                    <CircularProgress sx={{ color: ' #235D5E' }} />
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
            </Box>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>
                {'Please confirm the drug information matches what you want? '}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  This info will be used as for your product detail
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#ab0f0f' }}>
                  Disagree
                </Button>
                <Button
                  onClick={() => {
                    setActiveStep(activeStep + 1);
                    handleClose();
                  }}
                  sx={{ color: '#2f914e' }}
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Formik>
    </>
  );
};
export default AddProduct;
