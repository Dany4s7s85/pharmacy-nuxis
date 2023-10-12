import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { getStoreTopSellingProducts } from "../../../services/pharmacyDashboard";
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  Avatar,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { capitalize } from "../../../helpers/formatting";
import MuiDataGridTable from "../../../shared/components/MuiTable";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import { getFormattedDate } from "../../../shared/utils/getFormattedDate";
import { formatNumberWithCommas } from "../../../helpers/getTotalValue";

const SellingOrdersTable = ({ count }) => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [fromDate, setfromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const dispatch = useDispatch();

  const topSellingProductsLoading = useSelector(
    (state) => state?.pharmacyDashboard?.topSellingProducts?.loading
  );

  useEffect(() => {
    if (count) {
      setLimit(5);
      setfromDate("");
      setToDate("");
    }

    dispatch(
      getStoreTopSellingProducts(5, "", "", function (response) {
        if (response?.status == "success") {
          setTopSellingProducts(response?.data);
        }
      })
    );
  }, [count]);

  const handleTableLimitChange = (event) => {
    if (event?.target?.value) {
      setLimit(`${event?.target?.value}`);
      dispatch(
        getStoreTopSellingProducts(
          event?.target?.value,
          fromDate ? fromDate : "",
          toDate ? toDate : "",
          function (response) {
            if (response?.status == "success") {
              setTopSellingProducts(response?.data);
            }
          }
        )
      );
    }
  };

  const handleTableFromDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setfromDate(date);
      dispatch(
        getStoreTopSellingProducts(
          limit ? limit : "",
          date,
          toDate ? toDate : "",
          function (response) {
            if (response?.status == "success") {
              setTopSellingProducts(response?.data);
            }
          }
        )
      );
    }
  };

  const handleTableToDateChange = (newValue) => {
    const date = getFormattedDate(`${newValue?.toISOString()}`);
    if (date) {
      setToDate(date);
      dispatch(
        getStoreTopSellingProducts(
          limit ? limit : "",
          fromDate ? fromDate : "",
          date,
          function (response) {
            if (response?.status == "success") {
              setTopSellingProducts(response?.data);
            }
          }
        )
      );
    }
  };

  const handleRemoveTableFromDate = () => {
    setfromDate("");
    dispatch(
      getStoreTopSellingProducts(
        limit ? limit : "",
        "",
        toDate ? toDate : "",
        function (response) {
          if (response?.status == "success") {
            setTopSellingProducts(response?.data);
          }
        }
      )
    );
  };

  let columns = [
    {
      field: "markets",
      headerName: "Markets",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <IconButton>
              {params &&
              params?.row?.imageCover &&
              params?.row?.imageCover?.full_image &&
              params?.row?.imageCover?.full_image ? (
                <Avatar alt="Image" src={params?.row?.imageCover?.full_image} />
              ) : (
                <Avatar alt="Product Name">
                  {capitalize(params?.row?.product_name?.substring(0, 1))}
                </Avatar>
              )}
            </IconButton>
          </Box>
        );
      },
    },
    {
      field: "products",
      headerName: "Products",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText text-ellipses">
              {params?.row?.product_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            {params?.row?.maxPrice == params?.row?.minPrice ? (
              <Typography className="rowText text-ellipses">
                ${formatNumberWithCommas(params?.row?.maxPrice)}
              </Typography>
            ) : (
              <Typography className="rowText text-ellipses">
                ${formatNumberWithCommas(params?.row?.minPrice)} - $
                {formatNumberWithCommas(params?.row?.maxPrice)}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "customers",
      headerName: "Customers",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText text-ellipses">
              {formatNumberWithCommas(params?.row?.totalCustomer)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "total_sold",
      headerName: "Total Sold",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText text-ellipses">
              {formatNumberWithCommas(params?.row?.totalSold)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "total_sales",
      headerName: "Total Sales",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText text-ellipses">
              $
              {formatNumberWithCommas(
                parseFloat(Number(params?.row?.totalPrice))?.toFixed(2)
              )}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const handleRemoveTableToDate = () => {
    setToDate("");
    dispatch(
      getStoreTopSellingProducts(
        limit ? limit : "",
        fromDate ? fromDate : "",
        "",
        function (response) {
          if (response?.status == "success") {
            setTopSellingProducts(response?.data);
          }
        }
      )
    );
  };

  return (
    <Box height=" 100%" pl={{ xs: 0, lg: 2 }}>
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
            Top products
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} mt={{ xs: 2, sm: 0 }}>
          <Grid container spacing={1} alignItems="center" justifyContent="end">
            <Grid item xs={12} sm={4}>
              <Box
                sx={{ width: { xs: "100%", sm: "50%" }, marginLeft: "auto" }}
              >
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Limit"
                    className="selectLimit"
                    input={<OutlinedInput notched={false} />}
                    disabled={
                      topSellingProductsLoading ||
                      !topSellingProducts?.length > 0
                        ? true
                        : false
                    }
                    name="limit"
                    value={limit}
                    onChange={handleTableLimitChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box display="flex" position="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="From Date"
                    inputFormat="MM/DD/YYYY"
                    className="datePickerSelect"
                    disabled={
                      topSellingProductsLoading ||
                      !topSellingProducts?.length > 0
                        ? true
                        : false
                    }
                    value={fromDate ? fromDate : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        if (newValue?.$d && newValue?.$d != "Invalid Date") {
                          handleTableFromDateChange(newValue);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" error={false} />
                    )}
                  />
                  {!topSellingProductsLoading && fromDate && fromDate ? (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "30px",
                        top: "5px",
                      }}
                      onClick={handleRemoveTableFromDate}
                    >
                      <CloseIcon fontSize="12px" />
                    </Box>
                  ) : null}
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box display="flex" position="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="To Date"
                    inputFormat="MM/DD/YYYY"
                    className="datePickerSelect"
                    disabled={
                      topSellingProductsLoading ||
                      !topSellingProducts?.length > 0
                        ? true
                        : false
                    }
                    value={toDate ? toDate : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        if (newValue?.$d && newValue?.$d != "Invalid Date") {
                          handleTableToDateChange(newValue);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        className=""
                        {...params}
                        error={false}
                        size="small"
                      />
                    )}
                  />
                  {!topSellingProductsLoading && toDate && toDate ? (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "30px",
                        top: "5px",
                      }}
                      onClick={handleRemoveTableToDate}
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

      <Box className="table-card">
        {topSellingProductsLoading ? (
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
              topSellingProducts && topSellingProducts?.length > 0
                ? topSellingProducts
                : []
            }
            getRowId={(row) => Math.random()}
            columns={columns}
          />
        )}
      </Box>
      <Box className="card-table" sx={{ width: "100%" }}>
        {topSellingProductsLoading ? (
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
            {topSellingProducts && topSellingProducts?.length > 0
              ? topSellingProducts?.map((params, ind) => {
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
                                  {params &&
                                  params?.imageCover &&
                                  params?.imageCover?.full_image &&
                                  params?.imageCover?.full_image ? (
                                    <Avatar
                                      alt="Image"
                                      src={params?.imageCover?.full_image}
                                    />
                                  ) : (
                                    <Avatar alt="Product Name">
                                      {capitalize(
                                        params?.product_name?.substring(0, 1)
                                      )}
                                    </Avatar>
                                  )}
                                  <Typography
                                    className="card-field-14 text-ellipses"
                                    sx={{ marginLeft: "10px" }}
                                  >
                                    {params?.product_name}
                                  </Typography>
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
                                Price
                              </Typography>
                              <Typography className="card-field-14">
                                {params?.maxPrice == params?.minPrice ? (
                                  <Typography className="card-field-14 text-ellipses">
                                    ${formatNumberWithCommas(params?.maxPrice)}
                                  </Typography>
                                ) : (
                                  <Typography className="card-field-14 text-ellipses">
                                    ${formatNumberWithCommas(params?.minPrice)}-
                                    ${formatNumberWithCommas(params?.maxPrice)}
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                            <Box
                              flexDirection={"column"}
                              justifyContent={"flex-end"}
                              textAlign={"end"}
                            >
                              <Typography className="card-field-12">
                                Customers
                              </Typography>
                              <Typography className="card-field-14">
                                {formatNumberWithCommas(params?.totalCustomer)}
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
                                Total Sold
                              </Typography>

                              <Typography className="text-ellipses card-field-14">
                                {formatNumberWithCommas(params?.totalSold)}
                              </Typography>
                            </Box>

                            <Box
                              flexDirection={"column"}
                              justifyContent={"flex-end"}
                              textAlign={"end"}
                            >
                              <Typography
                                sx={{ whiteSpace: "nowrap" }}
                                className="card-field-12"
                              >
                                Total Sales
                              </Typography>

                              <Typography className="text-ellipses card-field-14">
                                $
                                {formatNumberWithCommas(
                                  parseFloat(
                                    Number(params?.totalPrice)
                                  )?.toFixed(2)
                                )}
                              </Typography>
                            </Box>
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
    </Box>
  );
};

export default SellingOrdersTable;
