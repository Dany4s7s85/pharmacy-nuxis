import React, { useState, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import { IconButton, InputLabel, FormControl, Select } from '@mui/material';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import {
  getCurrentUserPharmacyPermissions,
  getPharmToken,
  pharmacyLoginSuccess,
} from '../../services/BAuth';
import {
  setChoosenDetail,
  setConversations,
  setRecentConversations,
} from '../../services/chat';
import { setCookie } from '../../helpers/common';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router';
export default function StoreModal({ open, onClose, isProductPage }) {
  const [pharmLoading, setPharmLoading] = useState(false);
  const { setPharmacyAllowedPages } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { user, isSessionExpired } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const presponse = useSelector(
    (state) => state?.auth.allowed_pharmacies?.response
  );
  const handleClose = () => {
    onClose();
  };
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    setPharmacies(presponse?.stores);
  }, [presponse]);
  const handleChange = (event) => {
    const { value } = event.target;

    let id = pharmacies?.find((el) => el.store_name == value)?.id;
    setPharmLoading(true);
    dispatch(
      getPharmToken(
        id,
        function (resp) {
          if (resp) {
            setTimeout(() => {
              dispatch(setChoosenDetail(null));
              dispatch(setRecentConversations([]));
              dispatch(setConversations([]));
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

                    if (res.data.permissions.length == 0) {
                      toast.warn('You dont have permissions');
                      setPharmLoading(false);
                    } else {
                      user.store = resp?.data?.store;
                      dispatch(pharmacyLoginSuccess({ data: { ...user } }));
                      setPharmLoading(false);
                      onClose();
                      if (isProductPage != undefined) {
                        isProductPage &&
                          navigate('/dash/add-product', { replace: true });
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

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-mui">
          <Box className="modal-header-mui">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select Store
            </Typography>
            <IconButton className="modal-clear-btn" onClick={() => onClose()}>
              <ClearIcon />
            </IconButton>
            <Divider style={{ borderColor: '#ccc' }} />
          </Box>
          <Box className="modal-content-mui">
            <Box sx={{ minWidth: 120 }}>
              {pharmLoading ? (
                <CircularProgress sx={{ color: ' #235D5E' }} />
              ) : (
                <FormControl size="small" fullWidth>
                  <InputLabel id="demo-simple-select-label">Stores</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    className="pharmacies-select"
                    id="demo-simple-select"
                    value={user && user?.store ? user?.store?.store_name : ''}
                    label="Stores"
                    onChange={(e) => handleChange(e)}
                  >
                    {pharmacies &&
                      pharmacies?.length > 0 &&
                      pharmacies?.map((option, i) => {
                        return (
                          <MenuItem key={i} value={option?.store_name}>
                            {option?.store_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
