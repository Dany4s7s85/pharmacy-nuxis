import React, { useState, useEffect, useCallback, useContext } from 'react';
import { OutlinedInput, Switch, Tooltip, styled, Card } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import {
  getPharmacyMembers,
  sentLinkAgainTOAddMember,
  updateMemberStatus,
} from '../../services/members';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Pagination from '../../shared/components/Pagination';
import debounce from 'lodash.debounce';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../assets/images/searchIcon.svg';
import TextField from '@mui/material/TextField';
import AddMember from './addMember';
import { capitalize } from '../../helpers/formatting';
import useDialogModal from '../../hooks/useDialogModal';
import { AuthContext } from '../../context/authContext';
import { ClipLoader } from 'react-spinners';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import eye from '../../assets/images/eye.svg';
import './orders.scss';
import MuiDataGridTable from '../../shared/components/MuiTable';

const Members = () => {
  const dispatch = useDispatch();
  const response = useSelector((state) => state?.members?.members?.response);
  const loading = useSelector((state) => state?.members?.members?.loading);
  const [customLoading, setCustomLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [memberId, setMemberId] = useState('');
  const [memberStatusLoading, setMemeberStatusLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [regenerateLinkId, setRegenerateLinkId] = useState('');
  const [state, setState] = useState({
    members: [],
    count: 0,
  });

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 35,
    height: 18,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 1,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2ECA45' : '#56BA9B',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 16,
      height: 16,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const sentLinkToaddMemberloading = useSelector(
    (state) => state?.members?.sentLinkToaddMember?.loading
  );

  const { hasPermissionsOfBusiness } = useContext(AuthContext);
  const [AddMemberDialog, showAddMemberDialog, closeAddMemberDialog] =
    useDialogModal(AddMember);

  useEffect(() => {
    dispatch(
      getPharmacyMembers('', '', page, limit, function (res) {
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
      members:
        response?.members && response?.members?.length ? response?.members : [],
      count: buttonsCount,
    });
  }, [response]);

  const handlePageChange = useCallback((e, value) => {
    dispatch(
      getPharmacyMembers(
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
        getPharmacyMembers(
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

  const handleMemberStatusChange = (memberId, status) => {
    let tempMembers = [...state.members];
    let memberIndex = [...state.members]?.findIndex(
      (item) => item?._id == memberId
    );
    if (memberId && status) {
      setMemeberStatusLoading(true);
      setSelectedId(memberId);
      dispatch(
        updateMemberStatus(
          memberId,
          status,
          function (res) {
            if (res?.status == 'success') {
              if (memberIndex > -1) {
                tempMembers[memberIndex].status = status;

                setState({ ...state, members: tempMembers });
                setMemeberStatusLoading(false);
              }
            }
          },
          function (err) {
            setMemeberStatusLoading(false);
          }
        )
      );
    }
  };

  const columns = [
    {
      field: 'First Name',
      headerName: 'First Name',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="inherit" className="rowText">
              {capitalize(params?.row?.first_name)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Last Name',
      headerName: 'Last Name',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="inherit" className="rowText">
              {capitalize(params?.row?.last_name)}
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
            <Typography variant="caption" className="rowText">
              {params?.row?.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) => {
        return params?.row?.approvalStage == 'stage1' ||
          params?.row?.approvalStage == 'stage2' ? (
          <Box>
            <Typography variant="caption" className="rowText">
              Pending
            </Typography>
          </Box>
        ) : params?.row?.is_verified == false &&
          params?.row?.approvalStage == 'stage3' ? (
          <Box>
            <Typography variant="caption" className="rowText">
              Rejected
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="caption" className="rowText">
              {capitalize(params?.row?.status)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Role',
      headerName: 'Role',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="caption" className="rowText">
              {capitalize(params?.row?.role)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Mobile No #',
      headerName: 'Mobile No #',
      flex: 2,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="caption" className="rowText">
              {params?.row?.mobile_no}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 2,
      renderCell: (params) => {
        return (
          <>
            <Box sx={{ display: 'flex' }}>
              <IconButton
                onClick={() => {
                  setMemberId(params?.row?._id);
                  showAddMemberDialog();
                }}
              >
                <img src={eye} />
              </IconButton>
              {selectedId == params?.row?._id && memberStatusLoading ? (
                <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
              ) : (
                <>
                  {params?.row?._id ? (
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={
                        params?.row?.is_verified &&
                          params?.row?.status == 'approved'
                          ? true
                          : false
                      }
                      disabled={
                        !params?.row?.is_verified ||
                        params?.row?.approvalStage == 'stage1' ||
                        params?.row?.status == 'suspended_by_admin'
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                      value={params?.row?.status}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          handleMemberStatusChange(
                            params?.row?._id,
                            'approved'
                          );
                        } else {
                          handleMemberStatusChange(
                            params?.row?._id,
                            'suspended'
                          );
                        }
                      }}
                    />
                  ) : null}
                </>
              )}

              {params?.row?.approvalStage == 'stage1' &&
                (sentLinkToaddMemberloading &&
                  params?.row?._id == regenerateLinkId ? (
                  <Box sx={{ padding: '8px 0px' }}>
                    <ClipLoader size={20} color="purple" loading />
                  </Box>
                ) : (
                  <IconButton
                    variant="contained"
                    onClick={() => {
                      setRegenerateLinkId(params?.row?._id);
                      handleSentLinkAgainToAddMember(params?.row?._id);
                    }}
                  >
                    <Tooltip title="Regenerate Link">
                      <ForwardToInboxIcon fontSize="medium" />
                    </Tooltip>
                  </IconButton>
                ))}
            </Box>
          </>
        );
      },
    },
  ];

  const handleSentLinkAgainToAddMember = (id) => {
    if (id) {
      dispatch(
        sentLinkAgainTOAddMember(id, function (res) {
          if (res) {
          }
        })
      );
    }
  };

  const handleStatus = (e) => {
    setPage(1);
    dispatch(
      getPharmacyMembers(
        search ? search : '',
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
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Approved',
      value: 'approved',
    },
    {
      label: 'Rejected',
      value: 'Cancelled',
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
          sx={{ color: '#101828', fontWeight: '700', fontSize: '24px' }}
        >
          Members
        </Typography>
        <Box textAlign={"end"} display={"flex"}>
          <FormControl variant="filled" sx={{ width: { xs: "65%", sm: "250px" } }}>
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
                  <InputAdornment position="start" sx={{ margin: '-6px' }}>
                    <img src={searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl sx={{ width: { xs: "35%", sm: "160px" }, textAlign: "start", ml: 1 }} size="small">
            <Select
              className="membersSelect"
              labelId="demo-simple-select-label"
              placeholder="Status"
              id="demo-simple-select"
              input={<OutlinedInput notched={false} />}
              value={status}
              onChange={(e) => handleStatus(e)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                <Typography
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#9FA3A9',
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
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#9FA3A9',
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

      <Box className="table-card">
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
              state?.members && state?.members?.length > 0 ? state?.members : []
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
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        ) : (
          <>
            {state?.members.map((params, ind) => {
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
                        First Name
                      </Typography>
                      <Typography className='card-field'>
                        {capitalize(params?.first_name)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                      <Typography className='card-field'>
                        Last Name
                      </Typography>
                      <Typography className='card-field'>
                        {capitalize(params?.last_name)}
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
                        Status
                      </Typography>
                      <Box>
                        {params?.approvalStage == 'stage1' ||
                          params?.approvalStage == 'stage2' ? (
                          <Box>
                            <Typography className='card-field'>
                              Pending
                            </Typography>
                          </Box>
                        ) : params?.is_verified == false &&
                          params?.approvalStage == 'stage3' ? (
                          <Box>
                            <Typography className='card-field'>
                              Rejected
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography className='card-field'>
                              {capitalize(params?.status)}
                            </Typography>
                          </Box>
                        )
                        }
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                      <Typography className='card-field'>
                        Role
                      </Typography>
                      <Typography className='card-field'>
                        {capitalize(params?.role)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                      <Typography className='card-field'>
                        Mobile No #
                      </Typography>
                      <Typography className='card-field'>
                        {params?.mobile_no}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                      <Typography className='card-field'>
                        Action
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton
                          padding={"0px"}
                          onClick={() => {
                            setMemberId(params?._id);
                            showAddMemberDialog();
                          }}
                        >
                          <img src={eye} />
                        </IconButton>
                        {selectedId == params?._id && memberStatusLoading ? (
                          <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
                        ) : (
                          <>
                            {params?._id ? (
                              <IOSSwitch
                                sx={{ margin: "5px 0px 0px 5px" }}
                                checked={
                                  params?.is_verified &&
                                    params?.status == 'approved'
                                    ? true
                                    : false
                                }
                                disabled={
                                  !params?.is_verified ||
                                  params?.approvalStage == 'stage1' ||
                                  params?.status == 'suspended_by_admin'
                                }
                                inputProps={{ 'aria-label': 'controlled' }}
                                value={params?.status}
                                onChange={(e) => {
                                  if (e?.target?.checked) {
                                    handleMemberStatusChange(
                                      params?._id,
                                      'approved'
                                    );
                                  } else {
                                    handleMemberStatusChange(
                                      params?._id,
                                      'suspended'
                                    );
                                  }
                                }}
                              />
                            ) : null}
                          </>
                        )}

                        {params?.approvalStage == 'stage1' &&
                          (sentLinkToaddMemberloading &&
                            params?._id == regenerateLinkId ? (
                            <Box sx={{ padding: '8px 0px' }}>
                              <ClipLoader size={20} color="purple" loading />
                            </Box>
                          ) : (
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                setRegenerateLinkId(params?._id);
                                handleSentLinkAgainToAddMember(params?._id);
                              }}
                            >
                              <Tooltip title="Regenerate Link">
                                <ForwardToInboxIcon fontSize="medium" />
                              </Tooltip>
                            </IconButton>
                          ))}
                      </Box>
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
          {hasPermissionsOfBusiness('members.addMember') && (
            <Button
              variant="contained"
              className="containedPrimary"
              startIcon={
                <AddIcon />
              }
              onClick={() => showAddMemberDialog()}
            >
              Add Member
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
        {hasPermissionsOfBusiness('members.addMember') && (
          <Button
            variant="contained"
            className="containedPrimary"
            startIcon={
              <AddIcon />
            }
            onClick={() => showAddMemberDialog()}
          >
            Add Member
          </Button>
        )}
      </Box>

      <AddMemberDialog id={memberId} setMemberId={setMemberId} />
    </>
  );
};

export default Members;
