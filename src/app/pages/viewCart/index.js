import React, { useEffect, useState } from "react";
import "./viewCart.scss";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveCart } from "../../services/cart";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { getRelatedProducts } from "../../services/products";
import RelatedProductsSwiper from "./RelatedProductsSwiper";
import ViewProduct from "../../shared/components/ViewProduct";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";
const ViewCart = () => {
  const products = useSelector((state) => state?.cart?.products);
  const cartLoading = useSelector((state) => state?.cart?.saveCart?.loading);
  const relatedProductsLoading = useSelector(
    (state) => state?.product?.relatedProducts?.loading
  );
  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const getTotal = (products) => {
    return products.reduce((acc, curr) => {
      return (
        acc +
        curr?.count *
          (curr?.discountedPrice?.discountedPrice
            ? curr?.discountedPrice?.discountedPrice
            : curr.price)
      );
    }, 0);
  };
  const saveCartToDataBase = () => {
    dispatch(
      saveCart({ products }, function (res) {
        if (res) {
          if (res?.data?.ok) {
            history("/checkout", { replace: true });
          }
          if (res?.data?.isShippingError) {
            toast.warn(
              "There is issue with shipping api server,We are using static shipping"
            );
          }
        }
      })
    );
  };

  useEffect(() => {
    if (products?.length) {
      let query = products?.map((el) => {
        let store = el?.store?.id ? el.store?.id : el?.store;
        let product = el?.product?.id ? el.product?.id : el?.product;
        return {
          store: store,
          product: product,
        };
      });
      dispatch(
        getRelatedProducts({ query }, function (res) {
          if (res?.status == "success") {
            setRelatedProducts(res?.data[0]?.data);
          }
        })
      );
    }
  }, [count]);

  return (
    <React.Fragment>
      {/*<Header />*/}
      <Container>
        <Grid container spacing={{ lg: 2, md: 2, sm: 2, xs: 1 }}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <Grid item md={12} lg={12} sm={12} xs={12} mb={2}>
              <Typography
                fontSize={{ lg: "30px", md: "24px", sm: "18px", xs: "16px" }}
                fontWeight={"500"}
                color={"#000000"}
              >
                Your Cart
              </Typography>
            </Grid>
            {products && products?.length ? (
              products?.map((product, i) => {
                return (
                  <>
                    <Box>
                      <ViewProduct
                        product={product}
                        i={i}
                        count={count}
                        setCount={setCount}
                      />
                    </Box>
                  </>
                );
              })
            ) : (
              <>
                <Button
                  fullWidth
                  className="containedPrimary"
                  variant="contained"
                  sx={{ paddingLeft: "15px" }}
                  onClick={() => history("/")}
                >
                  Continue Shopping
                </Button>
              </>
            )}
          </Grid>
          {products && products?.length > 0 ? (
            <Grid item lg={5} md={5} sm={12} xs={12}>
              <Card className="summary-card">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item md={12} lg={12} sm={12} xs={12}>
                      <Typography
                        mb={1.5}
                        className="summary-heading"
                        fontSize={{ lg: 24, md: 24, sm: 18, xs: 16 }}
                      >
                        Order Summary
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6}>
                      <Typography
                        sx={{ flex: "1" }}
                        className="summary-heading"
                        fontSize={{ lg: 18, md: 16, sm: 14, xs: 12 }}
                      >
                        Subtotal <span>{products?.length}</span> Items
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6} textAlign={"right"}>
                      <Typography
                        variant="h5"
                        fontSize={{ lg: 24, md: 24, sm: 18, xs: 16 }}
                        className="summary-heading"
                      >
                        {`$${formatNumberWithCommas(
                          Number(getTotal(products))?.toFixed(2)
                        )}`}
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6}>
                      <Typography
                        sx={{ flex: "1" }}
                        className="summary-heading"
                        fontSize={{ lg: 18, md: 16, sm: 14, xs: 12 }}
                      >
                        Shipping Fee
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6} textAlign={"right"}>
                      <Typography
                        fontSize={{ lg: 16, md: 16, sm: 14, xs: 12 }}
                        className="summary-cal"
                      >
                        Calculated at next step
                      </Typography>
                    </Grid>

                    <Grid item md={6} lg={6} sm={6} xs={6}>
                      <Typography
                        sx={{ flex: "1" }}
                        className="summary-heading"
                        fontSize={{ lg: 18, md: 16, sm: 14, xs: 12 }}
                      >
                        Total
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6} textAlign={"right"}>
                      <Typography
                        fontSize={{ lg: 24, md: 24, sm: 18, xs: 16 }}
                        className="summary-heading"
                      >
                        {`$${formatNumberWithCommas(
                          Number(getTotal(products))?.toFixed(2)
                        )}`}
                      </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} sm={6} xs={6} my={1}>
                      <TextField
                        className="authfield"
                        placeholder="Enter voucher code"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      lg={6}
                      sm={6}
                      xs={6}
                      my={1}
                      textAlign={"right"}
                    >
                      <Button
                        className="containedPrimary"
                        variant="contained"
                        sx={{
                          background: "#35BD76 !important",
                          fontSize: "14px !important",
                          width: "100%",
                          paddingTop: "10px !important",
                          paddingBottom: "10px !important",
                          textAlign: "center !important",
                          borderRadius: "8px !important",
                          margin: "auto !important",
                          boxShadow:
                            "0px 1px 3px rgba(53, 189, 118, 0.21), 0px 2px 1px rgba(204, 255, 228, 0.06), 0px 1px 1px #CCFFE4 !important",
                        }}
                      >
                        Apply
                      </Button>
                    </Grid>
                  </Grid>

                  {user && user?.token ? (
                    <>
                      <Button
                        fullWidth
                        className="btn-full-length"
                        variant="contained"
                        sx={{
                          paddingLeft: "15px",
                          fontSize: "12px !important",
                          fontWeight: "400 !important",
                          paddingBottom: "15px !important",
                          paddingTop: "15px !important",
                        }}
                        onClick={saveCartToDataBase}
                        disabled={cartLoading}
                      >
                        {cartLoading ? (
                          <ClipLoader size={25} color="white" loading />
                        ) : (
                          "Proceed to Checkout"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        className="containedPrimary"
                        variant="contained"
                        sx={{ paddingLeft: "15px" }}
                        onClick={() => history("/login", { state: "viewcart" })}
                      >
                        Login to Checkout
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
        <RelatedProductsSwiper
          relatedProductsLoading={relatedProductsLoading}
          products={relatedProducts}
          setCount={setCount}
        />
      </Container>
    </React.Fragment>
  );
};

export default ViewCart;
