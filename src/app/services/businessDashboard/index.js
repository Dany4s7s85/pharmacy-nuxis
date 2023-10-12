import { createAction, handleActions } from "redux-actions";
import {
  _businessMonthlySaleReport,
  _businessOrderReporting,
  _businessPurchaseOrderReporting,
  _getBusinessLevelCount,
  _getBusinessOrderReportingCards,
  _getBusinessPrescription,
  _getStoreLevelCount,
  _topSellingProducts,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";

const initialState = {
  businessOrderReporting: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  businessOrderReportingCards: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  businessLevelCount: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  storeLevelCount: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  businessPurchaseOrderReporting: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessMonthlySaleReport: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  topSellingProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessPrescription: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
};

//Business Purchase Order Reporting
export const getBusinessPurchaseOrderReportingStart = createAction(
  ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_START
);
export const getBusinessPurchaseOrderReportingSuccess = createAction(
  ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_SUCCESS,
  (response) => response
);
export const getBusinessPurchaseOrderReportingError = createAction(
  ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_ERROR,
  (error) => error
);

//Business Monthly Sale Reporting
export const getBusinessMonthlySaleReportStart = createAction(
  ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_START
);
export const getBusinessMonthlySaleReportSuccess = createAction(
  ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_SUCCESS,
  (response) => response
);
export const getBusinessMonthlySaleReportError = createAction(
  ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_ERROR,
  (error) => error
);

//Get Business Order Reporting

export const getBusinessOrderReportingStart = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_START
);
export const getBusinessOrderReportingSuccess = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_SUCCESS,
  (response) => response
);
export const getBusinessOrderReportingError = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_ERROR,
  (error) => error
);

export const getBusinessOrderReporting =
  (fromDate, toDate, callback) => (dispatch) => {
    dispatch(getBusinessOrderReportingStart());

    return _businessOrderReporting(fromDate, toDate)
      .then((response) => {
        dispatch(getBusinessOrderReportingSuccess(response));
        callback(response);
      })
      .catch((error) => {
        dispatch(getBusinessOrderReportingError(error));

        if (error?.status?.length > 0) {
          toast.error(error?.error);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

//Get Business Order Reporting Cards

export const getBusinessOrderReportingCardsStart = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_START
);
export const getBusinessOrderReportingCardsSuccess = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_SUCCESS,
  (response) => response
);
export const getBusinessOrderReportingCardsError = createAction(
  ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_ERROR,
  (error) => error
);

export const getBusinessOrderReportingCards = (callback) => (dispatch) => {
  dispatch(getBusinessOrderReportingCardsStart());

  return _getBusinessOrderReportingCards()
    .then((response) => {
      dispatch(getBusinessOrderReportingCardsSuccess(response));
      callback(response);
    })
    .catch((error) => {
      dispatch(getBusinessOrderReportingCardsError(error));

      if (error?.status?.length > 0) {
        toast.error(error?.error);
      } else {
        toast.error("Something went wrong");
      }
    });
};

//Get Counts in dashboard
export const getBusinessLevelCountStart = createAction(
  ActionTypes.BUSINESS_LEVEL_COUNT_START
);
export const getBusinessLevelCountSuccess = createAction(
  ActionTypes.BUSINESS_LEVEL_COUNT_SUCCESS,
  (response) => response
);
export const getBusinessLevelCountError = createAction(
  ActionTypes.BUSINESS_LEVEL_COUNT_ERROR,
  (error) => error
);

export const getBusinessLevelCount = (callback) => (dispatch) => {
  dispatch(getBusinessLevelCountStart());

  return _getBusinessLevelCount()
    .then((response) => {
      dispatch(getBusinessLevelCountSuccess(response));
      callback(response);
    })
    .catch((error) => {
      dispatch(getBusinessLevelCountError(error));

      if (error?.status?.length > 0) {
        toast.error(error?.error);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const getStoreLevelCountStart = createAction(
  ActionTypes.STORE_LEVEL_COUNT_START
);
export const getStoreLevelCountSuccess = createAction(
  ActionTypes.STORE_LEVEL_COUNT_SUCCESS,
  (response) => response
);
export const getStoreLevelCountError = createAction(
  ActionTypes.STORE_LEVEL_COUNT_ERROR,
  (error) => error
);

export const getStoreLevelCount = (callback) => (dispatch) => {
  dispatch(getStoreLevelCountStart());

  return _getStoreLevelCount()
    .then((response) => {
      dispatch(getStoreLevelCountSuccess(response));
      callback(response);
    })
    .catch((error) => {
      dispatch(getStoreLevelCountError(error));

      if (error?.status?.length > 0) {
        toast.error(error?.error);
      } else {
        toast.error("Something went wrong");
      }
    });
};

// Get Business Purchase Order Reporting
export const getBusinessPurchaseOrderReporting =
  (fromDate, toDate, callback) => (dispatch) => {
    dispatch(getBusinessPurchaseOrderReportingStart());

    return _businessPurchaseOrderReporting(fromDate, toDate)
      .then((response) => {
        dispatch(getBusinessPurchaseOrderReportingSuccess(response));
        callback(response);
      })
      .catch((error) => {
        dispatch(getBusinessPurchaseOrderReportingError(error));

        if (error?.status?.length > 0) {
          toast.error(error?.error);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

// Get Business Monthly Sale Report
export const getBusinessMonthlySaleReport =
  (selectedMonths, callback) => (dispatch) => {
    dispatch(getBusinessMonthlySaleReportStart());

    return _businessMonthlySaleReport(selectedMonths)
      .then((response) => {
        dispatch(getBusinessMonthlySaleReportSuccess(response));
        callback(response);
      })
      .catch((error) => {
        dispatch(getBusinessMonthlySaleReportError(error));

        if (error?.status?.length > 0) {
          toast.error(error?.error);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

export const topSellingProductsStart = createAction(
  ActionTypes.TOP_SELLING_PRODUCTS_START
);
export const topSellingProductsSuccess = createAction(
  ActionTypes.TOP_SELLING_PRODUCTS_SUCCESS,
  (response) => response
);
export const topSellingProductsError = createAction(
  ActionTypes.TOP_SELLING_PRODUCTS_ERROR,
  (error) => error
);

export const getTopSellingProducts =
  (limit, fromDate, toDate, callback) => async (dispatch) => {
    try {
      dispatch(topSellingProductsStart());
      const response = await _topSellingProducts(limit, fromDate, toDate);
      dispatch(topSellingProductsSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(topSellingProductsError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Business PRESCRIPTION*/
export const businessPrescriptionStart = createAction(
  ActionTypes.GET_BUSINESS_PRESCRIPTION_START
);
export const businessPrescriptionSuccess = createAction(
  ActionTypes.GET_BUSINESS_PRESCRIPTION_SUCCESS,
  (response) => response
);
export const businessPrescriptionError = createAction(
  ActionTypes.GET_BUSINESS_PRESCRIPTION_ERROR,
  (error) => error
);
export const getBusinessPrescription =
  (search, status, page, limit, callback) => async (dispatch) => {
    try {
      dispatch(businessPrescriptionStart());

      const response = await _getBusinessPrescription(
        search,
        status,
        page,
        limit
      );

      dispatch(businessPrescriptionSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(businessPrescriptionError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
const reducer = handleActions(
  {
    //Business Order Reporting
    [ActionTypes.BUSINESS_ORDER_REPORTING_START]: (state) => ({
      ...state,
      businessOrderReporting: {
        ...state.businessOrderReporting,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_ORDER_REPORTING_SUCCESS]: (state, action) => ({
      ...state,
      businessOrderReporting: {
        ...state.businessOrderReporting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_ORDER_REPORTING_ERROR]: (state, action) => ({
      ...state,
      businessOrderReporting: {
        ...state.businessOrderReporting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Business Order Reporting Cards
    [ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_START]: (state) => ({
      ...state,
      businessOrderReportingCards: {
        ...state.businessOrderReportingCards,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_SUCCESS]: (state, action) => ({
      ...state,
      businessOrderReportingCards: {
        ...state.businessOrderReportingCards,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_ORDER_REPORTING_CARDS_ERROR]: (state, action) => ({
      ...state,
      businessOrderReportingCards: {
        ...state.businessOrderReportingCards,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.BUSINESS_LEVEL_COUNT_START]: (state) => ({
      ...state,
      businessLevelCount: {
        ...state.businessLevelCount,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_LEVEL_COUNT_SUCCESS]: (state, action) => ({
      ...state,
      businessLevelCount: {
        ...state.businessLevelCount,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_LEVEL_COUNT_ERROR]: (state, action) => ({
      ...state,
      businessLevelCount: {
        ...state.businessLevelCount,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.STORE_LEVEL_COUNT_START]: (state) => ({
      ...state,
      storeLevelCount: {
        ...state.storeLevelCount,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.STORE_LEVEL_COUNT_SUCCESS]: (state, action) => ({
      ...state,
      storeLevelCount: {
        ...state.storeLevelCount,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.STORE_LEVEL_COUNT_ERROR]: (state, action) => ({
      ...state,
      storeLevelCount: {
        ...state.storeLevelCount,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    // Business Purchase Order Reporting
    [ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_START]: (state) => ({
      ...state,
      businessPurchaseOrderReporting: {
        ...state.businessPurchaseOrderReporting,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      businessPurchaseOrderReporting: {
        ...state.businessPurchaseOrderReporting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_PURCHASE_ORDER_REPORTING_ERROR]: (state, action) => ({
      ...state,
      businessPurchaseOrderReporting: {
        ...state.businessPurchaseOrderReporting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Business Monthly Sale Report
    [ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_START]: (state) => ({
      ...state,
      businessMonthlySaleReport: {
        ...state.businessMonthlySaleReport,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_SUCCESS]: (state, action) => ({
      ...state,
      businessMonthlySaleReport: {
        ...state.businessMonthlySaleReport,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.BUSINESS_MONTHLY_SALE_REPORT_ERROR]: (state, action) => ({
      ...state,
      businessMonthlySaleReport: {
        ...state.businessMonthlySaleReport,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.TOP_SELLING_PRODUCTS_START]: (state) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.TOP_SELLING_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.TOP_SELLING_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PRESCRIPTION_START]: (state) => ({
      ...state,
      businessPrescription: {
        ...state.businessPrescription,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PRESCRIPTION_SUCCESS]: (state, action) => ({
      ...state,
      businessPrescription: {
        ...state.businessPrescription,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_BUSINESS_PRESCRIPTION_ERROR]: (state, action) => ({
      ...state,
      businessPrescription: {
        ...state.businessPrescription,
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
