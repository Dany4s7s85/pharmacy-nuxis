import React, { useEffect, useState, useRef, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import { Formik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useDialogModal from "../../hooks/useDialogModal";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import WatchListModal from "./WatchlistModal";
import searchIcon from "../../assets/images/searchIcon.svg";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { ClipLoader } from "react-spinners";
import {
  Container,
  FormControl,
  Stack,
  Typography,
  InputAdornment,
} from "@mui/material";
import { capitalize } from "../../helpers/formatting";
import Pagination from "../../shared/components/Pagination";
import debounce from "lodash.debounce";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteWatchList, getAllWatchList } from "../../services/products";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import notav from "../../assets/images/notav.svg";
import av from "../../assets/images/av.svg";
import pencil from "../../assets/images/pencil.svg";
import bin from "../../assets/images/bin.svg";
export const Watchlist = () => {
  const [watchListId, setWatchListId] = useState("");
  const [deleteWatchListId, setDeleteWatchListId] = useState("");
  const response = useSelector(
    (state) => state?.product?.getAllWatchList?.response
  );
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [watchLists, setWatchLists] = useState({});
  const navigate = useNavigate();
  const [state, setState] = useState({
    watchList: watchLists?.watchList,
    count: 0,
  });

  const dispatch = useDispatch();
  const getAllWatchListLoading = useSelector(
    (state) => state?.product?.getAllWatchList?.loading
  );
  const deleteWatchListLoading = useSelector(
    (state) => state?.product?.deleteWatchList?.loading
  );
  const [customLoading, setCustomLoading] = useState(true);
  const [WatchListDialog, showWatchListDialog, closeWatchListDialog] =
    useDialogModal(WatchListModal);

  useEffect(() => {
    dispatch(
      getAllWatchList("", page, limit, function (response) {
        // setWatchLists(response?.data);
        setCustomLoading(false);
      })
    );
  }, [count]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getAllWatchList(search ? search : "", value, limit, function (res) {
        if (res?.status == "success") {
          // setWatchLists(res?.data);
        }
      })
    );
    setPage(value);
    setCustomLoading(false);
  }, []);

  const debouncedGetSearch = useCallback(
    debounce((query) => {
      setPage(1);
      dispatch(
        getAllWatchList(query, page, limit, function (res) {
          if (res?.status == "success") {
            // setWatchLists(res?.data);
          }
        })
      );
    }, 1000),
    []
  );
  const searchText = (e) => {
    setSearch(e.target.value);
    debouncedGetSearch(e.target.value, page, limit);
  };
  useEffect(() => {
    const count = response?.count;
    const perPage = 10;
    const buttonsCount = Math.ceil(count / perPage);
    setState({
      ...state,
      watchList: response?.watchList,
      count: buttonsCount,
    });
  }, [response]);

  const columns = [
    {
      field: "DIN_NO",
      headerName: "DIN Number",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography className="rowText">{params?.row?.DIN_NO}</Typography>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.status == "available" ? (
              <Box
                sx={{ background: "#E9EFEF" }}
                borderRadius="16px"
                padding="3px 15px"
                color="#235D5E"
                textTransform="capitalize"
              >
                <Typography variant="caption" fontSize="12px" fontWeight="500">
                  {params?.row?.status}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{ background: "#FEE4E2" }}
                borderRadius="16px"
                padding="3px 15px"
                color="#F04438"
                textTransform="capitalize"
              >
                <Typography variant="caption" fontSize="12px" fontWeight="500">
                  Not Available
                </Typography>
              </Box>
            )}
          </>
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
            {params?.row?._id ? (
              <>
                <IconButton
                  onClick={() => {
                    setWatchListId(params?.row?._id);
                    showWatchListDialog();
                  }}
                >
                  <img src={pencil} />
                </IconButton>
              </>
            ) : null}

            {deleteWatchListLoading && params?.row?._id == deleteWatchListId ? (
              <ClipLoader size={25} sx={{ color: " #235D5E" }} loading />
            ) : params?.row?._id ? (
              <IconButton
                variant="contained"
                id={params?.row?._id}
                onClick={() => {
                  setDeleteWatchListId(params?.row?._id);
                  dispatch(
                    deleteWatchList(params?.row?._id, function (res) {
                      if (res?.status == "success") {
                        setCount((prev) => prev + 1);
                      }
                    })
                  );
                }}
              >
                <img src={bin} />
              </IconButton>
            ) : null}

            {params?.row?.status == "available" ? (
              <Button
                variant="contained"
                size="small"
                className="containedPrimary"
                onClick={() =>
                  navigate(
                    `/products/${params?.row?.product?.name}/${params?.row?.product?.DIN_NO}`
                  )
                }
              >
                Go to Product
              </Button>
            ) : null}
          </>
        );
      },
    },
  ];

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      padding={{ xs: "0px", sm: "0rem 4.5rem" }}
    >
      <Box sx={{ width: "100%" }}>
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          alignItem="center"
          marginBottom={{ xs: "10px ", sm: "15px" }}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              fontSize={{ xs: 24, sm: 30 }}
              fontWeight={500}
              sx={{ color: "#000000" }}
            >
              Watchlist
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} textAlign="right">
            <FormControl
              sx={{
                "@media (max-width: 400px)": {
                  width: "100%",
                },
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                onChange={searchText}
                InputLabelProps={{ shrink: false }}
                className="authfield"
                placeholder="Search here"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ margin: "-6px" }}>
                      <img src={searchIcon} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ height: 400, width: "100%" }}>
          {getAllWatchListLoading ? (
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
              getRowId={(row) => row._id}
              rows={state?.watchList ? state?.watchList : []}
              columns={columns}
              hideFooter={true}
              hideFooterRowCount={true}
            />
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={{ xs: "10px", sm: "0px" }}
        >
          <Button
            onClick={() => showWatchListDialog()}
            variant="contained"
            sx={{
              padding: {
                xs: "5px 10px !important",
                sm: "8px 24px !important",
              },
              fontSize: { xs: "14px !important", sm: "16px !important" },
            }}
            size="medium"
            className="containedPrimary"
            startIcon={
              <AddIcon sx={{ display: { xs: "none", sm: "block" } }} />
            }
          >
            Add to Watchlist
          </Button>
          {!customLoading &&
            (state?.watchList?.length > 0 ? (
              <Stack spacing={2}>
                <Pagination
                  totalCount={state?.count}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Stack>
            ) : null)}
        </Box>
        <WatchListDialog
          id={watchListId}
          setWatchListId={setWatchListId}
          setCount={setCount}
        />
      </Box>
    </Box>
  );
};
export default Watchlist;
