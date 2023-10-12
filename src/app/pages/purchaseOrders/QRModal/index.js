import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Backdrop, Divider, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const QRModal = ({
  handleAuthModalClose,
  setAuthModalOpen,
  authModalOpen,
  handler,
  purchaseOrderId,
  forType,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qrCode, setQRCode] = useState("");
  const rejectloading = useSelector(
    (state) => state?.order?.orderApprove?.loading
  );
  const approveloading = useSelector(
    (state) => state?.order?.orderReject?.loading
  );

  const handleQRCode = () => {
    if (purchaseOrderId && handler) {
      if (qrCode != "") {
        handler(purchaseOrderId, { qrCode }, setQRCode);
      }
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={authModalOpen}
        onClose={handleAuthModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: "transparent" },
        }}
      >
        <Box
          className="modal-mui"
          sx={{ boxShadow: "0 8px 30px 0 rgb(0 0 0 / 20%)" }}
        >
          <IconButton
            sx={{ float: "right", padding: "20px 15px" }}
            className="modal-clear-btn"
            onClick={handleAuthModalClose}
          >
            <ClearIcon />
          </IconButton>

          <Box padding="3rem">
            <Box component="div">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Enter QR Code
                </Typography>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Use the token generated by the app in the code section"
                </Typography>
              </Box>
              <Box
                pt={2}
                sx={{
                  "& .MuiTextField-root": { my: 1 },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Enter Authenticator Code"
                  value={qrCode}
                  onChange={(e) => setQRCode(e.target.value)}
                  name="qrCode"
                  type="text"
                />
              </Box>

              <Button
                onClick={handleQRCode}
                disabled={
                  rejectloading || approveloading || qrCode == "" || !forType
                }
                className="containedPrimary"
                variant="contained"
                sx={{ width: "100%", marginTop: "20px" }}
              >
                {rejectloading || approveloading ? (
                  <ClipLoader size={25} color="white" loading />
                ) : (
                  `${forType}`
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default QRModal;
