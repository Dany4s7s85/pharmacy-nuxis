import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import {
  Grid,
  IconButton,
  Button,
  Box,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import { initialValues, Schema } from "./helper";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router";
import {
  addWatchList,
  getSingleWatchList,
  updateWatchList,
} from "../../services/products";
import { ClipLoader } from "react-spinners";
export default function WatchListModal({
  open,
  onClose,
  id,
  setWatchListId,
  setCount,
}) {
  const [inValues, setInValues] = useState(initialValues);
  const submitRef = useRef();
  const dispatch = useDispatch();
  const { user, isSessionExpired } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const addWatchListLoading = useSelector(
    (state) => state?.product?.addWatchList?.loading
  );
  const updateWatchListLoading = useSelector(
    (state) => state?.product?.updateWatchList?.loading
  );
  const editLoading = useSelector((state) => state?.product?.getSingleWatchList?.loading);
  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    if (id) {
      dispatch(
        getSingleWatchList(id, function (res) {
          if (res?.status == "success") {
            setInValues(res?.data);
          }
        })
      );
    } else {
      setInValues({
        DIN_NO: "",
      });
    }
  }, [id]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="modal-mui"
          minWidth={{ xs: "90%", sm: "400px" }}
          height={"250px"}
          borderRadius="20px"
        >
          <Box className="modal-header-mui">
            <Typography
              id="modal-modal-title"
              fontSize={20}
              fontWeight={500}
              fontStyle={"normal"}
              color={"#101828"}
            >
              {id ? "Update WatchList" : "Add WatchList"}
            </Typography>
            <IconButton
              className="modal-clear-btn"
              onClick={() => {
                setWatchListId("");
                onClose();
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
          {editLoading ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress sx={{ color: ' #235D5E' }} />
            </Box>
            :
            <>
              <Box className="modal-content-mui">
                <Box height={50}>
                  <Formik
                    initialValues={inValues}
                    enableReinitialize={true}
                    validationSchema={Schema}
                    onSubmit={(values, { resetForm }) => {
                      let data = { ...values };
                      if (id) {
                        dispatch(
                          updateWatchList(id, data, function (res) {
                            if (res.status == "success") {
                              setWatchListId("");
                              setCount((prev) => prev + 1);
                              onClose();
                            }
                          })
                        );
                      } else {
                        dispatch(
                          addWatchList(data, function (res) {
                            if (res?.status == "success") {
                              setWatchListId("");
                              setCount((prev) => prev + 1);
                              onClose();
                            }
                          })
                        );
                      }
                    }}
                  >
                    {(props) => (
                      <form autoComplete="off" onSubmit={props.handleSubmit}>
                        <Grid container>
                          <Grid item xs={12} md={12} lg={12}>
                            <InputLabel shrink>DIN Number</InputLabel>
                            <TextField
                              fullWidth
                              className="authfield"
                              variant="outlined"
                              onBlur={props.handleBlur}
                              onChange={props.handleChange}
                              value={props?.values?.DIN_NO}
                              name="DIN_NO"
                              error={
                                props.touched.DIN_NO && Boolean(props.errors.DIN_NO)
                              }
                              helperText={
                                props.touched.DIN_NO && props.errors.DIN_NO
                              }
                              required
                            />
                          </Grid>
                        </Grid>
                        <Button
                          hidden
                          sx={{ display: "none" }}
                          onClick={(_) => props?.handleSubmit()}
                          ref={submitRef}
                        />
                      </form>
                    )}
                  </Formik>
                </Box>
              </Box>
              <Box className="modal-footer-mui">
                <Button
                  className="containedPrimaryWhite"
                  variant="contained"
                  size="large"
                  sx={{ width: "40% !important" }}
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="containedPrimary"
                  variant="contained"
                  size="large"
                  sx={{
                    height: "45px !important",
                    width: "40% !important",
                    marginLeft: "5px !important",
                  }}
                  onClick={() => submitRef?.current?.click()}
                >
                  {addWatchListLoading || updateWatchListLoading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Box>
            </>
          }
        </Box>
      </Modal >
    </>
  );
}
