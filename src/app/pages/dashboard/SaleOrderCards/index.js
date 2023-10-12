import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { getBusinessOrderReportingCards } from "../../../services/businessDashboard";
import {
  formatNumberWithCommas,
  getTotal,
  getTotalPercentage,
} from "../../../helpers/getTotalValue";
import CoinDollor from "../../../assets/images/coin-dollor.svg";
import readyPickup from "../../../assets/images/readyPickup.svg";
import inTransit from "../../../assets/images/inTransit.svg";
import newOrder from "../../../assets/images/newOrder.svg";
import orderDeclined from "../../../assets/images/orderDeclined.svg";
import completedIcon from "../../../assets/images/completedIcon.svg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const SaleOrderCards = ({ count }) => {
  const [orderReportingData, setOrderReportingData] = useState([]);
  const [orderReporting, setOrderReporting] = useState([
    {
      totalSaleAmount: 0.0,
      count: 0,
      percentageChange: 0,
      orderStatus: "Total Revenue",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "In Transit",
    },
    {
      totalSaleAmount: 0.0,
      count: 0,
      orderStatus: "Ready for pickup",
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

  const orderReportingloading = useSelector(
    (state) => state?.businessDashboard?.businessOrderReportingCards?.loading
  );

  useEffect(() => {
    dispatch(
      getBusinessOrderReportingCards(function (res) {
        if (res?.status == "success") {
          let data = res?.data;

          if (data) {
            data = orderReporting?.map((item) => ({
              ...item,
              ...data.find((el) => el?._id == item.orderStatus && el),
            }));

            let tempObj = {
              totalSaleAmount: getTotal(data),
              orderStatus: "Total Revenue",
              percentageChange: getTotalPercentage(data),
            };

            data?.splice(0, 1, tempObj);
          }
          setOrderReportingData([...orderReportingData, data]);
        }
      })
    );
  }, [count]);

  return (
    <>
      <Grid container spacing={0} sx={{ marginTop: { xs: "20px", sm: "0px" } }}>
        {orderReportingloading ? (
          <Box sx={{ margin: "9rem auto" }}>
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            {orderReportingData[0] && orderReportingData[0]?.length > 0 ? (
              orderReportingData[0]?.map((el, index) => {
                return (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={2}
                    display="flex"
                    justifyContent="space-around"
                    sx={{ marginBottom: "2rem" }}
                  >
                    <Box m={{ xs: "0px", sm: "auto" }}>
                      <Box display="flex">
                        <img
                          src={
                            el && el?.orderStatus == "Total Revenue"
                              ? CoinDollor
                              : el?.orderStatus == "Ready for pickup"
                              ? readyPickup
                              : el?.orderStatus == "In Transit"
                              ? inTransit
                              : el?.orderStatus == "New Order"
                              ? newOrder
                              : el?.orderStatus == "Order declined"
                              ? orderDeclined
                              : el?.orderStatus == "Completed"
                              ? completedIcon
                              : CoinDollor
                          }
                        />
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            color: "#878B93",
                            fontSize: "14px",
                            fontWeight: "400",
                            marginLeft: "6px",
                          }}
                        >
                          {el && el?.orderStatus}
                        </Typography>
                      </Box>
                      <Box sx={{ margin: "8px 0px" }}>
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{
                            color: "#101828",
                            fontSize: { xs: "20px", sm: "24px" },
                            fontWeight: "700",
                          }}
                        >
                          $
                          {el?.totalSaleAmount
                            ? formatNumberWithCommas(
                                parseFloat(
                                  Number(el?.totalSaleAmount * 100) / 100
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </Typography>
                      </Box>
                      <Box>
                        <Box display="flex" sx={{ flexFlow: "wrap" }}>
                          <>
                            {el?.percentageChange > 0 ? (
                              <>
                                <ArrowUpwardIcon
                                  sx={{
                                    fontSize: "16px",
                                    color: "#03AD54",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#03AD54",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {el?.totalSaleAmount == 0
                                    ? "0"
                                    : el?.percentageChange == 100
                                    ? "100"
                                    : parseFloat(
                                        Number(el?.percentageChange)
                                      ).toFixed(2)}
                                  %
                                </Typography>
                              </>
                            ) : (
                              <>
                                <ArrowDownwardIcon
                                  sx={{
                                    fontSize: "16px",
                                    color: "#F04438",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#F04438",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {el?.totalSaleAmount == 0
                                    ? "0"
                                    : el?.percentageChange == -100
                                    ? "-100"
                                    : parseFloat(
                                        Number(el?.percentageChange)
                                      ).toFixed(2)}
                                  %
                                </Typography>
                              </>
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#9FA3A9",
                                fontSize: "12px",
                                marginLeft: "5px",
                                fontWeight: "500",
                              }}
                            >
                              vs last month
                            </Typography>
                          </>
                        </Box>
                      </Box>
                    </Box>
                    {index < orderReportingData[0]?.length - 1 && (
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          borderColor: "#E7E8EA !important",
                          display: { xs: "none", md: "block" },
                        }}
                      />
                    )}
                    {index < orderReportingData[0]?.length - 1 &&
                      (index == 0 ||
                        index == 1 ||
                        index == 3 ||
                        index == 4 ||
                        index == 5) && (
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            borderColor: "#E7E8EA !important",
                            display: {
                              xs: "none",
                              sm: "block",
                              md: "none",
                            },
                          }}
                        />
                      )}
                    {index < orderReportingData[0]?.length - 1 &&
                      (index == 0 || index == 2 || index == 4) && (
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            borderColor: "#E7E8EA !important",
                            display: { xs: "block", sm: "none" },
                          }}
                        />
                      )}
                  </Grid>
                );
              })
            ) : (
              <Box
                justifyContent="center"
                display="flex"
                alignItems="center"
                height="100%"
              >
                No Data are available!
              </Box>
            )}
          </>
        )}
      </Grid>
      <Divider sx={{ borderColor: "#E7E8EA !important" }} />
    </>
  );
};

export default SaleOrderCards;
