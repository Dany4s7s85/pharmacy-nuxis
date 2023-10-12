import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Backdrop, Divider, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import ApprovalStatus from "../ApprovalStatus";
import Button from "@mui/material/Button";
import { preOrderDetail } from "../../../services/orders";
import CircularProgress from "@mui/material/CircularProgress";
import { checkProductExpired, isConflictInQty } from "../../../helpers/pricing";
import Grid from "@mui/material/Grid";
import { ClipLoader } from "react-spinners";

const PharmacistModal = ({
  modalOpen,
  count,
  handleModalClose,
  user,
  setUser,
  handleApprove,
  setAuthModalOpen,
  purchaseOrderId,
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [purchaseOrderCount, setPurchaseOrderCount] = useState(0);

  const [state, setState] = useState({ order: {} });

  const loading = useSelector((state) => state?.order?.preOrder?.loading);
  const updateLoading = useSelector(
    (state) => state?.order?.preOrderUpdate?.loading
  );

  const approveloading = useSelector(
    (state) => state?.order?.preOrderApprove?.loading
  );

  useEffect(() => {
    if (purchaseOrderId) {
      dispatch(
        preOrderDetail(purchaseOrderId, function (res) {
          if (res) {
            let copy = [...res?.data?.products];
            let groupedData = copy?.reduce((result, currentValue) => {
              if (!result[currentValue["sellerBusiness"]]) {
                result[currentValue["sellerBusiness"]] = [];
              }
              result[currentValue["sellerBusiness"]].push(currentValue);

              return result;
            }, {});

            let subOrders = [...Object?.values(groupedData)];
            let imuteSubs = JSON.parse(JSON.stringify(subOrders));

            if (!user) {
              setAuthModalOpen(true);
            }

            setState({
              ...state,
              order: res?.data,
              subOrders,
              imuteSubs: imuteSubs,
            });
          }
        })
      );
    }
  }, [purchaseOrderId, count, purchaseOrderCount]);
  const [edit, setEdit] = useState(false);

  const handleCancel = () => {
    setState({ ...state, subOrders: state?.imuteSubs });
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: "transparent" },
        }}
      >
        <Box
          className="modal-mui"
          sx={{
            boxShadow: "0 8px 30px 0 rgb(0 0 0 / 20%)",
            width: { xs: "90%!important", sm: "600px!important" },
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "10px",
            maxHeight: "600px",
            minHeight: "300px",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
              }}
            >
              <CircularProgress sx={{ color: " #235D5E" }} />
            </Box>
          ) : (
            <Box className="modal-header-mui">
              <Typography
                sx={{ padding: "24px !important" }}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              ></Typography>
              <IconButton
                className="modal-clear-btn"
                onClick={handleModalClose}
              >
                <ClearIcon />
              </IconButton>
              <Box
                sx={{
                  maxHeight: "460px",
                  minHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                <ApprovalStatus
                  order={state?.order}
                  subOrders={state?.subOrders}
                  setPurchaseOrderCount={setPurchaseOrderCount}
                  purchaseOrderCount={purchaseOrderCount}
                  edit={edit}
                  setEdit={setEdit}
                  setState={setState}
                  user={user}
                  setUser={setUser}
                  updateLoading={updateLoading}
                  state={state}
                  handleCancel={handleCancel}
                />
              </Box>
              <Divider style={{ borderColor: "#ccc" }} />
              <Box padding="1rem">
                <Grid container justifyContent="center">
                  {isConflictInQty(state?.order?.products)?.yes &&
                  user &&
                  state?.order?.approval_status == "pending" ? (
                    <Typography
                      variant="caption"
                      color="error"
                      maxWidth={"500px"}
                      mx={"auto"}
                      display={"inline-block"}
                    >
                      Products with DIN_NO{" "}
                      {`${isConflictInQty(state?.order?.products)?.errors?.map(
                        (el) => el
                      )}`}{" "}
                      have less stock then asked Delete or adjust the stock to
                      continue....
                    </Typography>
                  ) : (
                    <>
                      {user &&
                      state?.order?.approval_status == "pending" &&
                      state?.order?.updatedBy &&
                      state?.order?.updatedBy?._id?.toString() !=
                        user?._id?.toString() ? (
                        <Typography
                          variant="caption"
                          color="error"
                          maxWidth={"500px"}
                          mx={"auto"}
                          display={"inline-block"}
                        >
                          You can not edit or approve this pre-order its updated
                          by other pharmacist
                        </Typography>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                  <>
                    {user && (
                      <Box sx={{ float: "right" }} display={"inline-block"}>
                        <>
                          {approveloading ? (
                            <Button
                              variant="contained"
                              className="containedPrimary"
                              sx={{
                                paddingLeft: "76px",
                                paddingRight: "80px",
                                textAlign: "center",
                              }}
                              size="large"
                            >
                              {" "}
                              <ClipLoader size={25} color="white" loading />
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              className="containedPrimary"
                              sx={{
                                paddingLeft: "76px",
                                paddingRight: "80px",
                                textAlign: "center",
                              }}
                              size="large"
                              disabled={
                                checkProductExpired(state?.order?.products)
                                  ?.expired ||
                                isConflictInQty(state?.order?.products)?.yes ||
                                (state?.order?.updatedBy &&
                                  state?.order?.updatedBy?._id?.toString() !=
                                    user?._id?.toString()) ||
                                updateLoading ||
                                edit ||
                                state?.order?.approval_status ==
                                  "cancelled by pharmacist" ||
                                state?.order?.approval_status == "approved"
                              }
                              onClick={() =>
                                handleApprove(purchaseOrderId, user)
                              }
                            >
                              {state?.order?.approval_status == "pending"
                                ? "Approve"
                                : state?.order?.approval_status ==
                                  "cancelled by pharmacist"
                                ? "cancelled by pharmacist"
                                : "Approved"}
                            </Button>
                          )}
                        </>
                      </Box>
                    )}
                  </>
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PharmacistModal;
