import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { IconButton, InputLabel, FormControl, Select } from "@mui/material";
import { setCookie } from "../../../helpers/common";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";
import ClearIcon from "@mui/icons-material/Clear";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
export default function DialogComp({ title, open, onClose }) {
  const { user, isSessionExpired } = useSelector((state) => state?.auth);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-mui">
          <Box className="modal-header-mui">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton className="modal-clear-btn">
              <ClearIcon />
            </IconButton>
            <Divider style={{ borderColor: "#ccc" }} />
          </Box>
          <Box className="modal-content-mui">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Stores</InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  className="pharmacies-select"
                  id="demo-simple-select"
                  value={user && user?.store ? user?.store?.store_name : ""}
                  label="Stores"
                  //   onChange={(e) => handleChange(e)}
                >
                  {/* {pharmacies &&
                        pharmacies?.length > 0 &&
                        pharmacies?.map((option, i) => {
                          return (
                            <MenuItem key={i} value={option?.store_name}>
                              {option?.store_name}
                            </MenuItem>
                          );
                        })} */}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
