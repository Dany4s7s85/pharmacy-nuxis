import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card, CardContent, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InputAdornment from '@mui/material/InputAdornment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import {
  removeInventoryWishList,
  getInventoryWishListsSuccess,
} from '../../../services/products';
import { useDispatch, useSelector } from 'react-redux';
import { addProducts, openDrawer } from '../../../services/cart';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import cart from '../../../assets/images/cart.svg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './wishlist.scss';

const WishlistCard = ({ el, wishlists, setWishlists, i }) => {
  const { setWishListCount, wishListCount } = useContext(AuthContext);
  const { user, user_permission } = useSelector((state) => state?.auth);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleRemoveInventoryToWishList = (inventoryId, index) => {
    if (inventoryId) {
      dispatch(
        removeInventoryWishList(inventoryId, function (response) {
          if (response?.status == 'success') {
            setWishListCount(wishListCount - 1);
            let tempWish = [...wishlists];
            wishlists[index].product.isMarkedFavourite = false;

            setWishlists(tempWish);
          }
        })
      );
    }
  };

  const handleQuantityChange = (value, data) => {
    // value = value < 1 ? 1 : value;
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
      let product = data?.product;

      product = {
        ...product,
        imageCover: data?.product?.product.imageCover,
        product_name: data?.product?.product.product_name,
        price: !data?.discountedPrice
          ? data?.product?.price
          : data?.discountedPrice?.discountedPrice,
      };

      if (!user.store) {
        toast.error(`Please select store to buy `);
        return;
      } else if (user?.store) {
        let storeData = { ...user?.store };
        delete storeData?.token;
        product.for = storeData;
      }

      if (typeof window !== 'undefined') {
        // if cart is in local storage GET it
        if (localStorage.getItem('products')) {
          products = JSON.parse(localStorage.getItem('products'));
        }
        // push new product to cart
        let productIndex = products?.findIndex(
          (wishlists) =>
            wishlists._id == product?._id &&
            user?.store?._id == wishlists?.for?._id
        );
        if (productIndex > -1) {
          products[productIndex] = { ...product, count: quantity };
        } else {
          products.push({
            ...product,
            count: quantity,
          });
        }

        localStorage.setItem('products', JSON.stringify(products));

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
    <Card raised className="product-card" sx={{ position: 'relative' }}>
      <Box>
        <Box
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
          }}
        >
          <Tooltip title="Remove from Wishlist">
            <IconButton
              sx={{ background: '#fff' }}
              onClick={() => {
                handleRemoveInventoryToWishList(el?.product?.id, i);
              }}
            >
              <DeleteIcon sx={{ color: '#FA7066' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          display="flex"
          mt={5}
          className="carousel-img-container"
          justifyContent="center"
        >
          {el?.product?.product &&
            el?.product?.product?.imageCover?.full_image &&
            el?.product?.product?.imageCover?.full_image ? (
            <img
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'contain',
              }}
              src={el?.product?.product?.imageCover?.full_image}
            />
          ) : (
            <Box className="cusCardProductName">
              <Typography>{el?.product?.product?.product_name}</Typography>
            </Box>
          )}
        </Box>
        <CardContent className="Content" sx={{ padding: '0px !important' }}>
          <Box display="flex" mt={2} alignItems="center">
            <Typography variant="subtitle1" className="latest-product-subtext">
              {el && el?.product && el?.product?.quantity
                ? `${el?.product && el?.product?.quantity} packs avilabale`
                : 'packs are unavilable'}
            </Typography>
          </Box>

          <Box display="flex" mt={1} alignItems="center">
            <Typography
              variant="subtitle2"
              mr={1}
              className="latest-product-subtext"
            >
              Store id:
            </Typography>
            <Typography variant="subtitle1" className="latest-product-subtext">
              {el?.product?.store?.uuid}
            </Typography>
          </Box>

          <Box display="flex" mt={1} alignItems="center">
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
              }}
              variant="subtitle1"
              className="latest-product-subtext"
            >
              {el?.product?.product?.brand}
            </Typography>
          </Box>

          <Box
            display="flex"
            mt={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" sx={{ width: "50%" }}>
              <Typography
                sx={{
                  fontWeight: '500',
                  fontSize: '16px !important',
                }}
                className="price"
              >
                {!el?.discountedPrice ? (
                  <>
                    {el?.product && el?.product?.price
                      ? `$${el?.product && el?.product?.price}`
                      : 'N/A'}
                  </>
                ) : (
                  <>
                    {el && el?.discountedPrice && el?.discountedPrice
                      ? `$${el?.discountedPrice?.discountedPrice}`
                      : `$${el?.product?.price}`}
                  </>
                )}
              </Typography>
              <Box ml={1}>
                {el &&
                  el?.discountedPrice &&
                  el?.discountedPrice?.discountPercentage != '0%' ? (
                  <>
                    <Typography>
                      <del style={{ color: '#333', fontWeight: '300' }}>
                        ${el?.product?.price}
                      </del>
                    </Typography>
                    {/* <Typography sx={{ marginLeft: "10px" }}>
                    {el?.discountedPrice?.discountPercentage}
                  </Typography> */}
                  </>
                ) : (
                  <Box visibility="hidden">hidden</Box>
                )}
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" sx={{ width: "50%" }}>
              <Box width="50px" className="cartCounter">
                <TextField
                  className="counter"
                  sx={{ width: 'auto !important' }}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ position: 'relative' }}>
                        <InputAdornment
                          position="end"
                          sx={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '0px',
                          }}
                        >
                          <IconButton
                            aria-label="plus"
                            disabled={
                              (el?.product &&
                                el?.product?.quantity === quantity) ||
                                (quantity > el?.product && el?.product?.quantity)
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleQuantityChange(
                                Number(quantity) + 1,
                                el?.product
                              )
                            }
                          >
                            <KeyboardArrowUpIcon />
                          </IconButton>
                        </InputAdornment>
                        <InputAdornment
                          position="end"
                          sx={{
                            position: 'absolute',
                            right: '0px',
                            top: '5px',
                          }}
                        >
                          <IconButton
                            aria-label="plus"
                            disabled={
                              quantity === 1 || quantity === 0 ? true : false
                            }
                            onClick={() =>
                              handleQuantityChange(
                                Number(quantity) - 1,
                                el?.product
                              )
                            }
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </InputAdornment>
                      </Box>
                    ),
                  }}
                  id="outlined-basic"
                  variant="outlined"
                  value={quantity}
                  defaultValue={quantity}
                  onChange={(e) =>
                    handleQuantityChange(e?.target?.value, el?.product)
                  }
                />
              </Box>
              <IconButton
                sx={{ padding: '0px', marginLeft: '8px' }}
                onClick={() => {
                  handleAddToCart(el);
                }}
                disabled={quantity == 0 ? true : false}
              >
                <img src={cart} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
export default WishlistCard;
