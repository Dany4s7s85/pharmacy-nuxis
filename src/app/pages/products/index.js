import React, { useState, useEffect, useCallback, useContext } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MuiDataGridTable from "../../shared/components/MuiTable";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../assets/images/searchIcon.svg";
import Typography from "@mui/material/Typography";
import debounce from "lodash.debounce";
import "./product.scss";
import Stack from "@mui/material/Stack";
import {
  enlistDelistProducts,
  getPharmacyProductList,
} from "../../services/products";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../shared/components/Pagination";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import { AuthContext } from "../../context/authContext";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import pencil from "../../assets/images/pencil.svg";
import cross from "../../assets/images/cross.svg";
import DoneIcon from "@mui/icons-material/Done";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

export const Products = () => {
  const { hasPermission } = useContext(AuthContext);
  const [checked, setChecked] = useState({});
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState("");

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 35,
    height: 18,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 1,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#56BA9B",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const response = useSelector((state) => state?.product?.products?.response);
  const loading = useSelector((state) => state?.product?.products?.loading);
  const [customLoading, setCustomLoading] = useState(true);
  const [counting, setCounting] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [state, setState] = useState({
    products: response,
    count: 0,
  });
  const [memberStatusLoading, setMemeberStatusLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    dispatch(
      getPharmacyProductList(
        user?.store?._id,
        "",
        "",
        page,
        limit,
        function (res) {
          if (res) {
            setCustomLoading(false);
          }
        }
      )
    );
  }, [counting]);

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
      getPharmacyProductList(
        user?._id,
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
        getPharmacyProductList(
          user?._id,
          query,
          "",
          page,
          limit,
          function (res) {}
        )
      );
    }, 1000),
    []
  );

  const searchText = (e) => {
    setSearch(e.target.value);
    debouncedGetSearch(e.target.value, "", page, limit);
  };

  const handleProductsChange = (productId, status) => {
    setMemeberStatusLoading(true);
    setSelectedId(productId);
    setChecked((prevState) => ({
      ...prevState,
      [productId]: status,
    }));
    dispatch(
      enlistDelistProducts(productId, status, function (res) {
        if (res?.status == "success") {
          setMemeberStatusLoading(false);
        }
      })
    );
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
            <Typography variant="body1" component="body1" className="rowText">
              {params?.row?.max_price != params?.row?.min_price && (
                <>
                  Min Price : {formatNumberWithCommas(params?.row?.min_price)} /
                </>
              )}
              Max Price : {formatNumberWithCommas(params?.row?.max_price)}
            </Typography>
          </Box>
        );
      },
    },
    ...(hasPermission("edit-product.nav")
      ? [
          {
            field: "Action",
            headerName: "Action",
            flex: 2,
            renderCell: (params) => {
              return (
                <Box sx={{ display: "flex" }}>
                  {selectedId == params?.row?._id && memberStatusLoading ? (
                    <Box>
                      <CircularProgress size={25} sx={{ color: "#235D5E" }} />
                    </Box>
                  ) : (
                    <>
                      <IconButton
                        variant="text"
                        onClick={() => {
                          setProductId(params?.row?._id);
                        }}
                      >
                        {params?.row?.status == "pending" ||
                        params?.row?.status == "rejected" ? (
                          <DoneIcon />
                        ) : (
                          <img src={cross} />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          navigate({
                            pathname: "/dash/edit-product",
                            search: `?id=${params?.row?._id}`,
                          })
                        }
                      >
                        <img src={pencil} />
                      </IconButton>
                      {params?.row?._id ? (
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={checked[params?.row?._id]}
                          inputProps={{ "aria-label": "controlled" }}
                          defaultChecked={params?.row?.isActive}
                          disabled={params?.row?.total === 0}
                          value={params?.row?.isActive}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              handleProductsChange(params?.row?._id, true);
                            } else {
                              handleProductsChange(params?.row?._id, false);
                            }
                          }}
                        />
                      ) : null}
                    </>
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

      <Box className="table-card" sx={{ width: "100%" }}>
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
                                Quantity{" "}
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
                              <Typography className="card-field-12">
                                Price
                              </Typography>
                              <Typography
                                className="card-field-14"
                                sx={{ whiteSpace: " nowrap" }}
                              >
                                {params?.max_price != params?.min_price && (
                                  <>
                                    Min Price :
                                    {formatNumberWithCommas(params?.min_price)}{" "}
                                    /
                                  </>
                                )}
                                Max Price :
                                {formatNumberWithCommas(params?.max_price)}
                              </Typography>
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
                                    <Box
                                      className="card-field-12"
                                      sx={{ display: "flex" }}
                                    >
                                      {selectedId == params?._id &&
                                      memberStatusLoading ? (
                                        <Box>
                                          <CircularProgress
                                            size={25}
                                            sx={{ color: "#235D5E" }}
                                          />
                                        </Box>
                                      ) : (
                                        <>
                                          <IconButton
                                            variant="text"
                                            onClick={() => {
                                              setProductId(params?._id);
                                            }}
                                          >
                                            {params?.status == "pending" ||
                                            params?.status == "rejected" ? (
                                              <DoneIcon />
                                            ) : (
                                              <img src={cross} />
                                            )}
                                          </IconButton>
                                          <IconButton
                                            onClick={() =>
                                              navigate({
                                                pathname: "/dash/edit-product",
                                                search: `?id=${params?._id}`,
                                              })
                                            }
                                          >
                                            <img src={pencil} />
                                          </IconButton>
                                          {params?._id ? (
                                            <IOSSwitch
                                              sx={{ m: 1 }}
                                              checked={checked[params?._id]}
                                              inputProps={{
                                                "aria-label": "controlled",
                                              }}
                                              defaultChecked={params?.isActive}
                                              disabled={params?.total === 0}
                                              value={params?.isActive}
                                              onChange={(e) => {
                                                if (e?.target?.checked) {
                                                  handleProductsChange(
                                                    params?._id,
                                                    true
                                                  );
                                                } else {
                                                  handleProductsChange(
                                                    params?._id,
                                                    false
                                                  );
                                                }
                                              }}
                                            />
                                          ) : null}
                                        </>
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
          {hasPermission("add-product.nav") && (
            <Box pt={2}>
              <Button
                variant="contained"
                className="containedPrimary"
                startIcon={<AddIcon />}
                onClick={() => navigate("/dash/add-product", { replace: true })}
              >
                Add Product
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: "end",
          }}
        >
          {!customLoading && (
            <Stack
              spacing={2}
              sx={{ alignItems: "flex-end", marginTop: "15px" }}
            >
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
        {hasPermission("add-product.nav") && (
          <Box pt={2}>
            <Button
              variant="contained"
              className="containedPrimary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/dash/add-product", { replace: true })}
            >
              Add Product
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Products;
