import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Dialog, DialogTitle, IconButton, Card } from '@mui/material';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUserPharmacies,
  getPharmToken,
  getCurrentUserPharmacyPermissions,
} from '../../services/BAuth';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import moment from 'moment/moment';
import Stack from '@mui/material/Stack';
import Pagination from '../../shared/components/Pagination';
import debounce from 'lodash.debounce';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useLocation, useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import AddPharmacy from '../addStore';
import { pharmacyLoginSuccess } from '../../services/BAuth';
import { AuthContext } from '../../context/authContext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { setCookie } from '../../helpers/common';
import { capitalize } from '../../helpers/formatting';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import {
  setChoosenDetail,
  setConversations,
  setRecentConversations,
} from '../../services/chat';
import searchIcon from '../../assets/images/searchIcon.svg';
import './stores.scss';
import MuiDataGridTable from '../../shared/components/MuiTable';

const Pharmacies = () => {
  const { user } = useSelector((state) => state?.auth);
  const location = useLocation();
  const { pharmacyAllowedPages, setPharmacyAllowedPages } =
    useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { hasPermissionsOfBusiness } = useContext(AuthContext);
  const dispatch = useDispatch();
  const response = useSelector(
    (state) => state?.auth.allowed_pharmacies?.response
  );
  const navigate = useNavigate();
  const [pharmLoading, setPharmLoading] = useState(false);
  const loading = useSelector(
    (state) => state?.auth.allowed_pharmacies?.loading
  );
  const [customLoading, setCustomLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [state, setState] = useState({
    pharmacies: [],
    count: 0,
  });

  const [index, setIndex] = useState('');

  useEffect(() => {
    dispatch(
      getCurrentUserPharmacies('', '', page, limit, function (res) {
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
      pharmacies:
        response?.stores && response?.stores?.length ? response?.stores : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getCurrentUserPharmacies(
        search ? search : '',
        status ? status : '',
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
        getCurrentUserPharmacies(
          query,
          status ? status : '',
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
    debouncedGetSearch(e.target.value, '', page, limit);
  };

  const handlePharmToken = (id) => {
    setIndex(id);
    setPharmLoading(true);
    dispatch(
      getPharmToken(
        id,
        function (resp) {
          if (resp) {
            dispatch(setChoosenDetail(null));
            dispatch(setRecentConversations([]));
            dispatch(setConversations([]));
            setTimeout(() => {
              dispatch(
                getCurrentUserPharmacyPermissions(
                  resp?.data?.store?._id,
                  function (res) {
                    setPharmacyAllowedPages([
                      ...res?.data?.permissions
                        .filter((p) => p?.includes('.nav'))
                        .map((p) => p?.split('.')[0]),
                    ]);

                    setCookie(
                      'dash_allowed_pages',
                      JSON.stringify([
                        ...res?.data?.permissions
                          .filter((p) => p?.includes('.nav'))
                          .map((p) => p?.split('.')[0]),
                      ])
                    );

                    if (res?.data?.permissions?.length == 0) {
                      toast.warn('You dont have permissions');
                      setPharmLoading(false);
                    } else {
                      user.store = resp?.data?.store;
                      dispatch(pharmacyLoginSuccess({ data: { ...user } }));
                      dispatch(setChoosenDetail(null));
                      dispatch(setRecentConversations([]));
                      setPharmLoading(false);
                      if (location?.state) {
                        let pId = location?.state?.split('/')[2];
                        let din = location?.state?.split('/')[3];
                        navigate(`/products/${pId}/${din}`);
                      } else {
                        navigate('/dash/store-dashboard');
                      }
                    }
                  }
                )
              );
            }, 10);
          }
        },
        function (err) {
          setPharmLoading(false);
        }
      )
    );
  };

  const columns = [
    {
      field: 'Store Name',
      headerName: 'Store Name',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {capitalize(params?.row?.store_name)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Email',
      headerName: 'Email',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">{params?.row?.email}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography
              className="rowText"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {capitalize(params?.row?.type)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Created At',
      headerName: 'Created At',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography
              className="rowText"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {`${moment(params?.row?.createdAt).format(
                'MMMM Do YYYY, h:mm:ss a'
              )}`}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {capitalize(params?.row?.status)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'City',
      headerName: 'City',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography className="rowText">
              {capitalize(params?.row?.city)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <>
              {pharmLoading && params?.row?.id == index ? (
                <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
              ) : params?.row?.status == 'approved' ? (
                <IconButton onClick={() => handlePharmToken(params?.row?.id)}>
                  <OpenInNewIcon sx={{ color: '#1E1E1E' }} />
                </IconButton>
              ) : (
                <Chip label={`${params?.row?.status}`} color="warning" />
              )}
            </>
          </Box>
        );
      },
    },
  ];

  const handleStatus = (e) => {
    setPage(1);
    dispatch(
      getCurrentUserPharmacies(
        search ? search : '',
        e.target.value,
        1,
        limit,
        function (res) { }
      )
    );

    setStatus(e.target.value);
  };

  return (
    <>
      <Box className="admin-layout" component="div">
        <Box
          sx={{
            display: { xs: "contents", sm: "flex", md: "flex" },
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: '#101828', fontWeight: '700', fontSize: '24px' }}
            >
              Stores
            </Typography>
          </Box>
          <Box textAlign={"end"}>
            <FormControl variant="filled" sx={{ width: { xs: "100%", sm: "250px" } }}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                id="outlined-basic"
                className="authfield"
                placeholder="Search here"
                onChange={searchText}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ margin: '-6px' }}>
                      <img src={searchIcon} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%' } }}
              />
            </FormControl>
          </Box>
        </Box>
        <Box className="table-card" sx={{ width: '100%' }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <CircularProgress sx={{ color: ' #235D5E' }} />
            </Box>
          ) : (
            <MuiDataGridTable
              rows={
                state?.pharmacies && state?.pharmacies?.length > 0
                  ? state?.pharmacies
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
              <CircularProgress sx={{ color: "#235D5E" }} />
            </Box>
          ) : (
            <>
              {state?.pharmacies.map((params, ind) => {
                return (
                  <>
                    <Card
                      sx={{
                        borderRadius: "6px",
                        padding: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>

                        </Typography>
                        <Typography sx={{ color: "black", fontSize: "12px" }}>
                          {`${moment(params?.row?.createdAt).format(
                            'MMMM Do YYYY, h:mm:ss a'
                          )}`}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          Store Name
                        </Typography>
                        <Typography className='card-field'>
                          {capitalize(params?.store_name)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          Email
                        </Typography>
                        <Typography className='card-field'>
                          {params?.email}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          Type
                        </Typography>
                        <Typography className='card-field'>
                          {capitalize(params?.type)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          Status
                        </Typography>
                        <Typography className='card-field'>
                          {capitalize(params?.status)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          City
                        </Typography>
                        <Typography className='card-field'>
                          {capitalize(params?.city)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography className='card-field'>
                          Action
                        </Typography>
                        <Typography className='card-field'>
                          {pharmLoading && params?.id == index ? (
                            <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
                          ) : params?.status == 'approved' ? (
                            <IconButton sx={{ padding: 0 }} onClick={() => handlePharmToken(params?.id)}>
                              <OpenInNewIcon sx={{ color: '#1E1E1E' }} />
                            </IconButton>
                          ) : (
                            <Chip label={`${params?.status}`} color="warning" />
                          )}
                        </Typography>
                      </Box>
                    </Card>
                  </>
                );
              })}
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
          <Box sx={{ width: { xs: "100%", sm: "50%" }, display: { xs: "none", sm: "flex" } }} >
            {hasPermissionsOfBusiness('stores.addPharmacy') && (
              <Button
                variant="contained"
                className="containedPrimary"
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Add Store
              </Button>
            )}
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "end" }}>
            {!customLoading && (
              <Stack spacing={2} sx={{ alignSelf: 'center' }}>
                <Pagination
                  totalCount={state?.count}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Stack>
            )}
          </Box>
        </Box>
        <Box sx={{ width: "100%", marginTop: "10px", display: { xs: "flex", sm: "none" } }} >
          {hasPermissionsOfBusiness('stores.addPharmacy') && (
            <Button
              variant="contained"
              className="containedPrimary"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add Store
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={open}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="scroll-dialog-title" className="dialog-title">
          Add New Store
        </DialogTitle>
        <AddPharmacy handleClose={() => handleClose()} />
      </Dialog>
    </>
  );
};

export default Pharmacies;
