import React, { useRef, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import "./doc.scss";
import { capitalize, generateRandom } from "../../../helpers/formatting";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { printPDF } from "../../../helpers/pdf";
import SubordersTable from "./SubordersTable";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RxIcon from "../../../assets/images/rx.svg";

const ApprovalStatus = ({
  order,
  setPurchaseOrderCount,
  purchaseOrderCount,
  setState,
  state,
}) => {
  const { user, isSessionExpired } = useSelector((state) => state?.auth);
  const pdfRef = useRef(null);
  const [storeId, setStoreId] = useState("");

  const [edit, setEdit] = useState(false);

  const handleDownload = () => {
    printPDF(pdfRef);
  };

  const deletePurchaseOrderLoading = useSelector(
    (state) => state?.order?.deletePurchaseOrder?.loading
  );

  return (
    <>
      {/* <button onClick={handleDownload}> Download</button> */}
      <Box className="doc-container">
        <Box className="doc-wrapper" ref={pdfRef}>
          <Box>
            <Box className="doc-header" mb={4}>
              {order?.approvedBy ? (
                <>
                  <Typography className="doc-h5" fontWeight={"bold"}>
                    {order?.approvedBy?.role == "super_admin"
                      ? order?.approvedBy?.business_owner_name
                      : order?.approvedBy?.first_name +
                      " " +
                      order?.approvedBy?.last_name}
                  </Typography>
                  <Typography className="doc-h5">
                    {order?.approvedBy?.location}
                  </Typography>
                  <Typography className="doc-h5">
                    Tel : {order?.approvedBy?.mobile_no}
                  </Typography>
                </>
              ) : (
                <>
                  {order?.rejectedBy ? (
                    <>
                      <Typography className="doc-h5" fontWeight={"bold"}>
                        {order?.rejectedBy?.role == "super_admin"
                          ? order?.rejectedBy?.business_owner_name
                          : order?.rejectedBy?.first_name +
                          " " +
                          order?.rejectedBy?.last_name}
                      </Typography>
                      <Typography className="doc-h5">
                        {order?.rejectedBy?.location}
                      </Typography>
                      <Typography className="doc-h5">
                        Tel : {order?.rejectedBy?.mobile_no}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography className="doc-h5" fontWeight={"bold"}>
                        {user?.role == "super_admin"
                          ? user?.business_owner_name
                          : user?.first_name + " " + user?.last_name}
                      </Typography>

                      <Typography className="doc-h5">
                        {user?.location}
                      </Typography>
                      <Typography className="doc-h5">
                        Tel : {user?.mobile_no}
                      </Typography>
                    </>
                  )}
                </>
              )}

              <Divider className="doc-header-divider" pt={2} />
            </Box>
            <Box px={2} py={1} className="doc-body">
              <Typography className="doc-h6">
                FOR <ins>{capitalize(order?.orderedBy?.store_name)}</ins>
              </Typography>
              <Typography className="doc-h6">
                ADDRESS <ins>{order?.orderedBy?.location}</ins>
              </Typography>
              <Typography className="doc-h6" textAlign={"right"} mb={3}>
                DATE <ins>{moment(order.createdAt).format("DD-MM-YYYY")}</ins>
              </Typography>
              <img src={RxIcon} />
              <Box my={3}>
                {/* <Box display={"flex"} alignItems={"center"} gap={1} mb={1}>
                  <Typography className="doc-h5" fontWeight={"bold"}>
                    Consultation reason:
                  </Typography>
                  <Typography className="doc-h6"></Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={1} mb={1}>
                  <Typography className="doc-h5" fontWeight={"bold"}>
                    Details:
                  </Typography>
                  <Typography className="doc-h6"></Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={1} mb={1}>
                  <Typography className="doc-h5" fontWeight={"bold"}>
                    Conclusion:
                  </Typography>
                  <Typography className="doc-h6"></Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={1} mb={1}>
                  <Typography className="doc-h5" fontWeight={"bold"}>
                    Confidencial:
                  </Typography>
                  <Typography className="doc-h6"></Typography>
                </Box> */}
                <Box pt={2}>
                  <Typography fontSize={18} fontWeight={500} fontStyle={"normal"} color={"#101828"} >
                    Medicines:
                  </Typography>
                </Box>

                <TableContainer className="tableContainer">
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
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
                        <TableCell align="left" className="tableCell">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order && order?.subOrders && order?.subOrders?.length ? (
                        order?.subOrders?.map((el, i) => {
                          return (
                            <SubordersTable
                              key={generateRandom()}
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
              </Box>
            </Box>
          </Box>
          <Box
            px={2}
            py={1}
            className="doc-footer"
            display={"flex"}
            alignItems={"flex-center"}
            justifyContent={"flex-end"}
            gap={2}
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
