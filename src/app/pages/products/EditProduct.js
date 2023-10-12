import React, { useEffect, useState, useCallback } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Formik } from "formik";
import {
  Schema,
  inventorySchema,
  inventoryInitialValues,
  addInventoryInitialValues,
  addInventorySchema,
} from "./helper";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../shared/components/Pagination";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import { ClipLoader } from "react-spinners";
import ButtonGroup from "@mui/material/ButtonGroup";

import {
  addProductInventory,
  deleteProductInventory,
  editProductDetail,
  getAllProductInventories,
  getProductInventoryDetail,
  updateProductInventoryDetail,
} from "../../services/products";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
export const EditProduct = () => {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleAddClose = () => setAddOpen(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) => state?.product?.updateInventory?.loading
  );
  const addInventoryLoading = useSelector(
    (state) => state?.product?.addInventory?.loading
  );
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [productDetail, setProductDetail] = useState(null);
  const [customLoading, setCustomLoading] = useState(true);
  const [inventories, setInventories] = useState([]);
  const [editInventory, setEditInventory] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [state, setState] = useState({
    inventories: inventories.inventories,
    count: 0,
  });

  const handleOpen = (id) => {
    dispatch(
      getProductInventoryDetail(id, function (response) {
        if (response?.status === "success") {
          setEditInventory(response?.data);
        }
      })
    );
    setOpen(true);
  };
  const handlePageChange = useCallback((e, value) => {
    setPage(value);
    setCustomLoading(false);
  }, []);
  useEffect(() => {
    dispatch(
      editProductDetail(id, function (response) {
        if (response?.status === "success") {
          setProductDetail(response?.data);
        }
      })
    );
  }, [id]);

  useEffect(() => {
    dispatch(
      getAllProductInventories(id, page, limit, function (response) {
        if (response?.data?.inventories?.length > 0) {
          setInventories(response?.data);
          setCustomLoading(false);
        }
      })
    );
  }, [id, count]);

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
  const columns = [
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      width: 120,
      valueGetter: (params) =>
        moment(params.row?.expiry_date).format("DD-MM-YYYY"),
    },
    {
      field: "DIN_NUMBER",
      headerName: "DIN No",
      width: 120,
      valueGetter: (params) => params.row?.DIN_NUMBER,
    },
    {
      field: "batch_number",
      headerName: "Batch Number",
      valueGetter: (params) => params.row?.batch_number,
      width: 130,
    },

    { field: "quantity", headerName: "Quantity", width: 130, editable: true },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      valueGetter: (params) => `$${params?.row?.price}`,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        {
          return (
            <Box>
              {params?.row._id ? (
                <IconButton
                  variant="contained"
                  onClick={() => handleOpen(params?.row._id)}
                >
                  <EditIcon />
                </IconButton>
              ) : null}

              {params?.row._id ? (
                <IconButton
                  variant="contained"
                  onClick={() => {
                    dispatch(
                      deleteProductInventory(
                        params?.row?.id,
                        id,
                        function (response) {
                          setCount((pre) => count + 1);
                        }
                      )
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Box>
          );
        }
      },
    },
  ];
  return (
    <Box className="admin-layout" component="div">
      <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          className="admin-card-header"
          sx={{
            position: "sticky",
            top: "0",
            paddingLeft: "10px",
            paddingTop: "10px",
          }}
        >
          <Typography variant="h5">Edit Product</Typography>
        </Box>
        <CardContent>
          <Formik
            enableReinitialize={true}
            validationSchema={Schema}
            onSubmit={(values, { resetForm }) => { }}
          >
            {(props) => (
              <form autoComplete="off" onSubmit={props.handleSubmit}>
                <Grid container mt={3} spacing={3}>
                  <Grid item xs={12}>
                    <Box className="txt-divider">
                      <Typography variant="body">
                        Product Information
                      </Typography>
                      <Divider />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Din No
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.DRUG_IDENTIFICATION_NUMBER}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Product Form
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.PRODUCT_FORM}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Description
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.description}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Packaging Size
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.PACKAGING_SIZE}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Drug Code
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.DRUG_CODE}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Product Name
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.product_name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="label-color"
                        mr={1}
                        variant="subtitle2"
                      >
                        Ai Group NO
                      </Typography>
                      <Typography variant="subtitle1">
                        {productDetail?.AI_GROUP_NO}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container mt={3} spacing={3}>
                  <Button onClick={handleAddOpen}>Add Product Inventory</Button>
                </Grid>
                <Grid container mt={3} spacing={3}>
                  <Grid item xs={12}>
                    <Box className="txt-divider">
                      <Typography variant="body">
                        Product Inventories
                      </Typography>
                      <Divider />
                    </Box>
                  </Grid>
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={state.inventories ? state.inventories : []}
                      getRowId={(row) => row._id}
                      columns={columns}
                      hideFooter={true}
                      hideFooterRowCount={true}
                    />
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
              </form>
            )}
          </Formik>
        </CardContent>
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
          <Box className="modal-mui">
            <Box className="modal-header-mui">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Inventories
              </Typography>
              <Divider />
            </Box>
            <Box className="modal-content-mui">
              <Fade in={open}>
                <Grid container spacing={2} py={4} px={2}>
                  <Formik
                    initialValues={
                      editInventory ? editInventory : inventoryInitialValues
                    }
                    validationSchema={inventorySchema}
                    enableReinitialize={true}
                    onSubmit={(values, { resetForm }) => {
                      const data = {
                        expiry_date: values?.expiry_date,
                        quantity: values?.quantity,
                        price: values?.price,
                        pharmacy: productDetail?.pharmacy,
                        product: productDetail?.product_category,
                        DIN_NUMBER: editInventory?.DIN_NUMBER,
                      };
                      dispatch(
                        updateProductInventoryDetail(
                          editInventory?._id,
                          data,
                          id,
                          handleClose,
                          function (response) {
                            if (response?.data?.inventories?.length > 0) {
                              setInventories(response?.data);
                            }
                          }
                        )
                      );
                    }}
                  >
                    {(props) => (
                      <form autoComplete="off" onSubmit={props.handleSubmit}>
                        <Grid item xs={12} md={6} lg={6}>
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
                              props.touched.quantity &&
                              Boolean(props.errors.quantity)
                            }
                            helperText={
                              props.touched.quantity && props.errors.quantity
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Unit Price"
                            type="number"
                            value={props.values.price}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            name="price"
                            error={
                              props.touched.price && Boolean(props.errors.price)
                            }
                            helperText={
                              props.touched.price && props.errors.price
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Expiry Date"
                              disablePast={true}
                              value={props.values.expiry_date}
                              onChange={(newValue) => {
                                props.setFieldValue("expiry_date", newValue);
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
                        <Box>
                          <ButtonGroup
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              "& > *": {
                                m: 2,
                              },
                            }}
                          >
                            <Button variant="contained" onClick={handleClose}>
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={props.handleSubmit}
                            >
                              {loading ? (
                                <ClipLoader size={25} color="white" loading />
                              ) : (
                                "Update"
                              )}
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </Grid>
              </Fade>
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
          <Box className="modal-mui">
            <Box className="modal-header-mui">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Inventory
              </Typography>
              <Divider />
            </Box>
            <Box className="modal-content-mui">
              <Fade in={addOpen}>
                <Grid container spacing={2} py={4} px={2}>
                  <Formik
                    initialValues={addInventoryInitialValues}
                    validationSchema={addInventorySchema}
                    enableReinitialize={true}
                    onSubmit={(values, { resetForm }) => {
                      const data = {
                        pharmacy: productDetail?.pharmacy,
                        product: id,
                        expiry_date: values?.expiry_date,
                        quantity: values?.quantity,
                        price: values?.price,
                        DIN_NUMBER: productDetail?.DRUG_IDENTIFICATION_NUMBER,
                      };
                      dispatch(
                        addProductInventory(
                          data,
                          id,
                          handleAddClose,
                          function (response) {
                            if (response?.data?.inventories?.length > 0) {
                              setInventories(response?.data);
                            }
                          }
                        )
                      );
                    }}
                  >
                    {(props) => (
                      <form autoComplete="off" onSubmit={props.handleSubmit}>
                        <Grid item xs={12} md={6} lg={6}>
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
                              props.touched.quantity &&
                              Boolean(props.errors.quantity)
                            }
                            helperText={
                              props.touched.quantity && props.errors.quantity
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Unit Price"
                            type="number"
                            value={props.values.price}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            name="price"
                            error={
                              props.touched.price && Boolean(props.errors.price)
                            }
                            helperText={
                              props.touched.price && props.errors.price
                            }
                            required
                          />
                        </Grid>
                        {/*<Grid item xs={12} md={6} lg={6}>*/}
                        {/*  <TextField*/}
                        {/*    fullWidth*/}
                        {/*    variant="filled"*/}
                        {/*    label="Batch Number"*/}
                        {/*    value={props.values.batch_number}*/}
                        {/*    onBlur={props.handleBlur}*/}
                        {/*    onChange={props.handleChange}*/}
                        {/*    name="batch_number"*/}
                        {/*    error={*/}
                        {/*      props.touched.batch_number &&*/}
                        {/*      Boolean(props.errors.batch_number)*/}
                        {/*    }*/}
                        {/*    helperText={*/}
                        {/*      props.touched.batch_number &&*/}
                        {/*      props.errors.batch_number*/}
                        {/*    }*/}
                        {/*    required*/}
                        {/*  />*/}
                        {/*</Grid>*/}

                        <Grid item xs={12} md={6} lg={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Expiry Date"
                              disablePast={true}
                              value={props.values.expiry_date}
                              onChange={(newValue) => {
                                props.setFieldValue("expiry_date", newValue);
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
                        <Box>
                          <ButtonGroup
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              "& > *": {
                                m: 2,
                              },
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={handleAddClose}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
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
                          </ButtonGroup>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </Grid>
              </Fade>
            </Box>
          </Box>
        </Modal>
      </Card>
    </Box>
  );
};
export default EditProduct;
