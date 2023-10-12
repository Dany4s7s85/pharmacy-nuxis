import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetail,
  getSameProductInventory,
  getInventoryByDetail,
  getSimilarProducts,
  addInventoryWishList,
  removeInventoryWishList,
} from "../../services/products";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import "./productDetail.scss";
import "../../modules/nexusLandingPage/nexus.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import "swiper/modules/navigation/navigation.min.css"; // Navigation module
import "swiper/modules/free-mode/free-mode.min.css"; // Pagination module
import "swiper/modules/thumbs/thumbs.min.css";
import ReactImageZoom from "react-image-zoom";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Chip, CircularProgress, OutlinedInput, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { addProducts, openDrawer } from "../../services/cart";
import { AuthContext } from "../../context/authContext";
import { setChoosenDetail, chatBoxOpen } from "../../services/chat";
import useDialogModal from "../../hooks/useDialogModal";
import StoreModal from "./StoreModal";
import ViewCard from "../viewCart/ViewCard";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const ProductDetail = () => {
  const { hasPermission, wishListCount, setWishListCount } =
    useContext(AuthContext);

  const [SelectStoreDialog, showStoreDialog, closeStoreDialog] =
    useDialogModal(StoreModal);

  const { conversations, recent_conversations, chosenChatDetails } =
    useSelector((state) => state?.chat);
  const { id, din } = useParams();
  const invtId = new URLSearchParams(useLocation().search).get("invt");

  const { user, user_permission } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const [convs, setConvs] = useState([]);
  const drawer = useSelector((state) => state?.cart?.drawer);
  const [detail, setDetail] = useState({});
  const [pricing, setPricing] = useState({});
  const [inventory, setInventory] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [businessId, setBusinessId] = useState("");
  const [showSeeMore, setShowSeeMore] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const [filterValue, setFilterValue] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [squantity, setSQuantity] = useState(1);

  const dispatch = useDispatch();
  const response = useSelector(
    (state) => state?.product?.productDetail?.response
  );

  const productInventoryByDetailLoading = useSelector(
    (state) => state?.product?.productInventoryByDetail?.loading
  );

  const productDetailLoading = useSelector(
    (state) => state?.product?.productDetail?.loading
  );

  const similarProductsLoading = useSelector(
    (state) => state?.product?.similarProducts?.loading
  );

  useEffect(() => {
    setQuantity(1);
    if (invtId) {
      dispatch(
        getInventoryByDetail(invtId, filterValue, function (response) {
          if (response?.data) {
            setDetail(response?.data);
            setPricing(response?.data?.stock[0]);
            setImageUrl(response?.data?.imageCover?.full_image);
          }
        })
      );
    } else {
      dispatch(
        getProductDetail(id, function (response) {
          if (response?.data?.length > 0) {
            setDetail(response?.data[0]);
            setPricing(response?.data[0]?.stock[0]);
            setImageUrl(response?.data[0]?.imageCover?.full_image);
          }
        })
      );
    }

    dispatch(
      getSameProductInventory(din, filterValue, function (response) {
        if (response?.data?.inventories?.length > 0) {
          setInventory(response?.data?.inventories[0]?.data);
        }
      })
    );

    dispatch(
      getSimilarProducts(id, function (response) {
        if (response?.data?.length > 0) {
          setSimilarProducts(response?.data[0]?.data);
        }
      })
    );
  }, [dispatch, id, din, filterValue]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [count]);

  useEffect(() => {
    setConvs(conversations);
  });

  const props = {
    width: 250,
    height: 350,
    zoomWidth: 500,
    objectFit: "cover",
    img: imageUrl,
  };

  useEffect(() => {
    if (user?._id) {
      setBusinessId(
        user?.role == "super_admin" ? user.id : user?.business?._id
      );
    }
  }, [user]);

  const filters = [
    {
      label: "High to Low Expiry Date",
      value: "expirydesc",
    },
    {
      label: "Low to High Expiry Date",
      value: "expiryasc",
    },
    {
      label: "High to Low Price",
      value: "pricedesc",
    },
    {
      label: "Low to High Price",
      value: "priceasc",
    },
  ];

  const columns = [
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      width: 120,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="inherit" className="rowText">
              {moment(params.row?.expiry_date).format("DD-MM-YYYY")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "store_name",
      headerName: "Store ID",
      width: 130,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="inherit" className="rowText">
              {params.row?.store[0]?.uuid}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "quantity",
      headerName: "Quantity",
      width: 130,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="inherit" className="rowText">
              {formatNumberWithCommas(params.row?.quantity)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      renderCell: (params) => {
        {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography className="rowText">
                {!inventory
                  ? "N/A"
                  : `$${
                      params?.row && params?.row?.discountedPrice
                        ? parseFloat(
                            Number(
                              params?.row?.discountedPrice?.discountedPrice
                            )
                          ).toFixed(2)
                        : parseFloat(Number(params?.row?.price)).toFixed(2)
                    }`}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {params?.row &&
                params?.row?.discount &&
                params?.row?.discount?.isAutomatedDiscountApplied &&
                params?.row?.discountedPrice?.discountPercentage != "0%" ? (
                  <>
                    <Typography className="rowText">
                      <del
                        style={{
                          color: "#333",
                          fontWeight: "300",
                          fontSize: "12px",
                        }}
                      >
                        ${params.row.price}
                      </del>
                    </Typography>
                    <Typography
                      sx={{ marginLeft: "5px", fontSize: "12px" }}
                      className="rowText"
                    >
                      {params?.row?.discountedPrice?.discountPercentage}
                    </Typography>
                  </>
                ) : (
                  ""
                )}
              </Box>
            </Box>
          );
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => {
        {
          return (
            <Box>
              {params?.row._id ? (
                <IconButton
                  variant="contained"
                  onClick={() => {
                    navigate(
                      `/products/${params?.row?.product[0]._id}/${params.row?.product[0]?.DRUG_IDENTIFICATION_NUMBER}`
                    );
                    setCount((pre) => pre + 1);
                  }}
                >
                  <ViewHeadlineOutlinedIcon />
                </IconButton>
              ) : null}
            </Box>
          );
        }
      },
    },
  ];

  const showHideSeeMore = () => {
    setShowSeeMore(!showSeeMore);
  };

  const handleQuantityChange = (value) => {
    // value = value < 1 ? null : value;
    let inventoryCount =
      detail?.stock && detail?.stock && detail?.stock?.length
        ? detail?.stock[0]?.quantity
        : 0;
    if (value > inventoryCount) {
      toast.error(`Max available stock is ${inventoryCount} `);
      return;
    } else {
      setQuantity(value);
    }
  };
  const handleSimilarlQuantityChange = (value) => {
    // value = value < 1 ? null : value;
    let inventoryCount =
      detail?.stock && detail?.stock && detail?.stock?.length
        ? detail?.stock[0]?.quantity
        : 0;
    if (value > inventoryCount) {
      toast.error(`Max available stock is ${inventoryCount} `);
      return;
    } else {
      setSQuantity(value);
    }
  };

  const handleAddToCart = () => {
    let products = [];
    let product =
      detail?.stock &&
      detail?.stock &&
      detail?.stock?.length &&
      detail?.stock[0];

    if (!user.store) {
      toast.error(`Please select store to buy `);
      return;
    }

    product = {
      ...product,
      imageCover: detail?.imageCover,
      product_name: detail?.product_name,
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
        (el) => el?._id == product?._id && user?.store?._id == el?.for?._id
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
      dispatch(addProducts(products));
      if (productIndex > -1) {
        toast.success(`Cart updated successfully`);
        dispatch(openDrawer(true));
      } else {
        dispatch(openDrawer(true));
      }
    }
  };

  const handleChat = (detail) => {
    let data = {
      product: {
        _id: detail?._id,
        product_name: detail?.product_name,
        store: detail?.store[0]?._id,
        imageCover: detail?.imageCover ? detail?.imageCover : null,
      },
      role: user?.role,
      initBy: user?.store,
      author: user?.store?._id,
      authorName: detail?.store[0]?.store_name,
      receiver: detail?.store[0]?._id,
      receiverName: detail?.store[0]?.store_name,
      productAuthor: detail?.store[0],
      via: "detail",
    };
    dispatch(chatBoxOpen(true));
    dispatch(setChoosenDetail(data));
  };

  const handleAddInventoryToWishList = (inventoryId) => {
    if (inventoryId) {
      dispatch(
        addInventoryWishList({ productId: inventoryId }, function (response) {
          if (response?.status == "success") {
            setWishListCount(wishListCount + 1);
            setDetail({
              ...detail,
              stock: [{ ...detail?.stock[0], isMarkedFavourite: true }],
            });
          }
        })
      );
    }
  };

  const handleRemoveInventoryToWishList = (inventoryId) => {
    if (inventoryId) {
      dispatch(
        removeInventoryWishList(inventoryId, function (response) {
          if (response?.status == "success") {
            setWishListCount(wishListCount - 1);
            setDetail({
              ...detail,
              stock: [{ ...detail?.stock[0], isMarkedFavourite: false }],
            });
          }
        })
      );
    }
  };

  return (
    <>
      {productDetailLoading || productInventoryByDetailLoading ? (
        <Box
          sx={{
            height: "20vh",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: " #235D5E" }} />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3}>
            <>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{ overflow: "visible" }}
                  className="new-product-detail"
                >
                  <CardContent
                    sx={{ padding: "0", paddingBottom: "0 !important" }}
                  >
                    <Box display="flex" justifyContent="center">
                      {imageUrl ? <ReactImageZoom {...props} /> : null}
                    </Box>
                    <Box
                      sx={{
                        marginTop: "10px",
                        textAlign: "center",
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          setImageUrl(detail?.imageCover?.full_image)
                        }
                        sx={{
                          img: {
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                            width: { xs: "64px", sm: "100px" },
                            height: { xs: "64px", sm: "100px" },
                            objectFit: "cover",
                          },
                        }}
                      >
                        {detail?.imageCover &&
                        detail?.imageCover?.full_image &&
                        detail?.imageCover?.full_image ? (
                          <img src={detail?.imageCover?.full_image} />
                        ) : (
                          <Box className="cusCardProductName">
                            <Typography>{detail?.product_name}</Typography>
                          </Box>
                        )}
                      </IconButton>
                      {detail?.images &&
                        detail?.images.length > 0 &&
                        detail?.images?.map((img) => {
                          return (
                            img?.full_image && (
                              <IconButton
                                aria-label="delete"
                                onClick={() => setImageUrl(img?.full_image)}
                                sx={{
                                  img: {
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                    width: { xs: "64px", sm: "100px" },
                                    height: { xs: "64px", sm: "100px" },
                                    objectFit: "cover",
                                  },
                                }}
                              >
                                <img src={img?.full_image} />
                              </IconButton>
                            )
                          );
                        })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Tooltip title={detail?.product_name}>
                  <Typography
                    sx={{
                      fontSize: { xs: "20px", sm: "30px" },
                      fontWeight: "700",
                      color: "#101828",
                      width: "100%",
                    }}
                    className="text-ellipses"
                  >
                    {detail?.product_name}
                  </Typography>
                </Tooltip>
                <Box display="flex" my={2}>
                  <Box display="flex" alignItems="center" sx={{ flex: "1" }}>
                    <Typography className="detail-heading" mr={1}>
                      Store ID:
                    </Typography>
                    <Typography className="detail-heading-ans text-ellipses">
                      {detail?.store &&
                        detail?.store?.length > 0 &&
                        detail?.store[0]?.uuid}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" my={2}>
                  <Box
                    sx={{ display: "flex", flex: "0.5", alignItems: "center" }}
                  >
                    <Typography className="detail-heading" mr={1}>
                      DIN No:
                    </Typography>
                    <Typography className="detail-heading-ans text-ellipses">
                      {detail?.DRUG_IDENTIFICATION_NUMBER}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{ display: "flex", flex: "1.5", alignItems: "center" }}
                >
                  <Typography className="detail-heading" mr={1}>
                    Brand:
                  </Typography>
                  <Typography className="detail-heading-ans text-ellipses">
                    {detail?.brand}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flex: "1",
                    alignItems: "center",
                  }}
                  my={2}
                >
                  <Typography className="detail-heading" mr={1}>
                    Category:
                  </Typography>
                  <Typography className="detail-heading-ans text-ellipses">
                    {detail?.PRODUCT_CATEGORIZATION}
                  </Typography>
                </Box>
                <Box display="flex" my={2} alignItems="center">
                  <Box
                    sx={{ display: "flex", flex: "1", alignItems: "center" }}
                  >
                    <Typography
                      className="detail-heading"
                      mr={1}
                      variant="subtitle2"
                    >
                      Stock:
                    </Typography>
                    <Typography className="detail-heading-ans text-ellipses">
                      {detail?.stock && detail?.stock?.length > 0
                        ? `${
                            detail?.stock &&
                            detail?.stock?.length > 0 &&
                            formatNumberWithCommas(detail?.stock[0]?.quantity)
                          } packs avilabale`
                        : "packs are unavilable"}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" my={2} alignItems="center">
                  <Box
                    sx={{ display: "flex", flex: "1", alignItems: "center" }}
                  >
                    <Typography className="detail-heading" mr={1}>
                      Expiry Date:
                    </Typography>
                    <Typography className="detail-heading-ans text-ellipses">
                      {`${moment(
                        detail?.stock &&
                          detail?.stock?.length > 0 &&
                          detail?.stock[0]?.expiry_date
                      ).format("DD-MM-YYYY")}`}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: { xs: "contents", sm: "flex" },
                    alignItems: "center",
                  }}
                  my={2}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: { xs: "5px", sm: "0px" },
                    }}
                    pr={3}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography className="detail-heading" mr={1}>
                        Price:
                      </Typography>
                      <Typography
                        sx={{
                          color: "#101828",
                          fontSize: "24px",
                          fontWeight: "700",
                        }}
                        className="text-ellipses"
                      >
                        {!pricing
                          ? "N/A"
                          : `$${
                              pricing && pricing?.discountedPrice
                                ? formatNumberWithCommas(
                                    parseFloat(
                                      Number(
                                        pricing?.discountedPrice
                                          ?.discountedPrice
                                      )
                                    ).toFixed(2)
                                  )
                                : formatNumberWithCommas(
                                    parseFloat(Number(pricing?.price)).toFixed(
                                      2
                                    )
                                  )
                            }`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", paddingLeft: "25px" }}>
                      {pricing &&
                      pricing?.discount &&
                      pricing?.discount?.isAutomatedDiscountApplied &&
                      pricing?.discountedPrice?.discountPercentage != "0%" ? (
                        <>
                          <Typography>
                            <del
                              style={{
                                color: "#333",
                                fontWeight: "300",
                                fontSize: "16px",
                              }}
                            >
                              ${pricing?.price}
                            </del>
                          </Typography>
                          <Typography sx={{ marginLeft: "10px" }}>
                            {pricing?.discountedPrice?.discountPercentage}
                          </Typography>
                        </>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: { xs: "10px", sm: "0px" },
                    }}
                  >
                    {detail &&
                    detail?.store &&
                    detail?.store?.length &&
                    detail?.store[0]?.city != user?.store?.city ? null : (
                      <>
                        <Typography className="detail-heading" mr={1}>
                          Quantity:
                        </Typography>
                        <TextField
                          className="detail-counter"
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton
                                  aria-label="plus"
                                  disabled={
                                    quantity === 1 || quantity === 0
                                      ? true
                                      : false
                                  }
                                  onClick={() =>
                                    handleQuantityChange(Number(quantity) - 1)
                                  }
                                >
                                  <RemoveIcon sx={{ color: "#878B93" }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="plus"
                                  onClick={() =>
                                    handleQuantityChange(Number(quantity) + 1)
                                  }
                                  disabled={
                                    (detail?.stock &&
                                      detail?.stock?.length > 0 &&
                                      detail?.stock[0]?.quantity ===
                                        quantity) ||
                                    (quantity > detail?.stock &&
                                      detail?.stock?.length > 0 &&
                                      detail?.stock[0]?.quantity)
                                      ? true
                                      : false
                                  }
                                >
                                  <AddIcon sx={{ color: "#878B93" }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          id="outlined-basic"
                          variant="outlined"
                          value={quantity}
                          defaultValue={quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          // disabled={quantity < 1 ? true : false}
                        />
                      </>
                    )}
                  </Box>
                </Box>
                {detail?.stock && detail?.stock?.length === 0 ? (
                  <Typography variant="h5" gutterBottom>
                    Out of Stock
                  </Typography>
                ) : (
                  <>
                    {user && user._id ? (
                      <>
                        {user?.store?.id ? (
                          <>
                            {user_permission &&
                            user_permission?.response &&
                            user_permission?.response?.permissions &&
                            user_permission?.response?.permissions?.length >
                              0 &&
                            !hasPermission("store.purchasing") ? (
                              <Button
                                className="containedPrimary"
                                variant="contained"
                              >
                                Sorry You Dont have Permission
                              </Button>
                            ) : (
                              <>
                                {detail &&
                                detail?.store &&
                                detail?.store?.length &&
                                detail?.store[0]?.city != user?.store?.city ? (
                                  <Chip
                                    sx={{ fontSize: "16px" }}
                                    label={
                                      "This product does not belong to your selected store city."
                                    }
                                    size="large"
                                    color="error"
                                  />
                                ) : (
                                  <>
                                    {detail &&
                                    detail?.store &&
                                    detail?.store?.length &&
                                    detail?.store[0]?.business == businessId ? (
                                      <Button
                                        className="containedPrimary"
                                        variant="contained"
                                      >
                                        You can not buy from owned stores
                                      </Button>
                                    ) : (
                                      <Button
                                        className="containedPrimary"
                                        variant="contained"
                                        sx={{
                                          fontSize: "12px !important",
                                          padding: {
                                            xs: "10px 15px !important",
                                            sm: "14px 20px !important",
                                          },
                                          marginBottom: "5px",
                                          marginRight: "15px",
                                        }}
                                        onClick={handleAddToCart}
                                        disabled={quantity <= 0 ? true : false}
                                      >
                                        Add to Cart
                                      </Button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              className="containedPrimary"
                              variant="contained"
                              // onClick={() =>
                              //   navigate("/bus/stores", {
                              //     state: `/products/${id}/${din}`,
                              //   })
                              // }
                              onClick={() => showStoreDialog()}
                            >
                              Select Store For Buying
                            </Button>
                            <SelectStoreDialog />
                          </>
                        )}
                      </>
                    ) : (
                      <Button
                        className="containedPrimary"
                        variant="contained"
                        onClick={() =>
                          navigate("/login", {
                            state: `/products/${id}/${din}`,
                          })
                        }
                      >
                        Login to Add Cart
                      </Button>
                    )}
                  </>
                )}

                {detail &&
                detail?.store &&
                detail?.store?.length &&
                detail?.store[0]?.city != user?.store?.city ? null : (
                  <>
                    {user &&
                    user?._id &&
                    detail &&
                    detail?.store &&
                    detail?.store?.length &&
                    detail?.store[0]?.business != businessId ? (
                      <>
                        {user?.store?.id ? (
                          <Button
                            className="containedWhite"
                            variant="contained"
                            size="medium"
                            sx={{
                              padding: {
                                xs: "10px 15px !important",
                                sm: "14px 20px !important",
                              },
                              marginBottom: "5px",
                              marginRight: "15px",
                              border: "1px solid #E8E8E8 !important",
                              boxShadow:
                                "0px 1px 1px rgba(0, 0, 0, 0.06)!important",
                              borderRadius: "8px !important",
                            }}
                            onClick={() => handleChat(detail)}
                          >
                            Send Message
                          </Button>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {detail &&
                detail?.store &&
                detail?.store?.length &&
                detail?.store[0]?.business == businessId ? null : (
                  <>
                    {detail &&
                    detail?.store &&
                    detail?.store?.length &&
                    detail?.store[0]?.city != user?.store?.city ? null : (
                      <>
                        {detail?.stock && detail?.stock?.length > 0 ? (
                          detail?.stock[0]?.isMarkedFavourite == true ? (
                            <Button
                              className="containedWhite"
                              variant="contained"
                              sx={{
                                padding: {
                                  xs: "10px 15px !important",
                                  sm: "14px 20px !important",
                                },
                                marginBottom: "5px",
                                marginRight: "15px",
                                border: "1px solid #E8E8E8 !important",
                                boxShadow:
                                  "0px 1px 1px rgba(0, 0, 0, 0.06)!important",
                                borderRadius: "8px !important",
                              }}
                              size="medium"
                              startIcon={<FavoriteIcon />}
                              onClick={() => {
                                handleRemoveInventoryToWishList(
                                  detail?.stock[0]?._id
                                );
                              }}
                            >
                              Remove from my Wishlist
                            </Button>
                          ) : (
                            <Button
                              sx={{
                                padding: {
                                  xs: "10px 15px !important",
                                  sm: "14px 20px !important",
                                },
                                marginBottom: "5px",
                                border: "1px solid #E8E8E8 !important",
                                boxShadow:
                                  "0px 1px 1px rgba(0, 0, 0, 0.06)!important",
                                borderRadius: "8px !important",
                              }}
                              className="containedWhite"
                              variant="contained"
                              size="medium"
                              startIcon={<FavoriteBorderIcon />}
                              onClick={() => {
                                handleAddInventoryToWishList(
                                  detail?.stock[0]?._id
                                );
                              }}
                            >
                              Add to my Wishlist
                            </Button>
                          )
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </Grid>
            </>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography className="ing-heading" gutterBottom>
                Ingredients
              </Typography>
              {detail?.ingredients?.map((ing) => {
                return (
                  <Typography
                    component="span"
                    className="prod-ing-info ing-ans"
                    gutterBottom
                  >
                    {`${ing.INGREDIENT}`}
                  </Typography>
                );
              })}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography className="ing-heading" gutterBottom>
                Product Detail
              </Typography>
              <Box
                className={
                  showSeeMore
                    ? "channel-Halfdescription"
                    : "channel-Fulldescription"
                }
              >
                {detail && detail?.description}
              </Box>
              <Box className="channel-showMore" onClick={showHideSeeMore}>
                {detail?.description?.length > 124
                  ? showSeeMore
                    ? "Read Less"
                    : "Read More"
                  : null}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  display: { xs: "contents", sm: "flex" },
                  alignItems: "center",
                }}
              >
                <Typography flex="1" className="ing-heading">
                  Also Available In
                </Typography>
                <Select
                  className="membersSelectDetail"
                  id="demo-simple-select"
                  name="sort_by"
                  input={<OutlinedInput notched={false} />}
                  labelId="demo-simple-select-label"
                  label="Sort by"
                  sx={{ width: "auto !important" }}
                  value={filterValue ? filterValue : filters[0]?.value}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  {filters.map((filter) => {
                    return (
                      <MenuItem value={filter?.value}>{filter?.label}</MenuItem>
                    );
                  })}
                </Select>
              </Box>
              <Box style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={inventory ? inventory : []}
                  className="table-header"
                  rowHeight={60}
                  getRowId={(row) => row._id}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  onRowClick={(el) => {
                    setCount((pre) => pre + 1);
                    navigate(
                      `/products/${el?.row?.product[0]?._id}/${el?.row?.product[0]?.DRUG_IDENTIFICATION_NUMBER}?invt=${el?.id}`
                    );
                    dispatch(
                      getInventoryByDetail(
                        el?.id,
                        filterValue,
                        function (response) {
                          if (response?.data) {
                            setDetail(response?.data);
                            setPricing(response?.data?.stock[0]);
                            setImageUrl(response?.data?.imageCover?.full_image);
                          }
                        }
                      )
                    );
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {!productDetailLoading ? (
                <>
                  {detail &&
                  detail?.stock &&
                  detail?.stock[0] &&
                  detail?.stock[0]?.faqs &&
                  detail?.stock[0]?.faqs?.length ? (
                    <>
                      <Typography className="ing-heading">FAQ</Typography>
                      {detail?.stock[0]?.faqs?.map((el) => {
                        return (
                          <Accordion className="accordian-primary-new">
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>{el?.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>{el?.answer}</Typography>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Typography className="ing-heading">FAQ</Typography>
                      <Accordion className="accordian-new accordian-primary-new">
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography> Precautions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography className="faq-detail">
                            If you are allergic to any of the ingredients of
                            Motilium, you should avoid taking it and inform your
                            doctor. You must consult your doctor if you have any
                            pre-existing medical conditions including pituitary
                            gland diseases (brain tumor), stomach or duodenal
                            ulcer, kidney or liver disease or disorders, blocked
                            gut (from conditions such a fecal impaction),
                            perforated gut, any other bowel conditions, hernia
                            or regular stomach cramps that occur for more than
                            14 days. You must consult your doctor if you are
                            taking any other medications as they may interact
                            with Motilium, including antifungal medication,
                            antibiotics, MAO inhibitors, HIV/AIDs medication,
                            antidepressants or any other medication for bowel
                            and digestive disorders. It is important that you
                            inform your doctor if you are pregnant, planning to
                            conceive or breastfeeding as Motilium may cause harm
                            to unborn and new born babies, and can pass to
                            babies through breast milk.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion className="accordian-new accordian-primary-new">
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography> Side Effects</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            As with any drug, there may be side effects from
                            taking Motilium including headache, constipation,
                            diarrhea, decrease in appetite, abdominal cramps,
                            dry mouth, dizziness, heartburn, insomnia and some
                            hormonal changes such as breast enlargement or
                            tenderness and irregular menstrual periods. More
                            serious side effects may include change in
                            urination, severe dizziness and difficulty
                            balancing, muscle cramps, changes in heartbeat and
                            allergic reactions which may include itching,
                            swelling of the mouth, throat and lips and
                            difficulty breathing. If you experience any side
                            effects you must seek medical attention immediately
                            for safety
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion className="accordian-new accordian-primary-new">
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography> Directions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            You should follow the instructions of the doctor who
                            prescribed Motilium to you. Directions and dosage
                            information can also be found on the pack or leaflet
                            inside the pack. Motilium comes in tablet form. You
                            should swallow Motilium whole with a glass of water.
                            Motilium can be taken with or without food. Motilium
                            should be stored at room temperature away from
                            direct sunlight and heat. Domperidone may be
                            associated with a small increased risk of serious
                            ventricular arrhythmias or sudden cardiac death. A
                            higher risk was observed in patients: • older than
                            60 years of age; • using daily doses greater than 30
                            mg; • having predisposing factors for QT
                            prolongation including concomitant use of
                            QT-prolonging drugs or CYP 3A4 inhibitors. •
                            Domperidone is now contraindicated in patients: •
                            with prolongation of cardiac conduction intervals,
                            particularly QT; • with significant electrolyte
                            disturbances; • with cardiac disease (such as
                            congestive heart failure); • with moderate or severe
                            liver impairment; • receiving QT-prolonging drugs
                            and potent CYP3A4 inhibitors. Domperidone should be
                            used at the lowest effective dose to a maximum
                            recommended daily dose of 30 mg and for the shortest
                            possible duration.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                </>
              ) : null}
            </Grid>
          </Grid>
          <Box
            className="carousel-container"
            style={{ marginTop: "30px", color: "#494949" }}
          >
            {similarProducts.length > 0 ? (
              <Box
                my={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography className="ing-heading">
                  Similar Products
                </Typography>
                <Button
                  className="outlined-grey"
                  variant="outlined"
                  onClick={() => navigate("/productlisting")}
                  sx={{
                    padding: {
                      xs: "5px 12px !important",
                      sm: "10px 28px !important",
                    },
                    fontSize: { xs: "12px !important", sm: "14px !important" },
                  }}
                >
                  Explore All
                </Button>
              </Box>
            ) : (
              ""
            )}

            {similarProductsLoading ? (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress sx={{ color: " #235D5E" }} />
              </Box>
            ) : (
              <Swiper
                spaceBetween={15}
                slidesPerGroup={4}
                rewind={true}
                autoHeight={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  576: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                  },
                  768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                  },
                  1199: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                  },
                }}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper"
              >
                {similarProducts?.map((product) => {
                  return (
                    <SwiperSlide>
                      <ViewCard el={product} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProductDetail;
