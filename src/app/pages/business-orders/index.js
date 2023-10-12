import React, { useState, useEffect, useCallback, useContext } from "react";
import { Card, OutlinedInput } from "@mui/material";
import Box from "@mui/material/Box";
import MuiDataGridTable from '../../shared/components/MuiTable';
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessOrder } from "../../services/business-stats";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment/moment";
import Stack from "@mui/material/Stack";
import Pagination from "../../shared/components/Pagination";
import debounce from "lodash.debounce";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../assets/images/searchIcon.svg";
import TextField from "@mui/material/TextField";
import { capitalize } from "../../helpers/formatting";
import { useNavigate } from "react-router-dom";
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
import { AuthContext } from "../../context/authContext";
import eye from "../../assets/images/eye.svg";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

import "./orders.scss";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const BusinessOrders = () => {
  const dispatch = useDispatch();
  const response = useSelector(
    (state) => state?.BusinessOrders?.businessOrder?.response
  );
  const navigate = useNavigate();
  const loading = useSelector(
    (state) => state?.BusinessOrders?.businessOrder?.loading
  );
  const { user } = useSelector((state) => state?.auth);

  const [customLoading, setCustomLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [state, setState] = useState({
    orders: [],
    count: 0,
  });
  const [pharmLoading, setPharmLoading] = useState(false);
  const [inventryId, setInventryId] = useState("");
  const { setPharmacyAllowedPages } = useContext(AuthContext);

  useEffect(() => {
    dispatch(
      getBusinessOrder("", "", page, limit, function (res) {
        if (res) {
          setCustomLoading(false);
        }
      })
    );
  }, []);

  useEffect(() => {
    const count = response?.count ? response?.count : 0;
    const perPage = 10;
    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      orders:
        response?.orders && response?.orders?.length ? response?.orders : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getBusinessOrder(
        search ? search : "",
        status ? status : "",
        value,
        limit,
        function (res) { }
      )
    );
    setPage(value);
    setCustomLoading(false);
  }, []);

  const debouncedGetSearch = useCallback(
    debounce((query) => {
      setPage(1);
      dispatch(
        getBusinessOrder(
          query,
          status ? status : "",
          page,
          limit,
          function (res) { }
        )
      );
    }, 1000),
    []
  );

  const searchText = (e) => {
    setSearch(e.target.value);
    debouncedGetSearch(e.target.value, "", page, limit);
  };

  const handleBusOrders = (row) => {
    if (row) {
      setPharmLoading(true);
      setInventryId(row?._id);
      let page = "order-detail";
      dispatch(
        getPharmToken(
          row?.orderedTo?._id,
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
                            pathname: "/dash/order-detail",
                            search: `?oid=${row?._id}`,
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

  const columns = [
    {
      field: "Order",
      headerName: "Order",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              #{params?.row?.order_no}
              {params?.row?.orderedBy
                ? params?.row?.orderedBy?.pharmacy_name
                : ""}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Parent Order",
      headerName: "Parent Order",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              #{params?.row?.parent_order_number}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {`${moment(params?.row?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}`}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {capitalize(params?.row?.orderStatus)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Total",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              $
              {formatNumberWithCommas(
                parseFloat(Number(params?.row?.cartTotal)).toFixed(2)
              )}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {pharmLoading && params?.row?._id == inventryId ? (
              <CircularProgress size={25} sx={{ color: " #235D5E" }} />
            ) : (
              <IconButton onClick={() => handleBusOrders(params?.row)}>
                <img src={eye} />
              </IconButton>
            )}
            {params?.row && params?.row?.orderStatus == "New Order" && (
              <NewReleasesIcon sx={{ color: "#F04438" }} />
            )}
          </>
        );
      },
    },
  ];

  const handleStatus = (e) => {
    setPage(1);
    dispatch(
      getBusinessOrder(
        search ? search : "",
        e.target.value,
        1,
        limit,
        function (res) { }
      )
    );

    setStatus(e.target.value);
  };
  const filters = [
    {
      label: "New Order",
      value: "New Order",
    },
    {
      label: "Order Accepted By Store",
      value: "Order Accepted By Store",
    },
    {
      label: "Delivered",
      value: "Delivered",
    },
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Refunded",
      value: "Refunded",
    },
    {
      label: "Order declined",
      value: "Order declined",
    },
    {
      label: "In Transit",
      value: "In Transit",
    },
    {
      label: "Ready for pickup",
      value: "Ready for pickup",
    },
    {
      label: "Schedule for pickup",
      value: "Schedule for pickup",
    },
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
          Order List
        </Typography>
        <Box textAlign={"end"} display={"flex"}>
          <FormControl
            variant="filled"
            sx={{ width: { xs: "65%", sm: "250px" } }}
          >
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              InputLabelProps={{ shrink: false }}
              onChange={searchText}
              className="authfield"
              placeholder="Search here"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ margin: "-6px" }}>
                    <img src={searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl
            sx={{
              width: { xs: "35%", sm: "160px" },
              textAlign: "start",
              ml: 1,
            }}
            size="small"
          >
            <Select
              className="membersSelect"
              labelId="demo-simple-select-label"
              placeholder="Status"
              id="demo-simple-select"
              input={<OutlinedInput notched={false} />}
              value={status}
              onChange={(e) => handleStatus(e)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#9FA3A9",
                  }}
                >
                  Status
                </Typography>
              </MenuItem>
              {filters.map((filter) => {
                return (
                  <MenuItem value={filter?.value}>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#9FA3A9",
                      }}
                    >
                      {filter?.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        className="table-card"
        sx={{ width: "100%" }}
      >
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
              state?.orders && state?.orders?.length > 0 ? state?.orders : []
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
            <CircularProgress sx={{ color: "#235D5E" }} />
          </Box>
        ) : (
          <>
            {state?.orders.map((params, ind) => {
              return (
                <>
                  <Card
                    sx={{
                      borderRadius: "6px",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field"></Typography>
                      <Typography sx={{ color: "black", fontSize: "12px" }}>
                        {`${moment(params?.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}`}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">Order</Typography>
                      <Typography className="card-field">
                        #{params?.order_no}
                        {params?.orderedBy
                          ? params?.orderedBy?.pharmacy_name
                          : ""}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">
                        Parent Order
                      </Typography>
                      <Typography className="card-field">
                        #{params?.parent_order_number}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">Status</Typography>
                      <Typography className="card-field">
                        {capitalize(params?.orderStatus)}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">Total</Typography>
                      <Typography className="card-field">
                        $
                        {formatNumberWithCommas(
                          parseFloat(Number(params?.cartTotal)).toFixed(2)
                        )}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">Action</Typography>
                      <Typography className="card-field">
                        <>
                          {params && params?.orderStatus == "New Order" && (
                            <NewReleasesIcon
                              sx={{
                                color: "#F04438",
                                marginRight: "8px",
                                fontSize: "20px",
                              }}
                            />
                          )}
                          <IconButton
                            sx={{ padding: "0px" }}
                            onClick={() =>
                              navigate({
                                pathname: "/dash/order-detail",
                                search: `?oid=${params?._id}`,
                              })
                            }
                          >
                            <img src={eye} />
                          </IconButton>
                        </>
                      </Typography>
                    </Box>
                  </Card>
                </>
              );
            })}
          </>
        )}
      </Box>
      {!customLoading && (
        <Stack spacing={2} sx={{ alignItems: "flex-end", marginTop: "15px" }}>
          <Pagination
            totalCount={state?.count}
            page={page}
            onPageChange={handlePageChange}
          />
        </Stack>
      )}
    </>
  );
};

export default BusinessOrders;
