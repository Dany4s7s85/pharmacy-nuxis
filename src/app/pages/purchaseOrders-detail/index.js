import React, { useEffect, useRef, useState } from "react";
import "./viewCart.scss";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getPurchaseOrderDetail,
  cancelOrderBuyer,
  acceptOrderBuyer,
  purchaseOrderSuggestion,
  rejectProduct,
  acceptProduct,
  generateOrderQR,
} from "../../services/orders";
import CircularProgress from "@mui/material/CircularProgress";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import PDFFile from "../../shared/components/PDF/PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import OrderTableBody from "./OrderTableBody";
import moment from "moment";
import { TextField } from "@mui/material";
import { saveAs } from "file-saver";
import axios from "axios";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const PurchaseOrderDetail = () => {
  const downloadRef = useRef();
  const location = useLocation();
  let queryStr = new URLSearchParams(location?.search);
  const id = queryStr?.get("pid");
  const randomId = queryStr?.get("ranId");
  const loading = useSelector(
    (state) => state?.order?.purchaseOrderDetail?.loading
  );

  const { user } = useSelector((state) => state?.auth);

  const dispatch = useDispatch();

  const [state, setState] = useState({ order: {} });
  const [status, setStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState("");
  const [qrloading, setQrLoading] = useState(false);
  const [qrDetails, setQrDetails] = useState({});
  const [productIndex, setProductIndex] = useState(null);
  const [count, setCount] = useState(0);
  const [downloadPDF, setDownloadPDF] = useState(false);

  const userToken = user?.store?.vaistat_token;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (id) {
      dispatch(
        getPurchaseOrderDetail(id, function (res) {
          let response = res?.data;
          if (response) {
            setState({ ...state, order: response });
            setStatus(response?.orderStatus);

            let tempProducts = [];
            for (let i = 0; i < response?.subOrders?.length; i++) {
              tempProducts.push(response?.subOrders[i]?.products);
            }

            tempProducts = tempProducts.flat(Infinity);

            const newProduct = tempProducts?.filter(
              (product) =>
                product?.status == "cancelled" ||
                product?.status == "cancelled by buyer" ||
                product?.status == "partially accepted by buyer" ||
                product?.status == "partially accepted"
            );

            if (newProduct?.length > 0) {
              const abProduct = newProduct?.map((np) => {
                const obj = {
                  DIN_NUMBER: np?.product?.DIN_NUMBER,
                  orderedTo: np?.product?.store,
                };

                return obj;
              });
              dispatch(
                purchaseOrderSuggestion(
                  { products: abProduct },
                  function (response) {
                    if (response?.status == "success") {
                      setSuggestions(response?.data);
                    }
                  }
                )
              );
            }
          }
        })
      );
    }
  }, [id, count, randomId]);

  const handleAcceptChange = (prodId) => {
    dispatch(
      acceptOrderBuyer(prodId, function (res) {
        if (res) {
          setCount(count + 1);
          setStatus(res?.data?.orderStatus);
        }
      })
    );
  };

  const handleRejectChange = (prodId) => {
    dispatch(
      cancelOrderBuyer(prodId, function (res) {
        if (res) {
          setCount(count + 1);
          setStatus(res?.data?.orderStatus);
        }
      })
    );
  };

  // const handleGenerateQr = (id, i) => {
  //   setQrLoading(true);
  //   setProductIndex(i);
  //   dispatch(
  //     generateOrderQR(
  //       id,
  //       "recipient",
  //       function (res) {
  //         if (res) {
  //           setQrDetails(res?.data);
  //           setTimeout(() => {
  //             setQrLoading(false);
  //             setProductIndex(null);
  //             downloadRef?.current?.click();
  //           }, 400);
  //         }
  //       },
  //       function (err) {
  //         setQrLoading(false);
  //         setProductIndex(null);
  //       }
  //     )
  //   );
  // };

  const handleGeneratePDF = async (el, i) => {
    setDownloadPDF(true);
    setProductIndex(i);
    const jobDetail = {
      job_id: el?.jobId,
      user_id: el?.orderedTo?.vai_id,
    };
    try {
      const jobDetailPDF = await axios.post(
        `${process?.env?.REACT_APP_VAISTAT_BASE_URL}/api/v5/reports/getJobDetailsPdfNewForReceiver`,
        jobDetail,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (jobDetailPDF?.data && jobDetailPDF?.data?.message == "Success") {
        setDownloadPDF(false);
        setProductIndex(null);
        window?.open(
          jobDetailPDF?.data && jobDetailPDF?.data?.pdfUrl,
          "_blank"
        );
      }
    } catch (err) {
      setDownloadPDF(false);
      setProductIndex(null);
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <PDFDownloadLink
        style={{ display: "none" }}
        PDFDownloadLink
        document={<PDFFile data={qrDetails} forType={"recipient"} />}
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
              height: "60vh",
            }}
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            <Box>
              <Typography
                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                sx={{ color: "#101828", fontWeight: "700" }}
              >
                Purchase Order #{state?.order?.order_no} details
              </Typography>
            </Box>
            <Grid container columnGap={3} mt={3}>
              <Grid container lg={12} alignContent="start" spacing={3}>
                <Grid item xs={12} pt={3}>
                  <Typography
                    fontSize={{ lg: 20, md: 20, sm: 18, xs: 16 }}
                    sx={{
                      color: "#101828",
                      fontWeight: "500",
                    }}
                  >
                    Order Information
                  </Typography>
                </Grid>

                <Grid item lg={4} md={4} sm={4} xs={12}>
                  <Typography className="order-text-heading" mr={1}>
                    Ordered By
                  </Typography>
                  <TextField
                    variant="outlined"
                    className="newfield"
                    disabled={true}
                    value={state?.order?.createdBy?.id}
                  />
                </Grid>

                <Grid item lg={4} md={4} sm={4} xs={12}>
                  <Typography className="order-text-heading" mr={1}>
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
                </Grid>

                <Grid item lg={4} md={4} sm={4} xs={12}>
                  <Typography className="order-text-heading" mr={1}>
                    Order Status
                  </Typography>
                  <TextField
                    variant="outlined"
                    className="newfield"
                    disabled={true}
                    value={`${state?.order?.orderStatus}`}
                  />
                </Grid>
              </Grid>
              <Grid container lg={12}>
                <Grid item xs={12} lg={12} md={12} sm={12} mt={3}></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TableContainer className="tableContainer">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="tableCell"></TableCell>
                          <TableCell className="tableCell" align="left">
                            Store
                          </TableCell>
                          <TableCell className="tableCell" align="left">
                            Order Status
                          </TableCell>
                          <TableCell className="tableCell" align="left">
                            Total
                          </TableCell>
                          <TableCell className="tableCell" align="left">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {state?.order &&
                        state?.order?.subOrders &&
                        state?.order?.subOrders?.length ? (
                          state?.order?.subOrders?.map((el, i) => {
                            return (
                              <OrderTableBody
                                key={i}
                                el={el}
                                i={i}
                                state={state}
                                setState={setState}
                                count={count}
                                setCount={setCount}
                                handleGeneratePDF={handleGeneratePDF}
                                qrloading={downloadPDF}
                                productIndex={productIndex}
                                suggestions={suggestions}
                              />
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
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} lg={12} xs={12}>
                <Box pt={{ sm: 2, xs: 2 }}>
                  <Typography variant="h6">Order Summary</Typography>
                  <Divider />
                </Box>
              </Grid>
              <Grid item md={12} lg={12} sm={12} xs={12}>
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
              </Grid>
              <Grid item lg={5} md={5} sm={8} xs={12} my={3}>
                {state?.order &&
                state?.order?.subOrders &&
                state?.order?.subOrders?.length > 0 ? (
                  <>
                    <Box justifyContent="flex-end">
                      <Box display="flex" my={2} alignItems="center">
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Items Subtotal
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          $
                          {formatNumberWithCommas(
                            parseFloat(Number(state?.order?.total)).toFixed(2)
                          )}
                        </Typography>
                      </Box>

                      <Box display="flex" my={2} alignItems="center">
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Tax
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          {state?.order?.taxDetails?.tax_in_amount
                            ? "$" +
                              parseFloat(
                                state?.order?.taxDetails?.tax_in_amount.toFixed(
                                  2
                                )
                              )
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" my={2}>
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Shipping Fee
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          $
                          {parseFloat(state?.order?.shipping?.total).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" my={2}>
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Order Total
                        </Typography>

                        {state?.order?.taxDetails?.tax_in_amount ? (
                          <Typography variant="h5" fontSize={18}>
                            $
                            {formatNumberWithCommas(
                              parseFloat(
                                Number(state?.order?.total) +
                                  Number(state?.order?.shipping?.total) +
                                  state?.order?.taxDetails?.tax_in_amount
                              ).toFixed(2)
                            )}
                          </Typography>
                        ) : (
                          <Typography variant="h5" fontSize={18}>
                            $
                            {formatNumberWithCommas(
                              parseFloat(
                                Number(state?.order?.total) +
                                  Number(state?.order?.shipping?.total)
                              ).toFixed(2)
                            )}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        display="flex"
                        my={3}
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
          </>
        )}
      </Box>
    </React.Fragment>
  );
};

export default PurchaseOrderDetail;
