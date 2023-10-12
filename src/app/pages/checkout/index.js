import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Footer from "../../shared/components/footer";
import Header from "../../shared/components/header";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./checkout.scss";
import { getCart, emptyCart, updateCart } from "../../services/cart";
import { createPharmacyOrder } from "../../services/orders";
import { addProducts } from "../../services/cart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import Stripe from "../../shared/Stripe";
import Modal from "@mui/material/Modal";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import { capitalize } from "../../helpers/formatting";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Radio,
  RadioGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  getTotalOfCarts,
  getTotalTax,
  getShippingTotal,
  getGrandTotal,
  getShippingTotalOfCarts,
  getAllShippingTotal,
} from "../../helpers/pricing";
import preOrders from "../preOrders";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const cartLoading = useSelector((state) => state?.cart?.getCart?.loading);
  const updateCartLoading = useSelector(
    (state) => state?.cart?.updateCart?.loading
  );
  const loading = useSelector((state) => state?.order?.createOrder?.loading);
  const history = useNavigate();
  const [preOrders, setPreOrders] = useState([]);
  const [orderDeliver, setOrderDeliver] = useState([]);
  const [immuteableOrders, setImmuteableOrders] = useState([]);
  const [unCheckimmuteableOrders, setUnCheckImmuteableOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [total, setTotal] = useState(0);
  const [taxDetail, setTaxDetail] = useState({});
  const [showShoppingBtn, setShowShoppingBtn] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [count, setCount] = useState(0);
  const [shipmentSelected, setShipmentSelected] = useState("normal");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down("sm"));
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 600,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: "0 8px 30px 0 rgb(0 0 0 / 20%)",
    p: 4,
  };

  useEffect(() => {
    if (user && user?.token) {
      dispatch(
        getCart(function (res) {
          if (res) {
            let preOrders =
              res?.data && res?.data?.preOrder && res?.data?.preOrder?.length
                ? res?.data?.preOrder
                : [];

            setPreOrders(JSON.parse(JSON.stringify(preOrders)));
            setImmuteableOrders(JSON.parse(JSON.stringify(preOrders)));

            let tempPreOrders = [...JSON.parse(JSON.stringify(preOrders))];
            const products = [];
            for (let i = 0; i < tempPreOrders?.length; i++) {
              tempPreOrders[i].isChecked = false;

              for (let j = 0; j < tempPreOrders[i]?.carts?.length; j++) {
                tempPreOrders[i].carts[j].isChecked = false;
                for (
                  let k = 0;
                  k < tempPreOrders[i]?.carts[j]?.products?.length;
                  k++
                ) {
                  tempPreOrders[i].carts[j].products[k].isChecked = false;

                  let product = {};
                  product.DIN_NUMBER =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.DIN_NUMBER;
                  product.batch_number =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.batch_number;
                  product.for = tempPreOrders[i]?.carts[j]?.products[k]?.for;
                  product.isActive =
                    tempPreOrders[i]?.carts[j]?.products[k]?.product?.isActive;
                  product.quantity =
                    tempPreOrders[i]?.carts[j]?.products[k]?.product?.quantity;
                  product.imageCover =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.product?.imageCover;
                  product.product_name =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.product?.product_name;
                  product.brand =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.product?.brand;
                  product.count =
                    tempPreOrders[i]?.carts[j]?.products[k]?.count;
                  product.store =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.store?._id;
                  product.product =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.product?._id;
                  product.price =
                    tempPreOrders[i]?.carts[j]?.products[k]?.price;
                  if (
                    tempPreOrders[i]?.carts[j]?.products[k]?.discountedPrice
                  ) {
                    product.discountedPrice =
                      tempPreOrders[i]?.carts[j]?.products[k]?.discountedPrice;
                  }
                  product.expiry_date =
                    tempPreOrders[i]?.carts[j]?.products[
                      k
                    ]?.product?.expiry_date;
                  product._id = tempPreOrders[i]?.carts[j]?.products[k]?._id;

                  products.push(product);
                }
              }
            }

            setUnCheckImmuteableOrders(tempPreOrders);
            if (typeof window !== "undefined") {
              localStorage.setItem("products", JSON.stringify(products));
            }
            // add to  redux
            dispatch(addProducts(products));
          }
        })
      );
    }
  }, [count]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [count]);

  const handlePlaceOrder = () => {
    if (preOrders?.every((el) => !el.isChecked)) {
      toast.warn("Atleast one cart should be selected");
      return;
    } else {
      setOpen(true);
    }
  };

  const handleOrder = () => {
    let tmpOrders = [...JSON.parse(JSON.stringify(preOrders))];
    let preToCreate = [
      ...JSON.parse(JSON.stringify(tmpOrders)).filter((el) => el.isChecked),
    ];
    let preToCart = [...JSON.parse(JSON.stringify(preOrders))];
    let productsForCart = [];

    for (let i = 0; i < preToCreate?.length; i++) {
      for (let j = 0; j < preToCreate[i]?.carts?.length; j++) {
        if (preToCreate[i]?.carts[j]?.products?.every((el) => !el?.isChecked)) {
          preToCreate[i]?.carts?.splice(j, 1);
          j = j - 1;
        } else {
          for (let k = 0; k < preToCreate[i]?.carts[j]?.products?.length; k++) {
            if (preToCreate[i]?.carts[j]?.products[k]?.isChecked == false) {
              preToCreate[i]?.carts[j]?.products?.splice(k, 1);

              k = k - 1;
            }
          }
        }
      }
    }

    for (let i = 0; i < preToCart?.length; i++) {
      for (let j = 0; j < preToCart[i]?.carts?.length; j++) {
        preToCart[i].isChecked = false;
        if (preToCart[i]?.carts[j]?.products?.every((el) => el?.isChecked)) {
          preToCart[i]?.carts?.splice(j, 1);
          j = j - 1;
        } else {
          for (let k = 0; k < preToCart[i]?.carts[j]?.products?.length; k++) {
            if (preToCart[i]?.carts[j]?.products[k]?.isChecked == true) {
              preToCart[i]?.carts[j]?.products?.splice(k, 1);

              k = k - 1;
            }
          }
        }
        if (preToCart[i]?.carts?.length == 0) {
          preToCart?.splice(i, 1);
          i = i - 1;
        }
      }
    }
    for (let x = 0; x < preToCart?.length; x++) {
      for (let y = 0; y < preToCart[x]?.carts?.length; y++) {
        for (let z = 0; z < preToCart[x]?.carts[y]?.products?.length; z++) {
          productsForCart.push(preToCart[x]?.carts[y]?.products[z]);
        }
      }
    }

    dispatch(
      createPharmacyOrder(
        {
          newCart: preToCart,
          preOrders: preToCreate,
          productsForCart: productsForCart,
        },
        async function (res) {
          if (res) {
            toast.success("Order has been placed successfully");

            // const sumOfArray = preToCreate?.reduce(
            //   (acc, obj) => acc + obj.baseTotal,
            //   0
            // );
            setOrderDeliver(preToCreate);
            if (productsForCart?.length) {
              //  setPreOrders(preToCart)
              //  setUnCheckImmuteableOrders(JSON.parse(JSON.stringify(preToCart)))
              //
              // if (typeof window !== "undefined") {
              //   localStorage.setItem("products", JSON.stringify(productsForCart));
              // }
              // // add to  redux
              // dispatch(addProducts(productsForCart));

              setSelectAll(false);
              setCount((pre) => pre + 1);
            } else {
              if (typeof window !== "undefined") {
                localStorage.removeItem("products");
              }
              // remove from redux
              dispatch(addProducts([]));
              setPreOrders([]);
              setShowShoppingBtn(true);
            }

            // await emptyCart(function () {});
            // if (typeof window !== "undefined") {
            //   localStorage.removeItem("products");
            // }
            // // remove from redux
            // dispatch(addProducts([]));
            // setPreOrders([]);
            // setTotal(0);
            // setShowShoppingBtn(true);
          }
        }
      )
    );
  };

  const handleDeliveryClick = (preIndex, cartIndex, productIndex, type) => {
    let tmpOrders = [...JSON.parse(JSON.stringify(preOrders))];
    let tmpUnpack = [...JSON.parse(JSON.stringify(unCheckimmuteableOrders))];
    let tmpImmute = [...JSON.parse(JSON.stringify(immuteableOrders))];

    let selectedShipping = {
      total:
        tmpOrders[preIndex]?.carts[cartIndex]?.shipping?.estimatedShipping
          ?.normalPrice,
      shippingType: "normal",
      ride_charges:
        tmpOrders[preIndex]?.carts[cartIndex]?.shipping?.estimatedShipping
          ?.ride_charges_normal,
      tax: tmpOrders[preIndex].carts[cartIndex]?.shipping?.estimatedShipping
        ?.tax,
    };

    if (type == "urgent") {
      selectedShipping = {
        total:
          tmpOrders[preIndex]?.carts[cartIndex]?.shipping?.estimatedShipping
            ?.urgent_price,
        shippingType: "urgent",
        ride_charges:
          tmpOrders[preIndex]?.carts[cartIndex]?.shipping?.estimatedShipping
            ?.ride_charges_urgent,
        tax: tmpOrders[preIndex].carts[cartIndex]?.shipping?.estimatedShipping
          ?.tax,
      };
    }
    let shipping = {
      ...tmpOrders[preIndex]?.carts[cartIndex]?.shipping,
      selectedShipping: selectedShipping,
    };
    tmpUnpack[preIndex].carts[cartIndex].products[productIndex].shipping =
      shipping;
    tmpOrders[preIndex].carts[cartIndex].products[productIndex].shipping =
      shipping;
    tmpOrders[preIndex].carts[cartIndex].shipping = shipping;
    tmpUnpack[preIndex].carts[cartIndex].shipping = shipping;
    tmpImmute[preIndex].carts[cartIndex].shipping = shipping;

    let total = getShippingTotal(tmpUnpack[preIndex].carts);
    tmpUnpack[preIndex].shipping.total = total;
    tmpOrders[preIndex].shipping.total = total;
    tmpImmute[preIndex].shipping.total = total;

    setPreOrders(tmpOrders);
    setUnCheckImmuteableOrders(tmpUnpack);
    setImmuteableOrders(tmpImmute);
  };

  const handlePreOrderSelect = (preIndex, val) => {
    let tmpOrders = [...JSON.parse(JSON.stringify(preOrders))];

    tmpOrders[preIndex].isChecked = val;
    for (let j = 0; j < tmpOrders[preIndex]?.carts?.length; j++) {
      tmpOrders[preIndex].carts[j].isChecked = val;
      for (
        let k = 0;
        k < tmpOrders[preIndex]?.carts[j]?.products?.length;
        k++
      ) {
        tmpOrders[preIndex].carts[j].products[k].isChecked = val;
      }
    }
    let tmpSelect = false;
    if (tmpOrders.every((el) => !el.isChecked)) {
      tmpSelect = false;
    }

    if (tmpOrders.every((el) => el.isChecked)) {
      tmpSelect = true;
    }
    setSelectAll(tmpSelect);
    setPreOrders(tmpOrders);
  };

  const handleProductClick = (preInd, cartIndex, productIndex, val) => {
    let tmpOrders = [...JSON.parse(JSON.stringify(preOrders))];
    tmpOrders[preInd].carts[cartIndex].products[productIndex].isChecked = val;

    let tmpSelect = false;

    if (val) {
      tmpOrders[preInd].isChecked = val;

      if (tmpOrders.every((el) => el.isChecked)) {
        setSelectAll(true);
      }
    } else {
      let count = 0;

      for (let j = 0; j < tmpOrders[preInd]?.carts?.length; j++) {
        for (
          let k = 0;
          k < tmpOrders[preInd]?.carts[j]?.products?.length;
          k++
        ) {
          if (tmpOrders[preInd].carts[j].products[k].isChecked) {
            count++;

            break;
          }
        }
      }

      if (count <= 0) {
        tmpOrders[preInd].isChecked = false;
      }

      if (tmpOrders.every((el) => !el.isChecked)) {
        setSelectAll(false);
      } else if (
        tmpOrders.some((el) => el.isChecked) &&
        tmpOrders.some((el) => !el.isChecked)
      ) {
        setSelectAll(false);
      }
    }

    setPreOrders(tmpOrders);
  };

  const handleCheckAll = (val) => {
    let tmpOrders = [];
    if (val) {
      let tmpImute = [...JSON.parse(JSON.stringify(unCheckimmuteableOrders))];

      for (let i = 0; i < tmpImute?.length; i++) {
        tmpImute[i].isChecked = true;
        for (let j = 0; j < tmpImute[i]?.carts?.length; j++) {
          tmpImute[i].carts[j].isChecked = true;
          for (let k = 0; k < tmpImute[i]?.carts[j]?.products?.length; k++) {
            tmpImute[i].carts[j].products[k].isChecked = true;
          }
        }
      }

      tmpOrders = [...tmpImute];
    } else {
      tmpOrders = [...unCheckimmuteableOrders];
    }

    setPreOrders(tmpOrders);
    setSelectAll(val);
  };
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

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updateCartLoading}
      >
        <CircularProgress sx={{ color: " #235D5E" }} />
      </Backdrop>

      <Grid
        container
        justifyContent="center"
        width="100%"
        sx={{ margin: "0px" }}
        spacing={2}
      >
        <Grid item lg={8} md={12} sm={12} xs={12}>
          {cartLoading ? (
            <>
              <Box
                sx={{
                  justifyContent: "center",
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  sx={{
                    color: "#235D5E",
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              <Box>
                {preOrders && preOrders?.length > 0 && (
                  <FormGroup
                    sx={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <FormControlLabel
                      sx={{ margin: "0px 12px" }}
                      control={
                        <Checkbox
                          sx={{ color: "#235D5E !important" }}
                          disabled={loading}
                          value={selectAll}
                          onChange={(e) => handleCheckAll(e?.target?.checked)}
                          checked={selectAll}
                        />
                      }
                      label="Select All"
                    />
                  </FormGroup>
                )}

                <Box>
                  {preOrders && preOrders?.length ? (
                    preOrders?.map((pre, ind) => {
                      return (
                        <Box position={"relative"} mb={3}>
                          <Box className="store-checkout">
                            <b>Store : </b>
                            {capitalize(pre?.orderedBy?.store_name)} ,
                            <b> Location : </b>
                            {pre?.carts[0]?.products[0]?.for?.location}
                          </Box>
                          <Card
                            sx={{
                              borderRadius: "20px",
                              boxShadow:
                                "0px 84px 214px -80px rgba(0, 0, 0, 0.08)",
                              border: "1px solid #F0F0F0",
                            }}
                          >
                            <CardContent>
                              <>
                                {pre && pre?.carts && pre?.carts?.length ? (
                                  pre?.carts?.map((el, i) => (
                                    <>
                                      {el &&
                                      el?.products &&
                                      el?.products?.length
                                        ? el?.products?.map((item, index) => (
                                            <>
                                              <Grid
                                                item
                                                md={12}
                                                sm={12}
                                                lg={12}
                                                xs={12}
                                                pt={2}
                                              >
                                                {index == 0 && (
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <Box pt={2}>
                                                      <Chip
                                                        label={`From ${el?.orderedTo?.uuid}`}
                                                        sx={{
                                                          color: "#101828",
                                                          backgroundColor:
                                                            "#F3CA60",
                                                          borderRadius: "8px",
                                                        }}
                                                        size={
                                                          isMobile
                                                            ? "small"
                                                            : "medium"
                                                        }
                                                      />
                                                    </Box>

                                                    {i == 0 ? (
                                                      <Box
                                                        pt={{
                                                          md: 2,
                                                          lg: 2,
                                                          xs: 1,
                                                        }}
                                                        pl={{ xl: 5 }}
                                                      >
                                                        <FormGroup>
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                sx={{
                                                                  color:
                                                                    "#235D5E !important",
                                                                }}
                                                                checked={
                                                                  pre?.isChecked
                                                                }
                                                                disabled={
                                                                  loading
                                                                }
                                                                onChange={(e) =>
                                                                  handlePreOrderSelect(
                                                                    ind,
                                                                    e?.target
                                                                      ?.checked
                                                                  )
                                                                }
                                                                size={
                                                                  isMobile
                                                                    ? "small"
                                                                    : "medium"
                                                                }
                                                              />
                                                            }
                                                            label="Select"
                                                          />
                                                        </FormGroup>
                                                      </Box>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </Box>
                                                )}
                                              </Grid>
                                              <Box>
                                                <Box
                                                  display="flex"
                                                  flexDirection="column"
                                                  sx={{ width: "100%" }}
                                                >
                                                  <Grid
                                                    item
                                                    md={12}
                                                    sm={12}
                                                    lg={12}
                                                    xs={12}
                                                  >
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      pt={3}
                                                    >
                                                      <Grid
                                                        item
                                                        md={2}
                                                        lg={2}
                                                        sm={2}
                                                        xs={6}
                                                      >
                                                        {item?.product && // sx={{
                                                        //   marginX: '15px',
                                                        // }}
                                                        item?.product?.product
                                                          ?.imageCover
                                                          ?.full_image &&
                                                        item?.product?.product
                                                          ?.imageCover
                                                          ?.full_image ? (
                                                          <img
                                                            src={
                                                              item?.product
                                                                ?.product
                                                                ?.imageCover
                                                                ?.full_image
                                                            }
                                                            style={{
                                                              objectFit:
                                                                "cover",
                                                              width: "80px",
                                                              height: "80px",
                                                            }}
                                                          />
                                                        ) : (
                                                          <Box
                                                            className="cusProductName"
                                                            sx={{
                                                              width: "80px",
                                                              height: "80px",
                                                            }}
                                                          >
                                                            <Typography className="image-product-text">
                                                              {
                                                                item?.product
                                                                  ?.product
                                                                  ?.product_name
                                                              }
                                                            </Typography>
                                                          </Box>
                                                        )}
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        md={4}
                                                        lg={4}
                                                        sm={4}
                                                        xs={6}
                                                      >
                                                        <Box>
                                                          <Tooltip
                                                            title={
                                                              item?.product
                                                                ?.product
                                                                ?.product_name
                                                            }
                                                          >
                                                            <Typography
                                                              mx={{
                                                                lg: 1,
                                                                md: 1,
                                                                sm: 1,
                                                              }}
                                                              className="cart-text text-ellipses"
                                                            >
                                                              {
                                                                item?.product
                                                                  ?.product
                                                                  ?.product_name
                                                              }
                                                            </Typography>
                                                          </Tooltip>
                                                          <Typography
                                                            sx={{
                                                              marginX: "10px",
                                                            }}
                                                            variant="subtitle1"
                                                            className="cart-price"
                                                          >
                                                            {`$${formatNumberWithCommas(
                                                              Number(
                                                                item?.count *
                                                                  (item?.discountedPrice
                                                                    ? item
                                                                        ?.discountedPrice
                                                                        ?.discountedPrice
                                                                    : item?.price)
                                                              ).toFixed(2)
                                                            )}`}
                                                          </Typography>
                                                        </Box>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        md={4}
                                                        lg={4}
                                                        sm={4}
                                                        xs={6}
                                                      >
                                                        <TextField
                                                          className="counter"
                                                          type="number"
                                                          value={item?.count}
                                                          defaultValue={
                                                            item?.count
                                                          }
                                                          id="outlined-basic"
                                                          variant="outlined"
                                                        />
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        md={2}
                                                        lg={2}
                                                        sm={2}
                                                        xs={6}
                                                      >
                                                        <Box
                                                          pl={{ xs: 4 }}
                                                          sx={{
                                                            float: "right",
                                                          }}
                                                        >
                                                          <FormGroup>
                                                            <FormControlLabel
                                                              control={
                                                                <Checkbox
                                                                  disabled={
                                                                    loading
                                                                  }
                                                                  checked={
                                                                    item?.isChecked
                                                                  }
                                                                  sx={{
                                                                    color:
                                                                      "#235D5E !important",
                                                                  }}
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    handleProductClick(
                                                                      ind,
                                                                      i,
                                                                      index,
                                                                      e.target
                                                                        .checked
                                                                    )
                                                                  }
                                                                />
                                                              }
                                                              label=""
                                                            />
                                                          </FormGroup>
                                                        </Box>
                                                      </Grid>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    md={12}
                                                    lg={12}
                                                    xs={12}
                                                    sm={12}
                                                  >
                                                    <Box pt={3}>
                                                      <Divider
                                                        sx={{
                                                          borderColor:
                                                            "#EDEDED !important",
                                                          border:
                                                            "1px solid #EDEDED !important",
                                                          width: "100%",
                                                        }}
                                                      />
                                                    </Box>
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    md={12}
                                                    lg={12}
                                                    sm={12}
                                                    xs={12}
                                                  >
                                                    {el?.products?.length - 1 ==
                                                      index && (
                                                      <Stack
                                                        direction={{
                                                          md: "row",
                                                          lg: "row",
                                                          sm: "column",
                                                          xs: "column",
                                                        }}
                                                        sx={{
                                                          justifyContent:
                                                            "center",
                                                          textAlign: "center",
                                                        }}
                                                        my={5}
                                                      >
                                                        <FormControl>
                                                          <RadioGroup
                                                            row
                                                            name={
                                                              el?.shipping
                                                                ?.selectedShipping
                                                                ?.shippingType
                                                            }
                                                            value={
                                                              el?.shipping
                                                                ?.selectedShipping
                                                                ?.shippingType
                                                            }
                                                            onChange={(e) =>
                                                              handleDeliveryClick(
                                                                ind,
                                                                i,
                                                                index,
                                                                e?.target?.value
                                                              )
                                                            }
                                                            className="checkout-radio"
                                                          >
                                                            <Grid
                                                              item
                                                              md={5}
                                                              lg={5}
                                                              sm={5}
                                                              xs={12}
                                                            >
                                                              <FormControlLabel
                                                                control={
                                                                  <Radio
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      setShipmentSelected(
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                    value="normal"
                                                                    checked={
                                                                      el
                                                                        ?.shipping
                                                                        ?.selectedShipping
                                                                        ?.shippingType ===
                                                                      "normal"
                                                                    }
                                                                    sx={{
                                                                      color:
                                                                        "#235D5E",
                                                                      "&.Mui-checked":
                                                                        {
                                                                          color:
                                                                            "#235D5E",
                                                                        },
                                                                      position:
                                                                        "absolute",
                                                                      zIndex:
                                                                        "1",
                                                                    }}
                                                                    size={
                                                                      isMobile
                                                                        ? "small"
                                                                        : "medium"
                                                                    }
                                                                  />
                                                                }
                                                                labelPlacement="start"
                                                                label={
                                                                  <Box>
                                                                    <Chip
                                                                      disabled={
                                                                        loading
                                                                      }
                                                                      className="chip-checkout"
                                                                      label={
                                                                        <>
                                                                          <Typography
                                                                            style={{
                                                                              marginBottom:
                                                                                "0px",
                                                                            }}
                                                                            fontSize={{
                                                                              lg: 14,
                                                                              md: 14,
                                                                              sm: 12,
                                                                              xs: 10,
                                                                            }}
                                                                            fontWeight={
                                                                              400
                                                                            }
                                                                            color={
                                                                              "#101828"
                                                                            }
                                                                          >
                                                                            Normal
                                                                            Delivery
                                                                            <span
                                                                              style={{
                                                                                marginLeft:
                                                                                  "5px",
                                                                              }}
                                                                            >
                                                                              $
                                                                              {
                                                                                el
                                                                                  ?.shipping
                                                                                  ?.estimatedShipping
                                                                                  ?.normalPrice
                                                                              }
                                                                            </span>
                                                                          </Typography>
                                                                          <Typography
                                                                            fontSize={{
                                                                              lg: 14,
                                                                              md: 14,
                                                                              sm: 12,
                                                                              xs: 10,
                                                                            }}
                                                                            fontWeight={
                                                                              400
                                                                            }
                                                                            color={
                                                                              "#101828"
                                                                            }
                                                                          >
                                                                            Receive
                                                                            in
                                                                            3-4
                                                                            days
                                                                          </Typography>
                                                                        </>
                                                                      }
                                                                    />
                                                                  </Box>
                                                                }
                                                                sx={{
                                                                  marginLeft:
                                                                    "0px",
                                                                }}
                                                              />
                                                            </Grid>
                                                            <>
                                                              <Grid
                                                                item
                                                                md={2}
                                                                lg={2}
                                                                sm={2}
                                                                xs={12}
                                                              >
                                                                <Box
                                                                  p={{
                                                                    lg: 4,
                                                                    md: 4,
                                                                    sm: 4,
                                                                    xs: 1,
                                                                  }}
                                                                >
                                                                  <Typography
                                                                    fontSize={{
                                                                      lg: 18,
                                                                      md: 18,
                                                                      sm: 14,
                                                                      xs: 12,
                                                                    }}
                                                                    fontWeight={
                                                                      500
                                                                    }
                                                                    color={
                                                                      "#101828"
                                                                    }
                                                                  >
                                                                    or
                                                                  </Typography>
                                                                </Box>
                                                              </Grid>

                                                              <Grid
                                                                item
                                                                md={5}
                                                                lg={5}
                                                                sm={5}
                                                                xs={12}
                                                              >
                                                                <FormControlLabel
                                                                  control={
                                                                    <Radio
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        setShipmentSelected(
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                      value="urgent"
                                                                      checked={
                                                                        el
                                                                          ?.shipping
                                                                          ?.selectedShipping
                                                                          ?.shippingType ===
                                                                        "urgent"
                                                                      }
                                                                      sx={{
                                                                        color:
                                                                          "#235D5E",
                                                                        "&.Mui-checked":
                                                                          {
                                                                            color:
                                                                              "#235D5E",
                                                                          },
                                                                        position:
                                                                          "absolute",
                                                                        zIndex:
                                                                          "1",
                                                                      }}
                                                                      size={
                                                                        isMobile
                                                                          ? "small"
                                                                          : "medium"
                                                                      }
                                                                    />
                                                                  }
                                                                  labelPlacement="start"
                                                                  label={
                                                                    <Chip
                                                                      disabled={
                                                                        loading
                                                                      }
                                                                      className="chip-checkout"
                                                                      label={
                                                                        <>
                                                                          <Typography
                                                                            style={{
                                                                              marginBottom:
                                                                                "0px",
                                                                            }}
                                                                            fontSize={{
                                                                              lg: 14,
                                                                              md: 14,
                                                                              sm: 12,
                                                                              xs: 10,
                                                                            }}
                                                                            color={
                                                                              "#101828"
                                                                            }
                                                                            fontWeight={
                                                                              400
                                                                            }
                                                                          >
                                                                            Expedited
                                                                            Delivery
                                                                            <span
                                                                              style={{
                                                                                marginLeft:
                                                                                  "5px",
                                                                              }}
                                                                            >
                                                                              $
                                                                              {
                                                                                el
                                                                                  ?.shipping
                                                                                  ?.estimatedShipping
                                                                                  ?.urgent_price
                                                                              }
                                                                            </span>
                                                                          </Typography>
                                                                          <Typography
                                                                            fontSize={{
                                                                              lg: 14,
                                                                              md: 14,
                                                                              sm: 12,
                                                                              xs: 10,
                                                                            }}
                                                                            fontWeight={
                                                                              400
                                                                            }
                                                                            color={
                                                                              "#101828"
                                                                            }
                                                                          >
                                                                            Receive
                                                                            in
                                                                            1-2
                                                                            days
                                                                          </Typography>
                                                                        </>
                                                                      }
                                                                      // variant={
                                                                      //   el
                                                                      //     ?.shipping
                                                                      //     ?.selectedShipping
                                                                      //     ?.shippingType ==
                                                                      //   'urgent'
                                                                      //     ? 'outlined'
                                                                      //     : ''
                                                                      // }
                                                                      // onClick={() =>
                                                                      //   handleDeliveryClick(
                                                                      //     ind,
                                                                      //     i,
                                                                      //     index,
                                                                      //     shipmentSelected
                                                                      //   )
                                                                      // }
                                                                    />
                                                                  }
                                                                  sx={{
                                                                    marginLeft:
                                                                      "0px",
                                                                  }}
                                                                />
                                                              </Grid>
                                                            </>
                                                          </RadioGroup>
                                                        </FormControl>
                                                      </Stack>
                                                    )}
                                                  </Grid>

                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    justifyContent={"flex-end"}
                                                  >
                                                    {el?.products?.length - 1 ==
                                                      index &&
                                                    el &&
                                                    el?.shipping &&
                                                    el?.shipping
                                                      ?.estimatedShipping ? (
                                                      <>
                                                        <Box className="shipping-box">
                                                          <Box
                                                            component="div"
                                                            justifyContent="flex-end"
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <Typography
                                                              className="charges"
                                                              sx={{
                                                                flex: 1,
                                                              }}
                                                            >
                                                              Ride Charges:
                                                            </Typography>
                                                            <Typography
                                                              className="charges-text"
                                                              sx={{
                                                                marginX: "10px",
                                                              }}
                                                            >
                                                              $
                                                              {
                                                                el?.shipping
                                                                  ?.selectedShipping
                                                                  ?.ride_charges
                                                              }
                                                            </Typography>
                                                          </Box>

                                                          <Box
                                                            justifyContent="flex-end"
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <Typography
                                                              className="charges"
                                                              sx={{
                                                                flex: 1,
                                                              }}
                                                            >
                                                              Tax:
                                                            </Typography>
                                                            <Typography
                                                              sx={{
                                                                marginX: "10px",
                                                              }}
                                                              className="charges-text"
                                                            >
                                                              $
                                                              {
                                                                el?.shipping
                                                                  ?.selectedShipping
                                                                  ?.tax
                                                              }
                                                            </Typography>
                                                          </Box>
                                                          <Box
                                                            component="div"
                                                            justifyContent="flex-end"
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <Typography
                                                              variant="subtitle1"
                                                              fontSize={14}
                                                              className="charges"
                                                              sx={{
                                                                flex: 1,
                                                              }}
                                                            >
                                                              Total Shipping
                                                              Fee:
                                                            </Typography>
                                                            <Typography
                                                              sx={{
                                                                marginX: "10px",
                                                              }}
                                                              className="charges-text"
                                                            >
                                                              $
                                                              {formatNumberWithCommas(
                                                                el?.shipping
                                                                  ?.selectedShipping
                                                                  ?.total
                                                              )}
                                                            </Typography>
                                                          </Box>
                                                        </Box>
                                                      </>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </Grid>
                                                </Box>
                                              </Box>
                                              {el.products.length - 1 ==
                                                index && (
                                                <Divider
                                                  sx={{
                                                    borderColor: "#ccc",
                                                    marginTop: "1.5rem",
                                                  }}
                                                />
                                              )}
                                            </>
                                          ))
                                        : ""}
                                    </>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </>
                            </CardContent>
                          </Card>
                        </Box>
                      );
                    })
                  ) : (
                    <>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "0px 84px 214px -80px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #F0F0F0",
                          marginBottom: "16px",
                        }}
                      >
                        <CardContent>
                          <>
                            <Typography
                              mb={3}
                              className="summary-heading"
                              fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                            >
                              Order Summary
                            </Typography>
                            <Box display="flex" my={2} alignItems="center">
                              <Typography
                                sx={{ flex: "1" }}
                                className="summary-heading"
                                fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                              >
                                Subtotal <span>{orderDeliver?.length}</span>{" "}
                                Items
                              </Typography>
                              <Typography
                                variant="h5"
                                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                                className="summary-heading"
                              >
                                $
                                {formatNumberWithCommas(
                                  parseFloat(
                                    getShippingTotalOfCarts(orderDeliver)
                                  )?.toFixed(2)
                                )}
                              </Typography>
                            </Box>

                            <Box display="flex" my={2} alignItems="center">
                              <Typography
                                sx={{ flex: "1" }}
                                fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                                className="summary-heading"
                              >
                                Tax
                              </Typography>
                              <Typography
                                variant="h5"
                                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                                className="summary-heading"
                              >
                                $
                                {formatNumberWithCommas(
                                  parseFloat(
                                    Number(
                                      getTotalTax(
                                        getTotalOfCarts(orderDeliver[0]?.carts),
                                        orderDeliver[0]?.carts[0]?.taxDetails
                                      )
                                    )
                                  )?.toFixed(2)
                                )}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" my={2}>
                              <Typography
                                sx={{ flex: "1" }}
                                className="summary-heading"
                                fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                              >
                                Shipping Fee
                              </Typography>
                              <Typography
                                variant="h5"
                                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                                className="summary-heading"
                              >
                                {`$${formatNumberWithCommas(
                                  parseFloat(
                                    getAllShippingTotal(orderDeliver)
                                  ).toFixed(2)
                                )}`}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" my={2}>
                              <Typography
                                sx={{ flex: "1" }}
                                className="summary-heading"
                                fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                              >
                                Total
                              </Typography>
                              <Typography
                                variant="h5"
                                fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                                className="summary-heading"
                              >
                                $
                                {formatNumberWithCommas(
                                  getGrandTotal(
                                    getTotalTax(
                                      getShippingTotalOfCarts(orderDeliver),
                                      orderDeliver[0]?.carts[0]?.taxDetails
                                    ),
                                    getAllShippingTotal(orderDeliver),
                                    getShippingTotalOfCarts(orderDeliver)
                                  )
                                )}
                              </Typography>
                            </Box>
                          </>
                        </CardContent>
                      </Card>
                      <Button
                        onClick={() => history("/marketplace")}
                        fullWidth
                        className="containedPrimary"
                        variant="contained"
                        sx={{ paddingLeft: "15px" }}
                      >
                        Continue Shopping
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Grid>
        {preOrders && preOrders?.length > 0 ? (
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Card
              sx={{
                borderRadius: "20px",
                boxShadow: "0px 84px 214px -80px rgba(0, 0, 0, 0.08)",
                border: "1px solid #F0F0F0",
              }}
            >
              <CardContent>
                {/* {preOrders?.map((pre, ind) => {
                return ( */}

                <>
                  <Typography
                    mb={3}
                    className="summary-heading"
                    fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                  >
                    Order Summary
                  </Typography>
                  <Box display="flex" my={2} alignItems="center">
                    <Typography
                      sx={{ flex: "1" }}
                      className="summary-heading"
                      fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                    >
                      Subtotal <span>{preOrders?.length}</span> Items
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                      className="summary-heading"
                    >
                      $
                      {formatNumberWithCommas(
                        parseFloat(getShippingTotalOfCarts(preOrders))?.toFixed(
                          2
                        )
                      )}
                      {/* ${parseFloat(getTotalOfCarts(pre?.carts))?.toFixed(2)} */}
                    </Typography>
                  </Box>

                  <Box display="flex" my={2} alignItems="center">
                    <Typography
                      sx={{ flex: "1" }}
                      fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                      className="summary-heading"
                    >
                      Tax
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                      className="summary-heading"
                    >
                      $
                      {formatNumberWithCommas(
                        parseFloat(
                          Number(
                            getTotalTax(
                              getTotalOfCarts(preOrders[0]?.carts),
                              preOrders[0]?.carts[0]?.taxDetails
                            )
                          )
                        )?.toFixed(2)
                      )}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" my={2}>
                    <Typography
                      sx={{ flex: "1" }}
                      className="summary-heading"
                      fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                    >
                      Shipping Fee
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                      className="summary-heading"
                    >
                      {`$${formatNumberWithCommas(
                        parseFloat(getAllShippingTotal(preOrders)).toFixed(2)
                      )}`}

                      {/* {`$${parseFloat(getShippingTotal(pre?.carts)).toFixed(
                          2
                        )}`} */}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" my={2}>
                    <Typography
                      sx={{ flex: "1" }}
                      className="summary-heading"
                      fontSize={{ lg: 18, md: 18, sm: 16, xs: 14 }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize={{ lg: 24, md: 24, sm: 20, xs: 18 }}
                      className="summary-heading"
                    >
                      $
                      {formatNumberWithCommas(
                        getGrandTotal(
                          getTotalTax(
                            getShippingTotalOfCarts(preOrders),
                            preOrders[0]?.carts[0]?.taxDetails
                          ),
                          getAllShippingTotal(preOrders),
                          getShippingTotalOfCarts(preOrders)
                        )
                      )}
                    </Typography>
                  </Box>
                </>

                {/* );
              })} */}
              </CardContent>
              <CardActions>
                {preOrders && preOrders?.length ? (
                  <Button
                    onClick={handlePlaceOrder}
                    fullWidth
                    className="containedPrimary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={25} color="white" loading />
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </CardActions>
            </Card>
          </Grid>
        ) : null}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stripe handleOrder={handleOrder} handleClose={handleClose} />
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default Checkout;
