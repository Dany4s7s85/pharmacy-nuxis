import React, { useEffect, useState, useRef, useCallback } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Clear } from '@mui/icons-material';
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
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { resizeFile } from '../../helpers/imageResizer';

export const AddProduct = () => {
  const dispatch = useDispatch();
  const coverPictureRef = useRef(null);
  const onePictureRef = useRef(null);
  const twoPictureRef = useRef(null);
  const threePictureRef = useRef(null);
  const [initialValues, setInitialValues] = useState({
    product_name: '',
    quantity: '',
    description: '',
    brand: '',
    imageCover: {},
    product_category_name: '',
    batch_number: '',
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
  });
  const [progresspercent, setProgresspercent] = useState(0);
  const [showNotExistText, setShowNotExistText] = useState(false);
  const [imageIndex, setImageIndex] = useState('');
  const { user } = useSelector((state) => state?.auth);
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

  const pharmacyId = user?._id;

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
              data.product_category_name = 'narcotics';
              data.PRODUCT_CATEGORIZATION = 'narcotics';
              data.brand =
                data?.companies && data?.companies?.length
                  ? data?.companies[0]?.COMPANY_NAME
                  : '';
              props.setValues({ ...props.values, ...data });
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
        });
      }
    );
  };

  const handleRemoveImage = (publicId, fieldName, index, props) => {
    if (publicId) {
      setImageIndex(index);

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

  let disabled = false;
  return (
    <>
      <Typography
        variant="h5"
        component="div"
        sx={{
          paddingTop: '10px',
          paddingLeft: '15px',
          paddingBottom: '10px',
        }}
      >
        Add Product
      </Typography>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={(values, { resetForm }) => {
          values.pharmacy_id = pharmacyId;
          let data = { ...values };
          data.images = values.images.filter((el) => el?.public_id?.length > 0);

          dispatch(
            addProduct(data, function (res) {
              toast.success('Product created successfully');
              navigate('/dash/products');
            })
          );
        }}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <Grid alignItems="flex-start" spacing={4} container>
              <Grid container direction="columns" item xs={10}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Drug identification No"
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
                        (props?.values?.DRUG_IDENTIFICATION_NUMBER?.length &&
                          showNotExistText)
                          ? 'No Record Exists Against this DIN'
                          : ''
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Product Name"
                      value={props?.values?.product_name}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="product_name"
                      disabled={disabled}
                      error={
                        props.touched.product_name &&
                        Boolean(props.errors.product_name)
                      }
                      helperText={
                        props.touched.product_name && props.errors.product_name
                      }
                      required
                    />
                  </Grid>
                  {props?.values &&
                    props?.values?.DESCRIPTOR &&
                    props?.values?.DESCRIPTOR?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <TextField
                          fullWidth
                          variant="filled"
                          label="Descriptor"
                          value={props.values.DESCRIPTOR}
                          disabled={disabled}
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          name="description"
                          error={
                            props.touched.DESCRIPTOR &&
                            Boolean(props.errors.DESCRIPTOR)
                          }
                          helperText={
                            props.touched.DESCRIPTOR && props.errors.DESCRIPTOR
                          }
                          required
                        />
                      </Grid>
                    )}

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Product Categorization"
                      value={props.values.PRODUCT_CATEGORIZATION}
                      disabled={disabled}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="description"
                      error={
                        props.touched.PRODUCT_CATEGORIZATION &&
                        Boolean(props.errors.PRODUCT_CATEGORIZATION)
                      }
                      helperText={
                        props.touched.PRODUCT_CATEGORIZATION &&
                        props.errors.PRODUCT_CATEGORIZATION
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Drug Code"
                      value={props.values.DRUG_CODE}
                      disabled={disabled}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="description"
                      error={
                        props.touched.DRUG_CODE &&
                        Boolean(props.errors.DRUG_CODE)
                      }
                      helperText={
                        props.touched.DRUG_CODE && props.errors.DRUG_CODE
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Class"
                      value={props.values.CLASS}
                      disabled={disabled}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="description"
                      error={props.touched.CLASS && Boolean(props.errors.CLASS)}
                      helperText={props.touched.CLASS && props.errors.CLASS}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Product Category Name"
                      value={props?.values?.product_category_name}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      disabled={disabled}
                      name="description"
                      error={
                        props.touched.product_category_name &&
                        Boolean(props.errors.product_category_name)
                      }
                      helperText={
                        props.touched.product_category_name &&
                        props.errors.product_category_name
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Brand"
                      value={props?.values?.brand}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      disabled={disabled}
                      name="description"
                      error={props.touched.brand && Boolean(props.errors.brand)}
                      helperText={props.touched.brand && props.errors.brand}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="AI_GROUP_NO"
                      value={props.values.AI_GROUP_NO}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      disabled={disabled}
                      name="description"
                      error={
                        props.touched.AI_GROUP_NO &&
                        Boolean(props.errors.AI_GROUP_NO)
                      }
                      helperText={
                        props.touched.AI_GROUP_NO && props.errors.AI_GROUP_NO
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Pediatric Flag"
                      disabled={disabled}
                      value={props.values.PEDIATRIC_FLAG}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="description"
                      error={
                        props.touched.PEDIATRIC_FLAG &&
                        Boolean(props.errors.PEDIATRIC_FLAG)
                      }
                      helperText={
                        props.touched.PEDIATRIC_FLAG &&
                        props.errors.PEDIATRIC_FLAG
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="NUMBER_OF_AIS"
                      value={props.values.NUMBER_OF_AIS}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      disabled={disabled}
                      name="NUMBER_OF_AIS"
                      error={
                        props.touched.NUMBER_OF_AIS &&
                        Boolean(props.errors.NUMBER_OF_AIS)
                      }
                      helperText={
                        props.touched.NUMBER_OF_AIS &&
                        props.errors.NUMBER_OF_AIS
                      }
                      required
                    />
                  </Grid>
                </Grid>

                <Grid container mt={1} spacing={3}>
                  {props?.values &&
                    props?.values?.status &&
                    props?.values?.status?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            background: '#fff',
                            boxShadow:
                              '0px 0px 11px 3px rgba(115, 102, 255, 0.12)',
                          }}
                          component="nav"
                          aria-labelledby="Ingredients"
                          subheader={
                            <ListSubheader
                              component="div"
                              id="nested-list-subheader"
                            >
                              Status
                            </ListSubheader>
                          }
                        >
                          <ListItemText
                            primary={`${props?.values?.status[0]?.CLASS} ${props?.values?.status[0]?.STATUS} `}
                            sx={{ paddingLeft: '15px' }}
                          />
                        </List>
                      </Grid>
                    )}

                  {props?.values &&
                    props?.values?.ingredients &&
                    props?.values?.ingredients?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            background: '#fff',
                            boxShadow:
                              '0px 0px 11px 3px rgba(115, 102, 255, 0.12)',
                          }}
                          component="nav"
                          aria-labelledby="Ingredients"
                          subheader={
                            <ListSubheader
                              component="div"
                              id="nested-list-subheader"
                            >
                              Ingredients
                            </ListSubheader>
                          }
                        >
                          {props?.values &&
                            props?.values?.ingredients &&
                            props?.values?.ingredients?.length > 0 &&
                            props?.values?.ingredients?.map((el) => (
                              <ListItemText
                                primary={`${el?.INGREDIENT} ${el?.STRENGTH}${el?.STRENGTH_UNIT} `}
                                sx={{ paddingLeft: '15px' }}
                              />
                            ))}
                        </List>
                      </Grid>
                    )}

                  {props?.values &&
                    props?.values?.form &&
                    props?.values?.form?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            background: '#fff',
                            boxShadow:
                              '0px 0px 11px 3px rgba(115, 102, 255, 0.12)',
                          }}
                          component="nav"
                          aria-labelledby="Ingredients"
                          subheader={
                            <ListSubheader
                              component="div"
                              id="nested-list-subheader"
                            >
                              Form
                            </ListSubheader>
                          }
                        >
                          {props?.values &&
                            props?.values?.form &&
                            props?.values?.form?.length > 0 &&
                            props?.values?.form?.map((el) => (
                              <ListItemText
                                primary={`${el?.PHARMACEUTICAL_FORM} `}
                                sx={{ paddingLeft: '15px' }}
                              />
                            ))}
                        </List>
                      </Grid>
                    )}

                  {props?.values &&
                    props?.values?.route &&
                    props?.values?.route?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            background: '#fff',
                            boxShadow:
                              '0px 0px 11px 3px rgba(115, 102, 255, 0.12)',
                          }}
                          component="nav"
                          aria-labelledby="Ingredients"
                          subheader={
                            <ListSubheader
                              component="div"
                              id="nested-list-subheader"
                            >
                              Route
                            </ListSubheader>
                          }
                        >
                          {props?.values &&
                            props?.values?.route &&
                            props?.values?.route?.length > 0 &&
                            props?.values?.route?.map((el) => (
                              <ListItemText
                                primary={`${el?.ROUTE_OF_ADMINISTRATION} `}
                                sx={{ paddingLeft: '15px' }}
                              />
                            ))}
                        </List>
                      </Grid>
                    )}

                  {props?.values &&
                    props?.values?.companies &&
                    props?.values?.companies?.length > 0 && (
                      <Grid item xs={12} md={4} lg={3}>
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            background: '#fff',
                            boxShadow:
                              '0px 0px 11px 3px rgba(115, 102, 255, 0.12)',
                          }}
                          component="nav"
                          aria-labelledby="Ingredients"
                          subheader={
                            <ListSubheader
                              component="div"
                              id="nested-list-subheader"
                            >
                              Companies
                            </ListSubheader>
                          }
                        >
                          {props?.values &&
                            props?.values?.route &&
                            props?.values?.companies?.length > 0 &&
                            props?.values?.companies?.map((el) => (
                              <ListItemText
                                primary={`${el?.COMPANY_NAME} `}
                                sx={{ paddingLeft: '15px' }}
                              />
                            ))}
                        </List>
                      </Grid>
                    )}
                </Grid>
                <Grid container mt={3} spacing={3}>
                  <Grid item xs={12}>
                    <Box className="txt-divider">
                      <Typography variant="body">
                        Product Information
                      </Typography>
                      <Divider />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Description"
                      value={props.values.description}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="description"
                      error={
                        props.touched.description &&
                        Boolean(props.errors.description)
                      }
                      helperText={
                        props.touched.description && props.errors.description
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Product Form"
                      value={props.values.PRODUCT_FORM}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="PRODUCT_FORM"
                      error={
                        props.touched.PRODUCT_FORM &&
                        Boolean(props.errors.PRODUCT_FORM)
                      }
                      helperText={
                        props.touched.PRODUCT_FORM && props.errors.PRODUCT_FORM
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Packaging Size"
                      value={props.values.PACKAGING_SIZE}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="PACKAGING_SIZE"
                      error={
                        props.touched.PACKAGING_SIZE &&
                        Boolean(props.errors.PACKAGING_SIZE)
                      }
                      helperText={
                        props.touched.PACKAGING_SIZE &&
                        props.errors.PACKAGING_SIZE
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Expiry Date"
                        disablePast={true}
                        value={props.values.expiry_date}
                        onChange={(newValue) => {
                          props.setFieldValue('expiry_date', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              props.touched.expiry_date &&
                              Boolean(props.errors.expiry_date)
                            }
                            helperText={
                              props.touched.expiry_date &&
                              props.errors.expiry_date
                            }
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Batch Number"
                      value={props.values.batch_number}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="batch_number"
                      error={
                        props.touched.batch_number &&
                        Boolean(props.errors.batch_number)
                      }
                      helperText={
                        props.touched.batch_number && props.errors.batch_number
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Quantity"
                      value={props.values.quantity}
                      type="number"
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="quantity"
                      error={
                        props.touched.quantity && Boolean(props.errors.quantity)
                      }
                      helperText={
                        props.touched.quantity && props.errors.quantity
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Unit Price"
                      type="number"
                      value={props.values.price}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="price"
                      error={props.touched.price && Boolean(props.errors.price)}
                      helperText={props.touched.price && props.errors.price}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="columns" item xs={2}>
                <Box className="image-uploader">
                  <Box className="txt-divider">
                    <Typography variant="h6">Upload Images</Typography>
                  </Box>
                  <Box
                    className={
                      props?.values?.imageCover &&
                      props?.values?.imageCover?.full_image
                        ? 'image-upload-container cover'
                        : 'image-upload-container'
                    }
                    gutterBottom
                    mb={1}
                    mt={1}
                  >
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      onClick={() => coverPictureRef.current.click()}
                      sx={{ position: 'absolute' }}
                    >
                      {imageLoading && imageIndex == '-1' ? (
                        <CircularProgressbar
                          sx={{ color: '#235D5E' }}
                          value={progresspercent}
                          text={`${progresspercent}%`}
                          className="img-loader"
                        />
                      ) : (
                        <AddPhotoAlternateOutlinedIcon
                          sx={{ fontSize: '40px', color: '#235D5E' }}
                        />
                      )}
                    </IconButton>

                    {props?.values?.imageCover &&
                      props?.values?.imageCover?.full_image && (
                        <PreviewProductImage
                          imgUrl={props?.values?.imageCover?.full_image}
                        />
                      )}
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
                            right: '0',
                            top: '0',
                            color: 'red',
                            zIndex: '1',
                            padding: '3px',
                          }}
                        >
                          <Clear />
                        </IconButton>
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
                  </Box>
                  {props?.errors &&
                    props?.errors?.imageCover &&
                    props?.touched &&
                    props?.touched?.imageCover &&
                    props?.errors?.imageCover?.full_image && (
                      <span>{props?.errors?.imageCover?.full_image}</span>
                    )}
                  {props?.values?.images &&
                    props?.values?.images?.length > 0 &&
                    props?.values?.images?.map((el, index) => (
                      <Box
                        key={index}
                        className={'image-upload-container'}
                        gutterBottom
                        mb={1}
                        mt={1}
                      >
                        <IconButton
                          color="primary"
                          aria-label="upload cover picture"
                          component="label"
                          onClick={() =>
                            index == 0
                              ? onePictureRef.current.click()
                              : index == 1
                              ? twoPictureRef.current.click()
                              : threePictureRef.current.click()
                          }
                          sx={{ position: 'absolute' }}
                        >
                          {imageLoading && imageIndex == index ? (
                            <CircularProgressbar
                              sx={{ color: ' #235D5E' }}
                              value={progresspercent}
                              text={`${progresspercent}%`}
                              className="img-loader"
                            />
                          ) : (
                            <AddPhotoAlternateOutlinedIcon
                              sx={{ fontSize: '40px', color: '#7366ff' }}
                            />
                          )}
                        </IconButton>

                        {props?.values?.images &&
                          props?.values?.images.length > 0 &&
                          findImageIndex(el?.full_image, props) > -1 && (
                            <>
                              <PreviewProductImage
                                key={index}
                                imgUrl={
                                  props?.values?.images[
                                    findImageIndex(el?.full_image, props)
                                  ]?.full_image
                                }
                              />

                              <IconButton
                                onClick={() =>
                                  handleRemoveImage(
                                    props?.values?.images[index]?.full_image,
                                    'index',
                                    index,
                                    props
                                  )
                                }
                                aria-label="delete picture"
                                sx={{
                                  position: 'absolute',
                                  right: '0',
                                  top: '0',
                                  color: 'red',
                                  zIndex: '1',
                                  padding: '3px',
                                }}
                              >
                                <Clear />
                              </IconButton>
                            </>
                          )}
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
                    ))}
                </Box>
              </Grid>
            </Grid>

            <Button
              className="containedPrimary"
              disabled={addProductloading}
              onClick={props.handleSubmit}
              variant="contained"
            >
              {addProductloading ? (
                <CircularProgress sx={{ color: ' #235D5E' }} />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};
export default AddProduct;
