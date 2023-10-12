import React, { useState, useEffect, useCallback, useContext } from "react";
import Box from "@mui/material/Box";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MuiDataGridTable from "../../shared/components/MuiTable";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../assets/images/searchIcon.svg";
import Typography from "@mui/material/Typography";
import debounce from "lodash.debounce";
import Grid from "@mui/material/Grid";
import "./product.scss";
import Stack from "@mui/material/Stack";
import { getBusinessProductList } from "../../services/business-stats";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../shared/components/Pagination";
import Verify from "../../assets/images/teenyicons_tick-circle-outline.svg";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import { AuthContext } from "../../context/authContext";
import useDialogModal from "../../hooks/useDialogModal";
import StoreModal from "../productDetail/StoreModal";
import {
  getCurrentUserPharmacyPermissions,
  getPharmToken,
  pharmacyLoginSuccess,
} from "../../services/BAuth";
import {
  setChoosenDetail,
  setConversations,
  setRecentConversations,
} from "../../services/chat";
import { setCookie } from "../../helpers/common";
import { toast } from "react-toastify";
import { enlistDelistProducts } from "../../services/products";
import AddIcon from "@mui/icons-material/Add";
import pencil from "../../assets/images/pencil.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

export const BusinessProductList = () => {
  const { hasPermission } = useContext(AuthContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const response = useSelector(
    (state) => state?.BusinessOrders?.businessProducts?.response
  );
  const loading = useSelector(
    (state) => state?.BusinessOrders?.businessProducts?.loading
  );
  const [customLoading, setCustomLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pharmLoading, setPharmLoading] = useState(false);
  const [inventryId, setInventryId] = useState("");
  const [isProductPage, setIsProductPage] = useState(true);

  const [state, setState] = useState({
    products: response,
    count: 0,
  });

  const { setPharmacyAllowedPages } = useContext(AuthContext);

  const [SelectStoreDialog, showStoreDialog, closeStoreDialog] =
    useDialogModal(StoreModal);

  useEffect(() => {
    dispatch(
      getBusinessProductList("", "", page, limit, function (res) {
        if (res) {
          setCustomLoading(false);
        }
      })
    );
  }, []);

  useEffect(() => {
    const count =
      response &&
      response?.length &&
      response[0] &&
      response[0]?.metadata?.length &&
      response[0]?.metadata[0]?.total;
    const perPage = 10;

    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      products: response && response?.length ? response[0]?.data : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getBusinessProductList(
        search ? search : "",
        "",
        value,
        limit,
        function (res) {}
      )
    );
    setPage(value);
    setCustomLoading(false);
  }, []);

  const debouncedGetSearch = useCallback(
    debounce((query) => {
      setPage(1);
      dispatch(
        getBusinessProductList(query, "", page, limit, function (res) {})
      );
    }, 1000),
    []
  );

  const searchText = (e) => {
    setSearch(e.target.value);
    debouncedGetSearch(e.target.value, "", page, limit);
  };
  const handleProductsChange = (productId, status) => {
    dispatch(
      enlistDelistProducts(productId, status, function (res) {
        if (res?.status == "success") {
        }
      })
    );
  };

  const handleEditProduct = (row) => {
    if (row) {
      setPharmLoading(true);
      setInventryId(row?._id);
      let page = "edit-product";
      dispatch(
        getPharmToken(
          row?.store[0]?._id,
          function (resp) {
            if (resp) {
              dispatch(
                getCurrentUserPharmacyPermissions(
                  resp?.data?.store?._id,
                  function (res) {
                    if (res) {
                      if (res?.data?.permissions?.length == 0) {
                        toast.warn("You dont have permissions");
                        setPharmLoading(false);
                        return false;
                      } else {
                        let tempPerm = [
                          ...res?.data?.permissions
                            .filter((p) => p?.includes(".nav"))
                            .map((p) => p?.split(".")[0]),
                        ];

                        if (!tempPerm?.includes(page)) {
                          toast.warn("You dont have permissions");
                          setPharmLoading(false);
                          return false;
                        }

                        setPharmacyAllowedPages([...tempPerm]);

                        setCookie(
                          "dash_allowed_pages",
                          JSON.stringify([...tempPerm])
                        );

                        user.store = resp?.data?.store;
                        dispatch(pharmacyLoginSuccess({ data: { ...user } }));
                        setPharmLoading(false);
                        setTimeout(() => {
                          dispatch(setChoosenDetail(null));
                          dispatch(setRecentConversations([]));
                          dispatch(setConversations([]));
                          navigate({
                            pathname: "/dash/edit-product",
                            search: `?id=${row?._id}`,
                          });
                        }, 100);
                      }
                    }
                  }
                )
              );
            }
          },
          function (err) {
            setPharmLoading(false);
          }
        )
      );
    }
  };

  let columns = [
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 3,
      renderCell: (params) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {params?.row?.imageCover?.full_image &&
            params?.row?.imageCover?.full_image &&
            params?.row?.imageCover?.full_image ? (
              <img
                style={{
                  width: "60px",
                  height: "35px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginRight: "10px",
                }}
                src={params?.row?.imageCover?.full_image}
              />
            ) : (
              ""
            )}
            <Box className="rowText text-ellipses">
              <Typography className="rowText text-ellipses">
                {params?.row?.product_name}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "DRUG_IDENTIFICATION_NUMBER",
      headerName: "DIN No",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {params?.row?.DRUG_IDENTIFICATION_NUMBER}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "total",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {formatNumberWithCommas(params?.row?.total)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "PRODUCT STATUS",
      headerName: "Price",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <>
              <Typography
                variant="body1"
                component="body1"
                className="rowText text-ellipses"
              >
                Max Price : {params?.row?.max_price}{" "}
                {params?.row?.max_price != params?.row?.min_price && (
                  <> / Min Price : {params?.row?.min_price} </>
                )}
              </Typography>
            </>
          </Box>
        );
      },
    },

    ...(hasPermission("edit-product.nav")
      ? [
          {
            field: "Action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => {
              return (
                <Box sx={{ display: "flex" }}>
                  <IconButton variant="text">
                    {params?.row?.status == "pending" ||
                    params?.row?.status == "rejected" ? (
                      <img src={Verify} />
                    ) : (
                      ""
                    )}
                  </IconButton>
                  {pharmLoading && params?.row?._id == inventryId ? (
                    <CircularProgress size={25} sx={{ color: " #235D5E" }} />
                  ) : (
                    <IconButton onClick={() => handleEditProduct(params?.row)}>
                      <img src={pencil} />
                    </IconButton>
                  )}
                </Box>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Box
        sx={{
          display: { xs: "contents", sm: "flex", md: "flex" },
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#101828", fontWeight: "700", fontSize: "24px" }}
        >
          Product
        </Typography>
        <Box textAlign={"end"}>
          <FormControl
            variant="filled"
            sx={{ width: { xs: "100%", sm: "250px" } }}
          >
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: false }}
              id="outlined-basic"
              className="authfield"
              placeholder="Search here"
              onChange={searchText}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ margin: "-6px" }}>
                    <img src={searchIcon} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%" } }}
            />
          </FormControl>
        </Box>
      </Box>
      <Box className="table-card">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <MuiDataGridTable
            rows={
              state?.products && state?.products?.length > 0
                ? state?.products
                : []
            }
            getRowId={(row) => Math.random()}
            columns={columns}
          />
        )}
      </Box>
      <Box className="card-table" sx={{ width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100px",
            }}
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            {state?.products && state?.products?.length > 0
              ? state?.products?.map((params, ind) => {
                  return (
                    <>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={false}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{ paddingX: 1 }}
                        >
                          <Grid container>
                            <Grid item xs={12}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent={"space-between"}
                              >
                                <Box
                                  className="accordion-box-full"
                                  sx={{ alignItems: "center", display: "flex" }}
                                >
                                  {params?.imageCover?.full_image &&
                                  params?.imageCover?.full_image &&
                                  params?.imageCover?.full_image ? (
                                    <>
                                      <img
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: "4px",
                                          width: "60px",
                                          height: "35px",
                                        }}
                                        src={params?.imageCover?.full_image}
                                      />
                                      <Typography
                                        sx={{ ml: 1 }}
                                        className="card-field-14 text-ellipses"
                                      >
                                        {params?.product_name}
                                      </Typography>
                                    </>
                                  ) : (
                                    <Typography className="card-field-14 text-ellipses">
                                      {params?.product_name}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent={"space-between"}
                          >
                            <Box flexDirection={"column"}>
                              <Typography className="card-field-12">
                                Din No
                              </Typography>
                              <Typography className="card-field-14">
                                {params?.DRUG_IDENTIFICATION_NUMBER}
                              </Typography>
                            </Box>
                            <Box
                              flexDirection={"column"}
                              justifyContent={"flex-end"}
                              textAlign={"end"}
                            >
                              <Typography className="card-field-12">
                                Quantity
                              </Typography>
                              <Typography className="card-field-14">
                                {formatNumberWithCommas(params?.total)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent={"space-between"}
                          >
                            <Box flexDirection={"column"}>
                              <Typography
                                sx={{ whiteSpace: "nowrap" }}
                                className="card-field-12"
                              >
                                Price &nbsp;
                              </Typography>
                              <Tooltip>
                                <Typography
                                  className="text-ellipses card-field-14"
                                  sx={{ whiteSpace: "nowrap" }}
                                >
                                  {params?.max_price != params?.min_price && (
                                    <> Min Price : {params?.min_price} /</>
                                  )}
                                  Max Price : {params?.max_price}
                                </Typography>
                              </Tooltip>
                            </Box>

                            {hasPermission("edit-product.nav")
                              ? [
                                  <Box
                                    flexDirection={"column"}
                                    justifyContent={"flex-end"}
                                    textAlign={"end"}
                                  >
                                    <Typography className="card-field-12">
                                      Action
                                    </Typography>
                                    <Box sx={{ display: "flex" }}>
                                      <IconButton variant="text">
                                        {params?.status == "pending" ||
                                        params?.status == "rejected" ? (
                                          <img src={Verify} />
                                        ) : (
                                          ""
                                        )}
                                      </IconButton>
                                      {pharmLoading &&
                                      params?._id == inventryId ? (
                                        <CircularProgress
                                          size={25}
                                          sx={{ color: " #235D5E" }}
                                        />
                                      ) : (
                                        <IconButton
                                          onClick={() =>
                                            handleEditProduct(params)
                                          }
                                        >
                                          <img src={pencil} />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </Box>,
                                ]
                              : []}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })
              : null}
          </>
        )}
      </Box>
      <Box
        sx={{
          display: { xs: "contents", sm: "flex" },
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: { xs: "none", sm: "flex" },
          }}
        >
          {user && user._id ? (
            <>
              {user?.store?.id ? (
                <>
                  <Button
                    variant="contained"
                    className="containedPrimary"
                    onClick={() =>
                      navigate("/dash/add-product", { replace: true })
                    }
                    startIcon={<AddIcon />}
                  >
                    Add Product
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="containedPrimary"
                    variant="contained"
                    onClick={() => showStoreDialog()}
                  >
                    Select Store For Add Products
                  </Button>
                  <SelectStoreDialog isProductPage={isProductPage} />
                </>
              )}
            </>
          ) : null}
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: "end",
          }}
        >
          {!customLoading && (
            <Stack spacing={2} sx={{ alignSelf: "center" }}>
              {state.count > 0 && (
                <Pagination
                  totalCount={state?.count}
                  page={page}
                  onPageChange={handlePageChange}
                />
              )}
            </Stack>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          marginTop: "10px",
          display: { xs: "flex", sm: "none" },
        }}
      >
        {user && user._id ? (
          <>
            {user?.store?.id ? (
              <>
                <Button
                  variant="contained"
                  className="containedPrimary"
                  onClick={() =>
                    navigate("/dash/add-product", { replace: true })
                  }
                  startIcon={<AddIcon />}
                >
                  Add Product
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="containedPrimary"
                  variant="contained"
                  onClick={() => showStoreDialog()}
                >
                  Select Store For Add Products
                </Button>
                <SelectStoreDialog isProductPage={isProductPage} />
              </>
            )}
          </>
        ) : null}
      </Box>
    </>
  );
};

export default BusinessProductList;
