import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Chip, OutlinedInput } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { approvePreOrder, rejectPreOrder } from "../../services/orders";
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
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PharmacistModal from "./PharmacistApproval";
import QRModal from "./QRModal";
import { getTotalPrice } from "../../helpers/pricing";
import PreOrderModal from "./preOrderModal";
import { getBusinessPreOrders } from "../../services/business-stats";
import eye from "../../assets/images/eye.svg";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import "./orders.scss";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const PreOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const response = useSelector(
    (state) => state?.BusinessOrders?.businessPreOrders?.response
  );
  const loading = useSelector(
    (state) => state?.BusinessOrders?.businessPreOrders?.loading
  );

  const location = useLocation();
  let queryStr = new URLSearchParams(location?.search);
  const modId = queryStr?.get("modId");
  const randomId = queryStr?.get("ranId");

  const [customLoading, setCustomLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");
  const [state, setState] = useState({
    orders: [],
    count: 0,
  });

  const [user, setUser] = useState(null);
  const [preOrderId, setPreOrderId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [preOrderModal, setPreOrderModal] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getBusinessPreOrders("", "", page, limit, function (res) {
        if (res) {
          setCustomLoading(false);
        }
      })
    );
  }, [count]);

  useEffect(() => {
    if (modId) {
      dispatch(
        getBusinessPreOrders("", "", page, limit, function (res) {
          if (res) {
            setCustomLoading(false);
          }
        })
      );
    }
  }, [count, modId]);

  useEffect(() => {
    if (modId) {
      setPreOrderModal(true);
    }
  }, [modId, randomId]);

  useEffect(() => {
    const count = response?.count ? response?.count : 0;
    const perPage = 10;
    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      orders:
        response?.preOrders && response?.preOrders?.length
          ? response?.preOrders
          : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getBusinessPreOrders(
        search ? search : "",
        status ? status : "",
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
        getBusinessPreOrders(
          query,
          status ? status : "",
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
              {params?.row?.orderedBy ? params?.row?.pre_order_no : ""}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
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
      field: "createdBy",
      headerName: "Created By",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {params?.row?.createdBy?.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "SubTotal",
      headerName: "SubTotal",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              $
              {formatNumberWithCommas(
                getTotalPrice(params?.row?.products)?.toFixed(2)
              )}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "ApprovalStatus",
      headerName: "Approval Status",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <>
              {params?.row?.approval_status == "pending" ? (
                <>
                  <IconButton
                    onClick={() => {
                      handleModalOpen();

                      setPreOrderId(params?.row?._id);
                      setSelected("approved");
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: "#70e000", fontSize: "26px" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setAuthModalOpen(true);

                      setPreOrderId(params?.row?._id);
                      setSelected("rejected");
                    }}
                  >
                    <CancelIcon sx={{ color: "red", fontSize: "26px" }} />
                  </IconButton>
                </>
              ) : (
                <>
                  {params?.row?.approval_status == "rejected" ? (
                    <Chip
                      sx={{ color: "#CD6832" }}
                      size="small"
                      label={`${capitalize(params?.row?.approval_status)}`}
                    />
                  ) : params?.row?.approval_status == "approved" ? (
                    <Chip
                      sx={{ color: "#235D5E" }}
                      size="small"
                      label={`${capitalize(params?.row?.approval_status)}`}
                    />
                  ) : (
                    <Chip
                      sx={{ color: "#F3CA60" }}
                      size="small"
                      label={`${capitalize(params?.row?.approval_status)}`}
                    />
                  )}
                </>
              )}
            </>
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
            <IconButton
              onClick={() => {
                setPreOrderModal(true);
                setPreOrderId(params?.row?._id);
              }}
            >
              <img src={eye} />
            </IconButton>
            {params?.row && params?.row?.approval_status == "pending" && (
              <NewReleasesIcon sx={{ color: "#F04438" }} />
            )}
          </>
        );
      },
    },
  ];

  const handleModalClose = () => {
    modId && navigate("/dash/preOrders");
    setModalOpen(false);
    setPreOrderId("");
    setSelected("");
    setAuthModalOpen(false);
    setPreOrderModal(false);
    setUser(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setModalOpen(false);
    setPreOrderId("");
    setSelected("");
    setAuthModalOpen(false);
    setPreOrderModal(false);
    setUser(null);
  };

  const handleAuthModalOpen = () => {
    setAuthModalOpen(true);
  };

  const handleStatus = (e) => {
    setPage(1);
    dispatch(
      getBusinessPreOrders(
        search ? search : "",
        e.target.value,
        1,
        limit,
        function (res) {}
      )
    );
    setStatus(e.target.value);
  };

  const handleCancel = (pid, data, reset) => {
    if (pid) {
      dispatch(
        rejectPreOrder(pid, { ...data, preOrder: pid }, function (res) {
          if (res) {
            setSelected("");
            setAuthModalOpen(false);
            reset();
            dispatch(
              getBusinessPreOrders(
                search ? search : "",
                status ? status : "",
                page,
                limit,
                function (res) {
                  if (res) {
                  }
                }
              )
            );
          }
        })
      );
    }
  };

  const handleApprove = (pid, user) => {
    if (pid && user) {
      dispatch(
        approvePreOrder(
          pid,
          { user },
          function (res) {
            if (res) {
              setCount(count + 1);
              setAuthModalOpen(false);
              dispatch(
                getBusinessPreOrders(
                  search ? search : "",
                  status ? status : "",
                  page,
                  limit,
                  function (res) {
                    if (res) {
                      setCustomLoading(false);
                    }
                  }
                )
              );
            }
          },
          function (err) {
            if (err?.data && err?.data?.shouldReload) {
              setCount(count + 1);
              setAuthModalOpen(false);
            }
          }
        )
      );
    }
  };

  const filters = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Cancelled",
      value: "cancelled by pharmacist",
    },
    {
      label: "Approved",
      value: "approved",
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
          Pre Orders
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
        sx={{ height: "calc(100vh - 320px)", width: "100%" }}
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
          <DataGrid
            className="table-header"
            rowHeight={60}
            rows={
              state?.orders && state?.orders?.length > 0 ? state?.orders : []
            }
            columns={columns}
            hideFooter={true}
            hideFooterRowCount={true}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            filterMode="client"
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
            {state?.orders.map((params, ind) => {
              return (
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
                      {params?.orderedBy ? params?.pre_order_no : ""}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <Typography className="card-field">Created By</Typography>

                    <Typography className="card-field">
                      {params?.createdBy?.email}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <Typography className="card-field">SubTotal</Typography>

                    <Typography className="card-field">
                      $
                      {formatNumberWithCommas(
                        getTotalPrice(params?.products)?.toFixed(2)
                      )}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <Typography className="card-field">
                      Approval Status
                    </Typography>

                    <Typography className="card-field">
                      <>
                        {params?.approval_status == "pending" ? (
                          <>
                            <IconButton
                              sx={{ padding: 0 }}
                              onClick={() => {
                                handleModalOpen();

                                setPreOrderId(params?._id);

                                setSelected("approved");
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  color: "#70e000",

                                  fontSize: "26px",

                                  padding: 0,
                                }}
                              />
                            </IconButton>

                            <IconButton
                              sx={{ padding: 0 }}
                              onClick={() => {
                                setAuthModalOpen(true);

                                setPreOrderId(params?._id);

                                setSelected("rejected");
                              }}
                            >
                              <CancelIcon
                                sx={{
                                  color: "red",

                                  fontSize: "26px",

                                  padding: 0,
                                }}
                              />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            {params?.approval_status == "rejected" ? (
                              <Chip
                                sx={{ color: "#CD6832" }}
                                size="small"
                                label={`${capitalize(params?.approval_status)}`}
                              />
                            ) : params?.approval_status == "approved" ? (
                              <Chip
                                sx={{ color: "#235D5E" }}
                                size="small"
                                label={`${capitalize(params?.approval_status)}`}
                              />
                            ) : (
                              <Chip
                                sx={{ color: "#F3CA60" }}
                                size="small"
                                label={`${capitalize(params?.approval_status)}`}
                              />
                            )}
                          </>
                        )}
                      </>
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <Typography className="card-field">Action</Typography>

                    <Typography className="card-field">
                      {params && params?.approval_status == "pending" && (
                        <NewReleasesIcon
                          sx={{
                            color: "#F04438",

                            marginRight: "8px",

                            fontSize: "20px",
                          }}
                        />
                      )}

                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => {
                          setPreOrderModal(true);

                          setPreOrderId(params?._id);
                        }}
                      >
                        <img src={eye} />
                      </IconButton>
                    </Typography>
                  </Box>
                </Card>
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
      {modalOpen && (
        <PharmacistModal
          modalOpen={modalOpen}
          count={count}
          setModalOpen={setModalOpen}
          handleModalClose={handleModalClose}
          handleAuthModalOpen={handleAuthModalOpen}
          handleApprove={handleApprove}
          purchaseOrderId={preOrderId}
          authModalOpen={authModalOpen}
          user={user}
          setUser={setUser}
          setAuthModalOpen={setAuthModalOpen}
        />
      )}
      {preOrderModal && (
        <PreOrderModal
          modalOpen={preOrderModal}
          authModalOpen={authModalOpen}
          setAuthModalOpen={setAuthModalOpen}
          count={count}
          user={user}
          setUser={setUser}
          setModalOpen={setPreOrderModal}
          handleModalClose={handleModalClose}
          preOrderId={modId ? modId : preOrderId}
          setPreOrderId={setPreOrderId}
        />
      )}

      <QRModal
        forType={
          selected && selected == "approved"
            ? "Get Authorized"
            : selected && selected == "rejected"
            ? "Reject"
            : ""
        }
        handler={
          selected && selected == "approved"
            ? handleApprove
            : selected && selected == "rejected"
            ? handleCancel
            : null
        }
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        user={user}
        setUser={setUser}
        handleCancel={handleCancel}
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
        handleAuthModalClose={handleAuthModalClose}
        purchaseOrderId={preOrderId}
      />
    </>
  );
};

export default PreOrders;
