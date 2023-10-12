import { createAction, handleActions } from "redux-actions";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";
import {
  _createPharmacyOrder,
  _getOrderDetail,
  _getPharmacyOrders,
  _getPurchaseOrders,
  _purchaseOrderDetail,
  _rejectOrder,
  _generateOrderQR,
  _scanQR,
  _returnOrder,
  _cancelOrderBuyer,
  _acceptOrderBuyer,
  _purchaseOrderSuggestion,
  _updateOrderStatus,
  _rejectProduct,
  _acceptProduct,
  _pharmaciesOrderRejection,
  _pharmaciesOrderApproval,
  _deletePurchaseOrder,
  _updatePurchaseOrder,
  _getStorePreOrders,
  _getPreOrderDetail,
  _updatePreOrder,
  _approvePreOrder,
  _rejectPreOrder,
  _pharmacistAuth,
  _generatePDF,
  _generateAllOrdersPDF,
  _generatePrescriptionPDF,
  _getOrderPrescription,
} from "../../shared/httpService/api";

const initialState = {
  createOrder: { loading: false, response: {}, hasError: false, error: {} },
  purchaseOrder: { loading: false, response: {}, hasError: false, error: {} },
  pharmacyOrder: { loading: false, response: {}, hasError: false, error: {} },
  orderQr: { loading: false, response: {}, hasError: false, error: {} },
  scan_qr: { loading: false },
  generate_pdf: { loading: false },
  generate_allOrders_Pdf: { loading: false },
  generate_prescription_pdf: { loading: false },
  accept_product: { loading: false },
  reject_product: { loading: false },
  rejectOrder: { loading: false, response: {}, hasError: false, error: {} },
  returnOrder: { loading: false, response: {}, hasError: false, error: {} },
  pharmacist_auth: { loading: false },
  cancelOrderBuyer: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  acceptOrderBuyer: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  pharmacyOrderDetail: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  purchaseOrderDetail: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  refundOrder: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  purchaseOrderSuggestion: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateOrderStatus: { loading: false, response: null },
  orderApprove: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  orderReject: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  purchaseOrders: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  deletePurchaseOrder: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updatePurchaseOrder: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  preOrders: { loading: false, response: {}, hasError: false, error: {} },
  preOrder: { loading: false },
  preOrderApprove: { loading: false },
  preOrderReject: { loading: false },
  preOrderUpdate: { loading: false },
  orderPrescriptions: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
};
/* CREATE ORDER  */
export const createPharmacyOrderStart = createAction(
  ActionTypes.CREATE_PHARMACY_ORDER_START
);
export const createPharmacyOrderSuccess = createAction(
  ActionTypes.CREATE_PHARMACY_ORDER_SUCCESS,
  (response) => response
);
export const createPharmacyOrderError = createAction(
  ActionTypes.CREATE_PHARMACY_ORDER_ERROR,
  (error) => error
);
export const createPharmacyOrder = (data, callback) => async (dispatch) => {
  try {
    dispatch(createPharmacyOrderStart());

    const response = await _createPharmacyOrder(data);

    if (response) {
      callback(response);
    }

    dispatch(createPharmacyOrderSuccess(response));
  } catch (error) {
    dispatch(createPharmacyOrderError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* PURCHASE ORDER  */
export const purchaseOrderStart = createAction(
  ActionTypes.PURCHASE_ORDER_START
);
export const purchaseOrderSuccess = createAction(
  ActionTypes.PURCHASE_ORDER_SUCCESS,
  (response) => response
);
export const purchaseOrderError = createAction(
  ActionTypes.PURCHASE_ORDER_ERROR,
  (error) => error
);

export const getPurchaseOrders =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(purchaseOrderStart());
    return _getPurchaseOrders(search, status, page, limit)
      .then((response) => {
        dispatch(purchaseOrderSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(purchaseOrderError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* GET PHARAMCY ORDERS  */
export const getPharmacyOrderStart = createAction(
  ActionTypes.GET_PHARMACY_ORDER_START
);
export const getPharmacyOrderSuccess = createAction(
  ActionTypes.GET_PHARMACY_ORDER_SUCCESS,
  (response) => response
);
export const getPharmacyOrderError = createAction(
  ActionTypes.GET_PHARMACY_ORDER_ERROR,
  (error) => error
);

export const getPharmacyOrder =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getPharmacyOrderStart());
    return _getPharmacyOrders(search, status, page, limit)
      .then((response) => {
        dispatch(getPharmacyOrderSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getPharmacyOrderError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* GET  ORDER DETAIL  */
export const getOrderDetailStart = createAction(
  ActionTypes.GET_ORDER_DETAIL_START
);
export const getOrderDetailSuccess = createAction(
  ActionTypes.GET_ORDER_DETAIL_SUCCESS,
  (response) => response
);
export const getOrderDetailError = createAction(
  ActionTypes.GET_ORDER_DETAIL_ERROR,
  (error) => error
);
export const getOrderDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(getOrderDetailStart());

    const response = await _getOrderDetail(id);
    if (response) {
      callback(response);
    }
    dispatch(getOrderDetailSuccess(response));
  } catch (error) {
    dispatch(getOrderDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/*  Purchase ORDER DETAIL  */
export const purchaseOrderDetailStart = createAction(
  ActionTypes.PURCHASE_ORDER_DETAIL_START
);
export const purchaseOrderDetailSuccess = createAction(
  ActionTypes.PURCHASE_ORDER_DETAIL_SUCCESS,
  (response) => response
);
export const purchaseOrderDetailError = createAction(
  ActionTypes.PURCHASE_ORDER_DETAIL_ERROR,
  (error) => error
);
export const getPurchaseOrderDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(purchaseOrderDetailStart());

    const response = await _purchaseOrderDetail(id);
    if (response) {
      callback(response);
    }
    dispatch(purchaseOrderDetailSuccess(response));
  } catch (error) {
    dispatch(purchaseOrderDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Update accept Order Status  */
export const updateStatusOrderStart = createAction(
  ActionTypes.UPDATE_ORDER_STATUS
);
export const updateStatusOrderSuccess = createAction(
  ActionTypes.UPDATE_ORDER_STATUS_SUCCESS,
  (response) => response
);
export const updateStatusOrderError = createAction(
  ActionTypes.UPDATE_ORDER_STATUS_ERROR,
  (error) => error
);
export const updateOrderStatus = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(updateStatusOrderStart());

    const response = await _updateOrderStatus(id, data);
    if (response) {
      callback(response);
    }
    dispatch(updateStatusOrderSuccess(response));
  } catch (error) {
    dispatch(updateStatusOrderError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Update Order Status  */
export const rejectOrderStart = createAction(ActionTypes.REJECT_ORDER_START);
export const rejectOrderSuccess = createAction(
  ActionTypes.REJECT_ORDER_SUCCESS,
  (response) => response
);
export const rejectOrderError = createAction(
  ActionTypes.REJECT_ORDER_ERROR,
  (error) => error
);
export const rejectOrder = (id, callback) => async (dispatch) => {
  try {
    dispatch(rejectOrderStart());

    const response = await _rejectOrder(id);
    if (response) {
      callback(response);
    }
    dispatch(rejectOrderSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(rejectOrderError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Return Order   */
export const returnOrderStart = createAction(ActionTypes.RETURN_ORDER_START);
export const returnOrderSuccess = createAction(
  ActionTypes.RETURN_ORDER_SUCCESS,
  (response) => response
);
export const returnOrderError = createAction(
  ActionTypes.RETURN_ORDER_ERROR,
  (error) => error
);
export const returnOrder = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(returnOrderStart());

    const response = await _returnOrder(id, data);
    if (response) {
      callback(response);
    }
    dispatch(returnOrderSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(returnOrderError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Cancel Order Buyer  */
export const cancelOrderBuyerStart = createAction(
  ActionTypes.CANCEL_ORDER_BUYER_START
);
export const cancelOrderBuyerSuccess = createAction(
  ActionTypes.CANCEL_ORDER_BUYER_SUCCESS,
  (response) => response
);
export const cancelOrderBuyerError = createAction(
  ActionTypes.CANCEL_ORDER_BUYER_ERROR,
  (error) => error
);
export const cancelOrderBuyer = (id, callback) => async (dispatch) => {
  try {
    dispatch(cancelOrderBuyerStart());

    const response = await _cancelOrderBuyer(id);
    if (response) {
      callback(response);
    }
    dispatch(cancelOrderBuyerSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(cancelOrderBuyerError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Accept Order Buyer  */
export const acceptOrderBuyerStart = createAction(
  ActionTypes.ACCEPT_ORDER_BUYER_START
);
export const acceptOrderBuyerSuccess = createAction(
  ActionTypes.ACCEPT_ORDER_BUYER_SUCCESS,
  (response) => response
);
export const acceptOrderBuyerError = createAction(
  ActionTypes.ACCEPT_ORDER_BUYER_ERROR,
  (error) => error
);
export const acceptOrderBuyer = (id, callback) => async (dispatch) => {
  try {
    dispatch(acceptOrderBuyerStart());

    const response = await _acceptOrderBuyer(id);
    if (response) {
      callback(response);
    }
    dispatch(acceptOrderBuyerSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(acceptOrderBuyerError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* GET  ORDER DETAIL  */
export const generateQROrderStart = createAction(ActionTypes.GENERATE_QR_START);
export const generateQROrderSuccess = createAction(
  ActionTypes.GENERATE_QR_SUCCESS,
  (response) => response
);
export const generateQROrderError = createAction(
  ActionTypes.GENERATE_QR_ERROR,
  (error) => error
);
export const scanQR = (token, callback, callbackError) => async (dispatch) => {
  try {
    dispatch(generateQROrderStart());

    const response = await _scanQR(token);
    if (response) {
      callback(response);
    }
    dispatch(generateQROrderSuccess(response));
  } catch (error) {
    callbackError(error?.message);
    dispatch(generateQROrderError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

export const scanQROrderStart = createAction(ActionTypes.SCAN_QR_START);
export const scanQROrderSuccess = createAction(
  ActionTypes.SCAN_QR_SUCCESS,
  (response) => response
);
export const scanQROrderError = createAction(
  ActionTypes.SCAN_QR_ERROR,
  (error) => error
);
export const generateOrderQR =
  (id, forType, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(scanQROrderStart());

      const response = await _generateOrderQR(id, forType);
      if (response) {
        callback(response);
      }
      dispatch(scanQROrderSuccess(response));
    } catch (error) {
      callbackError(error);
      dispatch(scanQROrderError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* PURCHASE Order SUGGESTION  */
export const purchaseOrderSuggestionStart = createAction(
  ActionTypes.PURCHASE_ORDER_SUGGESTION_START
);
export const purchaseOrderSuggestionSuccess = createAction(
  ActionTypes.PURCHASE_ORDER_SUGGESTION_SUCCESS,
  (response) => response
);
export const purchaseOrderSuggestionError = createAction(
  ActionTypes.PURCHASE_ORDER_SUGGESTION_ERROR,
  (error) => error
);
export const purchaseOrderSuggestion =
  (product, callback) => async (dispatch) => {
    try {
      dispatch(purchaseOrderSuggestionStart());

      const response = await _purchaseOrderSuggestion(product);
      if (response) {
        callback(response);
      }
      dispatch(purchaseOrderSuggestionSuccess(response));
    } catch (error) {
      dispatch(purchaseOrderSuggestionError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Accept Order Product Buyer  */
export const acceptProductStart = createAction(
  ActionTypes.ACCEPT_PRODUCT_ORDER_START
);
export const acceptProductSuccess = createAction(
  ActionTypes.ACCEPT_PRODUCT_ORDER_SUCCESS,
  (response) => response
);
export const acceptProductError = createAction(
  ActionTypes.ACCEPT_PRODUCT_ORDER_ERROR,
  (error) => error
);
export const acceptProduct = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(acceptProductStart());

    const response = await _acceptProduct(id, data);
    if (response) {
      callback(response);
    }
    dispatch(acceptProductSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(acceptProductError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Reject Order Product Buyer  */
export const rejectProductStart = createAction(
  ActionTypes.REJECT_PRODUCT_ORDER_START
);
export const rejectProductSuccess = createAction(
  ActionTypes.REJECT_PRODUCT_ORDER_SUCCESS,
  (response) => response
);
export const rejectProductError = createAction(
  ActionTypes.REJECT_PRODUCT_ORDER_ERROR,
  (error) => error
);
export const rejectProduct = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(rejectProductStart());

    const response = await _rejectProduct(id, data);
    if (response) {
      callback(response);
    }
    dispatch(rejectProductSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(rejectProductError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* APPROVE STATUS  */
export const pharmaciesOrderApproveStart = createAction(
  ActionTypes.PHARMACIES_ORDER_APPROVE_START
);
export const pharmaciesOrderApproveSuccess = createAction(
  ActionTypes.PHARMACIES_ORDER_APPROVE_SUCCESS,
  (response) => response
);
export const pharmaciesOrderApproveError = createAction(
  ActionTypes.PHARMACIES_ORDER_APPROVE_ERROR,
  (error) => error
);
export const pharmaciesOrderApprove =
  (id, data, callback) => async (dispatch) => {
    try {
      dispatch(pharmaciesOrderApproveStart());

      const response = await _pharmaciesOrderApproval(id, data);
      if (response) {
        callback(response);
      }
      dispatch(pharmaciesOrderApproveSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(pharmaciesOrderApproveError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* REJECT STATUS  */
export const pharmaciesOrderRejectStart = createAction(
  ActionTypes.PHARMACIES_ORDER_REJECT_START
);
export const pharmaciesOrderRejectSuccess = createAction(
  ActionTypes.PHARMACIES_ORDER_REJECT_SUCCESS,
  (response) => response
);
export const pharmaciesOrderRejectError = createAction(
  ActionTypes.PHARMACIES_ORDER_REJECT_ERROR,
  (error) => error
);
export const pharmaciesOrderReject =
  (id, data, callback) => async (dispatch) => {
    try {
      dispatch(pharmaciesOrderRejectStart());

      const response = await _pharmaciesOrderRejection(id, data);
      if (response) {
        callback(response);
      }
      dispatch(pharmaciesOrderRejectSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(pharmaciesOrderRejectError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/* PURCHASE ORDER  */
export const getPurchaseOrdersStart = createAction(
  ActionTypes.GET_PURCHASE_ORDERS_START
);
export const getPurchaseOrdersSuccess = createAction(
  ActionTypes.GET_PURCHASE_ORDERS_SUCCESS,
  (response) => response
);
export const getPurchaseOrdersError = createAction(
  ActionTypes.GET_PURCHASE_ORDERS_ERROR,
  (error) => error
);
export const getPharmaciesPurchaseOrders =
  (id, data, callback) => async (dispatch) => {
    try {
      dispatch(getPurchaseOrdersStart());

      const response = await _getPurchaseOrders(id, data);
      if (response) {
        callback(response);
      }
      dispatch(getPurchaseOrdersSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(getPurchaseOrdersError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*  DELETE Product INVENTORY */

export const deletePurchaseOrderStart = createAction(
  ActionTypes.DELETE_PURCHASE_ORDER_START
);
export const deletePurchaseOrderSuccess = createAction(
  ActionTypes.DELETE_PURCHASE_ORDER_SUCCESS,
  (response) => response
);
export const deletePurchaseOrderError = createAction(
  ActionTypes.DELETE_PURCHASE_ORDER_ERROR,
  (error) => error
);
export const deletePurchaseOrder =
  (id, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(deletePurchaseOrderStart());
      const response = await _deletePurchaseOrder(id);
      if (response) {
        callback(response);
      }
      dispatch(deletePurchaseOrderSuccess(response));
      toast.success(response.message);
    } catch (error) {
      dispatch(deletePurchaseOrderError(error));
      callbackError(error);
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

export const updatePurchaseOrderStart = createAction(
  ActionTypes.UPDATE_PURCHASE_ORDER_START
);
export const updatePurchaseOrderSuccess = createAction(
  ActionTypes.UPDATE_PURCHASE_ORDER_SUCCESS,
  (response) => response
);
export const updatePurchaseOrderError = createAction(
  ActionTypes.UPDATE_PURCHASE_ORDER_ERROR,
  (error) => error
);
export const updatePurchaseOrder =
  (id, data, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(updatePurchaseOrderStart());

      const response = await _updatePurchaseOrder(id, data);

      dispatch(updatePurchaseOrderSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(updatePurchaseOrderError(error));
      callbackError(error);
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/* Get pre orders  */
export const getPreOrdersStart = createAction(
  ActionTypes.GET_ALL_PRE_ORDERS_START
);
export const getPreOrdersSuccess = createAction(
  ActionTypes.GET_ALL_PRE_ORDERS_SUCCESS,
  (response) => response
);
export const getPreOrdersError = createAction(
  ActionTypes.GET_ALL_PRE_ORDERS_ERROR,
  (error) => error
);

export const getPreOrders =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getPreOrdersStart());
    return _getStorePreOrders(search, status, page, limit)
      .then((response) => {
        dispatch(getPreOrdersSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getPreOrdersError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* Pre ORDER Detail*/
export const preOrderDetailStart = createAction(
  ActionTypes.PRE_ORDER_DETAIL_START
);
export const preOrderDetailSuccess = createAction(
  ActionTypes.PRE_ORDER_DETAIL_SUCCESS,
  (response) => response
);
export const preOrderDetailError = createAction(
  ActionTypes.PRE_ORDER_DETAIL_ERROR,
  (error) => error
);
export const preOrderDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(preOrderDetailStart());

    const response = await _getPreOrderDetail(id);
    if (response) {
      callback(response);
    }
    dispatch(preOrderDetailSuccess(response));
  } catch (error) {
    dispatch(preOrderDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* Pre Order Approved */
export const preOrderApproveStart = createAction(
  ActionTypes.APPROVE_PRE_ORDER_START
);
export const preOrderApproveSuccess = createAction(
  ActionTypes.APPROVE_PRE_ORDER_SUCCESS,
  (response) => response
);
export const preOrderApproveError = createAction(
  ActionTypes.APPROVE_PRE_ORDER_ERROR,
  (error) => error
);
export const approvePreOrder =
  (id, data, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(preOrderApproveStart());

      const response = await _approvePreOrder(id, data);
      if (response) {
        callback(response);
      }
      dispatch(preOrderApproveSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(preOrderApproveError(error));
      callbackError(error);
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Pre Order Reject */
export const preOrderRejectStart = createAction(
  ActionTypes.REJECT_PRE_ORDER_START
);
export const preOrderRejectSuccess = createAction(
  ActionTypes.REJECT_PRE_ORDER_SUCCESS,
  (response) => response
);
export const preOrderRejectError = createAction(
  ActionTypes.REJECT_PRE_ORDER_ERROR,
  (error) => error
);
export const rejectPreOrder = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(preOrderRejectStart());

    const response = await _rejectPreOrder(id, data);
    if (response) {
      callback(response);
    }
    dispatch(preOrderRejectSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(preOrderRejectError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Pre Order Update */
export const preOrderUpdateStart = createAction(
  ActionTypes.UPDATE_PRE_ORDER_START
);
export const preOrderUpdateSuccess = createAction(
  ActionTypes.UPDATE_PRE_ORDER_SUCCESS,
  (response) => response
);
export const preOrderUpdateError = createAction(
  ActionTypes.UPDATE_PRE_ORDER_ERROR,
  (error) => error
);
export const preOrderUpdate = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(preOrderUpdateStart());

    const response = await _updatePreOrder(id, data);
    if (response) {
      callback(response);
    }
    dispatch(preOrderUpdateSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(preOrderUpdateError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Pharmacist Auth */
export const pharmacistAuthStart = createAction(
  ActionTypes.PHARMACIST_AUTHORIZATION_START
);
export const pharmacistAuthSuccess = createAction(
  ActionTypes.PHARMACIST_AUTHORIZATION_SUCCESS,
  (response) => response
);
export const pharmacistAuthError = createAction(
  ActionTypes.PHARMACIST_AUTHORIZATION_ERROR,
  (error) => error
);
export const pharmacistAuth = (data, callback) => async (dispatch) => {
  try {
    dispatch(pharmacistAuthStart());

    const response = await _pharmacistAuth(data);
    if (response) {
      callback(response);
    }
    dispatch(pharmacistAuthSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(pharmacistAuthError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

// Generate PDF
export const generatePDFStart = createAction(ActionTypes.GENERATE_PDF_START);
export const generatePDFSuccess = createAction(
  ActionTypes.GENERATE_PDF_SUCCESS,
  (response) => response
);
export const generatePDFError = createAction(
  ActionTypes.GENERATE_PDF_ERROR,
  (error) => error
);
export const generatePDF =
  (id, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(generatePDFStart());
      const response = await _generatePDF(id);
      if (response) {
        callback(response);
      }
      dispatch(generatePDFSuccess(response));
    } catch (error) {
      callbackError(error);
      dispatch(generatePDFError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

export const generateAllOrdersPDFStart = createAction(
  ActionTypes.GENERATE_ALL_ORDERS_PDF_START
);
export const generateAllOrdersPDFSuccess = createAction(
  ActionTypes.GENERATE_ALL_ORDERS_PDF_SUCCESS,
  (response) => response
);
export const generateAllOrdersPDFError = createAction(
  ActionTypes.GENERATE_ALL_ORDERS_PDF_ERROR,
  (error) => error
);

export const generateAllOrdersPDF =
  (search, status, page, limit, callback) => async (dispatch) => {
    dispatch(generateAllOrdersPDFStart());
    return _generateAllOrdersPDF(search, status, page, limit)
      .then((response) => {
        dispatch(generateAllOrdersPDFSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(generateAllOrdersPDFError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

// Generate PRESCRIPTION PDF
export const generatePrescriptionPDFStart = createAction(
  ActionTypes.GENERATE_PRESCRIPTION_PDF_START
);
export const generatePrescriptionPDFSuccess = createAction(
  ActionTypes.GENERATE_PRESCRIPTION_PDF_SUCCESS,
  (response) => response
);
export const generatePrescriptionPDFError = createAction(
  ActionTypes.GENERATE_PRESCRIPTION_PDF_ERROR,
  (error) => error
);
export const generatePrescriptionPDF =
  (id, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(generatePrescriptionPDFStart());
      const response = await _generatePrescriptionPDF(id);
      if (response) {
        callback(response);
      }
      dispatch(generatePrescriptionPDFSuccess(response));
    } catch (error) {
      callbackError(error);
      dispatch(generatePrescriptionPDFError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// ORDER_PRESCRIPTIONS
export const orderPrescriptionsStart = createAction(
  ActionTypes.GET_ORDER_PRESCRIPTION_START
);
export const orderPrescriptionsSuccess = createAction(
  ActionTypes.GET_ORDER_PRESCRIPTION_SUCCESS,
  (response) => response
);
export const orderPrescriptionsError = createAction(
  ActionTypes.GET_ORDER_PRESCRIPTION_ERROR,
  (error) => error
);
export const getOrderPrescription = (id, callback) => async (dispatch) => {
  try {
    dispatch(orderPrescriptionsStart());
    const response = await _getOrderPrescription(id);
    if (response) {
      callback(response);
    }
    dispatch(orderPrescriptionsSuccess(response));
  } catch (error) {
    dispatch(orderPrescriptionsError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

const reducer = handleActions(
  {
    //Create Order
    [ActionTypes.CREATE_PHARMACY_ORDER_START]: (state) => ({
      ...state,
      createOrder: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PHARMACY_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      createOrder: {
        ...state.createOrder,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PHARMACY_ORDER_ERROR]: (state, action) => ({
      ...state,
      createOrder: {
        ...state.createOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //Purchase Order
    [ActionTypes.PURCHASE_ORDER_START]: (state) => ({
      ...state,
      purchaseOrder: {
        ...state.purchaseOrder,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      purchaseOrder: {
        ...state.purchaseOrder,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_ERROR]: (state, action) => ({
      ...state,
      purchaseOrder: {
        ...state.purchaseOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //Get Pharmacy Orders
    [ActionTypes.GET_PHARMACY_ORDER_START]: (state) => ({
      ...state,
      pharmacyOrder: {
        ...state.pharmacyOrder,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyOrder: {
        ...state.pharmacyOrder,
        response: action?.payload?.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_ORDER_ERROR]: (state, action) => ({
      ...state,
      pharmacyOrder: {
        ...state.pharmacyOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   GET  ORDER DETAIL
    [ActionTypes.GET_ORDER_DETAIL_START]: (state) => ({
      ...state,
      pharmacyOrderDetail: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ORDER_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyOrderDetail: {
        ...state.pharmacyOrderDetail,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ORDER_DETAIL_ERROR]: (state, action) => ({
      ...state,
      pharmacyOrderDetail: {
        ...state.pharmacyOrderDetail,
        error: action.payload,
        loading: false,
        hasError: true,
      },
    }),
    //   PURCHASE ORDER DETAIL
    [ActionTypes.PURCHASE_ORDER_DETAIL_START]: (state) => ({
      ...state,
      purchaseOrderDetail: {
        loading: true,
        response: null,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      purchaseOrderDetail: {
        ...state.purchaseOrderDetail,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_DETAIL_ERROR]: (state, action) => ({
      ...state,
      purchaseOrderDetail: {
        ...state.purchaseOrderDetail,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.REJECT_ORDER_START]: (state) => ({
      ...state,
      rejectOrder: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.REJECT_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      rejectOrder: {
        ...state.rejectOrder,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.REJECT_ORDER_ERROR]: (state, action) => ({
      ...state,
      rejectOrder: {
        ...state.rejectOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.RETURN_ORDER_START]: (state) => ({
      ...state,
      returnOrder: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RETURN_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      returnOrder: {
        ...state.returnOrder,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.RETURN_ORDER_ERROR]: (state, action) => ({
      ...state,
      returnOrder: {
        ...state.returnOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.CANCEL_ORDER_BUYER_START]: (state) => ({
      ...state,
      cancelOrderBuyer: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CANCEL_ORDER_BUYER_SUCCESS]: (state, action) => ({
      ...state,
      cancelOrderBuyer: {
        ...state.cancelOrderBuyer,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CANCEL_ORDER_BUYER_ERROR]: (state, action) => ({
      ...state,
      cancelOrderBuyer: {
        ...state.cancelOrderBuyer,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.ACCEPT_ORDER_BUYER_START]: (state) => ({
      ...state,
      acceptOrderBuyer: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ACCEPT_ORDER_BUYER_SUCCESS]: (state, action) => ({
      ...state,
      acceptOrderBuyer: {
        ...state.acceptOrderBuyer,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ACCEPT_ORDER_BUYER_ERROR]: (state, action) => ({
      ...state,
      acceptOrderBuyer: {
        ...state.acceptOrderBuyer,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPDATE_ORDER_STATUS]: (state) => ({
      ...state,
      updateOrderStatus: {
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_ORDER_STATUS_SUCCESS]: (state, action) => ({
      ...state,
      updateOrderStatus: {
        loading: false,
        response: action.payload.data,
      },
    }),
    [ActionTypes.UPDATE_ORDER_STATUS_ERROR]: (state, action) => ({
      ...state,
      updateOrderStatus: {
        loading: false,
      },
    }),

    [ActionTypes.GENERATE_QR_START]: (state) => ({
      ...state,
      orderQr: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GENERATE_QR_SUCCESS]: (state, action) => ({
      ...state,
      orderQr: {
        ...state.orderQr,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GENERATE_QR_ERROR]: (state, action) => ({
      ...state,
      orderQr: {
        ...state.orderQr,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.SCAN_QR_START]: (state) => ({
      ...state,
      scan_qr: {
        loading: true,
      },
    }),
    [ActionTypes.SCAN_QR_SUCCESS]: (state, action) => ({
      ...state,
      scan_qr: {
        loading: false,
      },
    }),
    [ActionTypes.SCAN_QR_ERROR]: (state, action) => ({
      ...state,
      scan_qr: {
        loading: false,
      },
    }),

    [ActionTypes.PURCHASE_ORDER_SUGGESTION_START]: (state) => ({
      ...state,
      purchaseOrderSuggestion: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_SUGGESTION_SUCCESS]: (state, action) => ({
      ...state,
      purchaseOrderSuggestion: {
        ...state.purchaseOrderSuggestion,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PURCHASE_ORDER_SUGGESTION_ERROR]: (state, action) => ({
      ...state,
      purchaseOrderSuggestion: {
        ...state.purchaseOrderSuggestion,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    // reject product

    [ActionTypes.REJECT_PRODUCT_ORDER_START]: (state) => ({
      ...state,
      reject_product: {
        loading: true,
      },
    }),
    [ActionTypes.REJECT_PRODUCT_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      reject_product: {
        loading: false,
      },
    }),

    [ActionTypes.REJECT_PRODUCT_ORDER_ERROR]: (state, action) => ({
      ...state,
      reject_product: {
        loading: false,
      },
    }),

    // accept product

    [ActionTypes.ACCEPT_PRODUCT_ORDER_START]: (state) => ({
      ...state,
      accept_product: {
        loading: true,
      },
    }),
    [ActionTypes.ACCEPT_PRODUCT_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      accept_product: {
        loading: false,
      },
    }),

    [ActionTypes.ACCEPT_PRODUCT_ORDER_ERROR]: (state, action) => ({
      ...state,
      accept_product: {
        loading: false,
      },
    }),
    // APPROVAL Order

    [ActionTypes.PHARMACIES_ORDER_APPROVE_START]: (state) => ({
      ...state,
      orderApprove: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACIES_ORDER_APPROVE_SUCCESS]: (state, action) => ({
      ...state,
      orderApprove: {
        ...state.orderApprove,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.PHARMACIES_ORDER_APPROVE_ERROR]: (state, action) => ({
      ...state,
      orderApprove: {
        ...state.orderApprove,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    // REJECT Orders

    [ActionTypes.PHARMACIES_ORDER_REJECT_START]: (state) => ({
      ...state,
      orderReject: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACIES_ORDER_REJECT_SUCCESS]: (state, action) => ({
      ...state,
      orderReject: {
        ...state.orderReject,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.PHARMACIES_ORDER_REJECT_ERROR]: (state, action) => ({
      ...state,
      orderReject: {
        ...state.orderReject,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    // PURCHASE Orders

    [ActionTypes.GET_PURCHASE_ORDERS_START]: (state) => ({
      ...state,
      purchaseOrders: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PURCHASE_ORDERS_SUCCESS]: (state, action) => ({
      ...state,
      purchaseOrders: {
        ...state.purchaseOrders,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_PURCHASE_ORDERS_ERROR]: (state, action) => ({
      ...state,
      purchaseOrders: {
        ...state.purchaseOrders,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //  DELETE PRODUCT INVENTORY
    [ActionTypes.DELETE_PURCHASE_ORDER_START]: (state) => ({
      ...state,
      deletePurchaseOrder: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.DELETE_PURCHASE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      deletePurchaseOrder: {
        ...state.deletePurchaseOrder,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.DELETE_PURCHASE_ORDER_ERROR]: (state, action) => ({
      ...state,
      deletePurchaseOrder: {
        ...state.deletePurchaseOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPDATE_PURCHASE_ORDER_START]: (state) => ({
      ...state,
      updatePurchaseOrder: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.UPDATE_PURCHASE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      updatePurchaseOrder: {
        ...state.updatePurchaseOrder,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_PURCHASE_ORDER_ERROR]: (state, action) => ({
      ...state,
      updatePurchaseOrder: {
        ...state.updatePurchaseOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  Get pre orders
    [ActionTypes.GET_ALL_PRE_ORDERS_START]: (state) => ({
      ...state,
      preOrders: {
        loading: true,
        response: null,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_PRE_ORDERS_SUCCESS]: (state, action) => ({
      ...state,
      preOrders: {
        ...state.preOrders,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_PRE_ORDERS_ERROR]: (state, action) => ({
      ...state,
      preOrders: {
        ...state.preOrders,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Pre Order Detail
    [ActionTypes.PRE_ORDER_DETAIL_START]: (state) => ({
      ...state,
      preOrder: {
        loading: true,
      },
    }),
    [ActionTypes.PRE_ORDER_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      preOrder: {
        loading: false,
      },
    }),
    [ActionTypes.PRE_ORDER_DETAIL_ERROR]: (state, action) => ({
      ...state,
      preOrder: {
        loading: false,
      },
    }),

    //Pre Order Approve
    [ActionTypes.APPROVE_PRE_ORDER_START]: (state) => ({
      ...state,
      preOrderApprove: {
        loading: true,
      },
    }),
    [ActionTypes.APPROVE_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      preOrderApprove: {
        loading: false,
      },
    }),
    [ActionTypes.APPROVE_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      preOrderApprove: {
        loading: false,
      },
    }),

    //Pre Order Reject
    [ActionTypes.REJECT_PRE_ORDER_START]: (state) => ({
      ...state,
      preOrderReject: {
        loading: true,
      },
    }),
    [ActionTypes.REJECT_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      preOrderReject: {
        loading: false,
      },
    }),
    [ActionTypes.REJECT_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      preOrderReject: {
        loading: false,
      },
    }),

    //Pre Order Update
    [ActionTypes.UPDATE_PRE_ORDER_START]: (state) => ({
      ...state,
      preOrderUpdate: {
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      preOrderUpdate: {
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      preOrderUpdate: {
        loading: false,
      },
    }),

    //Pharmacist Auth
    [ActionTypes.PHARMACIST_AUTHORIZATION_START]: (state) => ({
      ...state,
      pharmacist_auth: {
        loading: true,
      },
    }),
    [ActionTypes.PHARMACIST_AUTHORIZATION_SUCCESS]: (state, action) => ({
      ...state,
      pharmacist_auth: {
        loading: false,
      },
    }),
    [ActionTypes.PHARMACIST_AUTHORIZATION_ERROR]: (state, action) => ({
      ...state,
      pharmacist_auth: {
        loading: false,
      },
    }),

    [ActionTypes.GENERATE_PDF_START]: (state) => ({
      ...state,
      generate_pdf: {
        loading: true,
      },
    }),
    [ActionTypes.GENERATE_PDF_SUCCESS]: (state, action) => ({
      ...state,
      generate_pdf: {
        loading: false,
      },
    }),
    [ActionTypes.GENERATE_PDF_ERROR]: (state, action) => ({
      ...state,
      generate_pdf: {
        loading: false,
      },
    }),

    // All orders PDF
    [ActionTypes.GENERATE_ALL_ORDERS_PDF_START]: (state) => ({
      ...state,
      generate_allOrders_Pdf: {
        loading: true,
      },
    }),
    [ActionTypes.GENERATE_ALL_ORDERS_PDF_SUCCESS]: (state, action) => ({
      ...state,
      generate_allOrders_Pdf: {
        loading: false,
      },
    }),
    [ActionTypes.GENERATE_ALL_ORDERS_PDF_ERROR]: (state, action) => ({
      ...state,
      generate_allOrders_Pdf: {
        loading: false,
      },
    }),

    // Generate Prescription orders PDF
    [ActionTypes.GENERATE_PRESCRIPTION_PDF_START]: (state) => ({
      ...state,
      generate_prescription_pdf: {
        loading: true,
      },
    }),
    [ActionTypes.GENERATE_PRESCRIPTION_PDF_SUCCESS]: (state, action) => ({
      ...state,
      generate_prescription_pdf: {
        loading: false,
      },
    }),
    [ActionTypes.GENERATE_PRESCRIPTION_PDF_ERROR]: (state, action) => ({
      ...state,
      generate_prescription_pdf: {
        loading: false,
      },
    }),

    // order Prescription
    [ActionTypes.GET_ORDER_PRESCRIPTION_START]: (state) => ({
      ...state,
      orderPrescriptions: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ORDER_PRESCRIPTION_SUCCESS]: (state, action) => ({
      ...state,
      orderPrescriptions: {
        ...state.orderPrescriptions,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ORDER_PRESCRIPTION_ERROR]: (state, action) => ({
      ...state,
      orderPrescriptions: {
        ...state.orderPrescriptions,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
  },

  initialState
);

export default reducer;
