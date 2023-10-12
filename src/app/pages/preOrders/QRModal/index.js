import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Backdrop, Divider, InputLabel, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { pharmacyLoginRequest } from "../../../services/BAuth";
import { pharmacistAuth } from "../../../services/orders";
import * as Yup from "yup";
import FErrorMessage from "../../../shared/components/FErrorMessage";

const QRModal = ({
  handleAuthModalClose,
  setAuthModalOpen,
  authModalOpen,
  handler,
  purchaseOrderId,
  handleCancel,
  forType,
  user,
  setUser,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qrCode, setQRCode] = useState("");
  const rejectloading = useSelector(
    (state) => state?.order?.preOrderReject?.loading
  );
  const approveloading = useSelector(
    (state) => state?.order?.preOrderApprove?.loading
  );

  const authloading = useSelector(
    (state) => state?.order?.pharmacist_auth?.loading
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
            borderRadius: "20px !important",
            width: { xs: "75% !important", sm: "400px !important" },
            maxHeight: "450px !important",
            minHeight: "370px !important",
          }}
        >
          <IconButton
            sx={{ float: "right", padding: "20px 15px" }}
            className="modal-clear-btn"
            onClick={handleAuthModalClose}
          >
            <ClearIcon />
          </IconButton>

          <Formik
            initialValues={{ qrCode: "", email: "" }}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => {
              if (forType == "Reject") {
                handleCancel(purchaseOrderId, values, resetForm);
              } else {
                let data = { ...values };
                data.preOrder = purchaseOrderId;
                dispatch(
                  pharmacistAuth({ ...data }, function (res) {
                    if (res) {
                      let userData = res?.data?.user;
                      setUser(userData);
                      setAuthModalOpen(false);
                      resetForm();
                    }
                  })
                );
              }
            }}
            validationSchema={qrSchema}
          >
            {(props) => (
              <>
                <form onSubmit={props.handleSubmit}>
                  <Box padding="2rem">
                    <Box component="div">
                      <Box>
                        <Typography
                          fontSize={{ lg: 18, md: 18, sm: 18, xs: 16 }}
                          fontWeight={500}
                          color={"#101828"}
                        >
                          Enter Security Code
                        </Typography>
                        <Typography
                          fontSize={{ lg: 14, md: 14, sm: 12, xs: 10 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          Use the code generated by the authenticator app in the
                          code section
                        </Typography>
                      </Box>
                      <Box pt={1}>
                        <InputLabel shrink>Email</InputLabel>
                        <TextField
                          fullWidth
                          className="authfield"
                          placeholder="Enter Your Email"
                          value={props.values.email}
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          name="email"
                          type="text"
                          error={
                            props.touched.email && Boolean(props.errors.email)
                          }
                          // helperText={props.touched.email && props.errors.email}
                        />
                        <FErrorMessage name="email" />
                      </Box>
                      <Box pt={1}>
                        <InputLabel shrink>Authenticator Code</InputLabel>
                        <TextField
                          fullWidth
                          className="authfield"
                          placeholder="Enter Authenticator Code"
                          value={props.values.qrCode}
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          name="qrCode"
                          type="text"
                          error={
                            props.touched.qrCode && Boolean(props.errors.qrCode)
                          }
                          // helperText={
                          //   props.touched.qrCode && props.errors.qrCode
                          // }
                        />
                        <FErrorMessage name="qrCode" />
                      </Box>

                      <Button
                        onClick={props.handleSubmit}
                        disabled={rejectloading || authloading}
                        className="containedPrimary"
                        variant="contained"
                        sx={{
                          width: "100%",
                          marginTop: "20px",
                          padding: { xs: "5px 6px !important" },
                          fontSize: { xs: "14px !important" },
                        }}
                      >
                        {authloading || rejectloading ? (
                          <ClipLoader size={25} color="white" loading />
                        ) : (
                          `${forType}`
                        )}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default QRModal;

export const qrSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  qrCode: Yup.string().required("Code is required"),
});