import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
const UnderReview = () => {
  const navigate = useNavigate();
  return (
    <Modal
      open={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-mui" sx={{ height: "375px" }}>
        <Box className="modal-content-mui">
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutlineIcon
              sx={{
                color: "#21c921",
                fontSize: "60px",
                fontWeight: "200",
                marginY: "20px",
              }}
            />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontWeight: "600", fontSize: "16px" }}
            >
              Congrats! Your details has been submitted
            </Typography>
            <Typography
              variant="body2"
              my={5}
              sx={{
                textAlign: "center",
                fontWeight: "400",
                fontSize: "14px",
                maxWidth: "500px",
              }}
            >
              We'll review your info and if we can confirm it, you'll be able to
              access your account. We'll also send you an email when your
              account is activated.
            </Typography>
          </Box>
        </Box>
        <Box className="modal-footer-mui">
          <ButtonGroup
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              "& > *": {
                mx: 2,
              },
            }}
          >
            <Button variant="text" onClick={() => navigate("/login")}>
              Back To Login
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Modal>
  );
};

export default UnderReview;
