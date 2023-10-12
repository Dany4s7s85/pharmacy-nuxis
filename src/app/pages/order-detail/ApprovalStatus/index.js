import React, { useRef, useEffect } from "react";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "./doc.scss";
import { capitalize } from "../../../helpers/formatting";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { printPDF } from "../../../helpers/pdf";
import { urlToBase64 } from "../../../helpers/imageResizer";
import RxIcon from "../../../assets/images/rx.svg";

const ApprovalStatus = ({ order, products }) => {
  const { user, isSessionExpired } = useSelector((state) => state?.auth);
  const pdfRef = useRef(null);

  const handleDownload = () => {
    printPDF(pdfRef);
  };

  return (
    <>
      <Box className="doc-container">
        <Box
          padding={{ xs: "0rem 2rem", sm: "0rem 3rem" }}
          className="doc-wrapper"
          ref={pdfRef}
        >
          <Box>
            <Box className="doc-header" mb={2}>
              {order?.approvedBy ? (
                <>
                  <Typography className="doc-h4">
                    {order?.approvedBy?.role == "super_admin"
                      ? order?.approvedBy?.business_owner_name
                      : order?.approvedBy?.first_name +
                      " " +
                      order?.approvedBy?.last_name}
                  </Typography>
                  <Typography className="doc-h5">
                    {order?.approvedBy?.location}
                  </Typography>
                  {order?.approvedBy?.license_no && (
                    <Typography className="doc-h5">
                      License no : {order?.approvedBy?.license_no}
                    </Typography>
                  )}
                  <Typography className="doc-h5">
                    Tel : {order?.approvedBy?.mobile_no}
                  </Typography>
                </>
              ) : (
                <>
                  {order?.rejectedBy ? (
                    <>
                      <Typography className="doc-h4">
                        {order?.rejectedBy?.role == "super_admin"
                          ? order?.rejectedBy?.business_owner_name
                          : order?.rejectedBy?.first_name +
                          " " +
                          order?.rejectedBy?.last_name}
                      </Typography>
                      <Typography className="doc-h5">
                        {order?.rejectedBy?.location}
                      </Typography>
                      {order?.rejectedBy?.license_no && (
                        <Typography className="doc-h5">
                          License no : {order?.rejectedBy?.license_no}
                        </Typography>
                      )}
                      <Typography className="doc-h5">
                        Tel : {order?.rejectedBy?.mobile_no}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography className="doc-h4">
                        {user?.role == "super_admin"
                          ? user?.business_owner_name
                          : user?.first_name + " " + user?.last_name}
                      </Typography>
                      <Typography className="doc-h5">
                        {user?.location}
                      </Typography>
                      {user?.license_no && (
                        <Typography className="doc-h5">
                          License no : {user?.license_no}
                        </Typography>
                      )}
                      <Typography className="doc-h5">
                        Tel : {user?.mobile_no}
                      </Typography>
                    </>
                  )}
                </>
              )}
              <Box pt={2}>
                <Divider className="doc-header-divider" />
              </Box>
            </Box>
            <Box className="doc-body">
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography className="doc-h6">
                  FOR {capitalize(order?.orderedBy?.store_name)}
                </Typography>
                <Typography className="doc-h6" sx={{ float: "right" }}>
                  Date:{moment(order.createdAt).format("DD-MM-YYYY")}
                </Typography>
              </Box>
              <Typography className="doc-h6">
                Address: {order?.orderedBy?.location}
              </Typography>
              <Box pt={3}>
                <img src={RxIcon} />
              </Box>

              <Box my={3}>
                <Typography className="doc-h5" fontWeight={"500 !important"}>
                  Consultation Reason:
                </Typography>
                <Typography className="doc-h6">
                  NxusRx allows for the secure listing and sale of surplus
                  medical equipment and
                  <br /> medication which may be nearing its expiry date.
                </Typography>
                <Box>
                  <Box pt={2}>
                    <Typography
                      fontSize={18}
                      fontWeight={500}
                      fontStyle={"normal"}
                      color={"#101828"}
                    >
                      Medicines:
                    </Typography>
                  </Box>

                  <Box className="doc-table-wrapper" mt={1}>
                    <TableContainer className="prescriptionTableContainer">
                      <Table>
                        <TableHead>
                          <TableRow sx={{ background: "#f4f7f7f7" }}>
                            <TableCell align="left" className="tableCell">
                              Quantity
                            </TableCell>
                            <TableCell align="left" className="tableCell">
                              Medicine
                            </TableCell>
                            <TableCell align="left" className="tableCell">
                              DIN #
                            </TableCell>
                            <TableCell align="left" className="tableCell">
                              Store
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products && products?.length
                            ? products?.map((el, index) => (
                              <TableRow key={index}>
                                <TableCell align="left" className="tableCell">
                                  {el?.baseCount}
                                </TableCell>
                                <TableCell align="left" className="tableCell">
                                  {el?.product?.product?.product_name}
                                </TableCell>
                                <TableCell align="left" className="tableCell">
                                  {el?.product?.DIN_NUMBER}
                                </TableCell>
                                <TableCell align="left" className="tableCell">
                                  {el?.product?.store?.uuid}
                                </TableCell>
                              </TableRow>
                            ))
                            : "No Data"}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* <table className="doc-table">
                      <tr>
                        <th>Quantity</th>
                        <th>Medicine</th>
                        <th>DIN N0#</th>
                        <th>Store</th>
                      </tr>
                      {products && products?.length
                        ? products?.map((el,index) => (
                            <TableRow key={index}>
                              <TableCell align="left" className="tableCell">{el?.baseCount}</TableCell>
                              <TableCell align="left" className="tableCell">{el?.product?.product?.product_name}</TableCell>
                              <TableCell align="left" className="tableCell">{el?.product?.DIN_NUMBER}</TableCell>
                              <TableCell align="left" className="tableCell">{el?.product?.store?.uuid}</TableCell>
                            </TableRow>
                          ))
                        : "No Data"}
                    </table> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            m="2rem 0rem"
            className="doc-footer"
            display={"flex"}
            alignItems={{ xs: "center", sm: "flex-center" }}
            justifyContent={{ xs: "center", sm: "flex-end" }}
          >
            <Box display={"flex"} alignItems={"baseline"} gap={2}>
              <Typography className="doc-h5">DR.</Typography>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                {order?.approvedBy ? (
                  <img
                    className="signatures-img"
                    src={order?.approvedBy?.signature}
                  />
                ) : (
                  <>
                    {order?.rejectedBy ? (
                      <img
                        className="signatures-img"
                        src={order?.rejectedBy?.signature}
                      />
                    ) : (
                      <>
                        {user?.signature ? (
                          <img
                            className="signatures-img"
                            src={user?.signature}
                          />
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
                <Divider className="doc-blanks" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default ApprovalStatus;
