import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, OutlinedInput, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import {
  generateAllOrdersPDF,
  getOrderPrescription,
} from "../../services/orders";
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
import TextField from "@mui/material/TextField";
import { capitalize } from "../../helpers/formatting";
import { useNavigate } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { saveAs } from "file-saver";
import { getStorePrescription } from "../../services/pharmacyDashboard";
import PrescriptionModal from "../order-detail/prescription";
import eye from "../../assets/images/eye.svg";
import searchIcon from "../../assets/images/searchIcon.svg";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const Prescriptions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const response = useSelector(
    (state) => state?.pharmacyDashboard?.storePrescription?.response
  );
  const orderPrescriptionsloading = useSelector(
    (state) => state?.orders?.orderPrescriptions?.loading
  );
  const prescriptionLoading = useSelector(
    (state) => state?.order?.orderPrescriptions?.loading
  );

  const navigate = useNavigate();
  const loading = useSelector(
    (state) => state?.pharmacyDashboard?.storePrescription?.loading
  );
  const generatePDFLoading = useSelector(
    (state) => state?.order?.generate_allOrders_Pdf?.loading
  );
  const [customLoading, setCustomLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [prescriptionDetail, setPrescriptionDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [state, setState] = useState({
    orders: [],
    count: 0,
  });

  useEffect(() => {
    dispatch(
      getStorePrescription("", "", page, limit, function (res) {
        if (res) {
          setCustomLoading(false);
        }
      })
    );
  }, []);

  useEffect(() => {
    const count = response?.data?.count ? response?.data?.count : 0;
    const perPage = 10;
    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      orders:
        response?.data?.prescriptions && response?.data?.prescriptions?.length
          ? response?.data?.prescriptions
          : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getStorePrescription(
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

  const handleGenerateAllOrdersPDF = () => {
    dispatch(
      generateAllOrdersPDF("", "", page, limit, function (res) {
        if (res) {
          const blob = new Blob([res], {
            type: "application/pdf",
          });
          saveAs(blob, `orderList-page(${page}).pdf`);
        }
      })
    );
  };

  const debouncedGetSearch = useCallback(
    debounce((query) => {
      setPage(1);
      dispatch(
        getStorePrescription(
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

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = (id) => {
    setModalOpen(true);
    dispatch(
      getOrderPrescription(id, function (res) {
        if (res) {
          setPrescriptionDetail({
            res,
          });
        }
      })
    );
  };

  const columns = [
    {
      field: "Order",
      headerName: "Prescriptions",
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
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {user &&
              user?.store &&
              user?.store?.id == params?.row?.orderedTo?.id
                ? "Received"
                : "Sent"}
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
          <Box>
            <IconButton onClick={() => handleModalOpen(params?.row?._id)}>
              <img src={eye} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleStatus = (e) => {
    setPage(1);
    dispatch(
      getStorePrescription(
        search ? search : "",
        e.target.value,
        1,
        limit,
        function (res) {}
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
          Prescriptions
        </Typography>
        <Box textAlign={"end"} display={"flex"}>
          <Tooltip
            sx={{ width: { xs: "10%", sm: "50px" } }}
            title={<div style={{ fontSize: "12px" }}>Generate PDF</div>}
            placement="bottom"
          >
            <IconButton
              sx={{
                padding: "0px !important",
              }}
            >
              {generatePDFLoading ? (
                <CircularProgress sx={{ color: " #235D5E" }} />
              ) : (
                <PictureAsPdfIcon
                  onClick={() => handleGenerateAllOrdersPDF()}
                  sx={{
                    fontSize: "40px",
                    color: "#235D5E",
                    margin: "6px",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          <FormControl
            variant="filled"
            sx={{ width: { xs: "50%", sm: "220px" }, ml: 1 }}
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
              width: { xs: "40%", sm: "130px" },
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
                        ${parseFloat(Number(params?.cartTotal)).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Typography className="card-field">Action</Typography>
                      <Typography className="card-field">
                        <Box>
                          <>
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
                        </Box>
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

      <PrescriptionModal
        prescriptionLoading={prescriptionLoading}
        orderDetail={prescriptionDetail?.res?.data}
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
      />
    </>
  );
};

export default Prescriptions;
