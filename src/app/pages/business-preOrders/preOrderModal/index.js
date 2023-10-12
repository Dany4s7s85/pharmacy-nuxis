import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Backdrop, Divider, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import PreOrderDetail from "../preOrderDetail";
import Button from "@mui/material/Button";
import {
  getPurchaseOrderDetail,
  preOrderDetail,
  preOrderUpdate,
} from "../../../services/orders";
import CircularProgress from "@mui/material/CircularProgress";

const PreOrderModal = ({
  modalOpen,
  count,
  handleModalClose,
  preOrderId,
  setPreOrderId,
  setAuthModalOpen,
  authModalOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [purchaseOrderCount, setPurchaseOrderCount] = useState(0);

  const [state, setState] = useState({ order: {} });

  const loading = useSelector((state) => state?.order?.preOrder?.loading);
  const updateLoading = useSelector(
    (state) => state?.order?.preOrderUpdate?.loading
  );

  useEffect(() => {
    let mounted = true;
    if (preOrderId && modalOpen) {
      dispatch(
        preOrderDetail(preOrderId, function (res) {
          if (res && mounted) {
            let copy = [...res?.data?.products];
            let groupedData = copy?.reduce((result, currentValue) => {
              if (!result[currentValue["sellerBusiness"]]) {
                result[currentValue["sellerBusiness"]] = [];
              }
              result[currentValue["sellerBusiness"]].push(currentValue);

              return result;
            }, {});

            let subOrders = [...Object?.values(groupedData)];

            setState({
              ...state,
              order: res?.data,
              subOrders,
            });
          }
        })
      );
    }

    return () => {
      mounted = false;
    };
  }, [preOrderId, count, purchaseOrderCount]);
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
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: { md: "840px", lg: "900px", sm: "90%", xs: "90%" },
            maxHeight: "600px",
            minHeight: "300px"
          }}
        >
          {loading ? (
            <Box
              width="450px"
              height="100%"
              justifyContent="center"
              display="flex"
              alignItems="center"
              sx={{ height: "320px" }}
            >
              <CircularProgress sx={{ color: "#235D5E" }} />
            </Box>
          ) : (
            <Box className="modal-header-mui">
              <Typography
                padding={"14px"}
                fontSize={{ lg: 22, md: 22, sm: 20, xs: 18 }}
                id="modal-modal-title"
              >
                Pre Order #{state?.order?.pre_order_no} Details
              </Typography>
              <IconButton
                className="modal-clear-btn"
                onClick={() => {
                  handleModalClose();
                  setPreOrderId("");
                }}
              >
                <ClearIcon />
              </IconButton>

              <Box
                className="modal-content-mui"
                sx={{
                  overflow: "auto",
                  maxHeight: "460px",
                  minHeight: "300px"
                }}
              >
                <PreOrderDetail
                  order={state?.order}
                  subOrders={state?.subOrders}
                  setPurchaseOrderCount={setPurchaseOrderCount}
                  purchaseOrderCount={purchaseOrderCount}
                  edit={edit}
                  setEdit={setEdit}
                  setState={setState}
                  updateLoading={updateLoading}
                  state={state}
                  handleCancel={handleCancel}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PreOrderModal;
