import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { scanQR } from "../../../services/orders";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const UnderReview = () => {
  const dispatch = useDispatch();
  let params = useParams();
  const navigate = useNavigate();
  // const loading = useSelector((state) => state?.order?.scan_qr?.loading);
  const [loading, setLoading] = useState(false);
  const token = params?.token;
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucces, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setLoading(true);

    dispatch(
      scanQR(
        token,
        function (res) {
          if (res) {
            setIsSuccess(true);
            setLoading(false);
          }
        },
        function (error) {
          if (error) {
            setErrorMessage(error);
          } else {
            setErrorMessage("Something went wrong");
          }
          setError(true);
          setLoading(false);
        }
      )
    );
  }, []);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-mui">
        {loading ? (
          <CircularProgress sx={{ color: " #235D5E" }} />
        ) : (
          <>
            <Box className="modal-content-mui">
              <Box sx={{ textAlign: "center" }}>
                {error ? (
                  <ErrorOutlineIcon
                    sx={{
                      color: "red",
                      fontSize: "60px",
                      fontWeight: "200",
                      marginY: "20px",
                    }}
                  />
                ) : (
                  <CheckCircleOutlineIcon
                    sx={{
                      color: "#21c921",
                      fontSize: "60px",
                      fontWeight: "200",
                      marginY: "20px",
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                ></Typography>
                <Typography
                  variant="body2"
                  my={5}
                  sx={{
                    textAlign: "center",
                    fontWeight: "400",
                    fontSize: "16px",
                    maxWidth: "500px",
                  }}
                >
                  {error ? errorMessage : "QR code scanned sucessfully"}
                </Typography>
              </Box>
            </Box>
            <Box className="modal-footer-mui"></Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UnderReview;
