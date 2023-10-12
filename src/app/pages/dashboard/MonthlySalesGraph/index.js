import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import "../dashboard.scss";
import { getBusinessMonthlySaleReport } from "../../../services/businessDashboard";
import Chart from "react-apexcharts";
import {
  formatNumberWithCommas,
  getMonthsArrayWithNames,
} from "../../../helpers/getTotalValue";

const MonthlySalesGraph = ({ count }) => {
  const [selectedMonths, setSelectedMonths] = useState("6 month");
  const [state, setState] = useState({
    chartData: [],
    chartOptions: {},
  });
  const dispatch = useDispatch();

  const handleChange = (event) => {
    if (event) {
      setSelectedMonths(event.target.value);
    }
  };

  const monthlySalesLoading = useSelector(
    (state) => state?.businessDashboard?.businessMonthlySaleReport?.loading
  );

  useEffect(() => {
    dispatch(
      getBusinessMonthlySaleReport(selectedMonths, function (res) {
        if (res?.status == "success") {
          let graphData = res?.data;

          if (graphData) {
            let chartData = graphData[0]?.monthsAndCount?.sort(
              (a, b) => a?.month - b?.month
            );

            const monthsArray = getMonthsArrayWithNames(chartData);

            let staticStatus = [
              {
                name: "Ready for pickup",
                data: [],
                color: "#235D5E",
              },
              {
                name: "In Processing",
                data: [],
                color: "#235D5E",
              },
              {
                name: "Completed",
                data: [],
                color: "#235D5E",
              },
              {
                name: "New Order",
                data: [],
                color: "#D3DFDF",
              },
              {
                name: "Order Accepted By Store",
                data: [],
                color: "#235D5E",
              },
              {
                name: "Order declined",
                data: [],
                color: "#235D5E",
              },
              {
                name: "Order pending for buyer approval",
                data: [],
                color: "#235D5E",
              },
            ];

            for (let i = 0; i < chartData?.length; i++) {
              if (chartData[i].count == 0) {
                for (let j = 0; j < staticStatus?.length; j++) {
                  staticStatus[j].data[i] = 0;
                }
              } else if (chartData[i]?.status_data?.length) {
                let foundIndexes = [];
                for (let k = 0; k < staticStatus?.length; k++) {
                  let found = chartData[i]?.status_data.findIndex(
                    (el) => el?.status_data?.status == staticStatus[k].name
                  );

                  if (found > -1) {
                    staticStatus[k]?.data?.push(
                      chartData[i]?.status_data[found]?.status_data?.total
                    );
                    foundIndexes.push(k);
                  } else {
                    staticStatus[k]?.data?.push(0);
                  }
                }
              }
            }

            const options = {
              chart: {
                height: 350,
                type: "area",
                toolbar: {
                  show: false,
                },
              },
              stroke: {
                width: 2.5, // Sets the line width of the series and grid lines
                dashArray: [0, 0], // Sets the dash pattern of the series and grid lines
              },
              grid: {
                borderColor: "#ebebeb", // Sets the color of the grid lines
                strokeDashArray: 7, // Sets the dash pattern of the grid lines
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: true,
                  shadeIntensity: 0.7,
                  gradientToColors: undefined,
                  inverseColors: true,
                  opacityFrom: 0.4, // Set the starting opacity of the area shade
                  opacityTo: 0.1, // Set the ending opacity of the area shade
                  stops: [0, 100],
                },
              },
              dataLabels: {
                enabled: false,
              },
              legend: {
                show: false, // Hide the legend
              },
              xaxis: {
                type: "category",
                categories:
                  monthsArray && monthsArray
                    ? monthsArray
                    : [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                crosshairs: {
                  show: true,
                  width: 1,
                  position: "front",
                  opacity: 0.5,
                  stroke: {
                    color: "#235D5E",
                    width: 2,
                    dashArray: 0,
                  },
                  fill: {
                    type: "gradient",
                    color: "#235D5E",
                    gradient: {
                      colorFrom: "#235D5E",
                      colorTo: "#235D5E",
                      stops: [0, 100],
                      opacityFrom: 0.6,
                      opacityTo: 0.9,
                    },
                  },
                  dropShadow: {
                    enabled: false,
                    top: 0,
                    left: 0,
                    blur: 1,
                    opacity: 0.4,
                  },
                },
              },

              tooltip: {
                enabled: true, // Enable the tooltip
                shared: true, // Set to true if you want to display a single tooltip for multiple series
                x: {
                  show: true,
                  format: "dd MMM yyyy",
                  formatter: function (
                    value,
                    { series, seriesIndex, dataPointIndex, w }
                  ) {
                    const date = new Date();
                    const year = date.getFullYear();
                    const month =
                      w?.globals?.categoryLabels[dataPointIndex]?.length > 0
                        ? w?.globals?.categoryLabels[dataPointIndex]
                        : w?.config?.xaxis?.categories[dataPointIndex];
                    const tooltipTitle = month + " " + year;
                    return tooltipTitle;
                  },
                },
                y: {
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
            };

            setState({
              ...state,
              chartOptions: options,
              chartData: staticStatus,
            });
          }
        }
      })
    );
  }, [count, selectedMonths]);

  return (
    <Box display="flex" width="100%" justifyContent="space-around">
      <Box width="100%" pr={{ xs: 0, sm: 2 }}>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={6}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: "#101828",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              Monthly Sales Revenue
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Select
              labelId="demo-simple-select-label"
              className="pharmacies-select"
              id="demo-simple-select"
              disabled={state?.chartData?.every((el) => el?.data?.length == 0)}
              input={<OutlinedInput notched={false} />}
              value={selectedMonths}
              label=""
              onChange={handleChange}
            >
              <MenuItem value={"3 month"}>{"3 month"}</MenuItem>
              <MenuItem value={"6 month"}>{"6 month"}</MenuItem>
              <MenuItem value={"7 month"}>{"7 month"}</MenuItem>
            </Select>
          </Grid>
        </Grid>
        {monthlySalesLoading ? (
          <Box
            minHeight="350px"
            maxHeight="350px"
            justifyContent="center"
            display="flex"
            alignItems="center"
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            {state?.chartData &&
            state?.chartData?.length > 0 &&
            !state?.chartData?.every((el) => el?.data?.length == 0) ? (
              <Box id="chart" className="cusAreaChart">
                <Chart
                  options={state?.chartOptions}
                  series={state?.chartData || []}
                  type="area"
                  height={350}
                />
              </Box>
            ) : (
              <Box
                minHeight="350px"
                maxHeight="350px"
                justifyContent="center"
                display="flex"
                alignItems="center"
              >
                No revenue are available!
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

export default MonthlySalesGraph;
