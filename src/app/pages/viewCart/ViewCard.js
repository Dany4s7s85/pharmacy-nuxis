import React, { useState } from "react";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import "swiper/modules/navigation/navigation.min.css"; // Navigation module
import "swiper/modules/free-mode/free-mode.min.css"; // Pagination module
import "swiper/modules/thumbs/thumbs.min.css";

import "../../modules/nexusLandingPage/nexus.scss";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProducts, openDrawer } from "../../services/cart";
import { useDispatch, useSelector } from "react-redux";
import cart from "../../assets/images/cart.svg";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";
const ViewCard = ({ el, setCount }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { user, user_permission } = useSelector((state) => state?.auth);

  const handleQuantityChange = (value, data) => {
    let inventoryCount = data && data?.quantity ? data?.quantity : 0;

    if (value > inventoryCount) {
      toast.error(`Max available stock is ${inventoryCount} `);
      return;
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = (data) => {
    if (data) {
      let products = [];
      let product = data?.inventory;
      product = {
        ...product,
        imageCover: data?.imageCover,
        product_name: data?.product_name,
      };

      if (!user.store) {
        toast.error(`Please select store to buy `);
        return;
      } else if (user?.store) {
        let storeData = { ...user?.store };
        delete storeData?.token;
        product.for = storeData;
      }
      if (typeof window !== "undefined") {
        // if cart is in local storage GET it
        if (localStorage.getItem("products")) {
          products = JSON.parse(localStorage.getItem("products"));
        }
        // push new product to cart
        let productIndex = products?.findIndex(
          (el) => el._id == product?._id && user?.store?._id == el?.for?._id
        );
        if (productIndex > -1) {
          products[productIndex] = { ...product, count: quantity };
        } else {
          products.push({
            ...product,
            count: quantity,
          });
        }

        localStorage.setItem("products", JSON.stringify(products));

        // add to reeux state
        dispatch(addProducts(products));
        // setCount((prev) => prev + 1);
        if (productIndex > -1) {
          toast.success(`Cart updated successfully`);
        } else {
          dispatch(openDrawer(true));
        }
      }
    }
  };
  return (
    <Card raised className="product-card">
      <Box
        onClick={() =>
          navigate(`/products/${el?._id}/${el?.DRUG_IDENTIFICATION_NUMBER}`)
        }
      >
        <Box
          display="flex"
          className="carousel-img-container"
          justifyContent="center"
        >
          {el?.imageCover ? (
            <img src={el?.imageCover?.full_image} />
          ) : (
            <Box className="cusCardProductName">
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {el?.product_name}
              </Typography>
            </Box>
          )}
        </Box>
        <CardContent sx={{ padding: "0!important" }}>
          <Typography sx={{
            display: { xs: "none", sm: "block" }, marginY: "10px",
            fontSize: "16px",
          }}
            className="text-ellipses latest-product-text"
            variant="body1"
          >
            {el?.product_name}
          </Typography>
          <Typography sx={{
            display: { xs: "block", sm: "none" }, marginY: "10px",
            fontSize: "16px", height: "44px", overflow: "hidden"
          }}
            className="latest-product-text"
            variant="body1"
          >
            {el?.product_name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ marginY: "10px", fontSize: "12px", display: { xs: "none", sm: "block" } }}
            className="latest-product-subtext"
          >
            {`Store ID:${el?.store[0]?.uuid?.substring(0, 20)}`}
          </Typography>
          <Typography
            variant="body2"
            sx={{ marginTop: "10px" }}
            className="latest-product-subtext"
          >
            {`${formatNumberWithCommas(el?.total)} packs avialable`}
          </Typography>
        </CardContent>
      </Box>

      <Box
        sx={{
          height: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography component="div" className="price">
            {el?.total > 0
              ? ` ${
                  !el?.inventory
                    ? "N/A"
                    : `$${
                        el?.inventory && el?.inventory?.discountedPrice
                          ? formatNumberWithCommas(
                              parseFloat(
                                Number(
                                  el?.inventory?.discountedPrice
                                    ?.discountedPrice
                                )
                              ).toFixed(2)
                            )
                          : formatNumberWithCommas(
                              parseFloat(Number(el?.inventory?.price)).toFixed(
                                2
                              )
                            )
                      }`
                }`
              : "Out Of Stock"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {el?.inventory &&
            el?.inventory?.discount &&
            el?.inventory?.discount?.isAutomatedDiscountApplied &&
            el?.inventory?.discountedPrice?.discountPercentage != "0%" ? (
              <>
                <Typography>
                  <del
                    style={{
                      color: "#B7BABF",
                      fontWeight: "400",
                      fontSize: "14px",
                    }}
                  >
                    ${el?.price}
                  </del>
                </Typography>
                <Box pl={2}>
                  <Typography>
                    {el?.inventory?.discountedPrice?.discountPercentage}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: "none" }}>Hide Div</Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              flex: "1.5",
              alignItems: "center",
            }}
          >
            <TextField
              className="counter-new"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box pb={4} pl={2}>
                      <IconButton
                        aria-label="plus"
                        disabled={
                          quantity === 1 || quantity === 0 ? true : false
                        }
                        onClick={() =>
                          handleQuantityChange(
                            Number(quantity) - 1,
                            el?.inventory
                          )
                        }
                      >
                        <ExpandMoreIcon sx={{ color: "#70747E" }} />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box pt={3}>
                      <IconButton
                        aria-label="plus"
                        onClick={() =>
                          handleQuantityChange(
                            Number(quantity) + 1,
                            el?.inventory
                          )
                        }
                        disabled={
                          (el?.inventory &&
                            el?.inventory?.quantity === quantity) ||
                          (quantity > el?.inventory && el?.inventory?.quantity)
                            ? true
                            : false
                        }
                      >
                        <KeyboardArrowUpIcon sx={{ color: "#70747E" }} />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
              id="outlined-basic"
              variant="outlined"
              value={quantity}
              defaultValue={quantity}
              onChange={(e) =>
                handleQuantityChange(e?.target?.value, el?.inventory)
              }
            />
          </Box>
          <IconButton
            onClick={() => {
              handleAddToCart(el);
            }}
            disabled={quantity == 0 ? true : false}
          >
            <img src={cart} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default ViewCard;
