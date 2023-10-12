import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Backdrop, Divider, Modal, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import ApprovalStatus from '../ApprovalStatus';
import Button from '@mui/material/Button';
import {
  generatePrescriptionPDF,
  getPurchaseOrderDetail,
} from '../../../services/orders';
import CircularProgress from '@mui/material/CircularProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { saveAs } from 'file-saver';
import { ClipLoader } from 'react-spinners';

const Prescription = ({
  modalOpen,
  handleModalClose,
  orderDetail,
  prescriptionLoading,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    order: {},
    products: [],
  });

  const genPrescriptionPDFLoading = useSelector(
    (state) => state?.order?.generate_prescription_pdf?.loading
  );

  useEffect(() => {
    if (orderDetail) {
      setState({
        order: {
          ...orderDetail?.parentOrder,
          orderedBy: orderDetail.orderedBy,
        },
        products: orderDetail?.products,
      });
    }
  }, [orderDetail]);

  const handleGeneratePDF = () => {
    if (orderDetail) {
      dispatch(
        generatePrescriptionPDF(
          orderDetail?._id,
          function (res) {
            if (res) {
              const blob = new Blob([res], {
                type: 'application/pdf',
              });
              saveAs(blob, `OrderDetail-${state?.order?.order_no}.pdf`);
            }
          },
          function (err) {
            // console.log(err);
          }
        )
      );
    }
  };

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
          sx={{
            boxShadow: '0 8px 30px 0 rgb(0 0 0 / 20%)',
            minWidth: 'unset !important',
            minHeight: 'unset !important',
            width: '100%',
            height: '100%',
            maxWidth: { lg: '570px', sm: '70%', xs: '90%' },
            maxHeight: { lg: '95%', sm: '90%', xs: '90%' },
          }}
        >
          {prescriptionLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              height="100%"
              alignItems="center"
            >
              <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
            </Box>
          ) : (
            <Box className="modal-header-mui" height="100%">
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

              <>
                <Tooltip
                  title={<div style={{ fontSize: '12px' }}>Generate PDF</div>}
                  placement="bottom"
                >
                  <IconButton
                    sx={{ float: 'right', marginRight: '32px', padding: '0px' }}
                  >
                    {genPrescriptionPDFLoading ? (
                      <CircularProgress size={25} sx={{ color: ' #235D5E' }} />
                    ) : (
                      <PictureAsPdfIcon
                        onClick={() => handleGeneratePDF()}
                        sx={{
                          fontSize: { xs: '34px', sm: '40px' },
                          color: '#235D5E',
                        }}
                      />
                    )}
                  </IconButton>
                </Tooltip>

                <ApprovalStatus
                  order={state?.order}
                  products={state?.products}
                />
              </>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Prescription;
