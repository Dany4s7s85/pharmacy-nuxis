import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import "./doc.scss";
import { capitalize } from "../../../helpers/formatting";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { printPDF } from "../../../helpers/pdf";
import SubordersTable from "./SubordersTable";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RxIcon from "../../../assets/images/rx.svg";
import EditIcon from '@mui/icons-material/Edit';
import { preOrderUpdate } from "../../../services/orders";
import { ClipLoader } from "react-spinners";

const ApprovalStatus = ({
  order,
  setPurchaseOrderCount,
  purchaseOrderCount,
  setState,
  state,
  user,
  edit,
  setEdit,
  updateLoading,
  handleCancel,
  subOrders,
}) => {
  const pdfRef = useRef(null);
  const [storeId, setStoreId] = useState("");
  const dispatch = useDispatch();

  const handleDownload = () => {
    printPDF(pdfRef);
  };

  const handleUpdate = () => {
    let subOrders = [...state.subOrders] || [];
    subOrders = subOrders.flat(Infinity);
    if (subOrders.length) {
      subOrders = subOrders.filter((el) => el.count > 0 && el != "");
    }

    dispatch(
      preOrderUpdate(
        state?.order?._id,
        { user: user, products: subOrders },
        function (res) {
          if (res) {
            setPurchaseOrderCount(purchaseOrderCount + 1);
            setEdit(false);
          }
        }
      )
    );
  };
  return (
    <>
      {/* <button onClick={handleDownload}> Download</button> */}
      <Box className="doc-container">
        <Box className="doc-wrapper" ref={pdfRef}>
          <Box>
            <Box className="doc-header">
              {order?.updatedBy ? (
                <>
                  <Typography className="doc-h4">
                    {order?.updatedBy?.role == "super_admin"
                      ? order?.updatedBy?.business_owner_name
                      : order?.updatedBy?.first_name &&
                        order?.updatedBy?.last_name
                        ? order?.updatedBy?.first_name +
                        " " +
                        order?.updatedBy?.last_name
                        : null}
                  </Typography>
                  <Typography className="doc-h5">
                    {order?.updatedBy?.location}
                  </Typography>
                  {order?.updatedBy?.license_no && (
                    <Typography
                      className="doc-h5"
                    >
                      License no : {order?.updatedBy?.license_no}
                    </Typography>
                  )}
                  <Typography className="doc-h5">
                    Tel : {order?.updatedBy?.mobile_no}
                  </Typography>
                </>
              ) : (
                <>
                  {order?.rejectedBy ? (
                    <>
                      <Typography
                        className="doc-h4"
                      >
                        {order?.rejectedBy?.role == "super_admin"
                          ? order?.rejectedBy?.business_owner_name
                          : order?.rejectedBy?.first_name &&
                            order?.rejectedBy?.last_name
                            ? order?.rejectedBy?.first_name +
                            " " +
                            order?.rejectedBy?.last_name
                            : null}
                      </Typography>
                      <Typography
                        className="doc-h5"
                      >
                        {order?.rejectedBy?.location}
                      </Typography>
                      {order?.rejectedBy?.license_no && (
                        <Typography
                          className="doc-h5"
                        >
                          License no : {order?.rejectedBy?.license_no}
                        </Typography>
                      )}
                      <Typography
                        className="doc-h5"
                      >
                        Tel : {order?.rejectedBy?.mobile_no}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        className="doc-h4"
                      >
                        {user?.role == "super_admin"
                          ? user?.business_owner_name
                          : user?.first_name && user?.last_name
                            ? user?.first_name + " " + user?.last_name
                            : null}
                      </Typography>
                      <Typography
                        className="doc-h5"
                      >
                        {user?.location}
                      </Typography>
                      {user?.license_no && (
                        <Typography
                          className="doc-h5"
                        >
                          License no : {user?.license_no}
                        </Typography>
                      )}
                      <Typography
                        className="doc-h5"
                      >
                        Tel : {user?.mobile_no}
                      </Typography>
                    </>
                  )}
                </>
              )}

              <Box mt={2}>
                <Divider className="doc-header-divider" />
              </Box>
            </Box>

            <Box py={1} className="doc-body">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography className="doc-h6">
                  FOR {capitalize(order?.orderedBy?.store_name)}
                </Typography>
                <Typography className="doc-h6" sx={{ float: 'right' }}>
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
                <Typography className="doc-h5" >
                  Consultation Reason:
                </Typography>
                <Typography className="doc-h6">
                  NxusRx allows for the secure listing and sale of surplus medical equipment and<br /> medication which may be nearing its expiry date.
                </Typography>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={2}
                  pt={2}
                >
                  <Typography fontSize={18} fontWeight={500} fontStyle={"normal"} color={"#101828"} >
                    Medicines:
                  </Typography>
                  <Stack direction={"row"} gap={2}>
                    {edit ? (
                      <>
                        <Button
                          variant={"outlined"}
                          color={"info"}
                          disabled={updateLoading}
                          onClick={() => handleUpdate()}
                        >
                          {updateLoading ? (
                            <ClipLoader size={25} color="blue" loading />
                          ) : (
                            `Update`
                          )}
                        </Button>
                        <Button
                          variant={"outlined"}
                          color={"error"}
                          disabled={updateLoading}
                          onClick={() => {
                            setEdit(false);
                            handleCancel();
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        {order.approval_status == "pending" ? (
                          <IconButton
                            onClick={() => setEdit(true)}
                          >
                            <EditIcon />

                          </IconButton>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </Stack>
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
                        {edit ? (
                          <TableCell align="left" className="tableCell">
                            Action
                          </TableCell>
                        ) : (
                          ""
                        )}
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
              <Typography className="doc-h5">DR.</Typography>{" "}
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                {order?.updateBy ? (
                  <img
                    className="signatures-img"
                    src={order?.updateBy?.signature}
                  />
                ) : (
                  <>
                    {order?.updateBy ? (
                      <img
                        className="signatures-img"
                        src={order?.updateBy?.signature}
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
//
