import { createAction, handleActions } from "redux-actions";
import ActionTypes from "../../shared/constants/actionTypes";
import {
  _saveCart,
  _getCart,
  _emptyCart,
  _updateCart,
  _getRestoreCart,
} from "../../shared/httpService/api";
import { toast } from "react-toastify";

const initialState = {
  drawer: false,
  products: JSON.parse(localStorage.getItem("cart"))
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  saveCart: { loading: false, response: {}, hasError: false, error: {} },
  getCart: { loading: false, response: {}, hasError: false, error: {} },
  getRestoreCart: { loading: false, response: {}, hasError: false, error: {} },
  updateCart: { loading: false },
  activeLink: "",
};

export const activeLinkSuccess = createAction(
  ActionTypes.SET_ACTIVE_LINK,
  (response) => response
);

export const drawerOpenSuccess = createAction(
  ActionTypes.OPEN_DRAWER_SUCCESS,
  (response) => response
);

export const openDrawer = (bool) => (dispatch) => {
  dispatch(drawerOpenSuccess(bool));
};

export const activeLink = (link) => (dispatch) => {
  dispatch(activeLinkSuccess(link));
};

export const productToCartStart = createAction(
  ActionTypes.ADD_PRODUCTS_TO_CART_START
);
export const productToCartSuccess = createAction(
  ActionTypes.ADD_PRODUCTS_TO_CART_SUCCESS,
  (response) => response
);
export const productToCartError = createAction(
  ActionTypes.ADD_PRODUCTS_TO_CART_ERROR,
  (error) => error
);

export const addProducts = (products) => (dispatch) => {
  dispatch(productToCartSuccess(products));
};
export const cartSaveStart = createAction(ActionTypes.ADD_CART_START);
export const cartSaveSuccess = createAction(
  ActionTypes.ADD_CART_SUCCESS,
  (response) => response
);
export const cartSaveError = createAction(
  ActionTypes.ADD_CART_ERROR,
  (error) => error
);

export const saveCart = (data, callback) => (dispatch) => {
  dispatch(cartSaveStart());
  return _saveCart(data)
    .then((response) => {
      if (response) {
        toast.success("Cart has been saved successfully");
        callback(response);
      }

      dispatch(cartSaveSuccess(response));
    })
    .catch((error) => {
      dispatch(cartSaveError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const getCartStart = createAction(ActionTypes.GET_CART_START);
export const getCartSuccess = createAction(
  ActionTypes.GET_CART_SUCCESS,
  (response) => response
);
export const getCartError = createAction(
  ActionTypes.GET_CART_ERROR,
  (error) => error
);

export const getCart = (callback) => (dispatch) => {
  dispatch(getCartStart());
  return _getCart()
    .then((response) => {
      if (response) {
        callback(response);
      }

      dispatch(getCartSuccess(response));
    })
    .catch((error) => {
      dispatch(getCartError(error));
      toast.error("Something went wrong");
    });
};

export const getRestoreCartStart = createAction(
  ActionTypes.GET_RESTORE_CART_START
);
export const getRestoreCartSuccess = createAction(
  ActionTypes.GET_RESTORE_CART_SUCCESS,
  (response) => response
);
export const getRestoreCartError = createAction(
  ActionTypes.GET_RESTORE_CART_ERROR,
  (error) => error
);

export const getRestoreCart = (callback) => (dispatch) => {
  dispatch(getRestoreCartStart());
  return _getRestoreCart()
    .then((response) => {
      if (response) {
        callback(response);
      }

      dispatch(getRestoreCartSuccess(response));
    })
    .catch((error) => {
      dispatch(getRestoreCartError(error));
      toast.error("Something went wrong");
    });
};

export const emptyCart = (callback) => {
  return _emptyCart()
    .then((response) => {
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const cartUpdateStart = createAction(ActionTypes.UPDATE_CART_START);
export const cartUpdateSuccess = createAction(
  ActionTypes.UPDATE_CART_SUCCESS,
  (response) => response
);
export const cartUpdateError = createAction(
  ActionTypes.UPDATE_CART_ERROR,
  (error) => error
);

export const updateCart = (data, callback) => (dispatch) => {
  dispatch(cartUpdateStart());
  return _updateCart(data)
    .then((response) => {
      if (response) {
        callback(response);
      }

      dispatch(cartUpdateSuccess(response));
    })
    .catch((error) => {
      dispatch(cartUpdateError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

const reducer = handleActions(
  {
    //Open Drawer

    [ActionTypes.OPEN_DRAWER_SUCCESS]: (state, action) => ({
      ...state,
      drawer: action.payload,
    }),

    [ActionTypes.SET_ACTIVE_LINK]: (state, action) => ({
      ...state,
      activeLink: action.payload,
    }),

    //Add Products to Cart

    [ActionTypes.ADD_PRODUCTS_TO_CART_SUCCESS]: (state, action) => ({
      ...state,
      products: action.payload,
    }),

    //SAVE CART
    [ActionTypes.ADD_CART_START]: (state) => ({
      ...state,

      saveCart: { loading: true, response: {}, hasError: false, error: {} },
    }),
    [ActionTypes.ADD_CART_SUCCESS]: (state, action) => ({
      ...state,
      saveCart: {
        ...state.saveCart,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ADD_CART_ERROR]: (state, action) => ({
      ...state,

      saveCart: {
        ...state.saveCart,
        response: {},
        loading: false,
        hasError: false,
        error: action.payload,
      },
    }),

    //GET CART
    [ActionTypes.GET_CART_START]: (state) => ({
      ...state,

      getCart: { loading: true, response: {}, hasError: false, error: {} },
    }),
    [ActionTypes.GET_CART_SUCCESS]: (state, action) => ({
      ...state,
      getCart: {
        ...state.getCart,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CART_ERROR]: (state, action) => ({
      ...state,

      getCart: {
        ...state.getCart,
        response: {},
        loading: false,
        hasError: false,
        error: action.payload,
      },
    }),

    [ActionTypes.GET_RESTORE_CART_START]: (state) => ({
      ...state,

      getRestoreCart: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_RESTORE_CART_SUCCESS]: (state, action) => ({
      ...state,
      getRestoreCart: {
        ...state.getRestoreCart,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_RESTORE_CART_ERROR]: (state, action) => ({
      ...state,

      getRestoreCart: {
        ...state.getRestoreCart,
        response: {},
        loading: false,
        hasError: false,
        error: action.payload,
      },
    }),

    [ActionTypes.UPDATE_CART_START]: (state) => ({
      ...state,
      updateCart: {
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_CART_SUCCESS]: (state, action) => ({
      ...state,
      updateCart: {
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_CART_ERROR]: (state, action) => ({
      ...state,
      updateCart: {
        loading: false,
      },
    }),
  },
  initialState
);

export default reducer;
