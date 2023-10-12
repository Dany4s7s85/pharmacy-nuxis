import { createAction, handleActions } from "redux-actions";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";
import {
  _getBusinessOrders,
  _getBusinessPurchaseOrders,
  _getBusinessProductList,
  _getBusinessPreOrders,
  _getBusinessPreOrderDetail,
} from "../../shared/httpService/api";
import { _approveBusinessPreOrder } from "../../shared/httpService/api";
import { _rejectBusinessPreOrder } from "../../shared/httpService/api";
import { _updateBusinessPreOrder } from "../../shared/httpService/api";

const initialState = {
  businessPurchaseOrder: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessOrder: { loading: false, response: {}, hasError: false, error: {} },
  businessProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessPreOrders: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessPreOrder: { loading: false },
  businessPreOrderApprove: { loading: false },
  businessPreOrderReject: { loading: false },
  businessPreOrderUpdate: { loading: false },
};

/* GET BUSINESS ORDERS  */
export const getBusinessOrderStart = createAction(
  ActionTypes.GET_BUSINESS_ORDER_START
);
export const getBusinessOrderSuccess = createAction(
  ActionTypes.GET_BUSINESS_ORDER_SUCCESS,
  (response) => response
);
export const getBusinessOrderError = createAction(
  ActionTypes.GET_BUSINESS_ORDER_ERROR,
  (error) => error
);

export const getBusinessOrder =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getBusinessOrderStart());
    return _getBusinessOrders(search, status, page, limit)
      .then((response) => {
        dispatch(getBusinessOrderSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getBusinessOrderError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* GET BUSINESS PURCHASE ORDER  */
export const businessPurchaseOrderStart = createAction(
  ActionTypes.GET_BUSINESS_PURCHASE_ORDER_START
);
export const businessPurchaseOrderSuccess = createAction(
  ActionTypes.GET_BUSINESS_PURCHASE_ORDER_SUCCESS,
  (response) => response
);
export const businessPurchaseOrderError = createAction(
  ActionTypes.GET_BUSINESS_PURCHASE_ORDER_ERROR,
  (error) => error
);

export const getBusinessPurchaseOrders =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(businessPurchaseOrderStart());
    return _getBusinessPurchaseOrders(search, status, page, limit)
      .then((response) => {
        dispatch(businessPurchaseOrderSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(businessPurchaseOrderError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* GET BUSINESS PRODUCTS  */
export const getBusinessProductsStart = createAction(
  ActionTypes.GET_BUSINESS_PRODUCTS_START
);
export const getBusinessProductsSuccess = createAction(
  ActionTypes.GET_BUSINESS_PRODUCTS_SUCCESS,
  (response) => response
);
export const getBusinessProductsError = createAction(
  ActionTypes.GET_BUSINESS_PRODUCTS_ERROR,
  (error) => error
);

export const getBusinessProductList =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getBusinessProductsStart());
    return _getBusinessProductList(search, status, page, limit)
      .then((response) => {
        dispatch(getBusinessProductsSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getBusinessProductsError(error));
        if (error && error?.error) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* Get BUSINESS pre orders  */
export const getBusinessPreOrdersStart = createAction(
  ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_START
);
export const getBusinessPreOrdersSuccess = createAction(
  ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_SUCCESS,
  (response) => response
);
export const getBusinessPreOrdersError = createAction(
  ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_ERROR,
  (error) => error
);

export const getBusinessPreOrders =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getBusinessPreOrdersStart());
    return _getBusinessPreOrders(search, status, page, limit)
      .then((response) => {
        dispatch(getBusinessPreOrdersSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getBusinessPreOrdersError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

/* Business Pre ORDER Detail*/
export const businessPreOrderDetailStart = createAction(
  ActionTypes.BUSINESS_PRE_ORDER_DETAIL_START
);
export const businessPreOrderDetailSuccess = createAction(
  ActionTypes.BUSINESS_PRE_ORDER_DETAIL_SUCCESS,
  (response) => response
);
export const businessPreOrderDetailError = createAction(
  ActionTypes.BUSINESS_PRE_ORDER_DETAIL_ERROR,
  (error) => error
);
export const businessPreOrderDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(businessPreOrderDetailStart());

    const response = await _getBusinessPreOrderDetail(id);
    if (response) {
      callback(response);
    }
    dispatch(businessPreOrderDetailSuccess(response));
  } catch (error) {
    dispatch(businessPreOrderDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Business Pre Order Approved */
export const businessPreOrderApproveStart = createAction(
  ActionTypes.APPROVE_BUSINESS_PRE_ORDER_START
);
export const businessPreOrderApproveSuccess = createAction(
  ActionTypes.APPROVE_BUSINESS_PRE_ORDER_SUCCESS,
  (response) => response
);
export const businessPreOrderApproveError = createAction(
  ActionTypes.APPROVE_BUSINESS_PRE_ORDER_ERROR,
  (error) => error
);
export const approveBusinessPreOrder =
  (id, data, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(businessPreOrderApproveStart());

      const response = await _approveBusinessPreOrder(id, data);
      if (response) {
        callback(response);
      }
      dispatch(businessPreOrderApproveSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(businessPreOrderApproveError(error));
      callbackError(error);
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Business Pre Order Reject */
export const businessPreOrderRejectStart = createAction(
  ActionTypes.REJECT_BUSINESS_PRE_ORDER_START
);
export const businessPreOrderRejectSuccess = createAction(
  ActionTypes.REJECT_BUSINESS_PRE_ORDER_SUCCESS,
  (response) => response
);
export const businessPreOrderRejectError = createAction(
  ActionTypes.REJECT_BUSINESS_PRE_ORDER_ERROR,
  (error) => error
);
export const rejectBusinessPreOrder =
  (id, data, callback) => async (dispatch) => {
    try {
      dispatch(businessPreOrderRejectStart());

      const response = await _rejectBusinessPreOrder(id, data);
      if (response) {
        callback(response);
      }
      dispatch(businessPreOrderRejectSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(businessPreOrderRejectError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Business Pre Order Update */
export const businessPreOrderUpdateStart = createAction(
  ActionTypes.UPDATE_BUSINESS_PRE_ORDER_START
);
export const businessPreOrderUpdateSuccess = createAction(
  ActionTypes.UPDATE_BUSINESS_PRE_ORDER_SUCCESS,
  (response) => response
);
export const businessPreOrderUpdateError = createAction(
  ActionTypes.UPDATE_BUSINESS_PRE_ORDER_ERROR,
  (error) => error
);
export const businessPreOrderUpdate =
  (id, data, callback) => async (dispatch) => {
    try {
      dispatch(businessPreOrderUpdateStart());

      const response = await _updateBusinessPreOrder(id, data);
      if (response) {
        callback(response);
      }
      dispatch(businessPreOrderUpdateSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(businessPreOrderUpdateError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

const reducer = handleActions(
  {
    // Get Purchase Order
    [ActionTypes.GET_BUSINESS_PURCHASE_ORDER_START]: (state) => ({
      ...state,
      businessPurchaseOrder: {
        ...state.businessPurchaseOrder,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PURCHASE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      businessPurchaseOrder: {
        ...state.businessPurchaseOrder,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PURCHASE_ORDER_ERROR]: (state, action) => ({
      ...state,
      businessPurchaseOrder: {
        ...state.businessPurchaseOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Get Business Orders
    [ActionTypes.GET_BUSINESS_ORDER_START]: (state) => ({
      ...state,
      businessOrder: {
        ...state.businessOrder,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      businessOrder: {
        ...state.businessOrder,
        response: action?.payload?.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_ORDER_ERROR]: (state, action) => ({
      ...state,
      businessOrder: {
        ...state.businessOrder,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Get Business Products
    [ActionTypes.GET_BUSINESS_PRODUCTS_START]: (state) => ({
      ...state,
      businessProducts: {
        ...state.businessProducts,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      businessProducts: {
        ...state.businessProducts,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_BUSINESS_PRODUCTS_ERROR]: (state) => ({
      ...state,
      businessProducts: {
        ...state.businessProducts,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //  Get Business pre orders
    [ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_START]: (state) => ({
      ...state,
      businessPreOrders: {
        loading: true,
        response: null,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_SUCCESS]: (state, action) => ({
      ...state,
      businessPreOrders: {
        ...state.businessPreOrders,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_BUSINESS_PRE_ORDERS_ERROR]: (state, action) => ({
      ...state,
      businessPreOrders: {
        ...state.businessPreOrders,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    // Business Pre Order Detail
    [ActionTypes.BUSINESS_PRE_ORDER_DETAIL_START]: (state) => ({
      ...state,
      businessPreOrder: {
        loading: true,
      },
    }),
    [ActionTypes.BUSINESS_PRE_ORDER_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      businessPreOrder: {
        loading: false,
      },
    }),
    [ActionTypes.BUSINESS_PRE_ORDER_DETAIL_ERROR]: (state, action) => ({
      ...state,
      businessPreOrder: {
        loading: false,
      },
    }),

    // Business Pre Order Approve
    [ActionTypes.APPROVE_BUSINESS_PRE_ORDER_START]: (state) => ({
      ...state,
      businessPreOrderApprove: {
        loading: true,
      },
    }),
    [ActionTypes.APPROVE_BUSINESS_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      businessPreOrderApprove: {
        loading: false,
      },
    }),
    [ActionTypes.APPROVE_BUSINESS_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      businessPreOrderApprove: {
        loading: false,
      },
    }),

    // Business Pre Order Reject
    [ActionTypes.REJECT_BUSINESS_PRE_ORDER_START]: (state) => ({
      ...state,
      businessPreOrderReject: {
        loading: true,
      },
    }),
    [ActionTypes.REJECT_BUSINESS_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      businessPreOrderReject: {
        loading: false,
      },
    }),
    [ActionTypes.REJECT_BUSINESS_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      businessPreOrderReject: {
        loading: false,
      },
    }),

    // Business Pre Order Update
    [ActionTypes.UPDATE_BUSINESS_PRE_ORDER_START]: (state) => ({
      ...state,
      businessPreOrderUpdate: {
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PRE_ORDER_SUCCESS]: (state, action) => ({
      ...state,
      businessPreOrderUpdate: {
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PRE_ORDER_ERROR]: (state, action) => ({
      ...state,
      businessPreOrderUpdate: {
        loading: false,
      },
    }),
  },

  initialState
);

export default reducer;
