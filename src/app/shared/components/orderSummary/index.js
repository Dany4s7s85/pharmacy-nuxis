import React from 'react';
import {
  Card,
  Box,
  Typography,
  CardContent,
  CardActions,
  Button,
  TextField,
} from '@mui/material';
import { ClipLoader } from 'react-spinners';
import { getTotal } from '../../../helpers/getTotalValue';
const OrderSummary = ({
  products,
  user,
  history,
  cartLoading,
  saveCartToDataBase,
}) => {
  return (
    <>
      <Card className="summary-card">
        <CardContent>
          <Typography mb={3} className="summary-heading" fontSize={24}>
            Order Summary
          </Typography>
          <Box display="flex" my={2} alignItems="center">
            <Typography
              sx={{ flex: '1' }}
              className="summary-heading"
              fontSize={18}
            >
              Subtotal <span>{products?.length}</span> Items
            </Typography>
            <Typography variant="h5" fontSize={24} className="summary-heading">
              {`$${Number(getTotal(products))?.toFixed(2)}`}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" my={2}>
            <Typography
              sx={{ flex: '1' }}
              className="summary-heading"
              fontSize={18}
            >
              Shipping Fee
            </Typography>
            <Typography fontSize={16} className="summary-cal">
              Calculated at next step
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" my={2}>
            <Typography
              sx={{ flex: '1' }}
              className="summary-heading"
              fontSize={18}
            >
              Total
            </Typography>
            <Typography variant="h5" fontSize={24} className="summary-heading">
              {`$${Number(getTotal(products))?.toFixed(2)}`}
            </Typography>
          </Box>
          <Box display="flex" my={3} alignItems="center">
            <TextField
              className="authfield"
              placeholder="Enter voucher code"
              variant="outlined"
              sx={{ marginRight: '10px', flex: '1' }}
            />
            <Button
              className="containedPrimary"
              variant="contained"
              sx={{
                alignSelf: 'normal',
                background: '#35BD76 !important',
                fontSize: '12px !important',
                paddingLeft: '25x !important',
                paddingRight: '25px !important',
                textAlign: 'center !important',
                borderRadius: '8px !important',
                boxShadow:
                  '0px 1px 3px rgba(53, 189, 118, 0.21), 0px 2px 1px rgba(204, 255, 228, 0.06), 0px 1px 1px #CCFFE4 !important',
              }}
            >
              Apply
            </Button>
          </Box>
        </CardContent>
        <CardActions>
          {user && user?.token ? (
            <>
              <Button
                fullWidth
                className="containedPrimary"
                variant="contained"
                sx={{
                  paddingLeft: '15px',
                  fontSize: '12px !important',
                  fontWeight: '400 !important',
                  paddingBottom: '15px !important',
                  paddingTop: '15px !important',
                }}
                onClick={saveCartToDataBase}
                disabled={cartLoading}
              >
                {cartLoading ? (
                  <ClipLoader size={25} color="white" loading />
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                className="containedPrimary"
                variant="contained"
                sx={{ paddingLeft: '15px' }}
                onClick={() => history('/login', { state: 'viewcart' })}
              >
                Login to Checkout
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default OrderSummary;
