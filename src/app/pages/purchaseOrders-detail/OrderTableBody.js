import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import AlsoAvailable from "./AlsoAvailable";
import UndoIcon from "@mui/icons-material/Undo";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptProduct, rejectProduct } from "../../services/orders";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ErrorIcon from "@mui/icons-material/Error";
import warning from "../../assets/images/warning.svg";
import { ClipLoader } from "react-spinners";
import { formatNumberWithCommas } from "../../helpers/getTotalValue";

const OrderTableBody = ({
  el,
  i,
  state,
  setState,
  count,
  setCount,
  suggestions,
  handleGeneratePDF,
  qrloading,
  productIndex,
}) => {
  const [loadingIndex, setLoadingIndex] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const acceptOrderLoading = useSelector(
    (state) => state?.order?.accept_product?.loading
  );
  const rejectOrderLoading = useSelector(
    (state) => state?.order?.reject_product?.loading
  );

  const handleRejectProductChange = (
    orderId,
    productId,
    pindex,
    subindex,
    product
  ) => {
    setLoadingIndex(`${pindex}${subindex}`);
    let subs = [...state?.order?.subOrders];
    subs = JSON.parse(JSON.stringify(subs));
    subs[subindex].products[pindex].status = "cancelled by buyer";

    if (
      subs[subindex]?.products[pindex]?.return &&
      subs[subindex]?.products[pindex]?.return?.length
    ) {
      subs[subindex].products[pindex].return[0] = {
        quantity: product?.baseCount,
        returnTotal: Number(product?.baseCount) * Number(product?.price),
      };
    } else {
      subs[subindex].products[pindex].return = [
        {
          quantity: product?.baseCount,
          returnTotal: Number(product?.baseCount) * Number(product?.price),
        },
      ];
    }

    dispatch(
      rejectProduct(orderId, { product: productId }, function (res) {
        if (res) {
          setState({ order: { ...state.order, subOrders: subs } });
          if (res?.data?.reload) {
            setCount(count + 1);
          }
        }
      })
    );
  };

  const handleAcceptProductChange = (orderId, productId, pindex, subindex) => {
    setLoadingIndex(`${pindex}${subindex}`);

    let subs = [...state?.order?.subOrders];
    subs = JSON.parse(JSON.stringify(subs));
    subs[subindex].products[pindex].status = "partially accepted by buyer";

    dispatch(
      acceptProduct(orderId, { product: productId }, function (res) {
        if (res) {
          if (res?.data?.reload) {
            setCount(count + 1);
          }
          setState({ order: { ...state.order, subOrders: subs } });
        }
      })
    );
  };

  return (
    <>
      <TableRow key={i}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">{el?.orderedTo?.uuid}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
            {el?.parent_order_number && (
              <Typography variant="subtitle1">{el?.orderStatus}</Typography>
            )}
          </Typography>

          {el?.orderStatus === "In Transit" && (
            <Button
              onClick={() => handleGeneratePDF(el, i)}
              variant="contained"
              className="containedPrimary"
              disabled={qrloading && productIndex == i}
            >
              {qrloading && productIndex == i ? (
                <ClipLoader size={25} color="white" />
              ) : (
                "Generate Order QR"
              )}
            </Button>
          )}
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">{`$${formatNumberWithCommas(
            parseFloat(Number(el?.cartTotal)).toFixed(2)
          )}`}</Typography>
        </TableCell>
        <TableCell align="left">
          {el?.orderStatus == "Order pending for buyer approval" ? (
            <ErrorIcon sx={{ color: "#ff4747", fontSize: "25px" }} />
          ) : (
            // <img src={warning} />
            <ErrorIcon sx={{ color: "#47a049", fontSize: "25px" }} />
            // <img src={warning} />
          )}
        </TableCell>
      </TableRow>

      {el && el?.products && el?.products?.length
        ? el.products.map((product, index) => (
            <>
              {index == 0 && <></>}
              <TableRow key={index}>
                <TableCell
                  sx={{ padding: "0px" }}
                  colSpan={6}
                  style={{ border: "none" }}
                >
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table size="small" aria-label="purchases">
                      <TableBody>
                        <TableCell
                          width="500px"
                          //   sx={{ textAlign: "left", borderBottom: "none" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {product &&
                            product?.product?.product?.imageCover &&
                            product?.product?.product?.imageCover
                              ?.full_image ? (
                              <img
                                src={
                                  product?.product?.product?.imageCover
                                    ?.full_image
                                }
                                style={{
                                  minHeight: "60px",
                                  maxHeight: "60px",
                                  minWidth: "80px",
                                  maxWidth: "80px",
                                }}
                              />
                            ) : (
                              <Box
                                className="cusProductName"
                                sx={{ margin: "0px" }}
                              >
                                <Typography>
                                  {product?.product?.product?.product_name}
                                </Typography>
                              </Box>
                            )}

                            <Typography
                              mx={1}
                              variant="h5"
                              fontSize={16}
                              sx={{
                                maxWidth: "400px",
                              }}
                            >
                              {product?.product?.product?.product_name}
                            </Typography>
                          </Box>
                          {suggestions &&
                          suggestions?.length &&
                          (product?.status == "cancelled" ||
                            product?.status == "partially accepted" ||
                            product?.status == "partially accepted by buyer" ||
                            product?.status == "cancelled by buyer") ? (
                            <>
                              <AlsoAvailable
                                din={product?.product?.DIN_NUMBER}
                                suggestion={suggestions}
                                productQuantity={product?.baseCount}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </TableCell>
                        <TableCell
                          align="left"
                          //   sx={{ textAlign: "left", borderBottom: "none" }}
                        >
                          <Typography variant="subtitle1">
                            {`$${formatNumberWithCommas(
                              parseFloat(
                                Number(
                                  product?.discountedPrice
                                    ? product?.discountedPrice?.discountedPrice
                                    : product?.price
                                )
                              ).toFixed(2)
                            )}`}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="left"
                          //   sx={{ textAlign: "left", borderBottom: "none" }}
                        >
                          <Typography
                            variant="subtitle1"
                            className={
                              product &&
                              product?.return &&
                              product?.return.length
                                ? "margin32"
                                : "marginZero"
                            }
                          >
                            x {Number(product?.baseCount)}
                          </Typography>
                          <Box
                            sx={{
                              marginLeft: "-12px",
                            }}
                          >
                            {product &&
                            product?.return &&
                            product?.return.length ? (
                              <Box
                                display="flex"
                                justifyContent="left"
                                flex="1"
                                sx={{
                                  alignItems: "center",
                                  color: "red",
                                }}
                              >
                                <UndoIcon />

                                <Typography
                                  sx={{
                                    margin: "0px",
                                  }}
                                  variant="subtitle1"
                                  fontSize={18}
                                >
                                  {`-${product?.return[0]?.quantity}`}
                                </Typography>
                              </Box>
                            ) : null}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="left"
                          //   sx={{ textAlign: "left", borderBottom: "none" }}
                        >
                          <Typography
                            variant="subtitle1"
                            className={
                              product &&
                              product?.return &&
                              product?.return.length
                                ? "margin32"
                                : "marginZero"
                            }
                          >
                            {`$${formatNumberWithCommas(
                              parseFloat(
                                Number(
                                  Number(
                                    product?.discountedPrice
                                      ? product?.discountedPrice
                                          ?.discountedPrice
                                      : product?.price
                                  ) * Number(product?.baseCount)
                                )
                              ).toFixed(2)
                            )}`}
                          </Typography>
                          <Box
                            sx={{
                              marginLeft: "-12px",
                            }}
                          >
                            {product &&
                            product?.return &&
                            product?.return.length ? (
                              <Box
                                display="flex"
                                justifyContent="left"
                                flex="1"
                                sx={{
                                  alignItems: "center",
                                  color: "red",
                                }}
                              >
                                <UndoIcon />

                                <Typography
                                  sx={{
                                    margin: "0px",
                                  }}
                                  variant="subtitle1"
                                  fontSize={18}
                                >
                                  {`-$${product?.return[0]?.returnTotal}`}
                                </Typography>
                              </Box>
                            ) : null}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="left"
                          width="200px"
                          //   sx={{ textAlign: "left", borderBottom: "none" }}
                        >
                          <Stack direction="row" justifyContent="center">
                            {product?.status == "partially accepted" ||
                            product?.status == "pending for buyer approval" ? (
                              <>
                                {acceptOrderLoading &&
                                loadingIndex == `${index}${i}` ? (
                                  <CircularProgress sx={{ color: "#235D5E" }} />
                                ) : (
                                  <Button
                                    className="cusBtn"
                                    sx={{ color: "#246e48 !important" }}
                                    disabled={
                                      acceptOrderLoading || rejectOrderLoading
                                    }
                                    startIcon={
                                      <DoneIcon sx={{ color: "#246e48" }} />
                                    }
                                    onClick={() => {
                                      handleAcceptProductChange(
                                        el?.id,
                                        product?._id,
                                        index,
                                        i,
                                        product
                                      );
                                    }}
                                  >
                                    Accept
                                  </Button>
                                )}
                              </>
                            ) : null}

                            {product?.status == "partially accepted" ||
                            product?.status == "pending for buyer approval" ? (
                              <>
                                {rejectOrderLoading &&
                                loadingIndex == `${index}${i}` ? (
                                  <CircularProgress sx={{ color: "#235D5E" }} />
                                ) : (
                                  <Button
                                    className="cusBtn"
                                    sx={{ color: "#b52f2f !important" }}
                                    disabled={
                                      acceptOrderLoading || rejectOrderLoading
                                    }
                                    startIcon={
                                      <CloseIcon
                                        sx={{ color: "#b52f2f !important" }}
                                      />
                                    }
                                    onClick={() => {
                                      handleRejectProductChange(
                                        el?.id,
                                        product?._id,
                                        index,
                                        i,
                                        product
                                      );
                                    }}
                                  >
                                    Reject
                                  </Button>
                                )}
                              </>
                            ) : null}
                          </Stack>
                        </TableCell>
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))
        : ""}
    </>
  );
};

export default OrderTableBody;
