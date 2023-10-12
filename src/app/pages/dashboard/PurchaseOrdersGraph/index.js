import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { getBusinessPurchaseOrderReporting } from "../../../services/businessDashboard";
import {
  formatNumberWithCommas,
  getTotal,
} from "../../../helpers/getTotalValue";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getFormattedDate } from "../../../shared/utils/getFormattedDate";
import Chart from "react-apexcharts";
import CloseIcon from "@mui/icons-material/Close";

const PurchaseOrdersGraph = ({ count }) => {
  const [purchaseFromDate, setpurchaseFromDate] = useState(null);
  const [purchaseToDate, setpurchaseToDate] = useState("");
  const [purchaseState, setPurchaseState] = useState({
    chartPurchaseData: [],
    chartPurchaseOptions: {},
  });
  const [purchaseReporting, setPurchaseReporting] = useState([
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Total Purchase",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "In Processing",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "New Order",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Order declined",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Completed",
    },
  ]);

  const dispatch = useDispatch();

  const purchaseOrderLoading = useSelector(
    (state) => state?.businessDashboard?.businessPurchaseOrderReporting?.loading
  );

  useEffect(() => {
    if (count) {
      setpurchaseFromDate(null);
      setpurchaseToDate("");
    }

    dispatch(
      getBusinessPurchaseOrderReporting("", "", function (res) {
        let purchaseData = res?.data;
        if (purchaseData) {
          const labels = purchaseData?.map((el) => el?.orderStatus);
          const series = purchaseData?.map((el) =>
            parseFloat(Number((el?.totalSaleAmount * 100) / 100)).toFixed(2)
          );
          purchaseData = purchaseReporting?.map((item) => ({
            ...item,
            ...purchaseData.find(
              (el) => el.orderStatus == item.orderStatus && el
            ),
          }));

          const options = {
            chart: {
              width: 350,
              type: "radialBar",
            },
            labels: labels,
            tooltip: {
              y: {
                formatter: function (val) {
                  return (
                    "$" +
                    formatNumberWithCommas(
                      parseFloat(Number((val * 100) / 100)).toFixed(2)
                    )
                  );
                },
                title: {
                  formatter: function (seriesName) {
                    return seriesName;
                  },
                },
              },
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  margin: 0,
                  size: "65%",
                },

                dataLabels: {
                  show: true,
                  name: {
                    fontSize: "22px",
                  },
                  total: {
                    show: true,
                    label: "Total",
                    formatter: () =>
                      `$${formatNumberWithCommas(
                        parseFloat(
                          Number((tempObj?.totalSaleAmount * 100) / 100)
                        ).toFixed(2)
                      )}`,
                  },
                  value: {
                    show: true,
                    formatter: function (val) {
                      return (
                        "$" +
                        formatNumberWithCommas(
                          parseFloat(Number((val * 100) / 100)).toFixed(2)
                        )
                      );
                    },
                  },
                },
              },
            },
            fill: {
              colors: ["#235D5E", "#1CB565", "#F3CA60"],
            },
            dataLabels: {
              enabled: false,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            legend: {
              show: true,
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
              markers: {
                fillColors: ["#235D5E", "#1CB565", "#F3CA60"],
              },
            },
          };

          let tempObj = {
            totalSaleAmount: getTotal(purchaseData),
            count: 0,
            orderStatus: "Total Purchase",
          };

          purchaseData?.splice(0, 1, tempObj);

          setPurchaseState({
            ...purchaseState,
            chartPurchaseData: series,
            chartPurchaseOptions: options,
          });
        }
      })
    );
  }, [count]);

  const handlePurchaseOrderFromDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setpurchaseFromDate(date);
      dispatch(
        getBusinessPurchaseOrderReporting(
          date,
          purchaseToDate ? purchaseToDate : "",
          function (res) {
            if (res?.status == "success") {
              let purchaseData = res?.data;
              if (purchaseData) {
                const labels = purchaseData?.map((el) => el?.orderStatus);
                const series = purchaseData?.map((el) =>
                  parseFloat(Number((el?.totalSaleAmount * 100) / 100)).toFixed(
                    2
                  )
                );
                purchaseData = purchaseReporting?.map((item) => ({
                  ...item,
                  ...purchaseData.find(
                    (el) => el.orderStatus == item.orderStatus && el
                  ),
                }));

                const options = {
                  chart: {
                    width: 350,
                    type: "radialBar",
                  },
                  labels: labels,
                  tooltip: {
                    y: {
                      formatter: function (val) {
                        return (
                          "$" +
                          formatNumberWithCommas(
                            parseFloat(Number((val * 100) / 100)).toFixed(2)
                          )
                        );
                      },
                      title: {
                        formatter: function (seriesName) {
                          return seriesName;
                        },
                      },
                    },
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        margin: 0,
                        size: "65%",
                      },

                      dataLabels: {
                        show: true,
                        name: {
                          fontSize: "22px",
                        },
                        total: {
                          show: true,
                          label: "Total",
                          formatter: () =>
                            `$${formatNumberWithCommas(
                              parseFloat(
                                Number((tempObj?.totalSaleAmount * 100) / 100)
                              ).toFixed(2)
                            )}`,
                        },
                        value: {
                          show: true,
                          formatter: function (val) {
                            return (
                              "$" +
                              formatNumberWithCommas(
                                parseFloat(Number((val * 100) / 100)).toFixed(2)
                              )
                            );
                          },
                        },
                      },
                    },
                  },
                  fill: {
                    colors: ["#235D5E", "#1CB565", "#F3CA60"],
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  responsive: [
                    {
                      breakpoint: 480,
                      options: {
                        legend: {
                          position: "bottom",
                          offsetX: -10,
                          offsetY: 0,
                        },
                      },
                    },
                  ],
                  legend: {
                    show: true,
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0,
                    markers: {
                      fillColors: ["#235D5E", "#1CB565", "#F3CA60"],
                    },
                  },
                };

                let tempObj = {
                  totalSaleAmount: getTotal(purchaseData),
                  count: 0,
                  orderStatus: "Total Purchase",
                };

                purchaseData?.splice(0, 1, tempObj);

                setPurchaseState({
                  ...purchaseState,
                  chartPurchaseData: series,
                  chartPurchaseOptions: options,
                });
              }
            }
          }
        )
      );
    }
  };

  const handlePurchaseOrderToDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setpurchaseToDate(date);
      dispatch(
        getBusinessPurchaseOrderReporting(
          purchaseFromDate ? purchaseFromDate : "",
          date,
          function (res) {
            if (res?.status == "success") {
              let purchaseData = res?.data;
              if (purchaseData) {
                const labels = purchaseData?.map((el) => el?.orderStatus);
                const series = purchaseData?.map((el) =>
                  parseFloat(Number((el?.totalSaleAmount * 100) / 100)).toFixed(
                    2
                  )
                );
                purchaseData = purchaseReporting?.map((item) => ({
                  ...item,
                  ...purchaseData.find(
                    (el) => el.orderStatus == item.orderStatus && el
                  ),
                }));

                const options = {
                  chart: {
                    width: 350,
                    type: "radialBar",
                  },
                  labels: labels,
                  tooltip: {
                    y: {
                      formatter: function (val) {
                        return (
                          "$" +
                          formatNumberWithCommas(
                            parseFloat(Number((val * 100) / 100)).toFixed(2)
                          )
                        );
                      },
                      title: {
                        formatter: function (seriesName) {
                          return seriesName;
                        },
                      },
                    },
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        margin: 0,
                        size: "65%",
                      },

                      dataLabels: {
                        show: true,
                        name: {
                          fontSize: "22px",
                        },
                        total: {
                          show: true,
                          label: "Total",
                          formatter: () =>
                            `$${formatNumberWithCommas(
                              parseFloat(
                                Number((tempObj?.totalSaleAmount * 100) / 100)
                              ).toFixed(2)
                            )}`,
                        },
                        value: {
                          show: true,
                          formatter: function (val) {
                            return (
                              "$" +
                              formatNumberWithCommas(
                                parseFloat(Number((val * 100) / 100)).toFixed(2)
                              )
                            );
                          },
                        },
                      },
                    },
                  },
                  fill: {
                    colors: ["#235D5E", "#1CB565", "#F3CA60"],
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  responsive: [
                    {
                      breakpoint: 480,
                      options: {
                        legend: {
                          position: "bottom",
                          offsetX: -10,
                          offsetY: 0,
                        },
                      },
                    },
                  ],
                  legend: {
                    show: true,
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0,
                    markers: {
                      fillColors: ["#235D5E", "#1CB565", "#F3CA60"],
                    },
                  },
                };

                let tempObj = {
                  totalSaleAmount: getTotal(purchaseData),
                  count: 0,
                  orderStatus: "Total Purchase",
                };

                purchaseData?.splice(0, 1, tempObj);

                setPurchaseState({
                  ...purchaseState,
                  chartPurchaseData: series,
                  chartPurchaseOptions: options,
                });
              }
            }
          }
        )
      );
    }
  };

  const handleRemovePurchaseOrderFromDate = () => {
    setpurchaseFromDate("");
    dispatch(
      getBusinessPurchaseOrderReporting(
        "",
        purchaseToDate ? purchaseToDate : "",
        function (res) {
          if (res?.status == "success") {
            let purchaseData = res?.data;
            if (purchaseData) {
              const labels = purchaseData?.map((el) => el?.orderStatus);
              const series = purchaseData?.map((el) =>
                parseFloat(Number((el?.totalSaleAmount * 100) / 100)).toFixed(2)
              );
              purchaseData = purchaseReporting?.map((item) => ({
                ...item,
                ...purchaseData.find(
                  (el) => el.orderStatus == item.orderStatus && el
                ),
              }));

              const options = {
                chart: {
                  width: 350,
                  type: "radialBar",
                },
                labels: labels,
                tooltip: {
                  y: {
                    formatter: function (val) {
                      return (
                        "$" +
                        formatNumberWithCommas(
                          parseFloat(Number((val * 100) / 100)).toFixed(2)
                        )
                      );
                    },
                    title: {
                      formatter: function (seriesName) {
                        return seriesName;
                      },
                    },
                  },
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      margin: 0,
                      size: "65%",
                    },

                    dataLabels: {
                      show: true,
                      name: {
                        fontSize: "22px",
                      },
                      total: {
                        show: true,
                        label: "Total",
                        formatter: () =>
                          `$${formatNumberWithCommas(
                            parseFloat(
                              Number((tempObj?.totalSaleAmount * 100) / 100)
                            ).toFixed(2)
                          )}`,
                      },
                      value: {
                        show: true,
                        formatter: function (val) {
                          return (
                            "$" +
                            formatNumberWithCommas(
                              parseFloat(Number((val * 100) / 100)).toFixed(2)
                            )
                          );
                        },
                      },
                    },
                  },
                },
                fill: {
                  colors: ["#235D5E", "#1CB565", "#F3CA60"],
                },
                dataLabels: {
                  enabled: false,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                      },
                    },
                  },
                ],
                legend: {
                  show: true,
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0,
                  markers: {
                    fillColors: ["#235D5E", "#1CB565", "#F3CA60"],
                  },
                },
              };

              let tempObj = {
                totalSaleAmount: getTotal(purchaseData),
                count: 0,
                orderStatus: "Total Purchase",
              };

              purchaseData?.splice(0, 1, tempObj);

              setPurchaseState({
                ...purchaseState,
                chartPurchaseData: series,
                chartPurchaseOptions: options,
              });
            }
          }
        }
      )
    );
  };

  const handleRemovePurchaseOrderToDate = () => {
    setpurchaseToDate("");
    dispatch(
      getBusinessPurchaseOrderReporting(
        purchaseFromDate ? purchaseFromDate : "",
        "",
        function (res) {
          if (res?.status == "success") {
            let purchaseData = res?.data;
            if (purchaseData) {
              const labels = purchaseData?.map((el) => el?.orderStatus);
              const series = purchaseData?.map((el) =>
                parseFloat(Number((el?.totalSaleAmount * 100) / 100)).toFixed(2)
              );
              purchaseData = purchaseReporting?.map((item) => ({
                ...item,
                ...purchaseData.find(
                  (el) => el.orderStatus == item.orderStatus && el
                ),
              }));

              const options = {
                chart: {
                  width: 350,
                  type: "radialBar",
                },
                labels: labels,
                tooltip: {
                  y: {
                    formatter: function (val) {
                      return (
                        "$" +
                        formatNumberWithCommas(
                          parseFloat(Number((val * 100) / 100)).toFixed(2)
                        )
                      );
                    },
                    title: {
                      formatter: function (seriesName) {
                        return seriesName;
                      },
                    },
                  },
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      margin: 0,
                      size: "65%",
                    },

                    dataLabels: {
                      show: true,
                      name: {
                        fontSize: "22px",
                      },
                      total: {
                        show: true,
                        label: "Total",
                        formatter: () =>
                          `$${formatNumberWithCommas(
                            parseFloat(
                              Number((tempObj?.totalSaleAmount * 100) / 100)
                            ).toFixed(2)
                          )}`,
                      },
                      value: {
                        show: true,
                        formatter: function (val) {
                          return (
                            "$" +
                            formatNumberWithCommas(
                              parseFloat(Number((val * 100) / 100)).toFixed(2)
                            )
                          );
                        },
                      },
                    },
                  },
                },
                fill: {
                  colors: ["#235D5E", "#1CB565", "#F3CA60"],
                },
                dataLabels: {
                  enabled: false,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                      },
                    },
                  },
                ],
                legend: {
                  show: true,
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0,
                  markers: {
                    fillColors: ["#235D5E", "#1CB565", "#F3CA60"],
                  },
                },
              };

              let tempObj = {
                totalSaleAmount: getTotal(purchaseData),
                count: 0,
                orderStatus: "Total Purchase",
              };

              purchaseData?.splice(0, 1, tempObj);

              setPurchaseState({
                ...purchaseState,
                chartPurchaseData: series,
                chartPurchaseOptions: options,
              });
            }
          }
        }
      )
    );
  };

  return (
    <Box display="flex" width="100%">
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: "#E7E8EA !important",
          display: {
            lg: "none",
            md: "block",
            xs: "none",
          },
        }}
      />

      <Box
        display="flex "
        flexDirection="column"
        width="100%"
        pr={{ xs: 0, lg: 2 }}
        pl={{ xs: 0, md: 2, lg: 0 }}
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
              Purchase Orders
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} mt={{ xs: 1, sm: 0 }}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="end"
            >
              <Grid item xs={6} sm={4} md={6}>
                <Box display="flex" position="relative">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="From Date"
                      name={"purchaseFromDate"}
                      className="datePickerSelect"
                      inputFormat="MM/DD/YYYY"
                      disabled={
                        purchaseOrderLoading ||
                        !purchaseState?.chartPurchaseData?.length > 0
                          ? true
                          : false
                      }
                      value={purchaseFromDate ? purchaseFromDate : null}
                      onChange={(newValue) => {
                        if (newValue) {
                          if (newValue?.$d && newValue?.$d != "Invalid Date") {
                            handlePurchaseOrderFromDateChange(newValue);
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} error={false} size="small" />
                      )}
                    />
                    {!purchaseOrderLoading &&
                    purchaseFromDate &&
                    purchaseFromDate ? (
                      <Box
                        sx={{
                          position: "absolute",
                          right: "30px",
                          top: "5px",
                        }}
                        onClick={handleRemovePurchaseOrderFromDate}
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
                      disabled={
                        purchaseOrderLoading ||
                        !purchaseState?.chartPurchaseData?.length > 0
                          ? true
                          : false
                      }
                      value={purchaseToDate ? purchaseToDate : null}
                      onChange={(newValue) => {
                        if (newValue) {
                          if (newValue?.$d && newValue?.$d != "Invalid Date") {
                            handlePurchaseOrderToDateChange(newValue);
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} error={false} size="small" />
                      )}
                    />
                    {!purchaseOrderLoading &&
                    purchaseToDate &&
                    purchaseToDate ? (
                      <Box
                        sx={{
                          position: "absolute",
                          right: "30px",
                          top: "5px",
                        }}
                        onClick={handleRemovePurchaseOrderToDate}
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

        {purchaseOrderLoading ? (
          <Box
            minHeight="300px"
            maxHeight="300px"
            justifyContent="center"
            display="flex"
            alignItems="center"
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            {purchaseState?.chartPurchaseData &&
            purchaseState?.chartPurchaseData?.length > 0 ? (
              <Box
                width="100%"
                height="100%"
                textAlign="-webkit-center"
                position="relative"
                paddingTop="2rem"
              >
                <Box width={{ sm: 400, xs: 280 }} height={{ sm: 350, xs: 200 }}>
                  <Chart
                    options={purchaseState?.chartPurchaseOptions}
                    series={purchaseState?.chartPurchaseData}
                    type="radialBar"
                  />
                </Box>
              </Box>
            ) : (
              <Box
                minHeight="350px"
                maxHeight="350px"
                justifyContent="center"
                display="flex"
                alignItems="center"
              >
                No purchase orders are available!
              </Box>
            )}
          </>
        )}
      </Box>

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

export default PurchaseOrdersGraph;
