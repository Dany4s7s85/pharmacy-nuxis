import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import { useLocation, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import debounce from "lodash.debounce";
import "./header.scss";
import { resetStore } from "../../../services/auth";
import searchIcon from "../../../assets/images/searchIcon.svg";
import {
  getBusinessNotification,
  getCurrentUserPharmacies,
  getCurrentUserPharmacyPermissions,
  getPharmToken,
  logout,
  pharmacyLoginSuccess,
  updateBusinessNotification,
  updateSession,
} from "../../../services/BAuth";
import { getSearchProducts } from "../../../services/products";
import { useDispatch, useSelector } from "react-redux";
import nxusLogo from "../../../assets/images/newLogo.svg";
import moment from "moment";
import { activeLink, openDrawer } from "../../../services/cart";
import Avatar from "@mui/material/Avatar";
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  IconButton,
  MenuList,
} from "@mui/material";
import { setCookie } from "../../../helpers/common";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socketContext";
import CircularProgress from "@mui/material/CircularProgress";
import ConversationChatModal from "../ConversationModal";
import NotificationSound from "../../../assets/notificationSound/notification.wav";
import CartBasket from "../../../assets/images/cart-basket.svg";
import OpenEyeIcon from "../../../assets/images/open-eye.svg";
import chatMessage from "../../../assets/images/chat-message.svg";
import NoftificationBell from "../../../assets/images/notificationBell.svg";
import WatchListIcon from "../../../assets/images/watchListIcon.svg";
import {
  setChoosenDetail,
  setConversations,
  setRecentConversations,
  chatBoxOpen,
} from "../../../services/chat";
import Autocomplete from "@mui/material/Autocomplete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  capitalize,
  redirectForPageURL,
  removeDuplicates,
} from "../../../helpers/formatting";
import useDialogModal from "../../../hooks/useDialogModal";
import StoreModal from "../../../pages/productDetail/StoreModal";
import { ClipLoader } from "react-spinners";
import curl from "../../../assets/images/curl.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import manPlaceholder from "../../../assets/images/manPlaceholder.svg";
import ViewCartProduct from "../viewCartProduct";

const Header = ({ setOpen, open, props }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigate = useNavigate();

  const { user, isSessionExpired } = useSelector((state) => state?.auth);

  const searchLoading = useSelector(
    (state) => state?.product?.searchProducts?.loading
  );
  const [tabHasFocus, setTabHasFocus] = useState(true);
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [isProductPage, setIsProductPage] = useState(true);
  const [SelectStoreDialog, showStoreDialog] = useDialogModal(StoreModal);
  const audioPlayer = useRef(null);

  const setActiveLink = useSelector((state) => state?.cart?.activeLink);

  const { setPharmacyAllowedPages, wishListCount } = useContext(AuthContext);

  const { userSocket, storeSocket, setStoreSocketData, setUserSocketData } =
    useContext(SocketContext);

  const location = useLocation();
  const [pharmLoading, setPharmLoading] = useState(false);
  const [notifiLoading, setNotifiLoading] = useState(false);

  const pages = [
    {
      path: "Business",
      link: user && user?.email ? "/bus/dashboard" : "/login",
    },
    {
      path: "Shop",
      link: "/marketplace",
    },
  ];

  const presponse = useSelector(
    (state) => state?.auth.allowed_pharmacies?.response
  );

  const notiCountResponse = useSelector((state) => state?.auth?.notiCount);
  const [pharmacies, setPharmacies] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openChat, setOpenChat] = useState(false);

  const [chatCount, setChatCount] = useState(0);
  const { conversations } = useSelector((state) => state?.chat);
  const [highlightedValue, setHighlightedValue] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openNotification = Boolean(anchorEl);

  const [state, setState] = useState({
    notifications: [],
    count: null,
    unReadCount: null,
  });

  useEffect(() => {
    setCount((pre) => pre + 1);
  }, []);

  useEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (user && user?._id) {
      dispatch(
        getBusinessNotification(1, limit, function (res) {
          if (res?.status == "success") {
            setState({
              ...state,
              notifications: res?.data?.notifications,
              count: res?.data?.count,
              unReadCount: res?.data?.unReadCount,
            });
            setPage((prevState) => prevState + 1);
          }
        })
      );
    }
  }, [notiCountResponse]);

  useEffect(() => {
    const activePageLink = location?.pathname?.includes("marketplace")
      ? "/marketplace "
      : "/bus/dashboard";
    dispatch(activeLink(activePageLink));
  }, []);

  const fetchData = async () => {
    if (state?.notifications?.length == state?.count) {
      return false;
    } else {
      dispatch(
        getBusinessNotification(page, limit, function (res) {
          if (res?.status == "success") {
            setState({
              ...state,
              notifications: [
                ...state?.notifications,
                ...res?.data?.notifications,
              ],
              count: res?.data?.count,
              unReadCount: res?.data?.unReadCount,
            });
            setPage((prevState) => prevState + 1);
          }
        })
      );
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(
      updateBusinessNotification(function (res) {
        if (res) {
          setState({ ...state, unReadCount: 0 });
        }
      })
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isSessionExpired) {
      let action = "USER_LOGOUT";
      window.confirm("Session Expired, You can not  have multiple sessions!");
      dispatch(resetStore(action, history));
      dispatch(
        logout(function () {
          dispatch(updateSession(false));
        })
      );
      history("/login");
    }
  }, [isSessionExpired]);

  useEffect(() => {
    const handleFocus = () => {
      setTabHasFocus(true);
    };

    const handleBlur = () => {
      setTabHasFocus(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    if (
      (user?.email && user?.role == "super_admin") ||
      (user?.email && user?.is_verified)
    ) {
      dispatch(
        getCurrentUserPharmacies("", "", 1, 10, function (res) {
          if (res) {
          }
        })
      );
    }
  }, [user?.is_verified]);

  useEffect(() => {
    setPharmacies(presponse?.stores);
  }, [presponse]);

  useEffect(() => {
    if (conversations?.length) {
      let count = conversations.reduce((acc, curr) => {
        return curr?.unreadCount ? acc + 1 : acc + 0;
      }, 0);
      setChatCount(count);
      if (count > 0) {
        // if (!tabHasFocus) {
        //   (async () => {
        //     await audio.play();
        //   })();
        // }
      }
    } else {
      setChatCount(0);
    }
  }, [conversations]);

  const drawer = useSelector((state) => state?.cart?.drawer);
  const products = useSelector((state) => state?.cart?.products);
  const dispatch = useDispatch();
  const history = useNavigate();
  const handleLogin = () => {
    history("/login", { replace: true });
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleClickOpenChat = () => {
    setOpenChat(true);
    dispatch(chatBoxOpen(true));
  };

  const debouncedGetSearch = useCallback(
    debounce((query) => {
      query = query?.trim();

      if (query != "" && query?.length) {
        dispatch(
          getSearchProducts(query, function (res) {
            if (res?.status == "success") {
              let tempProducts = res?.data?.products;
              if (tempProducts?.length) {
                tempProducts = removeDuplicates(
                  tempProducts,
                  "DRUG_IDENTIFICATION_NUMBER"
                );
              }
              setSearchProducts(tempProducts);
            }
          })
        );
      }
    }, 1000),
    []
  );

  const searchText = (e, newValue) => {
    if (e == null || e == 0 || e.target.value == undefined) {
      setTerm(newValue);
      debouncedGetSearch(newValue);
    } else if (
      e.target.value == "" ||
      e.target.value == " " ||
      newValue == "" ||
      newValue == " "
    ) {
      setTerm("");
      debouncedGetSearch("");
    } else {
      setTerm(e.target.value);
      debouncedGetSearch(e.target.value);
    }
  };

  const searchSelected = (e, newValue) => {
    if (e == null || e == 0 || e.target.value == undefined) {
      setSelected(newValue);
      debouncedGetSearch(newValue);
    } else if (
      e.target.value == "" ||
      e.target.value == " " ||
      newValue == "" ||
      newValue == " "
    ) {
      setSelected("");
      debouncedGetSearch("");
    } else {
      setSelected(e.target.value);
      debouncedGetSearch(e.target.value);
    }
  };

  const handleChange = (event) => {
    if (event) {
      const { value } = event?.target;
      let id = pharmacies?.find((el) => el.store_name == value)?.id;
      setPharmLoading(true);
      if (id) {
        dispatch(
          getPharmToken(
            id,
            function (resp) {
              if (resp) {
                setTimeout(() => {
                  dispatch(setChoosenDetail(null));
                  dispatch(setRecentConversations([]));
                  dispatch(setConversations([]));
                  dispatch(
                    getCurrentUserPharmacyPermissions(
                      resp?.data?.store?._id,
                      function (res) {
                        if (res) {
                          setPharmacyAllowedPages([
                            ...res?.data?.permissions
                              .filter((p) => p?.includes(".nav"))
                              .map((p) => p?.split(".")[0]),
                          ]);
                          setCookie(
                            "dash_allowed_pages",
                            JSON.stringify([
                              ...res?.data?.permissions
                                .filter((p) => p?.includes(".nav"))
                                .map((p) => p?.split(".")[0]),
                            ])
                          );

                          if (res?.data?.permissions?.length == 0) {
                            toast.warn("You dont have permissions");
                            setPharmLoading(false);
                            return false;
                          } else {
                            user.store = resp?.data?.store;
                            dispatch(
                              pharmacyLoginSuccess({ data: { ...user } })
                            );
                            setPharmLoading(false);
                            setTimeout(() => {
                              if (
                                window?.location?.pathname?.includes(
                                  "bus/dashboard"
                                )
                              ) {
                                navigate("/dash/store-dashboard");
                              } else {
                                window?.location?.reload(false);
                              }
                            }, 1300);
                          }
                        }
                      }
                    )
                  );
                }, 10);
              }
            },
            function (err) {
              setPharmLoading(false);
            }
          )
        );
      }
    }
  };

  const handleLogOut = () => {
    let action = "USER_LOGOUT";
    dispatch(logout(function () { }));
    dispatch(
      resetStore(
        action,
        history,
        userSocket,
        storeSocket,
        setUserSocketData,
        setStoreSocketData
      )
    );
  };

  const handleDrawerOpen = (event) => {
    dispatch(openDrawer(!drawer));
  };

  const handleDrawerClose = () => {
    dispatch(openDrawer(false));
  };

  const handleWishLists = () => {
    navigate("/wishlist");
  };

  const handleWatchList = () => {
    navigate("/watchlist");
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function memoizeAddToIndex() {
    let cache = 80;
    return function () {
      cache = cache + 58;
      return cache;
    };
  }

  const handleNotification = (notif) => {
    if (notif) {
      setAnchorEl(null);
      let page = redirectForPageURL(notif);
      setNotifiLoading(true);
      if (notif?.doc?.for) {
        dispatch(
          getPharmToken(
            notif?.doc?.for,
            function (resp) {
              if (resp) {
                dispatch(
                  getCurrentUserPharmacyPermissions(
                    resp?.data?.store?._id,
                    function (res) {
                      if (res) {
                        if (res?.data?.permissions?.length == 0) {
                          toast.warn("You dont have permissions");
                          setNotifiLoading(false);
                          return false;
                        } else {
                          let tempPerm = [
                            ...res?.data?.permissions
                              .filter((p) => p?.includes(".nav"))
                              .map((p) => p?.split(".")[0]),
                          ];

                          let matchingPage = tempPerm?.reduce((prev, curr) => {
                            if (notif?.doc?.for_page?.includes(curr)) {
                              return curr;
                            }
                            return prev;
                          }, "");

                          if (!tempPerm.includes(matchingPage)) {
                            toast.warn("You dont have permissions");
                            setNotifiLoading(false);
                            return false;
                          } else {
                            setPharmacyAllowedPages([...tempPerm]);
                            setCookie(
                              "dash_allowed_pages",
                              JSON.stringify([...tempPerm])
                            );

                            user.store = resp?.data?.store;
                            dispatch(
                              pharmacyLoginSuccess({ data: { ...user } })
                            );
                            setNotifiLoading(false);
                            setTimeout(() => {
                              dispatch(setChoosenDetail(null));
                              dispatch(setRecentConversations([]));
                              // dispatch(setConversations([]));
                              setNotifiLoading(false);
                              navigate(page);
                            }, 100);
                          }
                        }
                      }
                    }
                  )
                );
              }
            },
            function (err) {
              setNotifiLoading(false);
            }
          )
        );
      } else {
        setTimeout(() => {
          setNotifiLoading(false);
          navigate(page);
        }, 500);
        return false;
      }
    }
  };

  const handleItemClick = (link) => {
    dispatch(activeLink(link));
    navigate(link);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ padding: "0px !important" }}
      className="page-header"
    >
      <audio ref={audioPlayer} src={NotificationSound} />
      <Toolbar>
        <Grid
          container
          spacing={1}
          alignItems="center"
          sx={{ margin: "5px 0px", padding: "0px", width: "100%" }}
        >
          <Grid
            item
            xs={5}
            sm={6}
            md={3}
            lg={2}
            container
            justifyContent="flex-start"
            alignItems="center"
            sx={{ paddingLeft: "0!important" }}
          >
            {location?.pathname?.includes("bus") ||
              location?.pathname?.includes("dash") ? (
              <Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={setOpen}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              ""
            )}
            <Box
              className="header-logo"
              onClick={() => navigate("/marketplace")}
            >
              <img className="logo-size" src={nxusLogo} />
              <Typography className="header-logo-text">NxusRX</Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={7}
            sm={6}
            md={9}
            lg={10}
            container
            sx={{
              justifyContent: { xs: "end", sm: "space-between" },
              paddingLeft: "0!important"
            }}
            alignItems="center"
          >
            {user?.role == "super_admin" || user?.is_verified ? (
              <Box display="flex">
                {pages?.map(
                  (page, index) =>
                    page &&
                    page?.path != undefined && (
                      <>
                        <MenuItem
                          sx={{ padding: "8px 10px" }}
                          key={index}
                          onClick={() => handleItemClick(page?.link)}
                        >
                          <Typography
                            textAlign="center"
                            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                            className={
                              page?.link == setActiveLink ? "activeLink" : ""
                            }
                          >
                            {page?.path}
                          </Typography>
                        </MenuItem>
                      </>
                    )
                )}
              </Box>
            ) : null}
            <Box sx={{ width: { xs: "0px", md: "320px" }, display: "flex" }}>
              {user &&
                user?.store &&
                user?.store?.id &&
                (user?.is_verified || user?.role == "super_admin") && (
                  <Box
                    sx={{
                      minWidth: 120,
                      marginX: "15px",
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    {pharmLoading ? (
                      <CircularProgress sx={{ color: " #235D5E" }} />
                    ) : (
                      <Tooltip
                        title={
                          <Box style={{ fontSize: "14px" }}>
                            {user && user?.store ? user?.store?.store_name : ""}
                          </Box>
                        }
                        placement="top"
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            shrink={true}
                            id="demo-simple-select-label"
                          >
                            &nbsp;
                          </InputLabel>

                          <Select
                            labelId="demo-simple-select-label"
                            className="pharmacies-select"
                            id="demo-simple-select"
                            input={<OutlinedInput notched={false} />}
                            value={
                              user && user?.store ? user?.store?.store_name : ""
                            }
                            label="Stores"
                            onChange={(e) => handleChange(e)}
                          >
                            {pharmacies &&
                              pharmacies?.length > 0 &&
                              pharmacies?.map((option, i) => {
                                return (
                                  <MenuItem key={i} value={option?.store_name}>
                                    <Typography
                                      sx={{
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        color: "#9FA3A9",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {option?.store_name}
                                    </Typography>
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    )}
                  </Box>
                )}

              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  width: { sm: "60%", md: "60%" },
                  border: "1px solid #E7E8EA",
                  borderRadius: "8px",
                }}
              >
                <Box
                  component="form"
                  onSubmit={(e) => e.preventDefault()}
                  noValidate
                  autoComplete="off"
                  sx={{
                    flex: "1",
                    display: "flex",
                    justifyContent: "right",
                    paddingRight: "0px !imoortant",
                  }}
                >
                  <FormControl className="header-search">
                    <Autocomplete
                      sx={{ width: "250px" }}
                      loading={searchLoading}
                      options={searchProducts}
                      autoHighlight={true}
                      autoSelect
                      filterSelectedOptions={true}
                      noOptionsText={"No Products avialable"}
                      loadingText={searchLoading ? "Loading..." : ""}
                      onChange={(e, newValue) => {
                        searchSelected(e, newValue);
                      }}
                      onInputChange={(e, newValue) => {
                        searchText(e, newValue);
                      }}
                      onHighlightChange={(e, newValue) => {
                        if (newValue) {
                          setHighlightedValue(newValue);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e?.key == "Enter" && searchProducts?.length > 0) {
                          navigate(
                            `/products/${highlightedValue
                              ? highlightedValue?.id
                              : searchProducts[0]?._id
                            }/${highlightedValue
                              ? highlightedValue?.DRUG_IDENTIFICATION_NUMBER
                              : searchProducts[0]?.DRUG_IDENTIFICATION_NUMBER
                            }`
                          );
                        }
                      }}
                      getOptionLabel={(searchProduct) =>
                        searchProduct
                          ? `${searchProduct?.product_name
                            ? searchProduct?.product_name
                            : ""
                          } ${searchProduct?.DRUG_IDENTIFICATION_NUMBER
                            ? searchProduct?.DRUG_IDENTIFICATION_NUMBER
                            : ""
                          }`
                          : ""
                      }
                      renderOption={(props, option) => (
                        <>
                          {
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                              key={option?._id}
                              onClick={() =>
                                navigate(
                                  `/products/${option?._id}/${option?.DRUG_IDENTIFICATION_NUMBER}`
                                )
                              }
                            >
                              {option?.imageCover &&
                                option?.imageCover?.full_image ? (
                                <img
                                  src={option?.imageCover?.full_image}
                                  width="25"
                                />
                              ) : (
                                <Avatar
                                  variant="square"
                                  sx={{
                                    width: 25,
                                    height: 25,
                                    mr: 2,
                                  }}
                                >
                                  {option &&
                                    option?.product_name &&
                                    option?.product_name?.substring(0, 2)}
                                </Avatar>
                              )}

                              <Typography
                                sx={{ fontSize: "14px" }}
                              >{`${option?.product_name} (DIN:${option?.DRUG_IDENTIFICATION_NUMBER})`}</Typography>
                            </Box>
                          }
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          placeholder="Search for Products"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <img src={searchIcon} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <Box className="endAdornment-SearchIcon">
                                {params.InputProps.endAdornment}
                              </Box>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                alignItems: "center",
                "& > *": {
                  margin: "5px",
                },
              }}
            >
              <Box className="in-nav-options">
                {wishListCount > 0 ? (
                  <Tooltip
                    title={<div style={{ fontSize: "12px" }}>Wishlist</div>}
                    placement="top"
                  >
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleWishLists}
                    >
                      <Badge
                        badgeContent={wishListCount}
                        max={99}
                        className="badgeStyle"
                      >
                        <FavoriteIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={<div style={{ fontSize: "12px" }}>Wishlist</div>}
                    placement="top"
                  >
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleWishLists}
                    >
                      <img src={WatchListIcon} />
                    </IconButton>
                  </Tooltip>
                )}

                {(user?.is_verified || user?.role == "super_admin") && (
                  <Tooltip
                    title={<div style={{ fontSize: "12px" }}>WatchList</div>}
                    placement="top"
                  >
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleWatchList}
                    >
                      <Badge badgeContent={null} className="badgeStyle">
                        <img src={OpenEyeIcon} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip
                  title={<div style={{ fontSize: "12px" }}>Shopping Cart</div>}
                  placement="top"
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleDrawerOpen}
                  >
                    <Badge
                      badgeContent={
                        products && products?.length && products?.length > 0
                          ? products?.length
                          : ""
                      }
                      max={99}
                      className={
                        products && products?.length && products?.length > 0
                          ? "badgeStyle"
                          : ""
                      }
                    >
                      <img src={CartBasket} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {user?.store &&
                  (user?.is_verified || user?.role == "super_admin") && (
                    <Tooltip
                      title={<div style={{ fontSize: "12px" }}>Chat</div>}
                      placement="top"
                    >
                      <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => {
                          handleClickOpenChat();
                        }}
                      >
                        {conversations?.length > 0 && chatCount > 0 ? (
                          <Badge
                            badgeContent={chatCount}
                            max={99}
                            className="badgeStyle"
                          >
                            <img src={chatMessage} />
                          </Badge>
                        ) : (
                          <img src={chatMessage} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}

                {user && user?._id ? (
                  <>
                    {notifiLoading ? (
                      <Box padding="12px">
                        <ClipLoader
                          size={25}
                          sx={{ color: "#235D5E !important", marginTop: "5px" }}
                          loading
                        />
                      </Box>
                    ) : (
                      <Tooltip
                        title={
                          <div style={{ fontSize: "12px" }}>Notifications</div>
                        }
                        placement="top"
                      >
                        <IconButton
                          id="basic-button"
                          aria-haspopup="true"
                          onClick={handleClick}
                        >
                          {state?.unReadCount > 0 ? (
                            <Badge
                              className="badgeStyle"
                              badgeContent={state?.unReadCount}
                              max={99}
                            >
                              <img src={NoftificationBell} />
                            </Badge>
                          ) : (
                            <img src={NoftificationBell} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                ) : (
                  ""
                )}

                <Menu
                  className="notification-menu"
                  anchorEl={anchorEl}
                  open={openNotification}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box className="notification-header">
                    <Typography
                      className="notification-label"
                      variant="subtitle1"
                    >
                      {state?.unReadCount > 0
                        ? `Notifications(${state?.unReadCount})`
                        : "Notifications"}
                    </Typography>
                    <img src={curl} sx={{ fontSize: "16px" }} />
                  </Box>

                  <Divider sx={{ borderColor: "#EBEDEE !important" }} />

                  <Box
                    sx={{ maxHeight: "350px", overflow: "auto" }}
                    id="scrollableDiv"
                  >
                    <InfiniteScroll
                      dataLength={state?.notifications?.length}
                      next={fetchData}
                      hasMore={state?.notifications?.length !== state?.count}
                      loader={
                        state?.notifications?.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              margin: "1rem auto",
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <ClipLoader size={28} color="blue" loading />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              margin: "1rem auto",
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            No Notifications
                          </Box>
                        )
                      }
                      scrollableTarget="scrollableDiv"
                    >
                      {state?.notifications && state?.notifications?.length > 0
                        ? state?.notifications?.map((notify, i) => (
                          <MenuItem sx={{ padding: "0px" }} key={i}>
                            <Box
                              display="flex"
                              flexDirection="row"
                              justifyContent="space-between"
                              sx={{ padding: "10px 15px" }}
                              onClick={() => {
                                handleNotification(notify);
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "#E9EFEF",
                                  minWidth: "35px",
                                  minHeight: "35px",
                                  maxWidth: "35px",
                                  maxHeight: "35px",
                                }}
                              >
                                <img src={manPlaceholder} />
                              </Avatar>

                              <Box
                                component="div"
                                sx={{
                                  whiteSpace: "normal",
                                  margin: "0px 10px",
                                }}
                              >
                                <Typography
                                  fontSize="14px"
                                  color="#585D69"
                                  fontWeight="500"
                                  fontStyle="normal"
                                >
                                  {notify?.message}
                                </Typography>
                              </Box>
                              <Box component="div">
                                <Typography
                                  fontSize="14px"
                                  fontWeight="500"
                                  fontStyle="normal"
                                  color="#9FA3A9"
                                >
                                  {`${moment(notify.createdAt).fromNow()}`}
                                </Typography>
                              </Box>
                            </Box>

                            <Divider
                              style={{
                                borderColor: "#EBEDEE",
                              }}
                            />
                          </MenuItem>
                        ))
                        : null}
                    </InfiniteScroll>
                  </Box>
                </Menu>
              </Box>

              {user && user?._id ? (
                <>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ padding: "2px" }}
                  >
                    <Avatar
                      alt="User Name"
                      sx={{ height: "30px", width: "30px", fontSize: "1rem" }}
                    >
                      {user && user?.business_owner_name
                        ? capitalize(user?.business_owner_name?.substring(0, 1))
                        : capitalize(user?.first_name?.substring(0, 1))}
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: "40px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => navigate("/bus/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  className="containedPrimary"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                {user && user._id ? (
                  <>
                    {user?.store?.id &&
                      (user?.is_verified || user?.role == "super_admin") ? (
                      <>
                        <Button
                          className="createProduct"
                          onClick={() =>
                            navigate("/dash/add-product", { replace: true })
                          }
                          sx={{
                            p: "9px",
                            borderRadius: "6px",
                            background: "#235D5E",
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            color: "#FFFF",
                            "&:hover": {
                              backgroundColor: "#235D5E",
                              color: "#FFFF",
                            },
                          }}
                        >
                          Create Product
                        </Button>
                      </>
                    ) : (
                      <>
                        {user?.role == "super_admin" || user?.is_verified ? (
                          <>
                            <Button
                              className="createProduct"
                              onClick={() => showStoreDialog()}
                              sx={{
                                p: "9px",
                                borderRadius: "6px",
                                backgroundColor: "#235D5E",
                                textTransform: "capitalize",
                                color: "#FFFF",
                                "&:hover": {
                                  backgroundColor: "#235D5E",
                                  color: "#FFFF",
                                },
                              }}
                            >
                              Create Product
                            </Button>
                            <SelectStoreDialog isProductPage={isProductPage} />
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                ) : null}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>

      <Menu
        className="cart-menu"
        open={drawer}
        onClose={handleDrawerClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className="cart-header">
          <Box pt={2} pl={2}>
            <Typography
              fontSize={"18px !important"}
              color={"#101828"}
              fontStyle={"normal"}
              fontWeight={700}
              variant="subtitle1"
              gutterBottom
            >
              Cart Items
            </Typography>
          </Box>
        </Box>
        {products && products?.length ? (
          <Box className="cart-body">
            {products?.map((product, i) => {
              return (
                <>
                  <MenuList key={i}>
                    <MenuItem>
                      <ViewCartProduct
                        product={product}
                        i={i}
                        count={count}
                        setCount={setCount}
                      />
                    </MenuItem>
                    <Divider
                      sx={{
                        borderColor: "#EDEDED !important",
                        border: "1px solid #EDEDED !important",
                      }}
                    />
                  </MenuList>
                </>
              );
            })}
          </Box>
        ) : (
          <Box
            className="cart-body"
            sx={{
              alignItems: "center",
              display: "flex",
              textAlign: "center",
            }}
          >
            <>
              <Typography
                mx={1}
                variant="h5"
                fontSize={18}
                sx={{
                  flex: "1",
                }}
              >
                No Items
              </Typography>
            </>
          </Box>
        )}

        <Box className="cart-footer">
          {products && products.length > 0 ? (
            <>
              <Box mr={1} mt={1}>
                <Button
                  fullWidth
                  className="containednewPrimary"
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    history("/viewcart");
                    dispatch(openDrawer(false));
                  }}
                  sx={{
                    paddingX: { xs: "30px !important", sm: "50px !important" },
                    paddingTop: "12px !important",
                  }}
                >
                  View Cart
                </Button>
              </Box>
              <Box ml={1}>
                <Button
                  fullWidth
                  className="containedWhite"
                  size="medium"
                  sx={{
                    paddingX: { xs: "30px !important", sm: "50px !important" },
                    paddingTop: "12px !important",
                    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.06) important",
                    border: "1px solid #E8E8E8 !important",
                  }}
                  variant="contained"
                  onClick={handleDrawerClose}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            ""
          )}
        </Box>
      </Menu>

      <ConversationChatModal
        openChat={openChat}
        count={count}
        setOpenChat={setOpenChat}
        setChatCount={setChatCount}
        chatCount={chatCount}
      />

      <Box className="out-nav-options">
        {wishListCount > 0 ? (
          <Tooltip
            title={<div style={{ fontSize: "12px" }}>Wishlist</div>}
            placement="top"
          >
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginX: "5px" }}
              onClick={handleWishLists}
            >
              <Badge
                badgeContent={wishListCount}
                max={99}
                className="badgeStyle"
              >
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            title={<div style={{ fontSize: "12px" }}>Wishlist</div>}
            placement="top"
          >
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginX: "5px" }}
              onClick={handleWishLists}
            >
              <img src={WatchListIcon} />
            </IconButton>
          </Tooltip>
        )}

        {(user?.is_verified || user?.role == "super_admin") && (
          <Tooltip
            title={<div style={{ fontSize: "12px" }}>WatchList</div>}
            placement="top"
          >
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginX: "5px" }}
              onClick={handleWatchList}
            >
              <Badge badgeContent={null} className="badgeStyle">
                <img src={OpenEyeIcon} />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip
          title={<div style={{ fontSize: "12px" }}>Shopping Cart</div>}
          placement="top"
        >
          <IconButton
            size="large"
            color="inherit"
            sx={{ marginX: "5px" }}
            onClick={handleDrawerOpen}
          >
            <Badge
              badgeContent={
                products && products?.length && products?.length > 0
                  ? products?.length
                  : ""
              }
              max={99}
              className={
                products && products?.length && products?.length > 0
                  ? "badgeStyle"
                  : ""
              }
            >
              <img src={CartBasket} />
            </Badge>
          </IconButton>
        </Tooltip>

        {user?.store && (user?.is_verified || user?.role == "super_admin") && (
          <Tooltip
            title={<div style={{ fontSize: "12px" }}>Chat</div>}
            placement="top"
          >
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginX: "5px" }}
              onClick={() => {
                handleClickOpenChat();
              }}
            >
              {conversations?.length > 0 && chatCount > 0 ? (
                <Badge badgeContent={chatCount} max={99} className="badgeStyle">
                  <img src={chatMessage} />
                </Badge>
              ) : (
                <img src={chatMessage} />
              )}
            </IconButton>
          </Tooltip>
        )}

        {user && user?._id ? (
          <>
            {notifiLoading ? (
              <ClipLoader
                size={25}
                cssOverride={{ margin: "-10px 5px" }}
                sx={{ color: " #235D5E !important" }}
                loading
              />
            ) : (
              <Tooltip
                title={<div style={{ fontSize: "12px" }}>Notifications</div>}
                placement="top"
              >
                <IconButton
                  id="basic-button"
                  aria-haspopup="true"
                  sx={{ marginX: "5px" }}
                  onClick={handleClick}
                >
                  {state?.unReadCount > 0 ? (
                    <Badge
                      badgeContent={state?.unReadCount}
                      max={99}
                      className="badgeStyle"
                    >
                      <img src={NoftificationBell} />
                    </Badge>
                  ) : (
                    <img src={NoftificationBell} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          ""
        )}

        <Menu
          className="notification-menu"
          anchorEl={anchorEl}
          open={openNotification}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box className="notification-header">
            <Typography className="notification-label" variant="subtitle1">
              {state?.unReadCount > 0
                ? `Notifications(${state?.unReadCount})`
                : "Notifications"}
            </Typography>
            <img src={curl} sx={{ fontSize: "16px" }} />
          </Box>

          <Divider sx={{ borderColor: "#EBEDEE !important" }} />

          <Box sx={{ maxHeight: "350px", overflow: "auto" }} id="scrollableDiv">
            <InfiniteScroll
              dataLength={state?.notifications?.length}
              next={fetchData}
              hasMore={state?.notifications?.length !== state?.count}
              loader={
                state?.notifications?.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      margin: "1rem auto",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <ClipLoader size={28} color="blue" loading />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      margin: "1rem auto",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    No Notifications
                  </Box>
                )
              }
              scrollableTarget="scrollableDiv"
            >
              {state?.notifications?.length > 0 ? (
                state?.notifications?.map((notify, i) => (
                  <MenuItem sx={{ padding: "0px" }} key={i}>
                    <Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        sx={{ padding: "10px 15px" }}
                        onClick={() => {
                          handleNotification(notify);
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#E9EFEF",
                            minWidth: "35px",
                            minHeight: "35px",
                            maxWidth: "35px",
                            maxHeight: "35px",
                          }}
                        >
                          <img src={manPlaceholder} />
                        </Avatar>

                        <Box
                          component="div"
                          sx={{
                            whiteSpace: "normal",
                            margin: "0px 10px",
                          }}
                        >
                          <Typography
                            fontSize="14px"
                            color="#585D69"
                            fontWeight="500"
                            fontStyle="normal"
                          >
                            {notify?.message}
                          </Typography>
                        </Box>
                        <Box component="div">
                          <Typography
                            fontSize="14px"
                            fontWeight="500"
                            fontStyle="normal"
                            color="#9FA3A9"
                          >
                            {`${moment(notify.createdAt).fromNow()}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider
                        style={{
                          borderColor: "#EBEDEE",
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    margin: "1rem auto",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  No Notifications
                </Box>
              )}
            </InfiniteScroll>
          </Box>
        </Menu>
      </Box>
    </AppBar>
  );
};

export default memo(Header);
