import axios from "axios";
import { store } from "../../../redux/store";
import { resetStore } from "../../../services/auth";
import { pharmacyLoginSuccess } from "../../../services/BAuth";
import { updateSession } from "../../../services/BAuth";
import { history } from "../../../../index";
import { toast } from "react-toastify";

/*global BASE_URL */
/*eslint no-undef: "error"*/

const API = axios.create({
  baseURL: `${process?.env?.REACT_APP_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 600000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

/**
 * api request interceptor
 * @param {Object} req request object
 * @returns
 */

const handleRequest = async (req) => {
  let user = (await store?.getState()?.auth?.user)
    ? store?.getState()?.auth?.user
    : null;
  let store1 = (await store?.getState()?.auth?.user?.store)
    ? store?.getState()?.auth?.user?.store
    : null;

  let token = user ? user?.token : null;

  if (user && user?.role == "super_admin") {
    user.is_verified = true;
  }

  let store_token = store1 ? store1?.token : null;

  if (token != null || token != undefined) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (
    store_token != null &&
    store_token != undefined &&
    user?.status == "approved" &&
    user?.is_verified == true
  ) {
    req.headers.store = `Store-Token ${store_token}`;
  }

  return req;
};

/**
 * api error interceptor
 * @param {Object} error error object
 * @returns
 */
const handleError = (error) => {
  if (error?.response?.status == "424") {
    store.dispatch(updateSession(true));
  }
  if (error?.response?.status == "422") {
    let action = "USER_LOGOUT";
    store.dispatch(resetStore(action));
    toast.error(error?.response?.data?.message, {
      toastId: "success1",
    });
    history.replace("/login");
  }
  if (error?.response?.status == "423") {
    let user = store?.getState()?.auth?.user
      ? store?.getState()?.auth?.user
      : "";
    if (user?.store) {
      delete user.store;
    }
    store.dispatch(pharmacyLoginSuccess({ data: { ...user } }));
    toast.error(error?.response?.data?.message);

    user = store?.getState()?.auth?.user ? store?.getState()?.auth?.user : "";
    if (user?.store) {
      delete user.store;
    }
    store.dispatch(pharmacyLoginSuccess({ data: { ...user } }));
    toast.error(error?.response?.data?.message);

    history.replace("/bus/dashboard");
  }

  let parsed_error = Object.assign({}, error);
  if (
    parsed_error.code == "ECONNABORTED" &&
    !parsed_error.config.__isRetryRequest
  ) {
    parsed_error.config.__isRetryRequest = true;
    return API.request(parsed_error.config);
  }
  return Promise.reject(parsed_error?.response?.data);
};

/**
 * api response interceptor
 * @param {Object} response response object
 * @returns
 */
const handleResponse = (response) => {
  return Promise.resolve(response.data);
};

API.interceptors.request.use(handleRequest);

API.interceptors.response.use(handleResponse, handleError);

export default API;
