import React, { useRef, useState } from "react";
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
import { preOrderUpdate } from "../../../services/orders";
import { ClipLoader } from "react-spinners";
import EditIcon from '@mui/icons-material/Edit';
const ApprovalStatus = ({
  order,
  setPurchaseOrderCount,
  purchaseOrderCount,
  setState,
  state,
  user,
  setUser,
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
            <Box className="doc-header" >
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
                  <Typography className="doc-h5">
                    Tel : {order?.updatedBy?.mobile_no}
                  </Typography>
                </>
              ) : (
                <>
                  {order?.rejectedBy ? (
                    <>
                      <Typography className="doc-h4" fontWeight={"bold"}>
                        {order?.rejectedBy?.role == "super_admin"
                          ? order?.rejectedBy?.business_owner_name
                          : order?.rejectedBy?.first_name &&
                            order?.rejectedBy?.last_name
                            ? order?.rejectedBy?.first_name +
                            " " +
                            order?.rejectedBy?.last_name
                            : null}
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
                      <Typography className="doc-h4">
                        {user?.role == "super_admin"
                          ? user?.business_owner_name
                          : user?.first_name && user?.last_name
                            ? user?.first_name + " " + user?.last_name
                            : null}
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
              <Box mt={2} >
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
                >
                  <Box pt={2}>
                    <Typography fontSize={18} fontWeight={500} fontStyle={"normal"} color={"#101828"} >
                      Medicines:
                    </Typography>
                  </Box>
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
                        {order.approval_status == "pending" ||
                          (state?.order?.updatedBy &&
                            state?.order?.updatedBy?._id?.toString() ==
                            user?._id?.toString()) ? (
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
                <TableContainer className="tableContainer" sx={{ height: "auto" }}>
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

                {/* {edit &&
                order &&
                order?.subOrders &&
                order?.subOrders?.length > 0 ? (
                  <>
                    <Box justifyContent="flex-end">
                      <Box display="flex" my={2} alignItems="center">
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Items Subtotal
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          ${order?.total}
                        </Typography>
                      </Box>

                      <Box display="flex" my={2} alignItems="center">
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Tax
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          {order?.taxDetails?.tax_in_amount
                            ? "$" +
                              parseFloat(
                                order?.taxDetails?.tax_in_amount.toFixed(2)
                              )
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" my={2}>
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Shipping Fee
                        </Typography>
                        <Typography variant="h5" fontSize={18}>
                          ${parseFloat(order?.shipping?.total).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" my={2}>
                        <Typography sx={{ flex: "1" }} variant="subtitle1">
                          Order Total
                        </Typography>

                        {order?.taxDetails?.tax_in_amount ? (
                          <Typography variant="h5" fontSize={18}>
                            $
                            {parseFloat(
                              Number(order?.total) +
                                Number(order?.shipping?.total) +
                                order?.taxDetails?.tax_in_amount
                            ).toFixed(2)}
                          </Typography>
                        ) : (
                          <Typography variant="h5" fontSize={18}>
                            $
                            {parseFloat(
                              Number(order?.total) +
                                Number(order?.shipping?.total)
                            ).toFixed(2)}
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
                )} */}

                {/* Order Summary  */}
                {/* {edit ? (
                  <div className="doc-order-summary">
                    <Typography mb={3} variant="h5">
                      Order Summary
                    </Typography>
                    <Box display="flex" my={2} alignItems="center">
                      <Typography sx={{ flex: "1" }} variant="subtitle1">
                        Subtotal <span></span> Items
                      </Typography>
                      <Typography variant="h5" fontSize={18}>
                        $974.32
                      </Typography>
                    </Box>
                    <Box display="flex" my={2} alignItems="center">
                      <Typography sx={{ flex: "1" }} variant="subtitle1">
                        Tax <span></span>
                      </Typography>
                      <Typography variant="h5" fontSize={18}>
                        $30
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" my={2}>
                      <Typography sx={{ flex: "1" }} variant="subtitle1">
                        Shipping Fee
                      </Typography>
                      <Typography variant="h5" fontSize={18}>
                        $29.32
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" my={2}>
                      <Typography sx={{ flex: "1" }} variant="subtitle1">
                        Total
                      </Typography>

                      <Typography variant="h5" fontSize={18}>
                        $974.32
                      </Typography>
                    </Box>
                  </div>
                ) : null} */}
              </Box>
            </Box>
          </Box>
          <Box
            py={1}
            className="doc-footer"
            display={"flex"}
            alignItems={"flex-center"}
            justifyContent={"flex-end"}
            gap={2}
          >
            <Box display={"flex"} alignItems={"baseline"} gap={1}>
              <Typography className="doc-h5">DR.</Typography>
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
