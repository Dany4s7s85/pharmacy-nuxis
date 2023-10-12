import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const QRModal = ({ open, onClose, qrImage }) => {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-mui">
        <Box className="modal-header-mui">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Scan QR Code
          </Typography>
          <Divider />
        </Box>
        <Box className="modal-content-mui">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontWeight: "600", fontSize: "16px" }}
            >
              Scan QR code with your google authenticator app
            </Typography>
            <Box sx={{ textAlign: "center", marginTop: "25px" }}>
              <img src={qrImage} width="200px" height="200px" />
            </Box>
            <List component="nav" aria-label="secondary mailbox folder">
              <ListItem>
                <ListItemAvatar>
                  <Avatar>1</Avatar>
                </ListItemAvatar>
                <ListItemText primary="Install Authenticator App on your smart phone Android / IOS" />
                {/*   <Link to="https://play.google.com/store/apps/details?id=com.azure.authenticator"
                              target="_blank">
                            Google play store
                        </Link>{' '}*/}
              </ListItem>
              <ListItem>
                {/*   <Link href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458" target="_blank">
                            {' '}
                            Apple Store.{' '}
                        </Link>*/}
                <ListItemAvatar>
                  <Avatar>2</Avatar>
                </ListItemAvatar>
                <ListItemText primary="Open the Google Authenticator App and scan QR code" />
              </ListItem>
            </List>
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
            <Button
              variant="text"
              sx={{ color: "#235D5E" }}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Modal>
  );
};

export default QRModal;
