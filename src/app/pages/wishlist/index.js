import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Grid, CircularProgress, Typography, Container } from '@mui/material';
import { getInventoryWishLists } from '../../services/products';
import { useDispatch } from 'react-redux';
import WishlistCard from './wishlistCard';
import { AuthContext } from '../../context/authContext';

const Wishlist = () => {
  const dispatch = useDispatch();
  const [inventoryWishListsLoading, setinventoryWishListsLoading] =
    useState(false);
  const [wishlists, setWishlists] = useState([]);
  const { wishListCount, setWishListCount } = useContext(AuthContext);

  useEffect(() => {
    setinventoryWishListsLoading(true);
    dispatch(
      getInventoryWishLists(
        function (response) {
          setinventoryWishListsLoading(false);
          if (response?.data?.wishlist?.length > 0) {
            let tempWish = response?.data?.wishlist.map((el) => {
              return {
                ...el,
                product: { ...el.product, isMarkedFavourite: true },
              };
            });
            setWishlists(tempWish);
          }
        },
        function (err) {
          setinventoryWishListsLoading(false);
        }
      )
    );
  }, []);

  return (
    <Container>
      <Typography
        color={'#000000'}
        fontSize={{ lg: 30, md: 30, sm: 28, xs: 24 }}
        fontWeight={500}
      >
        Wishlist
      </Typography>
      <Grid container spacing={3}>
        {inventoryWishListsLoading ? (
          <Box m="auto">
            <CircularProgress sx={{ color: ' #235D5E' }} />
          </Box>
        ) : (
          <>
            {wishlists && wishlists && wishlists?.length > 0 ? (
              wishlists?.map((el, index) => {
                return (
                  el?.product?.isMarkedFavourite && (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <WishlistCard
                        i={index}
                        key={index}
                        el={el}
                        wishlists={wishlists}
                        setWishlists={setWishlists}
                      />
                    </Grid>
                  )
                );
              })
            ) : (
              <Box
                sx={{
                  height: "200px",
                  alignItems: "center",
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "fit-content"
                }}
              >
                No wishlist are available!</Box>
            )}
          </>
        )}
        {wishlists?.length > 0 && wishListCount == 0 && (
          <Box
            sx={{
              height: "200px",
              alignItems: "center",
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content"
            }}
          >
            No wishlist are available!</Box>
        )}
      </Grid>
    </Container>
  );
};
export default Wishlist;
