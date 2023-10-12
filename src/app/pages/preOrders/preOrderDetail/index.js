import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import "./doc.scss";
import { capitalize, generateRandom } from "../../../helpers/formatting";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { printPDF } from "../../../helpers/pdf";
import { urlToBase64 } from "../../../helpers/imageResizer";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import SubordersTable from "./SubordersTable";
import CircularProgress from "@mui/material/CircularProgress";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RxIcon from "../../../assets/images/docLogo.png";
import { preOrderUpdate } from "../../../services/orders";
import { ClipLoader } from "react-spinners";
import { getTotalPrice, getTotalTax } from "../../../helpers/pricing";
import { Input } from "@mui/icons-material";
import { fontWeight } from "@mui/system";
import { formatNumberWithCommas } from "../../../helpers/getTotalValue";

const ApprovalStatus = ({
  order,
  setPurchaseOrderCount,
  purchaseOrderCount,
  setState,
  state,
  edit,
  setEdit,
  updateLoading,
  handleCancel,
  subOrders,
}) => {
  const { user, isSessionExpired } = useSelector((state) => state?.auth);
  const pdfRef = useRef(null);
  const [storeId, setStoreId] = useState("");
  const dispatch = useDispatch();

  const handleDownload = () => {
    printPDF(pdfRef);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} pl={1}>
          <Typography
            variant="h5"
            sx={{ color: "#101828", fontWeight: "500", fontSize: "16px" }}
          >
            Order Information
          </Typography>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Box
            sx={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
            }}
          >
            <InputLabel shrink>Created By</InputLabel>
            <>
              <TextField
                variant="outlined"
                className="authfield"
                disabled={true}
                value={
                  order?.createdBy?.role == "super_admin"
                    ? order?.createdBy?.business_owner_name
                    : order?.createdBy?.first_name +
                      " " +
                      order?.createdBy?.last_name
                }
              />
            </>
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Box
            sx={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
            }}
          >
            <InputLabel shrink>Created At</InputLabel>
            <TextField
              variant="outlined"
              className="authfield"
              disabled={true}
              value={
                state?.order?.createdAt
                  ? moment(state?.order?.createdAt).format("MM/DD/YYYY hh:mm A")
                  : ""
              }
            />
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Box
            sx={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
            }}
          >
            <InputLabel shrink>For(Store name)</InputLabel>
            <TextField
              variant="outlined"
              className="authfield"
              disabled={true}
              value={capitalize(order?.orderedBy?.store_name)}
            />
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Box
            sx={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
            }}
          >
            <InputLabel shrink>Address(Store)</InputLabel>
            <TextField
              variant="outlined"
              className="authfield"
              disabled={true}
              value={`${order?.orderedBy?.location}`}
            />
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Box
            sx={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
            }}
          >
            <InputLabel shrink>Approval Status</InputLabel>
            <TextField
              variant="outlined"
              className="authfield"
              disabled={true}
              value={`${order?.approval_status}`}
            />
          </Box>
        </Grid>

        <Grid item md={12} sm={12} lg={12} xs={12}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography
                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                fontWeight={500}
                color={"#101828"}
              >
                Order Summary
              </Typography>
              <Box display="flex" my={2} alignItems="center">
                <Typography
                  sx={{ flex: "1" }}
                  fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                  fontWeight={500}
                  color={"#101828"}
                >
                  Subtotal <span></span> Items
                </Typography>
                {order?.products && order?.products?.length ? (
                  <Typography
                    fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                    fontWeight={500}
                    color={"#101828"}
                  >
                    $
                    {formatNumberWithCommas(
                      getTotalPrice(order?.products)?.toFixed(2)
                    )}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              <Box display="flex" my={2} alignItems="center">
                <Typography
                  sx={{ flex: "1" }}
                  fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                  fontWeight={500}
                  color={"#101828"}
                >
                  Tax <span></span>
                </Typography>
                {order && order?.taxDetails && (
                  <Typography
                    fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                    fontWeight={500}
                    color={"#101828"}
                  >
                    $
                    {getTotalTax(
                      getTotalPrice(order?.products)?.toFixed(2),
                      order?.taxDetails
                    )}
                  </Typography>
                )}
              </Box>

              <Box display="flex" alignItems="center" my={2}>
                <Typography
                  sx={{ flex: "1" }}
                  fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                  fontWeight={500}
                  color={"#101828"}
                >
                  Total
                </Typography>
                {order && order?.taxDetails && (
                  <Typography
                    fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                    fontWeight={500}
                    color={"#101828"}
                  >
                    $
                    {formatNumberWithCommas(
                      Number(
                        Number(
                          getTotalTax(
                            getTotalPrice(order?.products)?.toFixed(2),
                            order?.taxDetails
                          )
                        ) + Number(getTotalPrice(order?.products)?.toFixed(2))
                      )?.toFixed(2)
                    )}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Order Table */}

        <Grid item xs={12} sm={12} lg={12} md={12} mt={3}></Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TableContainer
            className="tableContainer"
            // sx={{ width:'812px' }}
          >
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    sx={{ borderBottom: "none !important" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderBottom: "none !important" }}
                  >
                    Medicine
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderBottom: "none !important" }}
                  >
                    DIN #
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderBottom: "none !important" }}
                  >
                    Store
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subOrders && subOrders?.length ? (
                  subOrders?.map((el, i) => {
                    return (
                      <SubordersTable
                        // key={generateRandom()}
                        key={i}
                        suborders={order.subOrders}
                        el={el}
                        i={i}
                        setPurchaseOrderCount={setPurchaseOrderCount}
                        purchaseOrderCount={purchaseOrderCount}
                        edit={edit}
                        store={storeId}
                        setStore={setStoreId}
                        setEdit={setEdit}
                        setState={setState}
                        state={state}
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
    </>
  );
};
export default ApprovalStatus;
