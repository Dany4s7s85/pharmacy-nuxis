import React, { useEffect, useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { isProductExpired } from "../../../helpers/pricing";

const SubordersTable = ({ el, i, edit, setState, state }) => {
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
      subOrders[i][productIndex].count = value == "" ? "" : Number(value);
      subOrders[i][productIndex].baseCount = value == "" ? "" : Number(value);
      temp[productIndex].count = value == "" ? "" : Number(value);
      temp[productIndex].baseCount = value == "" ? "" : Number(value);
      setState({ ...state, subOrders });
      setSubOrder(temp);
    }
  };

  return (
    <>
      {subOrder && subOrder && subOrder?.length
        ? subOrder.map((product, index, array) => (
            <>
              {index == 0 && <TableCell mt={3}></TableCell>}
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  className="tableBodyCell"
                >
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
                      {state?.order?.approval_status == "pending" ? (
                        <Typography
                          variant="h5"
                          color={`${
                            product?.product?.quantity < product?.count ||
                            isProductExpired(product?.product?.expiry_date)
                              ? "error"
                              : ""
                          }`}
                          fontSize={12}
                          mt={1}
                        >
                          {isProductExpired(product?.product?.expiry_date)
                            ? "Product Expired"
                            : `Avail. Qty: ${product?.product?.quantity}`}
                        </Typography>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <>
                      {product?.count}
                      {state?.order?.approval_status == "pending" ? (
                        <Typography
                          variant="h5"
                          color={`${
                            product?.product?.quantity < product?.count ||
                            isProductExpired(product?.product?.expiry_date)
                              ? "error"
                              : ""
                          }`}
                          fontSize={12}
                          mt={1}
                        >
                          {isProductExpired(product?.product?.expiry_date)
                            ? "Product Expired"
                            : `Avail. Qty: ${product?.product?.quantity}`}
                        </Typography>
                      ) : (
                        ""
                      )}
                    </>
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
                  ""
                )}
              </TableRow>
            </>
          ))
        : ""}
    </>
  );
};

export default SubordersTable;
