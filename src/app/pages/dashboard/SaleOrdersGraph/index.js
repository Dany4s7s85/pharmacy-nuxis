import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { getBusinessOrderReporting } from "../../../services/businessDashboard";
import {
  formatNumberWithCommas,
  getTotal,
  getTotalCount,
} from "../../../helpers/getTotalValue";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getFormattedDate } from "../../../shared/utils/getFormattedDate";
import Chart from "react-apexcharts";
import CloseIcon from "@mui/icons-material/Close";

const SaleOrdersGraph = ({ count }) => {
  const [ordersState, setOrdersState] = useState({
    chartOrdersData: [],
    chartOrdersOptions: {},
  });
  const [ordersReporting, setordersReporting] = useState([
    {
      totalSaleAmount: 0,
      count: 0,
      orderStatus: "Total Revenue",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "New Order",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Completed",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Ready for pickup",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "In Transit",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Order declined",
    },
  ]);

  const [saleFromDate, setSaleFromDate] = useState(null);
  const [saleToDate, setSaleToDate] = useState("");

  const [saleOrdersData, setSaleOrdersData] = useState([]);
  const [saleOrdersTempData, setSaleOrdersTempData] = useState({});

  const [orderStatus, setOrderStatus] = useState("Completed");
  const [orderDetails, setOrderDetails] = useState({});

  const dispatch = useDispatch();

  const orderLoading = useSelector(
    (state) => state?.businessDashboard?.businessOrderReporting?.loading
  );

  const options = {
    colors: ["#235D5E"],
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "70%",
        },
        dataLabels: {
          showOn: "always",
          value: {
            offsetY: -40,
            show: true,
            color: "#101828",
            fontWeight: "700",
            fontSize: "36px",
          },
          name: {
            offsetY: -20,
            show: false,
            color: "#7A7A7A",
            fontWeight: "400",
            fontSize: "36px",
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: {
                  offsetY: -20,
                  fontSize: "28px",
                },
              },
            },
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (count) {
      setSaleFromDate(null);
      setSaleToDate("");
    }

    dispatch(
      getBusinessOrderReporting("", "", function (res) {
        let data = res?.data;
        if (data) {
          data = ordersReporting?.map((item) => ({
            ...item,
            ...data.find((el) => el?._id == item?.orderStatus && el),
          }));

          let tempObj = {
            totalSaleAmount: getTotal(data),
            count: getTotalCount(data),
            orderStatus: "Total Revenue",
          };

          data?.splice(0, 1, tempObj);

          setSaleOrdersData(data);
          setSaleOrdersTempData(tempObj);

          let selectedOrdersPer;
          let selectedOrder;
          if (data) {
            selectedOrder = data?.find((order) => order?._id === orderStatus);

            selectedOrdersPer = [
              parseFloat(
                Number(
                  selectedOrder?.count > 0
                    ? (selectedOrder?.count / tempObj?.count) * 100
                    : 0
                )
              ).toFixed(0),
            ];
          }
          setOrderDetails(selectedOrder);
          setOrdersState({
            ...ordersState,
            chartOrdersData: selectedOrdersPer,
            chartOrdersOptions: options,
          });
        }
      })
    );
  }, [count]);

  const handleOrderStatusClick = (data) => {
    setOrderDetails(data);
    setOrderStatus(data?.orderStatus);
    let selectedOrdersPer;
    if (data) {
      selectedOrdersPer = [
        parseFloat(
          Number(
            data?.count > 0
              ? (data?.count / saleOrdersTempData?.count) * 100
              : 0
          )
        ).toFixed(0),
      ];
    }
    setOrdersState({
      ...ordersState,
      chartOrdersData: selectedOrdersPer,
      chartOrdersOptions: options,
    });
  };

  const handleSaleOrderFromDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setSaleFromDate(date);
      dispatch(
        getBusinessOrderReporting(
          date,
          saleToDate ? saleToDate : "",
          function (res) {
            if (res?.status == "success") {
              let data = res?.data;
              if (data) {
                data = ordersReporting?.map((item) => ({
                  ...item,
                  ...data.find((el) => el?._id == item?.orderStatus && el),
                }));

                let tempObj = {
                  totalSaleAmount: getTotal(data),
                  count: getTotalCount(data),
                  orderStatus: "Total Revenue",
                };

                data?.splice(0, 1, tempObj);

                setSaleOrdersData(data);
                setSaleOrdersTempData(tempObj);

                let selectedOrdersPer;
                let selectedOrder;
                if (data) {
                  selectedOrder = data?.find(
                    (order) => order?._id === orderStatus
                  );

                  selectedOrdersPer = [
                    parseFloat(
                      Number(
                        selectedOrder?.count > 0
                          ? (selectedOrder?.count / tempObj?.count) * 100
                          : 0
                      )
                    ).toFixed(0),
                  ];
                }

                setOrdersState({
                  ...ordersState,
                  chartOrdersData: selectedOrdersPer,
                  chartOrdersOptions: options,
                });
              }
            }
          }
        )
      );
    }
  };

  const handleSaleOrderToDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setSaleToDate(date);
      dispatch(
        getBusinessOrderReporting(
          saleFromDate ? saleFromDate : "",
          date,
          function (res) {
            if (res?.status == "success") {
              let data = res?.data;
              if (data) {
                data = ordersReporting?.map((item) => ({
                  ...item,
                  ...data.find((el) => el?._id == item?.orderStatus && el),
                }));

                let tempObj = {
                  totalSaleAmount: getTotal(data),
                  count: getTotalCount(data),
                  orderStatus: "Total Revenue",
                };

                data?.splice(0, 1, tempObj);

                setSaleOrdersData(data);
                setSaleOrdersTempData(tempObj);

                let selectedOrdersPer;
                let selectedOrder;
                if (data) {
                  selectedOrder = data?.find(
                    (order) => order?._id === orderStatus
                  );

                  selectedOrdersPer = [
                    parseFloat(
                      Number(
                        selectedOrder?.count > 0
                          ? (selectedOrder?.count / tempObj?.count) * 100
                          : 0
                      )
                    ).toFixed(0),
                  ];
                }

                setOrdersState({
                  ...ordersState,
                  chartOrdersData: selectedOrdersPer,
                  chartOrdersOptions: options,
                });
              }
            }
          }
        )
      );
    }
  };

  const handleRemoveSaleOrderFromDate = () => {
    setSaleFromDate("");
    dispatch(
      getBusinessOrderReporting(
        "",
        saleToDate ? saleToDate : "",
        function (res) {
          if (res?.status == "success") {
            let data = res?.data;
            if (data) {
              data = ordersReporting?.map((item) => ({
                ...item,
                ...data.find((el) => el?._id == item?.orderStatus && el),
              }));

              let tempObj = {
                totalSaleAmount: getTotal(data),
                count: getTotalCount(data),
                orderStatus: "Total Revenue",
              };

              data?.splice(0, 1, tempObj);

              setSaleOrdersData(data);
              setSaleOrdersTempData(tempObj);

              let selectedOrdersPer;
              let selectedOrder;
              if (data) {
                selectedOrder = data?.find(
                  (order) => order?._id === orderStatus
                );

                selectedOrdersPer = [
                  parseFloat(
                    Number(
                      selectedOrder?.count > 0
                        ? (selectedOrder?.count / tempObj?.count) * 100
                        : 0
                    )
                  ).toFixed(0),
                ];
              }

              setOrdersState({
                ...ordersState,
                chartOrdersData: selectedOrdersPer,
                chartOrdersOptions: options,
              });
            }
          }
        }
      )
    );
  };

  const handleRemoveSaleOrderToDate = () => {
    setSaleToDate("");
    dispatch(
      getBusinessOrderReporting(
        saleFromDate ? saleFromDate : "",
        "",
        function (res) {
          if (res?.status == "success") {
            let data = res?.data;
            if (data) {
              data = ordersReporting?.map((item) => ({
                ...item,
                ...data.find((el) => el?._id == item?.orderStatus && el),
              }));

              let tempObj = {
                totalSaleAmount: getTotal(data),
                count: getTotalCount(data),
                orderStatus: "Total Revenue",
              };

              data?.splice(0, 1, tempObj);

              setSaleOrdersData(data);
              setSaleOrdersTempData(tempObj);

              let selectedOrdersPer;
              let selectedOrder;
              if (data) {
                selectedOrder = data?.find(
                  (order) => order?._id === orderStatus
                );

                selectedOrdersPer = [
                  parseFloat(
                    Number(
                      selectedOrder?.count > 0
                        ? (selectedOrder?.count / tempObj?.count) * 100
                        : 0
                    )
                  ).toFixed(0),
                ];
              }

              setOrdersState({
                ...ordersState,
                chartOrdersData: selectedOrdersPer,
                chartOrdersOptions: options,
              });
            }
          }
        }
      )
    );
  };

  return (
    <Box
      height="100%"
      pl={{ xs: 0, lg: 2 }}
      pr={{ xs: 0, md: 2, lg: 0 }}
      position="relative"
    >
      <Grid container spacing={0} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h5"
            sx={{
              color: "#101828",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Sale Orders
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} mt={{ xs: 1, sm: 0 }}>
          <Grid container spacing={1} alignItems="center" justifyContent="end">
            <Grid item xs={6} sm={4} md={6}>
              <Box display="flex" position="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="From Date"
                    className="datePickerSelect"
                    name={"SaleFromDate"}
                    inputFormat="MM/DD/YYYY"
                    disabled={orderLoading ? true : false}
                    value={saleFromDate ? saleFromDate : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        if (newValue?.$d && newValue?.$d != "Invalid Date") {
                          handleSaleOrderFromDateChange(newValue);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} error={false} size="small" />
                    )}
                  />
                  {!orderLoading && saleFromDate && saleFromDate ? (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "30px",
                        top: "5px",
                      }}
                      onClick={handleRemoveSaleOrderFromDate}
                    >
                      <CloseIcon fontSize="12px" />
                    </Box>
                  ) : null}
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} md={6} mr={{ sm: "1.5rem", md: "0px" }}>
              <Box display="flex" position="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="To Date"
                    inputFormat="MM/DD/YYYY"
                    className="datePickerSelect"
                    disabled={orderLoading ? true : false}
                    value={saleToDate ? saleToDate : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        if (newValue?.$d && newValue?.$d != "Invalid Date") {
                          handleSaleOrderToDateChange(newValue);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} error={false} size="small" />
                    )}
                  />
                  {!orderLoading && saleToDate && saleToDate ? (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "30px",
                        top: "5px",
                      }}
                      onClick={handleRemoveSaleOrderToDate}
                    >
                      <CloseIcon fontSize="12px" />
                    </Box>
                  ) : null}
                </LocalizationProvider>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {orderLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          height="100%"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress sx={{ color: " #235D5E" }} />
        </Box>
      ) : (
        <>
          {ordersState?.chartOrdersData &&
          ordersState?.chartOrdersData?.length > 0 ? (
            <Box width="100%" position="relative">
              <Box
                paddingTop="2rem"
                m="auto"
                width={{ xs: 280, sm: 500, md: "auto" }}
              >
                <Chart
                  options={ordersState?.chartOrdersOptions}
                  series={ordersState?.chartOrdersData}
                  type="radialBar"
                />
              </Box>
              <Box
                className="amountAndStatus"
                top={{ xs: "8rem", sm: "13rem", lg: "11rem" }}
              >
                <Typography
                  color="#7A7A7A"
                  fontWeight="400"
                  fontSize={{ xs: "12px", sm: "15px" }}
                >
                  $
                  {formatNumberWithCommas(
                    parseFloat(
                      Number(
                        orderDetails?.totalSaleAmount > 0
                          ? orderDetails?.totalSaleAmount
                          : 0
                      )
                    ).toFixed(2)
                  )}
                </Typography>
                <Typography
                  color="#7A7A7A"
                  fontWeight="400"
                  fontSize={{ xs: "12px", sm: "15px" }}
                >
                  {orderStatus}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              height="100%"
              alignItems="center"
              minHeight="200px"
            >
              No sale orders are available!
            </Box>
          )}
        </>
      )}

      {ordersState?.chartOrdersData &&
      ordersState?.chartOrdersData?.length > 0 ? (
        <Box
          className="cusLegend-series"
          sx={{ inset: { xs: "auto", sm: "auto 0px 20px 10px" } }}
        >
          <Grid container spacing={1} justifyContent="center">
            {saleOrdersData
              ?.filter((order) => order?.orderStatus != "Total Revenue")
              ?.map((el, i) => (
                <Box
                  key={i}
                  marginLeft="15px"
                  justifyContent="center"
                  display="flex"
                  alignItems="center"
                  onClick={() => {
                    handleOrderStatusClick(el);
                  }}
                >
                  <Typography
                    className="cusLegend-marker"
                    sx={{
                      height: { xs: "8px", sm: "12px" },
                      width: { xs: "8px", sm: "12px" },
                    }}
                  ></Typography>
                  <Typography
                    className="cusLegend-text"
                    fontSize={{ xs: "12px", sm: "14px" }}
                  >
                    {el?.orderStatus}
                  </Typography>
                </Box>
              ))}
          </Grid>
        </Box>
      ) : null}

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: "#E7E8EA !important",
          display: {
            lg: "block",
            xs: "none",
          },
        }}
      />
    </Box>
  );
};

export default SaleOrdersGraph;
