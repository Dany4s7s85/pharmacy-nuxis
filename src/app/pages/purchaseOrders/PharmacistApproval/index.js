import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Backdrop, Divider, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import ApprovalStatus from '../ApprovalStatus';
import Button from '@mui/material/Button';
import { getPurchaseOrderDetail } from '../../../services/orders';
import CircularProgress from '@mui/material/CircularProgress';

const PharmacistModal = ({
  modalOpen,
  count,
  setModalOpen,
  handleModalClose,
  handleAuthModalOpen,
  purchaseOrderId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [purchaseOrderCount, setPurchaseOrderCount] = useState(0);

  const [state, setState] = useState({ order: {} });

  const loading = useSelector(
    (state) => state?.order?.purchaseOrderDetail?.loading
  );

  useEffect(() => {
    if (purchaseOrderId) {
      dispatch(
        getPurchaseOrderDetail(purchaseOrderId, function (res) {
          if (res) {
            setState({ ...state, order: res?.data });
          }
        })
      );
    }
  }, [purchaseOrderId, count, purchaseOrderCount]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: 'transparent' },
        }}
      >
        <Box
          className="modal-mui"
          sx={{ boxShadow: '0 8px 30px 0 rgb(0 0 0 / 20%)', minWidth: '864px' }}
        >
          {loading ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress sx={{ color: ' #235D5E' }} />
            </Box>
          ) : (
            <Box className="modal-header-mui">
              <Typography
                sx={{ padding: '24px !important' }}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              ></Typography>
              <IconButton
                className="modal-clear-btn"
                onClick={handleModalClose}
              >
                <ClearIcon />
              </IconButton>
              <Divider style={{ borderColor: '#ccc' }} />
              <Box padding="3rem">
                <ApprovalStatus
                  order={state?.order}
                  setPurchaseOrderCount={setPurchaseOrderCount}
                  purchaseOrderCount={purchaseOrderCount}
                  setState={setState}
                  state={state}
                />
              </Box>
              <Divider style={{ borderColor: '#ccc' }} />
              <Box padding="1rem" sx={{ float: 'right' }}>
                <Button
                  variant="contained"
                  className="containedPrimary"
                  sx={{
                    paddingLeft: '76px',
                    paddingRight: '80px',
                    textAlign: 'center',
                  }}
                  size="large"
                  disabled={
                    state?.order?.approval_status ==
                      'cancelled by pharmacist' ||
                    state?.order?.approval_status == 'approved'
                  }
                  onClick={handleAuthModalOpen}
                >
                  {state?.order?.approval_status == 'pending'
                    ? 'Approve'
                    : state?.order?.approval_status == 'cancelled by pharmacist'
                    ? 'cancelled by pharmacist'
                    : 'Approved'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PharmacistModal;
