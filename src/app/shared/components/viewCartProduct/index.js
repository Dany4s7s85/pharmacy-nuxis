import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import "./viewCartProduct.scss";
import { addProducts } from "../../../services/cart";
import backcross from "../../../assets/images/backcross.svg";
import { useDispatch } from "react-redux";
import { formatNumberWithCommas } from "../../../helpers/getTotalValue";

const ViewCartProduct = ({ product, i, setCount, count }) => {
  const dispatch = useDispatch();
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
      <Box
        sx={{
          display: "flex",
          flex: "1",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          "& img": { alignSelf: "flex-start" },
        }}
      >
        <Box display={"flex"}>
          {product &&
          product?.imageCover?.full_image &&
          product?.imageCover?.full_image ? (
            <Box>
              <img
                src={product?.imageCover?.full_image}
                style={{
                  objectFit: "cover",
                  width: "50px",
                  height: "50px",
                }}
              />
            </Box>
          ) : (
            <Box
              className="cusProductCartName"
              sx={{
                width: "50px",
                height: "50px",
              }}
            >
              <Typography className="text-ellipses" fontSize={"8px"}>
                {product?.product_name}
              </Typography>
            </Box>
          )}
          <Box display="flex" flexDirection="column">
            <Box>
              <Tooltip title={product?.product_name}>
                <Typography
                  mx={1}
                  className="cart-text-product text-ellipses-product"
                >
                  {product?.product_name}
                </Typography>
              </Tooltip>
            </Box>
            <Box>
              <Typography
                sx={{ marginX: "8px" }}
                variant="subtitle1"
                className="cart-price-product"
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
          </Box>
        </Box>
        <Box display="flex" sx={{ justifyContent: "flex-end" }}>
          <Box pt={1}>
            <TextField
              className="cart-counter"
              type="number"
              onChange={(e) => handleQuantityChange(e.target.value, product, i)}
              value={product?.count}
              defaultValue={product?.count}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box paddingLeft={"3px"}>
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(
                            Number(product?.count) - 1,
                            product,
                            i
                          )
                        }
                        aria-label="plus"
                      >
                        <RemoveIcon
                          sx={{
                            color: "#878B93",
                            fontSize: "16px !important",
                            marginTop: "-10px !important",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box paddingRight={"2px"}>
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
                            fontSize: "16px !important",
                            marginTop: "-10px !important",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
              id="outlined-basic"
              variant="outlined"
            />
          </Box>
          <Box>
            <IconButton
              onClick={() => handleRemoveProduct(i)}
              aria-label="plus"
            >
              <img src={backcross} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ViewCartProduct;
