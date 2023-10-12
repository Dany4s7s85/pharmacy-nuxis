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
  const [quantity, setQuantity] = useState(1);
  const [storeId, setStoreId] = useState(store);
  const [orderIndex, setOrderIndex] = useState('');
  const [subOrder, setSubOrder] = useState({});

  const deletePurchaseOrderLoading = useSelector(
    (state) => state?.order?.deletePurchaseOrder?.loading
  );

  const updatePurchaseOrderLoading = useSelector(
    (state) => state?.order?.updatePurchaseOrder?.loading
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (el) {
      setSubOrder(JSON.parse(JSON.stringify(el)));
    }
  }, [el]);

  const handleDeleteProduct = (id) => {
    if (id) {
      setStore(el.orderedTo?._id);
      dispatch(
        deletePurchaseOrder(
          id,
          function (res) {
            if (res) {
              setStore('');
              setStoreId('');
              setPurchaseOrderCount(purchaseOrderCount + 1);
              //   let subOrders = [state?.order?.subOrders];
              //   subOrders.splice(i, 1);

              //   setState({
              //     ...state,
              //     order: {
              //       ...state.order,
              //       subOrders: subOrders,
              //       approval_status: res?.data?.parentStatus,
              //     },
              //   });
            }
          },
          function (err) {
            setStore('');
            setStoreId('');
          }
        )
      );
    }
  };

  const handleUpdatePurchaseOrder = (id) => {
    if (id) {
      setStore(el.orderedTo?._id);
      let tempProducts = [
        ...subOrder.products.map((el) => {
          return {
            ...el,
            ...(el.count == '' && { count: 0 }),
          };
        }),
      ];
      dispatch(
        updatePurchaseOrder(
          id,
          { products: tempProducts },
          function (res) {
            if (res) {
              setStore('');
              setStoreId('');
              setEdit(false);
              setPurchaseOrderCount(purchaseOrderCount + 1);
            }
          },
          function (err) {
            setStore('');
            setStoreId('');
            setEdit(false);
          }
        )
      );
    }
  };

  const handleEditOrder = (storeID, index) => {
    setStore(storeID);
    setEdit(!edit);
  };

  const handleQuantityChange = (value, product, i, productIndex) => {
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
      subOrder.products[productIndex].count = value;

      setSubOrder({ ...subOrder });
    }
  };

  const handleCancel = () => {
    setSubOrder({ ...el });
    setEdit(false);
  };
  return (
    <>
      {subOrder && subOrder?.products && subOrder?.products?.length
        ? subOrder.products.map((product, index, array) => (
            <>
              {index == 0 && <></>}
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  className="tableBodyCell"
                >
                  {edit && storeId == product?.product?.store?._id ? (
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
                    product?.count
                  )}
                </TableCell>
                <TableCell className="tableBodyCell">
                  {product?.product?.product?.product_name}
                </TableCell>
                <TableCell className="tableBodyCell">
                  {product?.product?.DIN_NUMBER}
                </TableCell>

                {index == 0 && (
                  <TableCell rowSpan={array?.length} className="tableBodyCell">
                    {el?.orderedTo?.uuid}
                  </TableCell>
                )}

                {index == 0 && (
                  <TableCell rowSpan={array?.length} className="tableBodyCell">
                    <Box display="flex" width="100%" justifyContent="center">
                      {!edit ? (
                        <>
                          <IconButton
                            onClick={() => {
                              handleEditOrder(
                                product?.product?.store?._id,
                                index
                              );
                            }}
                          >
                            <BorderColorIcon color="red" fontSize="18px" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              handleDeleteProduct(el?._id);
                            }}
                          >
                            {deletePurchaseOrderLoading &&
                            storeId == product?.product?.store?._id ? (
                              <CircularProgress sx={{ color: ' #235D5E' }} />
                            ) : (
                              <DeleteIcon color="red" fontSize="18px" />
                            )}
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {edit && storeId == product?.product?.store?._id ? (
                            <>
                              <IconButton
                                onClick={() => {
                                  handleUpdatePurchaseOrder(el?._id);
                                }}
                              >
                                {updatePurchaseOrderLoading &&
                                storeId == product?.product?.store?._id ? (
                                  <CircularProgress
                                    sx={{ color: ' #235D5E' }}
                                  />
                                ) : (
                                  <CheckCircleIcon />
                                )}
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleCancel();
                                  // setEdit(!edit);
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                disabled={edit}
                                onClick={() => {
                                  handleEditOrder(
                                    product?.product?.store?._id,
                                    index
                                  );
                                }}
                              >
                                <BorderColorIcon color="red" fontSize="18px" />
                              </IconButton>
                              <IconButton
                                disabled={edit}
                                onClick={() => {
                                  handleDeleteProduct(el?._id);
                                }}
                              >
                                {
                                  // deletePurchaseOrderLoading &&

                                  storeId == product?.product?.store?._id ? (
                                    <CircularProgress
                                      sx={{ color: ' #235D5E' }}
                                    />
                                  ) : (
                                    <DeleteIcon color="red" fontSize="18px" />
                                  )
                                }
                              </IconButton>
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            </>
          ))
        : ''}
    </>
  );
};

export default SubordersTable;
