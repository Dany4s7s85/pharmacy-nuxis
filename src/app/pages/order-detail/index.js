import React, { useEffect, useState, useRef } from "react";
import "./viewCart.scss";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UndoIcon from "@mui/icons-material/Undo";
import {
  getOrderDetail,
  rejectOrder,
  returnOrder,
  updateOrderStatus,
  generatePDF,
} from "../../services/orders";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFFile from "../../shared/components/PDF/PDFFile";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PrescriptionModal from "./prescription";
import { IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { saveAs } from "file-saver";
import OrderDetailStepper from "./orderDetailStepper";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const OrderDetail = () => {
  const downloadRef = useRef();
  const location = useLocation();
  let queryStr = new URLSearchParams(location?.search);
  const id = queryStr?.get("oid");
  const randomId = queryStr?.get("ranId");
  const response = useSelector(
    (state) => state?.order?.pharmacyOrderDetail?.response
  );

  const returnOrderLoading = useSelector(
    (state) => state?.order?.returnOrder?.loading
  );

  const loading = useSelector(
    (state) => state?.order?.pharmacyOrderDetail?.loading
  );
  const rejectOrderStatusLoading = useSelector(
    (state) => state?.order?.rejectOrder?.loading
  );

  const updateOrderStatusLoading = useSelector(
    (state) => state?.order?.updateOrderStatus?.loading
  );

  const generatePDFLoading = useSelector(
    (state) => state?.order?.generate_pdf?.loading
  );
  const acceptOrderLoading = useSelector(
    (state) => state?.order?.updateOrderStatus?.loading
  );

  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [state, setState] = useState({ order: {} });
  const [qrDetails, setQrDetails] = useState({});

  const [status, setStatus] = useState("");
  const [isFundReturn, setIsFundReturn] = useState(false);
  const [returns, setReturn] = useState([]);

  const [reason, setReason] = useState("");
  const [restock, setRestock] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadPDF, setDownloadPDF] = useState(false);
  const userToken = user?.store?.vaistat_token;
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (id) {
      dispatch(getOrderDetail(id, function (res) {}));
      setIsFundReturn(false);
    }
  }, [id, count, randomId]);

  useEffect(() => {
    if (response) {
      setState({ ...state, order: response });
      setStatus(response?.orderStatus);
    }
  }, [response]);

  const handleAcceptChange = () => {
    dispatch(
      updateOrderStatus(
        id,
        { status: "Order Accepted By Store" },
        function (res) {
          if (res) {
            toast.success("Order Status Updated Successfully");
            setStatus(res?.data?.orderStatus);
          }
        }
      )
    );
  };

  const handleGeneratePDF = () => {
    dispatch(
      generatePDF(
        id,
        function (res) {
          if (res) {
            const blob = new Blob([res], {
              type: "application/pdf",
            });
            saveAs(blob, `OrderDetail-${state?.order?.order_no}.pdf`);
          }
        },
        function (err) {
          // console.log(err);
        }
      )
    );
  };

  const handleRejectChange = () => {
    dispatch(
      rejectOrder(id, function (res) {
        if (res) {
          setStatus(res?.data?.orderStatus);
          setCount(count + 1);
        }
      })
    );
  };

  const handleReadyForPickUp = () => {
    dispatch(
      updateOrderStatus(id, { status: "Ready for pickup" }, function (res) {
        if (res) {
          toast.success("Order Status Updated Successfully");
          setStatus(res?.data?.orderStatus);
          dispatch(getOrderDetail(id, function (res) {}));
        }
      })
    );
  };

  const handleDownloadPDF = async () => {
    setDownloadPDF(true);
    const jobDetail = {
      job_id: state?.order?.jobId,
      user_id: state?.order?.orderedTo?.vai_id,
    };
    try {
      const jobDetailPDF = await axios.post(
        `${process?.env?.REACT_APP_VAISTAT_BASE_URL}/api/v5/reports/getJobDetailsPdfNew`,
        jobDetail,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (jobDetailPDF?.data && jobDetailPDF?.data?.message == "Success") {
        setDownloadPDF(false);
        window?.open(
          jobDetailPDF?.data && jobDetailPDF?.data?.pdfUrl,
          "_blank"
        );
      }
    } catch (err) {
      setDownloadPDF(false);
      console.log(err);
    }
  };

  // const handleGenerateQr = () => {
  //   setQrLoading(true);
  //   dispatch(
  //     generateOrderQR(
  //       state?.order?._id,
  //       "sender",
  //       function (res) {
  //         if (res) {
  //           setQrDetails(res?.data);
  //           setTimeout(() => {
  //             setQrLoading(false);
  //             downloadRef?.current?.click();
  //           }, 400);
  //         }
  //       },
  //       function (err) {
  //         setQrLoading(false);
  //       }
  //     )
  //   );
  // };

  const handleFundReturn = () => {
    setIsFundReturn(true);
  };

  const handleFundReturnCancel = () => {
    setIsFundReturn(false);
  };

  const handleQuantityChange = (value, product, i) => {
    let products = [...state?.order?.products];

    let count = value < 1 ? 1 : value;

    if (value > product.count) {
      toast.error(`Max available quantity: ${product?.count}`);
      value = product?.count;
    }

    let copyReturns = [...returns];

    let is_fully_returned = false;
    if (value == 0) {
      is_fully_returned = true;
    }

    products[i].tempReturns = { quantity: value };

    let productIndex = copyReturns.findIndex(
      (el) => el?.product == product?._id
    );
    if (copyReturns && copyReturns?.length && productIndex > -1) {
      copyReturns[productIndex] = {
        ...copyReturns[productIndex],
        quantity: value,
        is_fully_returned,
      };
    } else {
      copyReturns.push({
        product: product?._id,
        quantity: value,
        is_fully_returned,
      });
    }
    setReturn(copyReturns);
    setState({ order: { ...state?.order, products: products } });
  };

  const handleReturnSubmit = () => {
    let copyReturns = [...returns];
    copyReturns = copyReturns.filter((el) => el?.quantity != "");
    if (copyReturns && copyReturns?.length) {
      const data = {
        returns: copyReturns,
        reason: reason,
        restock: restock,
      };

      dispatch(
        returnOrder(id, data, function (res) {
          if (res.status == "success") {
            setCount(count + 1);
          }
        })
      );
    } else {
      toast?.error("No Changes detected");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  return (
    <React.Fragment>
      <PDFDownloadLink
        style={{ display: "none" }}
        PDFDownloadLink
        document={<PDFFile data={qrDetails} forType={"sender"} />}
        filename="order"
      >
        {({ loading }) =>
          loading ? (
            <button>Loading Document...</button>
          ) : (
            <button ref={downloadRef}>Download</button>
          )
        }
      </PDFDownloadLink>

      <Box className="admin-layout" component="div">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
            }}
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            <Box>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography
                  fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                  sx={{
                    color: "#101828",
                    fontWeight: "700",
                  }}
                >
                  Order No. {state?.order?.order_no} details
                </Typography>
                <Tooltip
                  title={<div style={{ fontSize: "12px" }}>Generate PDF</div>}
                  placement="bottom"
                >
                  <IconButton sx={{ marginRight: { lg: "3rem", md: "3rem" } }}>
                    {generatePDFLoading ? (
                      <CircularProgress sx={{ color: " #235D5E" }} />
                    ) : (
                      <PictureAsPdfIcon
                        sx={{
                          fontSize: {
                            lg: "40px",
                            md: "40px",
                            sm: "30px",
                            xs: "25px",
                          },
                          color: "#235D5E",
                        }}
                        onClick={() => handleGeneratePDF()}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                height: "420px",
                overflowY: "scroll",
                paddingRight: "10px",
              }}
            >
              <Grid container columnGap={2}>
                <Grid container lg={12} alignContent="start" spacing={3}>
                  <Grid item xs={12} lg={12} md={12} sm={12} pt={3}>
                    <Typography
                      variant="h4"
                      fontSize={{ lg: 20, md: 20, sm: 18, xs: 16 }}
                      sx={{
                        color: "#101828",
                        fontWeight: "500",
                      }}
                    >
                      Order Information
                    </Typography>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <Box>
                      <Typography className="order-text-heading" mr={1}>
                        Customer ID
                      </Typography>
                      <TextField
                        variant="outlined"
                        className="newfield"
                        disabled={true}
                        value={
                          state?.order?.orderedBy?.uuid
                            ? state?.order?.orderedBy?.uuid
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <Box>
                      <Typography className="order-text-heading">
                        Created At
                      </Typography>
                      <TextField
                        variant="outlined"
                        className="newfield"
                        disabled={true}
                        value={
                          state?.order?.createdAt
                            ? moment(state?.order?.createdAt).format(
                                "MM/DD/YYYY hh:mm A"
                              )
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <Box>
                      <Typography className="order-text-heading" mr={1}>
                        Parent Order No.
                      </Typography>
                      <TextField
                        variant="outlined"
                        className="newfield"
                        disabled={true}
                        value={
                          state?.order?.parent_order_number
                            ? state?.order?.parent_order_number
                            : "N/A"
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <Box>
                      <Box>
                        <Typography className="order-text-heading" mr={1}>
                          Status
                        </Typography>
                        {state?.order?.parent_order_number && (
                          <TextField
                            variant="outlined"
                            className="newfield"
                            disabled={true}
                            value={status}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    {state?.order?.parent_order_number && (
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                          md: "row",
                          lg: "row",
                        }}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                        spacing={2}
                      >
                        {status === "New Order" ? (
                          <Button
                            variant="contained"
                            size="large"
                            className="containedAlpha"
                            startIcon={<DoneIcon />}
                            onClick={handleAcceptChange}
                            disabled={acceptOrderLoading}
                          >
                            {acceptOrderLoading ? (
                              <ClipLoader size={20} color="white" />
                            ) : (
                              "Accept"
                            )}
                          </Button>
                        ) : null}

                        {status === "New Order" ? (
                          <Button
                            variant="contained"
                            size="large"
                            className="containedQr"
                            sx={{ marginX: "1rem" }}
                            startIcon={<CloseIcon />}
                            onClick={handleRejectChange}
                            disabled={rejectOrderStatusLoading}
                          >
                            {rejectOrderStatusLoading ? (
                              <ClipLoader size={20} color="white" />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        ) : null}

                        {status === "New Order" ? (
                          <Button
                            variant="contained"
                            size="large"
                            className="containedPrimary"
                            sx={{ marginX: "1rem" }}
                            startIcon={<EditIcon />}
                            onClick={handleFundReturn}
                          >
                            Edit
                          </Button>
                        ) : null}

                        {status === "Order Accepted By Store" ||
                        status === "Ready for pickup" ||
                        status === "Order Accepted By Buyer" ||
                        status === "Completed" ||
                        status === "In Transit" ? (
                          <Box pl={1}>
                            <Button
                              variant="contained"
                              size="large"
                              className="containedAlpha"
                              onClick={() => handleModalOpen()}
                            >
                              See Prescription
                            </Button>
                          </Box>
                        ) : (
                          ""
                        )}

                        {status === "Order Accepted By Store" ||
                        status === "Order Accepted By Buyer" ? (
                          <Box pl={1}>
                            <Button
                              variant="contained"
                              size="large"
                              className="containedPrimary"
                              onClick={() => handleReadyForPickUp()}
                              disabled={updateOrderStatusLoading}
                            >
                              {updateOrderStatusLoading ? (
                                <ClipLoader size={25} color="white" />
                              ) : (
                                "Ready for pickup"
                              )}
                            </Button>
                          </Box>
                        ) : (
                          ""
                        )}

                        {status === "Ready for pickup" ||
                        status === "Schedule for pickup" ? (
                          <Box pl={1}>
                            <Button
                              variant="contained"
                              size="large"
                              className="containedQr"
                              onClick={() => handleDownloadPDF()}
                              disabled={downloadPDF}
                            >
                              {downloadPDF ? (
                                <ClipLoader size={25} color="white" />
                              ) : (
                                "Generate Order QR"
                              )}
                            </Button>
                          </Box>
                        ) : null}
                      </Stack>
                    )}
                  </Grid>
                </Grid>

                <Grid container lg={12} md={12} sm={12} xs={12} pt={3}>
                  <OrderDetailStepper stateOrder={state?.order} />
                </Grid>

                <Grid container pt={{ lg: 3, md: 3, sm: 2, xs: 1.5 }}>
                  <TableContainer
                    // component={Paper}
                    className="tableContainer"
                  >
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: "30%" }}>Item</TableCell>
                          <TableCell>Cost</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell className="tableCell">Total</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {state?.order &&
                        state?.order?.products &&
                        state?.order?.products?.length ? (
                          state?.order?.products?.map((product, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell className="tableBodyCell">
                                  <Box sx={{ display: "flex" }}>
                                    {product?.product?.product?.imageCover &&
                                    product?.product?.product?.imageCover
                                      ?.full_image &&
                                    product?.product?.product?.imageCover
                                      ?.full_image ? (
                                      <img
                                        width="80px"
                                        style={{ marginRight: "10px" }}
                                        src={
                                          product?.product?.product?.imageCover
                                            ?.full_image
                                        }
                                      />
                                    ) : (
                                      <Box
                                        className="cusProductName"
                                        sx={{ margin: "0px 10px 0px 0px" }}
                                      >
                                        <Typography>
                                          {
                                            product?.product?.product
                                              ?.product_name
                                          }
                                        </Typography>
                                      </Box>
                                    )}

                                    <Box alignSelf="center" className="rowText">
                                      {product?.product?.product?.product_name}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell className="tableBodyCell">
                                  {`$${formatNumberWithCommas(
                                    parseFloat(
                                      Number(
                                        product?.discountedPrice
                                          ? product?.discountedPrice
                                              ?.discountedPrice
                                          : product?.price
                                      )
                                    ).toFixed(2)
                                  )}`}
                                </TableCell>
                                <TableCell className="tableBodyCell">
                                  <Box>
                                    <span> x {Number(product?.baseCount)}</span>
                                  </Box>

                                  <Box className="editQuantityInput">
                                    {isFundReturn && (
                                      <>
                                        <TextField
                                          className="counter"
                                          name="quantity"
                                          type="number"
                                          variant="outlined"
                                          size="small"
                                          value={
                                            product?.tempReturns?.quantity
                                              ? product?.tempReturns?.quantity
                                              : ""
                                          }
                                          onChange={(e) =>
                                            handleQuantityChange(
                                              e?.target?.value,
                                              product,
                                              i
                                            )
                                          }
                                        />

                                        <Typography
                                          variant="subtitle1"
                                          fontSize={12}
                                        >
                                          {`Avail. Stock : ${
                                            Number(product?.product?.quantity) +
                                            Number(product?.count)
                                          }`}
                                        </Typography>
                                      </>
                                    )}
                                  </Box>

                                  {product &&
                                  product?.return &&
                                  product?.return.length ? (
                                    <Box
                                      display="flex"
                                      sx={{
                                        alignItems: "center",
                                        color: "red",
                                      }}
                                    >
                                      <UndoIcon />
                                      <Typography
                                        variant="subtitle1"
                                        fontSize={18}
                                      >
                                        {`-${product?.return[0]?.quantity}`}
                                      </Typography>
                                    </Box>
                                  ) : null}
                                </TableCell>
                                <TableCell className="tableBodyCell">
                                  {`$${formatNumberWithCommas(
                                    parseFloat(
                                      Number(
                                        Number(product?.price) *
                                          Number(product?.baseCount)
                                      )
                                    )?.toFixed(2)
                                  )}`}

                                  {product &&
                                  product?.return &&
                                  product?.return.length ? (
                                    <Box
                                      display="flex"
                                      sx={{
                                        alignItems: "center",
                                        color: "red",
                                      }}
                                    >
                                      <UndoIcon />
                                      <Typography
                                        variant="subtitle1"
                                        fontSize={18}
                                      >
                                        {`-$${parseFloat(
                                          Number(
                                            product?.return[0]?.returnTotal
                                          )
                                        ).toFixed(2)}`}
                                      </Typography>
                                    </Box>
                                  ) : null}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid mt={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="h6">Order Summary</Typography>
                  <Divider />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
                  <Box>
                    <Typography variant="body1">Order Note</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      value="ship all the ordered items together by tommorroow and I send you an email please check thanks"
                      style={{
                        minWidth: "100%",
                        // marginLeft: '15px',
                        // marginRight: '15px',
                        height: "170px",
                        backgroundColor: "rgb(233, 236, 239)",
                        padding: "10px",
                        border: "none",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item lg={5} md={5} sm={8} xs={12} mt={3}>
                  {state?.order &&
                  state?.order?.products &&
                  state?.order?.products?.length > 0 ? (
                    <>
                      <Box justifyContent="flex-end">
                        <Box display="flex" mt={2} alignItems="center">
                          <Typography sx={{ flex: "1" }} variant="subtitle1">
                            Items Subtotal
                          </Typography>
                          <Typography variant="h5" fontSize={18}>
                            $
                            {formatNumberWithCommas(
                              parseFloat(
                                Number(state?.order?.cartTotal)
                              ).toFixed(2)
                            )}
                          </Typography>
                        </Box>
                        <Box display="flex" mt={2} alignItems="center">
                          <Typography sx={{ flex: "1" }} variant="subtitle1">
                            Tax
                          </Typography>
                          <Typography variant="h5" fontSize={18}>
                            {state?.order?.taxDetails?.tax_in_amount
                              ? "$" +
                                parseFloat(
                                  Number(
                                    state?.order?.taxDetails?.tax_in_amount
                                  ).toFixed(2)
                                )
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Typography sx={{ flex: "1" }} variant="subtitle1">
                            Shipping Fee
                          </Typography>
                          <Typography variant="h5" fontSize={18}>
                            ${state?.order?.shipping?.selectedShipping?.total}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Typography sx={{ flex: "1" }} variant="subtitle1">
                            Order Total
                          </Typography>

                          {state?.order?.taxDetails?.tax_in_amount ? (
                            <Typography variant="h5" fontSize={18}>
                              $
                              {formatNumberWithCommas(
                                parseFloat(
                                  Number(
                                    state?.order?.shipping?.selectedShipping
                                      ?.total
                                  ) +
                                    Number(state?.order?.cartTotal) +
                                    state?.order?.taxDetails?.tax_in_amount
                                ).toFixed(2)
                              )}
                            </Typography>
                          ) : (
                            <Typography variant="h5" fontSize={18}>
                              $
                              {formatNumberWithCommas(
                                parseFloat(
                                  Number(state?.order?.cartTotal) +
                                    Number(
                                      state?.order?.shipping?.selectedShipping
                                        ?.total
                                    )
                                ).toFixed(2)
                              )}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          display="flex"
                          mt={3}
                          style={{ width: "200px" }}
                          alignItems="center"
                        ></Box>
                      </Box>
                    </>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Box>
            {status == "New Order" && (
              <CardActions sx={{ justifyContent: "flex-end" }}>
                {isFundReturn && (
                  <Button
                    variant="contained"
                    className="containedPrimary"
                    onClick={() => {
                      handleFundReturnCancel();
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {isFundReturn && (
                  <Button
                    variant="contained"
                    className="containedPrimary"
                    disabled={returns?.length == 0 || returnOrderLoading}
                    onClick={handleReturnSubmit}
                  >
                    {returnOrderLoading ? (
                      <Box sx={{ display: "flex" }}>
                        <CircularProgress sx={{ color: " #235D5E" }} />
                      </Box>
                    ) : (
                      "Update"
                    )}
                  </Button>
                )}
              </CardActions>
            )}
          </>
        )}
      </Box>
      <PrescriptionModal
        orderDetail={state?.order}
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
      />
    </React.Fragment>
  );
};

export default OrderDetail;
