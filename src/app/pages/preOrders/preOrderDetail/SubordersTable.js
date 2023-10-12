import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  deletePurchaseOrder,
  updatePurchaseOrder,
} from '../../../services/orders';
import { useDispatch, useSelector } from 'react-redux';
import { data } from 'jquery';
import { toast } from 'react-toastify';
import { set } from 'date-fns';

const SubordersTable = ({
  el,
  setPurchaseOrderCount,
  purchaseOrderCount,
  i,
  suborders,
  edit,
  setEdit,
  store,
  setStore,
  setState,
  state,
}) => {
  const [subOrder, setSubOrder] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (el) {
      setSubOrder(JSON.parse(JSON.stringify(el)));
    }
  }, [el]);

  const handleDeleteProduct = (pIndex) => {
    let tempSub = [...subOrder];
    let subOrders = [...state?.subOrders];
    subOrders = JSON.parse(JSON.stringify(subOrders));
    tempSub.splice(pIndex, 1);
    subOrders[i]?.splice(pIndex, 1);
    setSubOrder(tempSub);
    setState({ ...state, subOrders: subOrders });
  };

  const handleQuantityChange = (value, product, i, productIndex) => {
    let temp = [...subOrder];
    let subOrders = [...state?.subOrders];
    subOrders = JSON.parse(JSON.stringify(subOrders));
    // if (value.trim() == "") {
    //   value = product?.count;
    // }
    let inventoryCount =
      product && product?.product && product?.product?.quantity
        ? product?.product?.quantity
        : 0;

    if (value > inventoryCount) {
      toast.error(`Max available quantity: ${inventoryCount}`);
      value = inventoryCount;
      return;
    } else {
      subOrders[i][productIndex].count = Number(value);
      subOrders[i][productIndex].baseCount = Number(value);
      temp[productIndex].count = Number(value);
      temp[productIndex].baseCount = Number(value);
      setState({ ...state, subOrders });
      setSubOrder(temp);
    }
  };

  return (
    <>
      {subOrder && subOrder && subOrder?.length
        ? subOrder.map((product, index, array) => (
            <>
              {/* {index == 0 && <TableCell mt={3}></TableCell>} */}
              <TableRow>
                <TableCell scope="row" align="center">
                  {edit ? (
                    <>
                      <TextField
                        className="counter"
                        type="number"
                        id="outlined-basic"
                        variant="outlined"
                        value={product?.count}
                        onChange={(e) =>
                          handleQuantityChange(
                            e?.target?.value,
                            product,
                            i,
                            index
                          )
                        }
                      />

                      <Typography variant="h5" fontSize={12} mt={1}>
                        {product?.count} X {product?.product?.price} = {''} $
                        {Number(
                          Number(product?.count) *
                            Number(product?.product?.price)
                        ).toFixed(2)}
                      </Typography>
                    </>
                  ) : (
                    <Box pl={1}>{product?.count}</Box>
                  )}
                </TableCell>
                <TableCell className="tableBodyCell">
                  {product?.product?.product?.product_name}
                </TableCell>
                <TableCell className="tableBodyCell">
                  {product?.product?.DIN_NUMBER}
                </TableCell>

                {index == 0 && (
                  <TableCell className="tableBodyCell" rowSpan={array?.length}>
                    {product?.product?.store?.uuid}
                  </TableCell>
                )}

                {edit ? (
                  <TableCell className="tableBodyCell">
                    <Box display="flex" width="100%" justifyContent="center">
                      <>
                        <IconButton
                          disabled={!edit}
                          onClick={() => {
                            handleDeleteProduct(index);
                          }}
                        >
                          <DeleteIcon color="red" fontSize="18px" />
                        </IconButton>
                      </>
                    </Box>
                  </TableCell>
                ) : (
                  ''
                )}
              </TableRow>
            </>
          ))
        : ''}
    </>
  );
};

export default SubordersTable;
