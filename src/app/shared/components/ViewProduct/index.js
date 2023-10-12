import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import "./viewProduct.scss";
import { addProducts } from "../../../services/cart";
import cross from "../../../assets/images/cross.svg";
import { useDispatch } from "react-redux";
import { formatNumberWithCommas } from "../../../helpers/getTotalValue";
const ViewProduct = ({ product, i, setCount, count }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down("sm"));
  const handleQuantityChange = (value, product, index) => {
    let count = value < 1 ? 1 : value;
    // let count = value;
    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product?.quantity}`);
      return;
    }
    let products = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
      }

      products[index].count = count;
      localStorage.setItem("products", JSON.stringify(products));

      // add to reeux state
      dispatch(addProducts(products));
    }
  };

  const handleRemoveProduct = (index) => {
    let products = [];

    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
      }
    }
    products.splice(index, 1);

    localStorage.setItem("products", JSON.stringify(products));
    setCount((prev) => prev + 1);
    // add to reeux state
    dispatch(addProducts(products));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={2} md={2} sm={2} xs={4}>
          {product &&
          product?.imageCover?.full_image &&
          product?.imageCover?.full_image ? (
            <Box>
              <img
                src={product?.imageCover?.full_image}
                style={{
                  objectFit: "cover",
                  width: "80px",
                  height: "80px",
                }}
              />
            </Box>
          ) : (
            <Box
              className="cusProductName"
              sx={{
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>{product?.product_name}</Typography>
            </Box>
          )}
        </Grid>
        <Grid item md={10} lg={10} sm={10} xs={8}>
          <Grid container spacing={2}>
            <Grid item md={4} lg={4} sm={4} xs={12}>
              <Box className="view-product-box">
                <Tooltip title={product?.product_name}>
                  <Typography
                    className="view-text text-ellipses"
                    fontSize={{
                      lg: "18px",
                      md: "18px",
                      sm: "16px",
                      xs: "14px",
                    }}
                  >
                    {product?.product_name}
                  </Typography>
                </Tooltip>

                <Typography
                  className="view-price"
                  fontSize={{ lg: "24px", md: "24px", sm: "18px", xs: "16px" }}
                >
                  {`$${formatNumberWithCommas(
                    Number(
                      Number(
                        product?.discountedPrice
                          ? product?.discountedPrice?.discountedPrice
                          : product?.price
                      ) * Number(product?.count)
                    )?.toFixed(2)
                  )}`}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              md={8}
              lg={8}
              sm={8}
              xs={12}
              sx={{ paddingTop: { xs: "0px!important", sm: "16px!important" } }}
            >
              <Box
                display={"flex"}
                justifyContent={isMobile ? "flex-start" : "flex-end"}
                alignItems={"center"}
              >
                <Box pt={1}>
                  <TextField
                    className="counter"
                    type="number"
                    onChange={(e) =>
                      handleQuantityChange(e.target.value, product, i)
                    }
                    value={product?.count}
                    defaultValue={product?.count}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                Number(product.count) - 1,
                                product,
                                i
                              )
                            }
                            aria-label="plus"
                          >
                            <RemoveIcon
                              sx={{
                                color: "#878B93",
                                fontSize: `${isMobile ? "14px" : "16px"}`,
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                Number(product.count) + 1,
                                product,
                                i
                              )
                            }
                            aria-label="plus"
                          >
                            <AddIcon
                              sx={{
                                color: "#878B93",
                                fontSize: `${isMobile ? "14px" : "16px"}`,
                              }}
                            />{" "}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="outlined-basic"
                    variant="outlined"
                  />
                </Box>
                <Box pl={{ lg: 2, md: 2, sm: 2, xs: 1 }} pt={{ lg: 1, md: 1 }}>
                  <IconButton
                    onClick={() => handleRemoveProduct(i)}
                    aria-label="plus"
                  >
                    <img src={cross} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box pt={2} pb={2}>
        <Divider
          sx={{
            borderColor: "#EDEDED !important",
            border: "1px solid #EDEDED !important",
            width: "100%",
          }}
        />
      </Box>
    </>
  );
};

export default ViewProduct;
