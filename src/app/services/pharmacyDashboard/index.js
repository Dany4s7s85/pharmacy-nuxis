import { createAction, handleActions } from "redux-actions";
import {
  _getStorePrescription,
  _pharmacyMonthlySaleReporting,
  _pharmacyOrderReporting,
  _pharmacyOrderReportingCards,
  _pharmacyPurchaseOrderReporting,
  _storeTopSellingProducts,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";

const initialState = {
  pharmacyOrderReporting: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  pharmacyOrderReportingCards: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  pharmacyPurchaseReporting: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  pharmacyMonthlySaleReporting: {
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
  storePrescription: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
};

// PHARMACY ORDER REPORTING

export const pharmacyOrderReportingStart = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_START
);
export const pharmacyOrderReportingSuccess = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_SUCCESS,
  (response) => response
);
export const pharmacyOrderReportingError = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_ERROR,
  (error) => error
);
export const getPharmacyOrderReporting =
  (fromDate, toDate, callback) => async (dispatch) => {
    try {
      dispatch(pharmacyOrderReportingStart());
      const response = await _pharmacyOrderReporting(fromDate, toDate);
      dispatch(pharmacyOrderReportingSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(pharmacyOrderReportingError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// PHARMACY ORDER REPORTING CARDS

export const pharmacyOrderReportingCardsStart = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_START
);
export const pharmacyOrderReportingCardsSuccess = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_SUCCESS,
  (response) => response
);
export const pharmacyOrderReportingCardsError = createAction(
  ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_ERROR,
  (error) => error
);
export const getPharmacyOrderReportingCards =
  (callback) => async (dispatch) => {
    try {
      dispatch(pharmacyOrderReportingCardsStart());
      const response = await _pharmacyOrderReportingCards();
      dispatch(pharmacyOrderReportingCardsSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(pharmacyOrderReportingCardsError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

export const topSellingProductsStart = createAction(
  ActionTypes.STORE_TOP_SELLING_PRODUCTS_START
);
export const topSellingProductsSuccess = createAction(
  ActionTypes.STORE_TOP_SELLING_PRODUCTS_SUCCESS,
  (response) => response
);
export const topSellingProductsError = createAction(
  ActionTypes.STORE_TOP_SELLING_PRODUCTS_ERROR,
  (error) => error
);

export const getStoreTopSellingProducts =
  (limit, fromDate, toDate, callback) => async (dispatch) => {
    try {
      dispatch(topSellingProductsStart());
      const response = await _storeTopSellingProducts(limit, fromDate, toDate);
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

//Pharmacy Purchase Order Reporting
export const pharmacyPurchaseReportingStart = createAction(
  ActionTypes.PHARMACY_PURCHASE_REPORTING_START
);
export const pharmacyPurchaseReportingSuccess = createAction(
  ActionTypes.PHARMACY_PURCHASE_REPORTING_SUCCESS,
  (response) => response
);
export const pharmacyPurchaseReportingError = createAction(
  ActionTypes.PHARMACY_PURCHASE_REPORTING_ERROR,
  (error) => error
);

export const getPharmacyPurchaseReporting =
  (fromDate, toDate, callback) => async (dispatch) => {
    try {
      dispatch(pharmacyPurchaseReportingStart());
      const response = await _pharmacyPurchaseOrderReporting(fromDate, toDate);
      dispatch(pharmacyPurchaseReportingSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(pharmacyPurchaseReportingError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
//Pharmacy Monthly sale Reporting

export const pharmacyMonthlySaleReportingStart = createAction(
  ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_START
);
export const pharmacyMonthlySaleReportingSuccess = createAction(
  ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_SUCCESS,
  (response) => response
);
export const pharmacyMonthlySaleReportingError = createAction(
  ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_ERROR,
  (error) => error
);

export const getPharmacyMonthlySaleReporting =
  (selectedMonths, callback) => async (dispatch) => {
    try {
      dispatch(pharmacyMonthlySaleReportingStart());
      const response = await _pharmacyMonthlySaleReporting(selectedMonths);
      dispatch(pharmacyMonthlySaleReportingSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(pharmacyMonthlySaleReportingError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Store PRESCRIPTION*/
export const storePrescriptionStart = createAction(
  ActionTypes.GET_STORE_PRESCRIPTION_START
);
export const storePrescriptionSuccess = createAction(
  ActionTypes.GET_STORE_PRESCRIPTION_SUCCESS,
  (response) => response
);
export const storePrescriptionError = createAction(
  ActionTypes.GET_STORE_PRESCRIPTION_ERROR,
  (error) => error
);
export const getStorePrescription =
  (search, status, page, limit, callback) => async (dispatch) => {
    try {
      dispatch(storePrescriptionStart());

      const response = await _getStorePrescription(search, status, page, limit);

      dispatch(storePrescriptionSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(storePrescriptionError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
const reducer = handleActions(
  {
    [ActionTypes.PHARMACY_ORDER_REPORTING_START]: (state) => ({
      ...state,
      pharmacyOrderReporting: {
        ...state.pharmacyOrderReporting,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_ORDER_REPORTING_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyOrderReporting: {
        ...state.pharmacyOrderReporting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_ORDER_REPORTING_ERROR]: (state, action) => ({
      ...state,
      pharmacyOrderReporting: {
        ...state.pharmacyOrderReporting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_START]: (state) => ({
      ...state,
      pharmacyOrderReportingCards: {
        ...state.pharmacyOrderReportingCards,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyOrderReportingCards: {
        ...state.pharmacyOrderReportingCards,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_ORDER_REPORTING_CARDS_ERROR]: (state, action) => ({
      ...state,
      pharmacyOrderReportingCards: {
        ...state.pharmacyOrderReportingCards,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.PHARMACY_PURCHASE_REPORTING_START]: (state) => ({
      ...state,
      pharmacyPurchaseReporting: {
        ...state.pharmacyPurchaseReporting,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_PURCHASE_REPORTING_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyPurchaseReporting: {
        ...state.pharmacyPurchaseReporting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_PURCHASE_REPORTING_ERROR]: (state, action) => ({
      ...state,
      pharmacyPurchaseReporting: {
        ...state.pharmacyPurchaseReporting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_START]: (state) => ({
      ...state,
      pharmacyMonthlySaleReporting: {
        ...state.pharmacyMonthlySaleReporting,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyMonthlySaleReporting: {
        ...state.pharmacyMonthlySaleReporting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_MONTHLY_SALE_REPORTING_ERROR]: (state, action) => ({
      ...state,
      pharmacyMontlySaleReporting: {
        ...state.pharmacyMonthlySaleReporting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.STORE_TOP_SELLING_PRODUCTS_START]: (state) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.STORE_TOP_SELLING_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.STORE_TOP_SELLING_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      topSellingProducts: {
        ...state.topSellingProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.GET_STORE_PRESCRIPTION_START]: (state) => ({
      ...state,
      storePrescription: {
        ...state.storePrescription,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_STORE_PRESCRIPTION_SUCCESS]: (state, action) => ({
      ...state,
      storePrescription: {
        ...state.storePrescription,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_STORE_PRESCRIPTION_ERROR]: (state, action) => ({
      ...state,
      storePrescription: {
        ...state.storePrescription,
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
