import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FErrorMessage from "../../shared/components/FErrorMessage";
import { InputLabel } from "@mui/material";
import moment from "moment/moment";

const DiscountModal = ({
  openDiscount,
  handleCloseModal,
  parentProps,
  index,
  isEdit,
}) => {
  const [initialValues, setInitialValues] = useState({
    discount: "",
    month: "",
  });
  useEffect(() => {
    if (isEdit) {
      setInitialValues({ ...parentProps?.values?.discountsArray[index] });
    }
  }, [isEdit, index]);

  const discountSchema = yup.object().shape({
    discount: yup.number().max(100).min(1).required(),
    month: yup
      .number()
      .max(12)
      .min(1)
      .required()
      .test(
        "Unique Email",
        "This month discount  already exists ", // <- key, message
        function (value) {
          return new Promise((resolve, reject) => {
            let foundIndex = parentProps?.values?.discountsArray?.findIndex(
              (el) => el?.month == value
            );
            if (
              parentProps &&
              parentProps?.values?.discountsArray &&
              parentProps?.values?.discountsArray?.length &&
              foundIndex != index &&
              parentProps?.values?.discountsArray?.find(
                (el) => el?.month == value
              )
            ) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      ),
  });

  return (
    <Modal
      open={openDiscount}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Formik
        validationSchema={discountSchema}
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          let vals = { ...parentProps.values };
          let discountArray = [...parentProps.values.discountsArray];
          discountArray[index] = values;

          parentProps.setValues({ ...vals, discountsArray: discountArray });
          handleCloseModal();
          resetForm();
        }}
      >
        {(props) => (
          <form noValidate onSubmit={props.handleSubmit}>
            <Box
              className="modal-mui"
              sx={{ width: { xs: "90%!important", sm: "600px!important" } }}
            >
              <Box className="modal-header-mui">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Discount Detail
                </Typography>
                <IconButton
                  className="modal-clear-btn"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
              {parentProps && parentProps?.values?.expiry_date && (
                <Box
                  display="flex"
                  color="red"
                  fontSize="14px"
                  marginLeft="25px"
                >
                  Exp Date :
                  <Typography
                    className="rowText"
                    sx={{ pl: 1 }}
                    color="red"
                    fontSize="14px"
                  >
                    {`${moment(
                      parentProps && parentProps?.values?.expiry_date
                    ).format("MMMM Do YYYY")}`}
                  </Typography>
                </Box>
              )}

              <Box
                className="modal-content-mui"
                sx={{ height: { xs: "300px", sm: "300px", md: "200px" } }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={6}>
                    <InputLabel shrink>Months left in Expiry</InputLabel>
                    <TextField
                      fullWidth
                      className="authfield"
                      type="number"
                      value={props.values.month}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="month"
                      error={props.touched.month && Boolean(props.errors.month)}
                      // helperText={props.touched.month && props.errors.month}
                      required
                    />
                    <FErrorMessage name="month" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <InputLabel shrink>Discount</InputLabel>
                    <TextField
                      fullWidth
                      className="authfield"
                      type="number"
                      value={props.values.discount}
                      onBlur={props.handleBlur}
                      onChange={props.handleChange}
                      name="discount"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      error={
                        props.touched.discount && Boolean(props.errors.discount)
                      }
                      // helperText={
                      //   props.touched.discount && props.errors.discount
                      // }
                      required
                    />
                    <FErrorMessage name="discount" />
                  </Grid>
                </Grid>
                <Box className="modal-footer-mui">
                  <ButtonGroup
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      "& > *": {
                        mx: 3,
                      },
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      className="containedPrimary"
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default DiscountModal;
