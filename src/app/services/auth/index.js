import { createAction, handleActions } from "redux-actions";
import {
  _userSignUpDetails,
  _pharmacySignUpDetails,
  _pharmacyVerifyOtp,
  _resendPharmacyVerifyOtp,
  _pharmacyLoginDetails,
  _uploadVerificationDocsDetails,
  _getForgotPasswordDetails,
  _getResetPasswordDetails,
  _getUpdatePasswordDetails,
  _getUpdateProfileDetails,
  _CreatePasswordDetails,
  _signIn_QR,
  _resendQR,
  _addBusinessPharmacy,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";
import UnderReview from "../../pages/Signin/underReview";

const initialState = {
  userSignupDetails: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  resendQRLoading: { loading: false },
  pharmacyLogin: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  uploadVerificationDocs: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  pharmacySignupDetails: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  pharmacyVerifyOtp: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  resendVerifyOtp: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  forgotPassword: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  resetPassword: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updatePassword: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  updateProfile: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  createPassword: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessPharmacy: {
    loading: false,
  },

  authenticated: {},
};

export const resetStore = (
  action,
  history,
  userSocket,
  storeSocket,
  setUserSocketData,
  setStoreSocketData
) => {
  localStorage.removeItem("token");
  if (history) {
    history("/authenticate");
  }

  return {
    type: action,
    payload: {
      userSocket,
      storeSocket,
      setUserSocketData,
      setStoreSocketData,
    },
  };
};

/* User Signup */
export const userSignupDetailsStart = createAction(
  ActionTypes.USER_SIGNUP_DETAILS_START
);
export const userSignupDetailsSuccess = createAction(
  ActionTypes.USER_SIGNUP_DETAILS_SUCCESS,
  (response) => response
);
export const userSignupDetailsError = createAction(
  ActionTypes.USER_SIGNUP_DETAILS_ERROR,
  (error) => error
);

export const userSignupDetails =
  (values, setCompanyName, setDepartment, toggle, toast, history) =>
  async (dispatch) => {
    const Obj = {
      email: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      country: values.country,
      province: values.province,
      address: values.address,
      company_id: values.company_name,
      department_id: values.department,
    };
    if (toggle) {
      Obj.department_id = { name: values.department };
    }

    try {
      dispatch(userSignupDetailsStart());

      const response = await _userSignUpDetails(Obj);

      dispatch(userSignupDetailsSuccess(response));
      setDepartment("");
      setCompanyName("");
      toast.success(response.message);
      history("/verify", {
        state: {
          email: values?.email,
          component: "signup",
        },
      });
    } catch (error) {
      dispatch(userSignupDetailsError(error));

      if (error?.status.length > 0) {
        toast.error(error?.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* PHARMACY Signup */

export const pharmacySignupDetailsStart = createAction(
  ActionTypes.PHARMACY_SIGNUP_DETAILS_START
);
export const pharmacySignupDetailsSuccess = createAction(
  ActionTypes.PHARMACY_SIGNUP_DETAILS_SUCCESS,
  (response) => response
);
export const pharmacySignupDetailsError = createAction(
  ActionTypes.PHARMACY_SIGNUP_DETAILS_ERROR,
  (error) => error
);
export const pharmacySignupDetails =
  (
    values,
    coordinates,
    country,
    province,
    city,
    zipCode,
    countryData,
    storeCoordinates,
    store_country,
    store_province,
    store_city,
    store_postcode,
    storeCountryCode,
    navigate,
    toast
  ) =>
  async (dispatch) => {
    const code = "+";

    const Obj = {
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
      business_name: values.business_name,
      business_owner_name: values.business_owner_name,
      lat_long: [coordinates?.lat, coordinates?.lng],
      location: values.location,
      mobile_no: values.mobile_no,
      is_pharmacist: values.is_pharmacist,
      country_code: code.concat(countryData?.dialCode),
      business_landline_num: `${values.business_landline_num}`,
      fax_no: `${values.fax_no}`,
      postcode: zipCode,
      country,
      state: province,
      city,
      timeZone: "America/Toronto",
      store: {
        GST_NO: values.GST_NO,
        PST_NO: values.PST_NO,
        store_name: values.store_name,
        store_owner: values.store_owner,
        store_license_number: values.store_license_number,
        store_mobile_no: values.store_mobile_no,
        store_landline_num: `${values.store_landline_num}`,
        store_fax_no: `${values.store_fax_no}`,
        store_location: values.store_location,
        store_lat_long: [storeCoordinates?.lat, storeCoordinates?.lng],
        store_country_code: code.concat(storeCountryCode?.dialCode),
        store_state: store_province,
        type: values.type,
        store_country,
        store_city,
        store_postcode,
        store_timeZone: "America/Toronto",
      },
    };
    if (values?.signature) {
      Obj.signature = values.signature;
    }
    if (values?.license_number) {
      Obj.license_no = values.license_number;
    }

    if (!city) {
      toast.error("Please select correct city from address suggestions");
      return;
    }

    if (!store_city) {
      toast.error(
        "Invalid store address , Address must be selected from suggestions or use default store location"
      );
      return;
    }

    if (!Obj?.location || !Obj?.store?.store_location) {
      toast.error(
        "Invalid Address of store or business ,Address must be selected from suggestions"
      );
      return;
    }

    try {
      dispatch(pharmacySignupDetailsStart());

      const response = await _pharmacySignUpDetails(Obj);

      dispatch(pharmacySignupDetailsSuccess(response));
      toast.success(response.message);
      setTimeout(() => {
        navigate("/verifyOtp", {
          state: {
            email: values?.email,
            id: response?.data?.business,
          },
        });
      }, 1000);
    } catch (error) {
      dispatch(pharmacySignupDetailsError(error));

      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else if (
        Obj.city == "" ||
        Obj.country == "" ||
        (Obj.lat_long[0] == null && Obj.lat_long[1] == null) ||
        store_country == "" ||
        store_province == ""
      ) {
        toast.error("Please select correct city from address suggestions");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*OTP Verification */
export const verifyOtpStart = createAction(ActionTypes.VERIFY_OTP_START);
export const verifyOtpSuccess = createAction(
  ActionTypes.VERIFY_OTP_SUCCESS,
  (response) => response
);
export const verifyOtpError = createAction(
  ActionTypes.VERIFY_OTP_ERROR,
  (error) => error
);

export const pharmacyVerificationOtp =
  (values, businessId, navigate) => async (dispatch) => {
    const obj = {
      businessId,
      otp: values.otp,
    };
    try {
      dispatch(verifyOtpStart());
      const response = await _pharmacyVerifyOtp(obj);

      dispatch(verifyOtpSuccess(response));
      toast.success(response?.message);
      setTimeout(() => {
        navigate("/verifyDocument", {
          state: {
            pharmacyId: response?.data?.store,
          },
        });
      }, 1000);
    } catch (error) {
      dispatch(verifyOtpError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Resend OTP Verification */
export const resendVerifyOtpStart = createAction(
  ActionTypes.RESEND_VERIFY_OTP_START
);
export const resendVerifyOtpSuccess = createAction(
  ActionTypes.RESEND_VERIFY_OTP_SUCCESS,
  (response) => response
);
export const resendVerifyOtpError = createAction(
  ActionTypes.RESEND_VERIFY_OTP_ERROR,
  (error) => error
);

export const pharmacyResendVerificationOtp =
  (businessId, email, callback) => async (dispatch) => {
    const obj = {
      businessId,
      email,
    };
    try {
      dispatch(resendVerifyOtpStart());
      const response = await _resendPharmacyVerifyOtp(obj);
      dispatch(resendVerifyOtpSuccess(response));
      toast.success(response?.message);
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(resendVerifyOtpError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Pharmacy Login */
export const pharmacyLoginStart = createAction(
  ActionTypes.PHARMACY_LOGIN_START
);
export const pharmacyLoginSuccess = createAction(
  ActionTypes.PHARMACY_LOGIN_SUCCESS,
  (response) => response
);
export const pharmacyLoginError = createAction(
  ActionTypes.PHARMACY_LOGIN_ERROR,
  (error) => error
);

export const pharmacyLoginRequest =
  (values, navigate, toast, callback, location) => async (dispatch) => {
    if (values?.token !== "") {
      try {
        dispatch(pharmacyLoginStart());
        const response = await _pharmacyLoginDetails(values);
        dispatch(pharmacyLoginSuccess(response));

        localStorage.setItem("token", response?.data?.token);
        toast.success(response?.message);
        setTimeout(() => {
          if (location && location?.state)
            if (location?.state?.includes("products")) {
              navigate("/bus/pharmacies", { state: `${location?.state}` });
            } else {
              navigate(`/${location?.state}`);
            }
          else {
            navigate("/bus/dashboard");
          }
        }, 1400);
      } catch (error) {
        dispatch(pharmacyLoginError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      try {
        dispatch(pharmacyLoginStart());
        const response = await _signIn_QR(values);
        dispatch(pharmacyLoginSuccess(response));

        if (response) {
          if (response?.message == "Upload verification docs") {
            setTimeout(() => {
              navigate("/verifyDocument", {
                state: {
                  pharmacyId: response?.data?.store,
                },
              });
            }, 400);
          } else {
            callback({ is_qr: true, response });
          }
        }
      } catch (error) {
        dispatch(pharmacyLoginError(error));
        // if (error?.message === "Your account is under reveiw") {
        //   navigate("/underReview");
        // }
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

/*UPLOAD Verification  DOCS*/
export const uploadVerificationDocsStart = createAction(
  ActionTypes.UPLOAD_VERIFICATION_DOCS_START
);
export const uploadVerificationDocsSuccess = createAction(
  ActionTypes.UPLOAD_VERIFICATION_DOCS_SUCCESS,
  (response) => response
);
export const uploadVerificationDocsError = createAction(
  ActionTypes.UPLOAD_VERIFICATION_DOCS_ERROR,
  (error) => error
);

export const uploadVerificationDocsDetails =
  (values, storeId, toast, navigate, is_reuploaded) => async (dispatch) => {
    values.store_id = storeId;
    try {
      dispatch(uploadVerificationDocsStart());
      const response = await _uploadVerificationDocsDetails(
        values,
        is_reuploaded
      );
      dispatch(uploadVerificationDocsSuccess(response));
      toast.success(response?.message);

      setTimeout(() => {
        navigate("/underReview");
      }, 1000);
    } catch (error) {
      dispatch(uploadVerificationDocsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*  FORGOT PASSWORD  */
export const forgotPasswordDetailsStart = createAction(
  ActionTypes.FORGOT_PASSWORD_DETAILS_START
);
export const forgotPasswordDetailsSuccess = createAction(
  ActionTypes.FORGOT_PASSWORD_DETAILS_SUCCESS,
  (response) => response
);
export const forgotPasswordDetailsError = createAction(
  ActionTypes.FORGOT_PASSWORD_DETAILS_ERROR,
  (error) => error
);

export const getForgotPasswordDetails = (values) => async (dispatch) => {
  try {
    dispatch(forgotPasswordDetailsStart());
    const response = await _getForgotPasswordDetails(values);
    dispatch(forgotPasswordDetailsSuccess(response));
    toast.success(response?.message);
  } catch (error) {
    dispatch(forgotPasswordDetailsError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/*Reset Password */
export const resetPasswordDetailsStart = createAction(
  ActionTypes.RESET_PASSWORD_DETAILS_START
);
export const resetPasswordDetailsSuccess = createAction(
  ActionTypes.RESET_PASSWORD_DETAILS_SUCCESS,
  (response) => response
);
export const resetPasswordDetailsError = createAction(
  ActionTypes.RESET_PASSWORD_DETAILS_ERROR,
  (error) => error
);

export const getResetPasswordDetails =
  (values, id, history) => async (dispatch) => {
    const obj = {
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };

    try {
      dispatch(resetPasswordDetailsStart());
      const response = await _getResetPasswordDetails(obj, id);
      dispatch(resetPasswordDetailsSuccess(response));
      toast.success(response?.message);

      setTimeout(() => {
        history("/login");
      }, 1000);
    } catch (error) {
      dispatch(resetPasswordDetailsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*Update Password */
export const updatePasswordDetailsStart = createAction(
  ActionTypes.UPDATE_PASSWORD_DETAILS_START
);
export const updatePasswordDetailsSuccess = createAction(
  ActionTypes.UPDATE_PASSWORD_DETAILS_SUCCESS,
  (response) => response
);
export const updatePasswordDetailsError = createAction(
  ActionTypes.UPDATE_PASSWORD_DETAILS_ERROR,
  (error) => error
);

export const getUpdatePasswordDetails =
  (values, resetForm, history) => async (dispatch) => {
    const newPassword = {
      passwordCurrent: values.currentPassword,
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };
    try {
      dispatch(updatePasswordDetailsStart());
      const response = await _getUpdatePasswordDetails(newPassword);
      dispatch(updatePasswordDetailsSuccess(response));
      if (response.status === "success") {
        dispatch(resetStore("USER_LOGOUT", history));
      }
      toast.success(response?.message);
      resetForm();
    } catch (error) {
      dispatch(updatePasswordDetailsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*Create Password */
export const createPasswordDetailsStart = createAction(
  ActionTypes.CREATE_PASSWORD_DETAILS_START
);
export const createPasswordDetailsSuccess = createAction(
  ActionTypes.CREATE_PASSWORD_DETAILS_SUCCESS,
  (response) => response
);
export const createPasswordDetailsError = createAction(
  ActionTypes.CREATE_PASSWORD_DETAILS_ERROR,
  (error) => error
);

export const getCreatePasswordDetails =
  (values, id, history) => async (dispatch) => {
    const obj = {
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };

    try {
      dispatch(createPasswordDetailsStart());
      const response = await _CreatePasswordDetails(obj, id);
      dispatch(createPasswordDetailsSuccess(response));
      toast.success(response?.message);

      setTimeout(() => {
        history("/login");
      }, 1000);
    } catch (error) {
      dispatch(createPasswordDetailsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Update Profile */
export const updateProfileDetailsStart = createAction(
  ActionTypes.UPDATE_PROFILE_DETAILS_START
);
export const updateProfileDetailsSuccess = createAction(
  ActionTypes.UPDATE_PROFILE_DETAILS_SUCCESS,
  (response) => response
);
export const updateProfileDetailsError = createAction(
  ActionTypes.UPDATE_PROFILE_DETAILS_ERROR,
  (error) => error
);

export const getUpdateProfileDetails =
  (values, postcode) => async (dispatch) => {
    const updatePasswordObj = {
      password: values.values.password,
      passwordConfirm: values.confirmPassword,
      passwordCurrent: values.currentPassword,
    };

    const formData = new FormData();
    formData.append("postcode", postcode);
    formData.append("pharmacy_photo", values.file);
    formData.append("pharmacy_name", values.pharmacy_name);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("email", values.email);
    formData.append("location", values.location);

    try {
      dispatch(updateProfileDetailsStart());
      const response = await _getUpdateProfileDetails(formData);
      dispatch(updateProfileDetailsSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(updateProfileDetailsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// forgot Password
export const qrResendStart = createAction(ActionTypes.RESEND_QR_DETAILS_START);
export const qrResendSuccess = createAction(
  ActionTypes.RESEND_QR_DETAILS_SUCCESS,
  (response) => response
);
export const qrResendError = createAction(
  ActionTypes.RESEND_QR_DETAILS_ERROR,
  (error) => error
);

export const resendQR = (formData, callback) => (dispatch) => {
  dispatch(qrResendStart());
  return _resendQR(formData)
    .then((response) => {
      dispatch(qrResendSuccess(response));
      if (response) {
        callback(response);
        toast.success(`${response?.message}`);
      }
    })
    .catch((error) => {
      dispatch(qrResendError(error));
      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

/* PHARMACY ADD */

export const pharmacyBusinessAddStart = createAction(
  ActionTypes.ADD_BUSINESS_PHARMACY_START
);
export const pharmacyBusinessAddSuccess = createAction(
  ActionTypes.ADD_BUSINESS_PHARMACY_SUCCESS,
  (response) => response
);
export const pharmacyBusinessAddError = createAction(
  ActionTypes.ADD_BUSINESS_PHARMACY_ERROR,
  (error) => error
);
export const addBusinessPharmacy =
  (
    values,
    coordinates,
    country,
    province,
    city,
    zipCode,
    countryData,
    navigate,
    toast,
    callback
  ) =>
  async (dispatch) => {
    const code = "+";

    const Obj = {
      GST_NO: values.GST_NO,
      PST_NO: values.PST_NO,
      email: values.email,
      store_name: values.store_name,
      store_fax_no: `${values.store_fax_no}`,
      front_picture: values.front_picture,
      back_picture: values.back_picture,
      id_type: values.id_type,
      type: values.type,
      store_license_number: values.store_license_number,
      mobile_no: values.mobile_no,
      store_landline_num: `${values.store_landline_num}`,
      lat_long: [coordinates?.lat, coordinates?.lng],
      location: values.location,
      country_code: code.concat(countryData?.dialCode),
      state: province,
      postcode: zipCode,
      country,
      city,
      timeZone: "America/Toronto",
    };

    try {
      dispatch(pharmacyBusinessAddStart());

      const response = await _addBusinessPharmacy(Obj);

      dispatch(pharmacyBusinessAddSuccess(response));
      toast.success(response.message);
      callback(response);
    } catch (error) {
      dispatch(pharmacyBusinessAddError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

const reducer = handleActions(
  {
    [ActionTypes.USER_SIGNUP_DETAILS_START]: (state) => ({
      ...state,
      userSignupDetails: {
        ...state.userSignupDetails,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.USER_SIGNUP_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      userSignupDetails: {
        ...state.userSignupDetails,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.USER_SIGNUP_DETAILS_ERROR]: (state, action) => ({
      ...state,
      userSignupDetails: {
        ...state.userSignupDetails,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.PHARMACY_SIGNUP_DETAILS_START]: (state) => ({
      ...state,
      pharmacySignupDetails: {
        ...state.pharmacySignupDetails,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_SIGNUP_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      pharmacySignupDetails: {
        ...state.userpharmacyDetails,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_SIGNUP_DETAILS_ERROR]: (state, action) => ({
      ...state,
      pharmacySignupDetails: {
        ...state.pharmacySignupDetails,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.VERIFY_OTP_START]: (state) => ({
      ...state,
      pharmacyVerifyOtp: {
        ...state.pharmacyVerifyOtp,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.VERIFY_OTP_SUCCESS]: (state, action) => ({
      ...state,
      pharmacyVerifyOtp: {
        ...state.pharmacyVerifyOtp,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.VERIFY_OTP_ERROR]: (state, action) => ({
      ...state,
      pharmacyVerifyOtp: {
        ...state.pharmacyVerifyOtp,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.RESEND_VERIFY_OTP_START]: (state) => ({
      ...state,
      resendVerifyOtp: {
        ...state.resendVerifyOtp,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RESEND_VERIFY_OTP_SUCCESS]: (state, action) => ({
      ...state,
      resendVerifyOtp: {
        ...state.resendVerifyOtp,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RESEND_VERIFY_OTP_ERROR]: (state, action) => ({
      ...state,
      resendVerifyOtp: {
        ...state.resendVerifyOtp,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.PHARMACY_LOGIN_START]: (state) => ({
      ...state,
      pharmacyLogin: {
        ...state.pharmacyLogin,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_LOGIN_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.data,
      pharmacyLogin: {
        ...state.pharmacyLogin,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PHARMACY_LOGIN_ERROR]: (state, action) => ({
      ...state,
      pharmacyLogin: {
        ...state.pharmacyLogin,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPLOAD_VERIFICATION_DOCS_START]: (state) => ({
      ...state,
      uploadVerificationDocs: {
        ...state.uploadVerificationDocs,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_VERIFICATION_DOCS_SUCCESS]: (state, action) => ({
      ...state,
      uploadVerificationDocs: {
        ...state.uploadVerificationDocs,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_VERIFICATION_DOCS_ERROR]: (state, action) => ({
      ...state,
      uploadVerificationDocs: {
        ...state.uploadVerificationDocs,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.FORGOT_PASSWORD_DETAILS_START]: (state) => ({
      ...state,
      forgotPassword: {
        ...state.forgotPassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.FORGOT_PASSWORD_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      forgotPassword: {
        ...state.forgotPassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.FORGOT_PASSWORD_DETAILS_ERROR]: (state, action) => ({
      ...state,
      forgotPassword: {
        ...state.forgotPassword,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.RESET_PASSWORD_DETAILS_START]: (state) => ({
      ...state,
      resetPassword: {
        ...state.resetPassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RESET_PASSWORD_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      resetPassword: {
        ...state.resetPassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RESET_PASSWORD_DETAILS_ERROR]: (state, action) => ({
      ...state,
      resetPassword: {
        ...state.resetPassword,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPDATE_PASSWORD_DETAILS_START]: (state) => ({
      ...state,
      updatePassword: {
        ...state.updatePassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_PASSWORD_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      updatePassword: {
        ...state.updatePassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_PASSWORD_DETAILS_ERROR]: (state, action) => ({
      ...state,
      updatePassword: {
        ...state.updatePassword,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.CREATE_PASSWORD_DETAILS_START]: (state) => ({
      ...state,
      createPassword: {
        ...state.createPassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PASSWORD_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      createPassword: {
        ...state.createPassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PASSWORD_DETAILS_ERROR]: (state, action) => ({
      ...state,
      createPassword: {
        ...state.createPassword,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //RESEND QR
    [ActionTypes.RESEND_QR_DETAILS_START]: (state) => ({
      ...state,
      resendQRLoading: {
        ...state.resendQRLoading,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.RESEND_QR_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      resendQRLoading: {
        ...state.resendQRLoading,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.RESEND_QR_DETAILS_ERROR]: (state, action) => ({
      ...state,
      resendQRLoading: {
        ...state.resendQRLoading,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    [ActionTypes.UPDATE_PROFILE_DETAILS_START]: (state) => ({
      ...state,
      updateProfile: {
        ...state.updateProfile,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_PROFILE_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.data,
      updateProfile: {
        ...state.updateProfile,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_PROFILE_DETAILS_ERROR]: (state, action) => ({
      ...state,
      updateProfile: {
        ...state.updateProfile,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.ADD_BUSINESS_PHARMACY_START]: (state) => ({
      ...state,
      businessPharmacy: {
        loading: true,
      },
    }),
    [ActionTypes.ADD_BUSINESS_PHARMACY_SUCCESS]: (state, action) => ({
      ...state,
      businessPharmacy: {
        loading: false,
      },
    }),
    [ActionTypes.ADD_BUSINESS_PHARMACY_ERROR]: (state, action) => ({
      ...state,
      businessPharmacy: {
        loading: false,
      },
    }),
  },

  initialState
);
export default reducer;
