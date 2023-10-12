import React, { useEffect, useState, useRef, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { InputLabel, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Formik } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Schema,
  inventorySchema,
  inventoryInitialValues,
  addInventoryInitialValues,
  addInventorySchema,
} from "./helper";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";

import Divider from "@mui/material/Divider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Add } from "@mui/icons-material";
import Pagination from "../../shared/components/Pagination";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import { ClipLoader } from "react-spinners";
import {
  addProductInventory,
  editProductDetail,
  enlistDelistInventory,
  getAllProductInventories,
  getProductInventoryDetail,
  updateProductInventoryDetail,
} from "../../services/products";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { generateRandom } from "../../helpers/formatting";
import DiscountModal from "../add-product/DiscountModal";
import Switch from "@mui/material/Switch";
import Faqs from "../add-product/faqs";
import action from "../../assets/images/action.svg";
import FErrorMessage from "../../shared/components/FErrorMessage";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";
export const EditProduct = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  let queryStr = new URLSearchParams(location?.search);

  const id = queryStr?.get("id");
  const exist = queryStr?.get("exist") ? queryStr?.get("exist") : false;
  const [addOpen, setAddOpen] = useState(Boolean(exist) == true ? true : false);
  const [checked, setChecked] = useState({});
  const [memberStatusLoading, setMemeberStatusLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const handleAddClose = () => {
    setAddOpen(false);
  };
  const formikRefEdit = useRef(null);
  const handleOpenD = () => setOpenDiscount(true);
  const handleAddOpen = () => {
    if (productDetail?.faqs && productDetail?.faqs?.length > 0) {
      setInventoryInitialValues({
        ...inventorInitialValues,
        faqs: productDetail?.faqs,
      });
    }
    setAddOpen(true);
  };
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(
    (state) => state?.product?.updateInventory?.loading
  );
  const addInventoryLoading = useSelector(
    (state) => state?.product?.addInventory?.loading
  );
  const editProductDetailLoading = useSelector(
    (state) => state?.product?.editProductDetail?.loading
  );

  const allProductInventoriesLoading = useSelector(
    (state) => state?.product?.allProductInventories?.loading
  );
  const productInventoryDetailLoading = useSelector(
    (state) => state?.product?.productInventoryDetail?.loading
  );

  const deleteProductInventoryLoading = useSelector(
    (state) => state?.product?.deleteProductInventory?.loading
  );
  const enlistDelistLoading = useSelector(
    (state) => state?.product?.enlistDelistInventory?.loading
  );
  const handleCloseModal = () => {
    setOpenDiscount(false);
    setIndex("");
    setIsEdit(false);
  };
  const [openDiscount, setOpenDiscount] = React.useState(false);
  const [index, setIndex] = useState("");
  const [showFaqInputs, setShowFaqInputs] = useState(false);

  const formikRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);

  const [productDetail, setProductDetail] = useState(null);
  const [customLoading, setCustomLoading] = useState(true);

  const [inventories, setInventories] = useState([]);
  const [editInventory, setEditInventory] = useState(null);
  const [inventorInitialValues, setInventoryInitialValues] = useState(
    addInventoryInitialValues
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [state, setState] = useState({
    inventories: inventories?.inventories,
    count: 0,
  });

  const handleOpen = (id) => {
    if (id) {
      dispatch(
        getProductInventoryDetail(id, function (response) {
          if (response?.status === "success") {
            let data = { ...response?.data };
            if (data?.discount) {
              data.isAutomatedDiscountApplied =
                data?.discount?.isAutomatedDiscountApplied;
              data.discountsArray = data?.discount?.discountsArray || [];
            }

            if (
              !data?.faqs?.length &&
              productDetail?.faqs &&
              productDetail?.faqs?.length > 0
            ) {
              data.faqs = productDetail?.faqs;
            }

            setEditInventory(data);
          }
        })
      );

      setOpen(true);
    }
  };
  const handlePageChange = useCallback((e, value) => {
    setPage(value);
    setCustomLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(
        editProductDetail(id, function (response) {
          if (response?.status === "success") {
            setProductDetail(response?.data);
          }
        })
      );
    }
  }, [id]);

  useEffect(() => {
    dispatch(
      getAllProductInventories(id, page, limit, function (response) {
        setInventories(response?.data);
        setCustomLoading(false);
      })
    );
  }, [count]);

  useEffect(() => {
    const count = inventories?.count;
    const perPage = 10;
    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      inventories: inventories?.inventories,
      count: buttonsCount,
    });
  }, [inventories]);

  const handleInventoryChange = (inventoryId, status) => {
    setMemeberStatusLoading(true);
    setSelectedId(inventoryId);
    setChecked((prevState) => ({
      ...prevState,
      [inventoryId]: status,
    }));
    dispatch(
      enlistDelistInventory(inventoryId, status, function (res) {
        if (res?.status == "success") {
          setMemeberStatusLoading(false);
        }
      })
    );
  };

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 35,
    height: 18,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 1,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#56BA9B",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const columns = [
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {`${moment(params.row?.expiry_date).format("DD-MM-YYYY")}`}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "DIN_NUMBER",
      headerName: "DIN No",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {params.row?.DIN_NUMBER}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "batch_number",
      headerName: "Batch Number",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {params.row?.batch_number}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "quantity",
      headerName: "Quantity",
      flex: 2,
      editable: true,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {formatNumberWithCommas(params.row?.quantity)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {formatNumberWithCommas(params.row?.price)}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "Action",
      headerName: "Action",
      flex: 3,
      renderCell: (params) => {
        {
          return (
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5" }}>
              {params?.row._id ? (
                <IconButton
                  variant="contained"
                  onClick={() => handleOpen(params?.row._id)}
                >
                  <img src={action} />
                </IconButton>
              ) : null}
              {selectedId == params?.row?._id && memberStatusLoading ? (
                <Box sx={{ padding: "8px 0px" }}>
                  <ClipLoader size={20} color="purple" loading />
                </Box>
              ) : (
                <>
                  {params?.row?._id ? (
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={checked[params?.row?._id]}
                      inputProps={{ "aria-label": "controlled" }}
                      defaultChecked={params?.row?.isActive}
                      disabled={params?.row?.product?.isActive == false}
                      value={params?.row?.isActive}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          handleInventoryChange(params?.row?._id, true);
                        } else {
                          handleInventoryChange(params?.row?._id, false);
                        }
                      }}
                    />
                  ) : null}
                </>
              )}
            </Box>
          );
        }
      },
    },
  ];

  const handleDiscountChange = (e, props) => {
    let values = { ...props.values };

    props.setValues({
      ...values,
      discountsArray: !e.target.checked ? [] : [{ month: "", discount: "" }],
      isAutomatedDiscountApplied: e.target.checked,
    });

    setIndex(0);
  };

  const handleRemoveDiscount = (params, ref) => {
    let index = ref?.current?.values?.discountsArray?.findIndex(
      (el) => el.month == params.row.month
    );
    let values = { ...ref?.current?.values };
    let discountsArray = [...ref?.current?.values?.discountsArray];

    discountsArray.splice(index, 1);

    if (discountsArray.length == 0) {
      discountsArray.push({ month: "", discount: "" });
      setIndex(0);
    }

    ref?.current?.setValues({ ...values, discountsArray: discountsArray });
  };

  const handleEditRowDiscount = (params, ref) => {
    let index = ref?.current?.values?.discountsArray?.findIndex(
      (el) => el.month == params.row.month
    );
    setIndex(`${index}`);
    setIsEdit(true);
    handleOpenD();
  };
  const columnsD = [
    {
      field: "month",
      headerName: "Months Left In Expiry",
      flex: 2,
    },

    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      valueGetter: (params) => `${params?.row?.discount}%`,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        {
          return (
            <Box>
              <IconButton
                variant="contained"
                onClick={() => handleEditRowDiscount(params, formikRef)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                onClick={() => handleRemoveDiscount(params, formikRef)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }
      },
    },
  ];
  const columnsEdit = [
    {
      field: "month",
      headerName: "Months Left In Expiry",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText" sx={{ pl: 2 }}>
              {params?.row?.month}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      valueGetter: (params) => `${params?.row?.discount}%`,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        {
          return (
            <Box>
              <IconButton
                variant="contained"
                onClick={() => handleEditRowDiscount(params, formikRefEdit)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                onClick={() => handleRemoveDiscount(params, formikRefEdit)}
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
    <Box className="admin-layout" component="div">
      <Box>
        <Typography
          fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
          sx={{ color: "#101828", fontWeight: "700" }}
        >
          Edit Product
        </Typography>
      </Box>

      <Formik
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={(values, { resetForm }) => { }}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <Grid container pt={3} spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Typography
                    fontSize={{ lg: 20, md: 20, sm: 18, xs: 16 }}
                    sx={{
                      color: "#101828",
                      fontWeight: "500",
                    }}
                  >
                    Product Information
                  </Typography>
                </Box>
              </Grid>

              {editProductDetailLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    margin: "auto",
                    padding: "3rem 0rem 0rem 0rem",
                  }}
                >
                  <CircularProgress sx={{ color: " #235D5E" }} />
                </Box>
              ) : (
                <>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        mr={1}
                        variant="subtitle2"
                      >
                        Din No
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.DRUG_IDENTIFICATION_NUMBER}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        mr={1}
                        variant="subtitle2"
                      >
                        Product Form
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.PRODUCT_FORM}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        mr={1}
                        variant="subtitle2"
                      >
                        Description
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.description}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        mr={1}
                        variant="subtitle2"
                      >
                        Packaging Size
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.PACKAGING_SIZE}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        mr={1}
                        variant="subtitle2"
                      >
                        Drug Code
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.DRUG_CODE}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        variant="subtitle2"
                      >
                        Product Name
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.product_name}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Box>
                      <Typography
                        className="order-text-heading"
                        variant="subtitle2"
                      >
                        Ai Group NO
                      </Typography>
                      <TextField
                        className="field-input"
                        disabled={true}
                        value={productDetail?.AI_GROUP_NO}
                      />
                    </Box>
                  </Grid>
                </>
              )}
              <Grid item md={12} lg={12} sm={12}>
                {productDetail?.product_name && (
                  <Button
                    variant="contained"
                    onClick={handleAddOpen}
                    size="medium"
                    className="containedPrimary"
                    sx={{ margin: "10px 0px", fontSize: "14px !important" }}
                  >
                    Add Inventory
                  </Button>
                )}
              </Grid>
            </Grid>

            <Grid container pt={3} spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#101828",
                      fontWeight: "500",
                      fontSize: "20px",
                    }}
                  >
                    Product Inventories
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <div style={{ height: 400, width: "100%" }}>
                  {allProductInventoriesLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress sx={{ color: " #235D5E" }} />
                    </Box>
                  ) : (
                    <DataGrid
                      className="table-header"
                      rowHeight={60}
                      rows={state.inventories ? state.inventories : []}
                      getRowId={(row) => row._id}
                      columns={columns}
                      hideFooter={true}
                      hideFooterRowCount={true}
                    />
                  )}
                </div>
                {!customLoading && (
                  <Stack
                    spacing={2}
                    sx={{ alignItems: "flex-end", marginTop: "15px" }}
                  >
                    {state.count > 0 && (
                      <Pagination
                        totalCount={state?.count}
                        page={page}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </Stack>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className="modal-mui"
          sx={{
            width: { xs: "90%!important", sm: "600px!important" },
            height: "70vh",
          }}>
          <Box className="modal-header-mui">
            <Typography
              id="modal-modal-title"
              fontSize={20}
              fontWeight={500}
              color={"#101828"}
            >
              Edit Inventories
            </Typography>
            <IconButton className="modal-clear-btn" onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box
            className="modal-content-mui"
            sx={{ overflow: "auto", height: "55vh" }}
          >
            <Formik
              initialValues={
                editInventory ? editInventory : inventoryInitialValues
              }
              innerRef={formikRefEdit}
              validationSchema={inventorySchema}
              enableReinitialize={true}
              onSubmit={(values, { resetForm }) => {
                const data = {
                  batch_number: values.batch_number,
                  expiry_date: values?.expiry_date,
                  discount: {
                    isAutomatedDiscountApplied:
                      values.isAutomatedDiscountApplied,
                    discountsArray: values.discountsArray,
                  },
                  ...(values?.faqs &&
                    values?.faqs?.length && { faqs: values.faqs }),
                  quantity: values?.quantity,
                  price: values?.price,
                  store: productDetail?.store,
                  product: id,
                  DIN_NUMBER: editInventory?.DIN_NUMBER,
                };
                dispatch(
                  updateProductInventoryDetail(
                    editInventory?._id,
                    data,
                    id,
                    handleClose,
                    function (response) {
                      setCount((pre) => pre + 1);
                    }
                  )
                );
              }}
            >
              {(props) => (
                <form autoComplete="off" onSubmit={props.handleSubmit}>
                  {productInventoryDetailLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "3rem 0rem 0rem 0rem ",
                      }}
                    >
                      <CircularProgress sx={{ color: " #235D5E" }} />
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>
                          <InputLabel shrink>Quantity</InputLabel>
                          <TextField
                            fullWidth
                            className="authfield"
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
                        <Grid item xs={12} md={6} lg={6}>
                          <InputLabel shrink>Unit Price</InputLabel>
                          <TextField
                            fullWidth
                            className="authfield"
                            type="number"
                            value={props.values.price}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            name="price"
                            error={
                              props.touched.price && Boolean(props.errors.price)
                            }
                            // helperText={
                            //   props.touched.price && props.errors.price
                            // }
                            required
                          />
                          <FErrorMessage name="price" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <InputLabel shrink>Expiry Date</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              fullWidth
                              className="datePickerSelectA"
                              disablePast={true}
                              name="expiry_date"
                              value={props.values.expiry_date}
                              onChange={(newValue) => {
                                props.setFieldValue("expiry_date", newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  className="datePickerSelectA"
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
                            <FErrorMessage name="expiry_date" />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <InputLabel>Batch Number</InputLabel>
                          <TextField
                            fullWidth
                            className="authfield"
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
                        <Grid item xs={12} md={12} lg={12}>
                          <Faqs
                            parentProps={props}
                            showFaqInputs={showFaqInputs}
                            setShowFaqInputs={setShowFaqInputs}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "20px",
                                fontWeight: "500",
                                color: "#101828",
                              }}
                            >
                              Discount Details
                            </Typography>
                            <Box pt={2}>
                              <Typography
                                fontSize={16}
                                fontWeight={400}
                                color={"#70747E"}
                              >
                                Add discount details
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    sx={{
                                      color: "#235D5E",
                                      "&.Mui-checked": { color: "#235D5E" },
                                    }}
                                    onClick={(e) =>
                                      handleDiscountChange(e, props)
                                    }
                                    checked={
                                      props.values.isAutomatedDiscountApplied
                                    }
                                  />
                                }
                                label="Apply Automated Discount (optional)"
                              />
                            </FormGroup>
                          </Box>
                        </Grid>
                        {props?.values?.isAutomatedDiscountApplied &&
                          props?.values?.discountsArray?.length == 1 &&
                          props?.values?.discountsArray[0]?.discount?.length ==
                          0 &&
                          props?.values?.discountsArray[0]?.month?.length ==
                          0 && (
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Button
                                  className="outlined-text"
                                  variant="text"
                                  startIcon={<Add />}
                                  onClick={() => {
                                    handleOpenD();
                                    setIndex(0);
                                    props.setValues({
                                      ...props.values,
                                      discountsArray: [
                                        { month: "", discount: "" },
                                      ],
                                    });
                                  }}
                                >
                                  Add New
                                </Button>
                              </Box>
                              {props?.errors &&
                                props?.errors?.discountsArray?.length &&
                                props?.errors?.discountsArray[0] &&
                                props?.errors?.discountsArray[0]?.discount &&
                                props?.errors?.discountsArray[0]?.month &&
                                props?.touched &&
                                props?.touched?.discountsArray && (
                                  <div
                                    style={{
                                      color: "#d32f2f",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    One discount value is mandatory after
                                    enabling automated discount
                                  </div>
                                )}
                            </Grid>
                          )}

                        {props?.values?.isAutomatedDiscountApplied &&
                          props?.values?.discountsArray?.length > 0 &&
                          props?.values?.discountsArray[0]?.discount &&
                          props?.values?.discountsArray[0]?.month && (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              sx={{ marginBottom: "70px" }}
                            >
                              <Box
                                className="txt-divider"
                                sx={{ marginTop: "6px" }}
                              >
                                <Box component="div" sx={{ display: "flex" }}>
                                  <Typography
                                    color="text.primary"
                                    variant="h6"
                                    sx={{ flex: 1 }}
                                  >
                                    Discount Details
                                  </Typography>
                                  <Button
                                    className="outlined-text"
                                    variant="text"
                                    startIcon={<Add />}
                                    onClick={() => {
                                      handleOpenD();
                                      setIndex(
                                        `${props?.values?.discountsArray?.length}`
                                      );
                                    }}
                                  >
                                    Add New
                                  </Button>
                                </Box>
                              </Box>
                              <div
                                style={{
                                  height: 300,
                                  width: "100%",
                                  marginTop: "10px",
                                }}
                              >
                                <DataGrid
                                  className="table-header"
                                  rowHeight={60}
                                  rows={props?.values?.discountsArray}
                                  columns={columnsEdit}
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

                      <Box
                        sx={{ display: "flex", justifyContent: "space-around" }}
                        mt={5}
                      >
                        <Button
                          className="containedPrimaryWhite"
                          variant="contained"
                          size="large"
                          onClick={() => {
                            handleClose();
                          }}
                        >
                          Cancel
                        </Button>{" "}
                        <Button
                          variant="contained"
                          className="containedPrimary"
                          size="large"
                          sx={{
                            height: "45px !important",
                            marginLeft: "5px !important",
                          }}
                          onClick={props.handleSubmit}
                        >
                          {loading ? (
                            <ClipLoader size={25} color="white" loading />
                          ) : (
                            "Update"
                          )}
                        </Button>
                        {/* <Button
                          variant="contained"
                          className="contained contained-default"
                          style={{ marginLeft: "10px" }}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button> */}
                      </Box>
                    </>
                  )}
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addOpen}
        onClose={handleAddClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          className="modal-mui"
          sx={{
            width: { xs: "90%!important", sm: "600px!important" },
            height: "70vh",
          }}
        >
          <Box className="modal-header-mui">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {exist == "true" ? (
                <>
                  <Typography fontSize={20} fontWeight={500} color={"#101828"}>
                    Add Inventory
                  </Typography>
                  <Alert severity="error">
                    Product already exist please fill the form to add inventory
                    of the product
                  </Alert>
                </>
              ) : (
                "Add Inventory"
              )}
            </Typography>
            <IconButton className="modal-clear-btn" onClick={handleAddClose}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box
            className="modal-content-mui"
            sx={{ overflow: "auto", height: "55vh" }}
          >
            <Formik
              initialValues={inventorInitialValues}
              validationSchema={addInventorySchema}
              innerRef={formikRef}
              enableReinitialize={true}
              onSubmit={(values, { resetForm }) => {
                const data = {
                  store: productDetail?.store,
                  product: id,
                  batch_number: values.batch_number,
                  ...(values?.faqs &&
                    values?.faqs?.length && { faqs: values.faqs }),
                  expiry_date: values?.expiry_date,
                  quantity: values?.quantity,
                  discount: {
                    isAutomatedDiscountApplied:
                      values.isAutomatedDiscountApplied,
                    discountsArray: values.discountsArray,
                  },

                  price: values?.price,
                  DIN_NUMBER: productDetail?.DRUG_IDENTIFICATION_NUMBER,
                };
                dispatch(
                  addProductInventory(
                    data,
                    id,
                    exist,
                    handleAddClose,
                    navigate,

                    function (response) {
                      setCount((pre) => pre + 1);
                    }
                  )
                );
              }}
            >
              {(props) => (
                <form autoComplete="off" onSubmit={props.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <InputLabel shrink>Quantity</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
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
                    <Grid item xs={12} md={6} lg={6}>
                      <InputLabel shrink>Unit Price</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
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
                    <Grid item xs={12} md={6} lg={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <InputLabel shrink>Expiry Date</InputLabel>
                        <DatePicker
                          className="datePickerSelectA"
                          value={props.values.expiry_date}
                          disablePast={true}
                          onChange={(newValue) => {
                            props.setFieldValue("expiry_date", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              className="datePickerSelectA"
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
                        <FErrorMessage name="expiry_date" />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <InputLabel shrink>Batch Number</InputLabel>
                      <TextField
                        fullWidth
                        className="authfield"
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

                    <Grid item xs={12} md={12} lg={12}>
                      <Faqs
                        parentProps={props}
                        showFaqInputs={showFaqInputs}
                        setShowFaqInputs={setShowFaqInputs}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: "500",
                            color: "#101828",
                          }}
                        >
                          Discount Details
                        </Typography>
                        <Box pt={2}>
                          <Typography
                            fontSize={16}
                            fontWeight={400}
                            color={"#70747E"}
                          >
                            Add discount details
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "#235D5E",
                                  "&.Mui-checked": { color: "#235D5E" },
                                }}
                                onClick={(e) => handleDiscountChange(e, props)}
                                checked={
                                  props.values.isAutomatedDiscountApplied
                                }
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
                        <Grid item xs={12} sm={12}>
                          <Button
                            className="faq-button"
                            sx={{ float: "right" }}
                            onClick={() => {
                              handleOpenD();
                              setIndex(0);
                              props.setValues({
                                ...props.values,
                                discountsArray: [{ month: "", discount: "" }],
                              });
                            }}
                          >
                            <AddIcon className="faq-button" />
                            ADD NEW
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
                                  color: "#d32f2f",
                                  fontSize: "0.75rem",
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
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          sx={{
                            marginBottom: "70px",
                            paddingTop: "0px !important",
                          }}
                        >
                          <Box
                            className="txt-divider"
                            sx={{ marginTop: "6px" }}
                          >
                            <Box component="div" sx={{ display: "flex" }}>
                              <Typography
                                color="text.primary"
                                variant="h6"
                                sx={{ flex: 1 }}
                              >
                                Discount Details
                              </Typography>
                              <Button
                                className="outlined-text"
                                variant="text"
                                sx={{ float: "right" }}
                                startIcon={<Add />}
                                onClick={() => {
                                  handleOpenD();
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
                              width: "100%",
                              marginTop: "10px",
                            }}
                          >
                            <DataGrid
                              className="table-header"
                              rowHeight={60}
                              rows={props?.values?.discountsArray}
                              columns={columnsD}
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

                  <Box
                    sx={{ display: "flex", justifyContent: "space-around" }}
                    mt={5}
                  >
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
                      variant="contained"
                      className="containedPrimary"
                      size="large"
                      sx={{
                        height: "45px !important",
                        marginLeft: "5px !important",
                      }}
                      onClick={props.handleSubmit}
                    >
                      {addInventoryLoading ? (
                        <ClipLoader
                          size={25}
                          color="white"
                          addInventoryLoading
                        />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default EditProduct;
