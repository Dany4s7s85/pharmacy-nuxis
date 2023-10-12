import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

const ReturnOrderDetail = ({ product, i, isFundReturn, props }) => {
  const handleQuantityChange = (props, value, product) => {
    let count = value < 1 ? 1 : value;

    if (count > product?.baseCount) {
      toast.error(`Max available quantity: ${product?.baseCount}`);
      return false;
    } else {
      props.setFieldValue("quantity", value);
    }
  };

  return (
    <Box
      key={i}
      my={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        "& img": { alignSelf: "flex-start" },
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box display="flex" flex="1" sx={{ flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={product?.product?.product?.imageCover?.full_image}
              width="80px"
            />
            <Typography
              variant="h5"
              fontSize={16}
              sx={{
                maxWidth: "400px",
                marginLeft: "20px",
              }}
            >
              {product?.product?.product?.product_name}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flex="1" sx={{ flexDirection: "column" }}>
          <Box>
            <Typography variant="subtitle1" fontSize={18}>
              {`$${Number(
                product?.discountedPrice
                  ? product?.discountedPrice?.discountedPrice
                  : product?.price
              )}`}{" "}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flex="1" sx={{ flexDirection: "column" }}>
          <Box>
            <Typography variant="subtitle1" fontSize={18}>
              <span> x {Number(product?.count)}</span>
            </Typography>
          </Box>
          {isFundReturn && (
            <TextField
              className="counter"
              sx={{ marginX: "10px" }}
              type="number"
              value={props.values.quantity}
              onChange={(e) =>
                handleQuantityChange(props, e.target.value, product)
              }
              onBlur={props.handleBlur}
              name="quantity"
              error={props.touched.quantity && Boolean(props.errors.quantity)}
              helperText={props.touched.quantity && props.errors.quantity}
              required
              id="outlined-basic"
              variant="outlined"
            />
          )}
        </Box>
        <Box display="flex" flex="1" sx={{ flexDirection: "column" }}>
          <Box>
            <Typography variant="subtitle1" fontSize={18}>
              {`$${Number(
                Number(
                  product?.discountedPrice
                    ? product?.discountedPrice?.discountedPrice
                    : product?.price
                ) * Number(product?.count)
              )?.toFixed(2)}`}
            </Typography>
          </Box>
          {isFundReturn && (
            <Typography
              sx={{ marginX: "10px" }}
              variant="subtitle1"
              fontSize={18}
            >
              {`$${Number(
                Number(
                  product?.discountedPrice
                    ? product?.discountedPrice?.discountedPrice
                    : product?.price
                ) * Number(props.values.quantity)
              )?.toFixed(2)}`}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default ReturnOrderDetail;
