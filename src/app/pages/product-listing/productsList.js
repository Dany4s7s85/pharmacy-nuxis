import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cart from '../../assets/images/cart.svg';
import '../../modules/nexusLandingPage/nexus.scss';
const ProductLists = ({ prod, listBulleted }) => {
  const history = useNavigate();
  const location = useLocation();
  const isWishlistPage = location?.pathname?.includes('/wishlist');

  return (
    <>
      {!listBulleted && (
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
        >
          <Card className="product-card">
            <Box
              sx={{
                position: 'absolute',
                right: '8px',
                top: '8px',
              }}
            ></Box>
            <Box
              display="flex"
              className="carousel-img-container"
              justifyContent="center"
              onClick={() =>
                history(
                  `/products/${prod?._id}/${prod?.DRUG_IDENTIFICATION_NUMBER}`
                )
              }
            >
              {prod?.imageCover &&
                prod?.imageCover?.full_image &&
                prod?.imageCover?.full_image ? (
                <img
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                  src={prod?.imageCover?.full_image}
                />
              ) : (
                <Box className="cusCardProductName">
                  <Typography>{prod?.product_name}</Typography>
                </Box>
              )}
            </Box>
            <CardContent
              className="Content"
              sx={{ padding: '0px !important' }}
            >
              <Box
                display="flex"
                mt={1}
                alignItems="center"
              >
                <Typography
                  className="text-ellipses latest-product-text"
                  variant="body1"
                  sx={{
                    fontSize: '16px',
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {prod?.product_name}
                </Typography>
                <Typography
                  className="latest-product-text"
                  variant="body1"
                  sx={{
                    fontSize: '16px',
                    display: { xs: "block", sm: "none" },
                    height: "44px",
                    overflow: "hidden"
                  }}
                >
                  {prod?.product_name}
                </Typography>
              </Box>

              <Box
                display="flex"
                mt={1}
                alignItems="center"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Typography
                  variant="subtitle2"
                  mr={1}
                  className="latest-product-subtext text-ellipses "
                >
                  Store id: {prod?.store[0]?.uuid}
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                mt={1}
              >
                <Typography
                  variant="subtitle1"
                  className="latest-product-subtext text-ellipses"
                >
                  {prod?.product[0]?.quantity} packs avialable
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Box
                  mt={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: '500',
                      fontSize: '16px !important',
                    }}
                    className="price"
                  >
                    {prod?.total > 0
                      ? `${!prod?.inventory
                        ? 'N/A'
                        : `$${prod?.inventory &&
                          prod?.inventory?.discountedPrice
                          ? parseFloat(
                            Number(
                              prod?.inventory?.discountedPrice
                                ?.discountedPrice
                            )
                          ).toFixed(2)
                          : parseFloat(
                            Number(prod?.inventory?.price)
                          ).toFixed(2)
                        }`
                      }`
                      : 'Out Of Stock'}
                  </Typography>

                  <>
                    {prod?.inventory &&
                      prod?.inventory?.discount &&
                      prod?.inventory?.discount?.isAutomatedDiscountApplied &&
                      prod?.inventory?.discountedPrice?.discountPercentage !=
                      '0%' ? (
                      <>

                        <del
                          style={{
                            marginLeft: '8px',
                            color: '#9fa1a3',
                            fontSize: '14px',
                          }}
                        >
                          ${prod?.inventory?.price}
                        </del>

                      </>
                    ) : (
                      ''
                    )}
                  </>
                </Box>

                {isWishlistPage && (
                  <Box pt={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flex: '1.5',
                        alignItems: 'center',
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
                                >
                                  <ExpandMoreIcon sx={{ color: '#70747E' }} />
                                </IconButton>
                              </Box>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box pt={3}>
                                <IconButton
                                  aria-label="plus"
                                >
                                  <KeyboardArrowUpIcon
                                    sx={{ color: '#70747E' }}
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
                    <Box ml={1}>
                      <IconButton
                        sx={{ padding: '0px' }}
                      >
                        <img src={cart} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {listBulleted && (
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{ padding: "15px 5px 0px 5px" }}
          onClick={() =>
            history(
              `/products/${prod?._id}/${prod?.DRUG_IDENTIFICATION_NUMBER}`
            )
          }
        >
          <Box
            sx={{
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0px 0px 7px 1px rgb(115 102 255 / 12%)',
              cursor: 'pointer',
            }}
          >
            <Box display="flex">
              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  backgroundColor: '#d8dde1',
                  width: '100%',
                  minWidth: '200px',
                  maxWidth: '280px',
                }}
              >
                {prod?.imageCover &&
                  prod?.imageCover?.full_image &&
                  prod?.imageCover?.full_image ? (
                  <img
                    style={{
                      width: '100%',
                      maxWidth: '280px',
                      minWidth: '200px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      alignSelf: 'center',
                    }}
                    src={prod?.imageCover?.full_image}
                  />
                ) : (
                  <Box
                    className="cusCardProductName"
                    sx={{ alignSelf: 'center' }}
                  >
                    <Typography>{prod?.product_name}</Typography>
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                sx={{ padding: '0 1rem 1rem 1rem', width: '100%' }}
              >
                <Box>
                  <Box display="flex" mt={2} alignItems="center">
                    <Typography variant="subtitle1">
                      {prod?.product_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography
                      className="label-color"
                      mr={1}
                      variant="subtitle2"
                    >
                      Avail Stock:
                    </Typography>
                    <Typography variant="subtitle1">
                      {prod?.product[0]?.quantity} packs
                    </Typography>
                  </Box>
                  <Box display="flex" mt={1} alignItems="center">
                    <Typography
                      variant="subtitle2"
                      mr={1}
                      className="label-color"
                    >
                      Store id:
                    </Typography>
                    <Typography variant="subtitle1">
                      {prod?.store[0]?.uuid}
                    </Typography>
                  </Box>
                </Box>
                <Box mt={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    alignSelf="flex-start"
                  >
                    <Typography
                      className="label-color"
                      mr={1}
                      variant="subtitle2"
                    >
                      Price:
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: '500',
                        fontSize: '18px',
                      }}
                      className="price"
                    >
                      {prod?.total > 0
                        ? `${!prod?.inventory
                          ? 'N/A'
                          : `$${prod?.inventory &&
                            prod?.inventory?.discountedPrice
                            ? parseFloat(
                              Number(
                                prod?.inventory?.discountedPrice
                                  ?.discountedPrice
                              )
                            ).toFixed(2)
                            : parseFloat(
                              Number(prod?.inventory?.price)
                            ).toFixed(2)
                          }`
                        }`
                        : 'Out Of Stock'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    {prod?.inventory &&
                      prod?.inventory?.discount &&
                      prod?.inventory?.discount?.isAutomatedDiscountApplied &&
                      prod?.inventory?.discountedPrice?.discountPercentage !=
                      '0%' ? (
                      <>
                        <Typography
                          className="label-color"
                          variant="subtitle2"
                        // sx={{ marginRight: "5px" }}
                        >
                          <del
                            style={{
                              color: '#9fa1a3',
                              fontSize: '14px',
                            }}
                          >
                            ${prod?.inventory?.price}
                          </del>
                        </Typography>
                        <Typography
                          className="label-color"
                          variant="subtitle2"
                          sx={{ fontSize: '14px', marginLeft: '5px' }}
                        >
                          {prod?.inventory?.discountedPrice?.discountPercentage}
                        </Typography>
                      </>
                    ) : (
                      ''
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ProductLists;
