import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { addProducts, openDrawer } from "../../services/cart";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AlsoAvailable = ({ din, suggestion, productQuantity }) => {
  const [sameProduct, setSameProduct] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    const sameproduct = suggestion?.find((el) => el?.DIN_NUMBER == din);
    if (sameproduct) {
      setSameProduct(sameproduct);
    }
  }, [din, suggestion]);

  const handleAddToCart = () => {
    if (sameProduct) {
      let products = [];
      let product = sameProduct;

      product = {
        ...product,
        imageCover: sameProduct?.product?.imageCover,
        product_name: sameProduct?.product?.product_name,
        price: !sameProduct?.discountedPrice
          ? sameProduct?.price
          : sameProduct?.discountedPrice?.discountedPrice,
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
          (wishlists) =>
            wishlists._id == product?._id &&
            user?.store?._id == wishlists?.for?._id
        );
        if (productIndex > -1) {
          products[productIndex] = { ...product, count: productQuantity };
        } else {
          products.push({
            ...product,
            count: productQuantity,
          });
        }

        localStorage.setItem("products", JSON.stringify(products));

        // add to reeux state
        dispatch(addProducts(products));

        if (productIndex > -1) {
          toast.success(`Cart updated successfully`);
        } else {
          dispatch(openDrawer(true));
        }
      }
    }
  };

  return (
    <>
      {sameProduct ? (
        <>
          <Box sx={{ margin: "10px auto", textAlign: "center" }}>
            <Button
              size="small"
              variant="outlined"
              sx={{ textTransform: "capitalize" }}
              onClick={handleAddToCart}
            >{`Also available in ${
              sameProduct?.product?.store &&
              sameProduct?.product?.store?.store_name
            } on price ${sameProduct?.price}`}</Button>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AlsoAvailable;
