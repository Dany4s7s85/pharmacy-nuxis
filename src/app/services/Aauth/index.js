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
  _signIn_QR,
  _resendQR,
  _getAdminNotificationList,
  _updateAdminNotification,
  _getCurrentUserPermissions,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";

const initialState = {
  notifications: { loading: false, response: {}, hasError: false, error: {} },
  updateNotifications: { loading: false },
  user_permissions: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
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
};

export const resetStore = (action, history) => {
  localStorage.removeItem("token");
  history("/login");
  return {
    type: action,
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
    navigate,
    toast
  ) =>
  async (dispatch) => {
    const code = "+";

    const Obj = {
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
      pharmacy_name: values.pharmacy_name,
      lat_long: [coordinates?.lat, coordinates?.lng],
      location: values.location,
      mobile_no: values.phone_number,
      country_code: code.concat(countryData.dialCode),
      pharmacy_landline_num: `${values.landline_number}`,
      postcode: zipCode,
      country,
      state: province,
      city,
    };

    try {
      dispatch(pharmacySignupDetailsStart());

      const response = await _pharmacySignUpDetails(Obj);

      dispatch(pharmacySignupDetailsSuccess(response));
      toast.success(response.message);
      setTimeout(() => {
        navigate("/verifyOtp", {
          state: {
            email: values?.email,
            id: response?.data?.id,
          },
        });
      }, 1000);
    } catch (error) {
      dispatch(pharmacySignupDetailsError(error));
      if (error.length > 0) {
        toast.error("Please enter correct city");
      } else if (error?.status.length > 0) {
        toast.error(error?.message);
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
  (values, pharmacyId, toast, navigate) => async (dispatch) => {
    const obj = {
      pharmacyId,
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
            pharmacyId: pharmacyId,
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
  (pharmacyId, email) => async (dispatch) => {
    const obj = {
      pharmacyId,
      email,
      toast,
    };
    try {
      dispatch(verifyOtpStart());
      const response = await _resendPharmacyVerifyOtp(obj);
      dispatch(verifyOtpSuccess(response));
      toast.success(response?.message);
    } catch (error) {
      dispatch(verifyOtpError(error));
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
  (values, navigate, toast, callback) => async (dispatch) => {
    if (values?.token !== "") {
      try {
        dispatch(pharmacyLoginStart());
        const response = await _pharmacyLoginDetails(values);
        dispatch(pharmacyLoginSuccess(response));
        localStorage.setItem("token", response?.data?.token);
        toast.success(response?.message);
        setTimeout(() => {
          navigate("/dash/pharmacy-profile");
        }, 1000);
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
          callback({ is_qr: true, response });
        }
      } catch (error) {
        dispatch(pharmacyLoginError(error));
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
  (values, pharmacyId, toast, navigate, is_reuploaded) => async (dispatch) => {
    let formData = new FormData();
    formData.append("id_type", values.id_type);
    formData.append("front_picture", values.front_picture);
    formData.append("back_picture", values.back_picture);
    formData.append("pharmacy_id", pharmacyId);
    try {
      dispatch(uploadVerificationDocsStart());
      const response = await _uploadVerificationDocsDetails(
        formData,
        is_reuploaded
      );
      dispatch(uploadVerificationDocsSuccess(response));
      toast.success(response?.message);
      setTimeout(() => {
        navigate("/login");
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

export const getForgotPasswordDetails =
  (values, history, toast) => async (dispatch) => {
    try {
      dispatch(forgotPasswordDetailsStart());
      const response = await _getForgotPasswordDetails(values);
      dispatch(forgotPasswordDetailsSuccess(response));
      history("/verify", {
        state: {
          email: values.email,
          component: "forgotPassword",
        },
      });
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
  (values, id, toast, history) => async (dispatch) => {
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

export const getUpdatePasswordDetails = (values) => async (dispatch) => {
  const newPassword = {
    passwordCurrent: values.password,
    newPassword: values.confirmPassword,
  };
  try {
    dispatch(updatePasswordDetailsStart());
    const response = await _getUpdatePasswordDetails(newPassword);
    dispatch(updatePasswordDetailsSuccess(response));
  } catch (error) {
    dispatch(updatePasswordDetailsError(error));
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
  (values, postcode, toast) => async (dispatch) => {
    const formData = new FormData();
    formData.append("postcode", postcode);
    formData.append("pharmacy_photo", values.file);

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
export const updateNotificationAdminStart = createAction(
  ActionTypes.UPDATE_ADMIN_NOTIFICATIONS
);
export const updateNotificationAdminSuccess = createAction(
  ActionTypes.UPDATE_ADMIN_NOTIFICATIONS_SUCCESS,
  (response) => response
);
export const updateNotificationAdminError = createAction(
  ActionTypes.UPDATE_ADMIN_NOTIFICATIONS_ERROR,
  (error) => error
);

export const updateAdminNotification = (callback) => (dispatch) => {
  dispatch(updateNotificationAdminStart());
  return _updateAdminNotification()
    .then((response) => {
      dispatch(updateNotificationAdminSuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(updateNotificationAdminError(error));
      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const getNotificationAdminStart = createAction(
  ActionTypes.GET_ADMIN_NOTIFICATIONS
);
export const getNotificationAdminSuccess = createAction(
  ActionTypes.GET_ADMIN_NOTIFICATIONS_SUCCESS,
  (response) => response
);
export const getNotificationAdminError = createAction(
  ActionTypes.GET_ADMIN_NOTIFICATIONS_ERROR,
  (error) => error
);

export const getAdminNotificationList =
  (page, limit, callback) => (dispatch) => {
    dispatch(getNotificationAdminStart());
    return _getAdminNotificationList(page, limit)
      .then((response) => {
        dispatch(getNotificationAdminSuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getNotificationAdminError(error));
        if (error && error?.error) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };
export const getUserPermsStart = createAction(
  ActionTypes.GET_CURRENT_USER_PERMISSIONS_START
);
export const getUserPermsSuccess = createAction(
  ActionTypes.GET_CURRENT_USER_PERMISSIONS_SUCCESS,
  (response) => response
);
export const getUserPermsError = createAction(
  ActionTypes.GET_CURRENT_USER_PERMISSIONS_ERROR,
  (error) => error
);

export const getCurrentUserPermissions = (callback) => (dispatch) => {
  dispatch(getUserPermsStart());

  return _getCurrentUserPermissions()
    .then((response) => {
      dispatch(getUserPermsSuccess(response));
      callback(response);
    })
    .catch((error) => {
      dispatch(getUserPermsError(error));

      // if (error?.status?.length > 0) {
      //   toast.error(error?.error);
      // } else {
      //   toast.error("Something went wrong");
      // }
    });
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

    //update notifications
    [ActionTypes.UPDATE_ADMIN_NOTIFICATIONS]: (state) => ({
      ...state,
      updateNotifications: {
        ...state.updateNotifications,
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_ADMIN_NOTIFICATIONS_SUCCESS]: (state) => ({
      ...state,
      updateNotifications: {
        ...state.updateNotifications,
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_ADMIN_NOTIFICATIONS_ERROR]: (state, action) => ({
      ...state,
      updateNotifications: {
        ...state.updateNotifications,
        loading: false,
      },
    }),

    //NOTIFICATONS
    [ActionTypes.GET_ADMIN_NOTIFICATIONS]: (state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ADMIN_NOTIFICATIONS_SUCCESS]: (state, action) => ({
      ...state,

      notifications: {
        ...state.notifications,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_ADMIN_NOTIFICATIONS_ERROR]: (state) => ({
      ...state,

      notifications: {
        ...state.notifications,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    [ActionTypes.GET_CURRENT_USER_PERMISSIONS_START]: (state) => ({
      ...state,
      user_permissions: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PERMISSIONS_SUCCESS]: (state, action) => ({
      ...state,
      user_permissions: {
        ...state.user_permissions,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PERMISSIONS_ERROR]: (state, action) => ({
      ...state,
      user_permissions: {
        ...state.user_permissions,
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
