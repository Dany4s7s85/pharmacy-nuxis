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
  _getCurrentUserPharmacies,
  _addBusinessPharmacy,
  _getAllPharms,
  _getPharmToken,
  _getBusinessNotification,
  _updateBusinessNotification,
  _getCurrentUserPharmacyPermissions,
  _getAllPermissions,
  _updateBusinessProfileDetails,
  _updateBusinessPassword,
  _updateMemberPassword,
  _CreatePasswordDetails,
  _logout,
  _getBusinessPrescription,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";
import { setActiveConversations } from "../chat";

const initialState = {
  sockets: [],
  authenticated: {},
  isSessionExpired: false,
  userSocket: null,
  storeSocket: null,
  notiCount: 0,
  notifications: { loading: false, response: {}, hasError: false, error: {} },
  updateNotifications: { loading: false },
  allowed_pharmacies: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  user_permissions: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  all_permissions: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  pharmacy_permissions: {
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
  updateBusinessPassword: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateMemberPassword: {
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
  updateBusinessProfile: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  businessPharmacy: {
    loading: false,
  },
  businessNotification: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateBusinessNotification: {
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

export const getAllPharms = (callback) => (dispatch) => {
  return _getAllPharms()
    .then((response) => {
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      if (error && error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const getPharmToken = (id, callback, callbackError) => (dispatch) => {
  return _getPharmToken(id)
    .then((response) => {
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      callbackError(error);
      if (error && error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const logout = (callback) => (dispatch) => {
  return _logout()
    .then((response) => {
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      if (error && error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const updateSessionAction = createAction(
  "update-session",
  (response) => response
);

export const updateSession = (bool) => async (dispatch) => {
  dispatch(updateSessionAction(bool));
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

/* Update NotiCount */
export const updateNotiCountaAction = createAction(
  ActionTypes.UPDATE_NOTI_COUNT_START
);

export const updateNotiCount = () => async (dispatch) => {
  try {
    dispatch(updateNotiCountaAction());
  } catch (error) {}
};

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
  (values, navigate, toast, callback) => async (dispatch) => {
    if (values?.token !== "") {
      try {
        dispatch(pharmacyLoginStart());
        const response = await _pharmacyLoginDetails(values);
        dispatch(pharmacyLoginSuccess(response));
        localStorage.setItem("token", response?.data?.token);
        toast.success(response?.message);
        setTimeout(() => {
          navigate("/bus/dashboard");
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
          if (error?.message == "Your account is under reveiw") {
            navigate("/underReview");
          }
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
      password: values?.password,
      passwordConfirm: values?.confirmPassword,
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
/*Update Business Password */
export const updateBusinessPasswordStart = createAction(
  ActionTypes.UPDATE_BUSINESS_PASSWORD_START
);
export const updateBusinessPasswordSuccess = createAction(
  ActionTypes.UPDATE_BUSINESS_PASSWORD_SUCCESS,
  (response) => response
);
export const updateBusinessPasswordError = createAction(
  ActionTypes.UPDATE_BUSINESS_PASSWORD_ERROR,
  (error) => error
);

export const updateBusinessPasswordDetails =
  (values, resetForm, history) => async (dispatch) => {
    const newPassword = {
      passwordCurrent: values.currentPassword,
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };
    try {
      dispatch(updateBusinessPasswordStart());
      const response = await _updateBusinessPassword(newPassword);
      dispatch(updateBusinessPasswordSuccess(response));
      if (response.status === "success") {
        dispatch(resetStore("USER_LOGOUT", history));
      }
      toast.success(response?.message);
      resetForm();
    } catch (error) {
      dispatch(updateBusinessPasswordError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Update Business Password */
export const updateMemberPasswordStart = createAction(
  ActionTypes.UPDATE_MEMBER_PASSWORD_START
);
export const updateMemberPasswordSuccess = createAction(
  ActionTypes.UPDATE_MEMBER_PASSWORD_SUCCESS,
  (response) => response
);
export const updateMemberPasswordError = createAction(
  ActionTypes.UPDATE_MEMBER_PASSWORD_ERROR,
  (error) => error
);

export const updateMemberPasswordDetails =
  (values, resetForm, history) => async (dispatch) => {
    const newPassword = {
      passwordCurrent: values.currentPassword,
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };
    try {
      dispatch(updateMemberPasswordStart());
      const response = await _updateMemberPassword(newPassword);
      dispatch(updateMemberPasswordSuccess(response));
      if (response.status === "success") {
        dispatch(resetStore("USER_LOGOUT", history));
      }
      toast.success(response?.message);
      resetForm();
    } catch (error) {
      dispatch(updateMemberPasswordError(error));
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
  (values, callback) => async (dispatch) => {
    let data = {};
    data.store_photo = values;
    try {
      dispatch(updateProfileDetailsStart());
      const response = await _getUpdateProfileDetails(data);
      dispatch(updateProfileDetailsSuccess(response));
      toast.success(response?.message);
      if (response?.status === "success") {
        callback(response);
      }
    } catch (error) {
      dispatch(updateProfileDetailsError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*Update Business Profile */
export const updateBusinessProfileDetailsStart = createAction(
  ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_START
);
export const updateBusinessProfileDetailsSuccess = createAction(
  ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_SUCCESS,
  (response) => response
);
export const updateBusinessProfileDetailsError = createAction(
  ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_ERROR,
  (error) => error
);

export const updateBusinessProfileDetails =
  (values, postcode, callback) => async (dispatch) => {
    const data = {
      postcode: postcode,
      business_photo: values,
    };
    try {
      dispatch(updateBusinessProfileDetailsStart());
      const response = await _updateBusinessProfileDetails(data);
      dispatch(updateBusinessProfileDetailsSuccess(response));
      if (response?.status === "success") {
        callback(response);
      }
    } catch (error) {
      dispatch(updateBusinessProfileDetailsError(error));
      if (error?.status?.length > 0) {
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
        // if (error && error?.error) {
        //     toast.error(error?.message);
        // } else {
        //     toast.error('Something went wrong');
        //
        // }
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

/* GET CURRENT USER PHARMACIES  */
export const getUserCurrentPharmacyStart = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACIES_START
);
export const getUserCurrentPharmacySuccess = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACIES_SUCCESS,
  (response) => response
);
export const getUserCurrentPharmacyError = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACIES_ERROR,
  (error) => error
);

export const getCurrentUserPharmacies =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getUserCurrentPharmacyStart());
    return _getCurrentUserPharmacies(search, status, page, limit)
      .then((response) => {
        dispatch(getUserCurrentPharmacySuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getUserCurrentPharmacyError(error));
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

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
    toast
  ) =>
  async (dispatch) => {
    const code = "+";

    const Obj = {
      pharmacy_name: values.pharmacy_name,
      front_picture: values.front_picture,
      back_picture: values.back_picture,
      id_type: values.id_type,
      pharmacy_license_number: values.pharmacy_license_number,
      mobile_no: values.mobile_no,
      pharmacy_landline_num: `${values.pharmacy_landline_num}`,
      lat_long: [coordinates?.lat, coordinates?.lng],
      location: values.location,
      country_code: code.concat(countryData?.dialCode),
      state: province,
      postcode: zipCode,
      country,
      city,
    };

    try {
      dispatch(pharmacyBusinessAddStart());

      const response = await _addBusinessPharmacy(Obj);

      dispatch(pharmacyBusinessAddSuccess(response));
      toast.success(response.message);
    } catch (error) {
      dispatch(pharmacyBusinessAddError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Business Notification*/
export const getBusinessNotificationStart = createAction(
  ActionTypes.GET_BUSINESS_NOTIFICATION_START
);
export const getBusinessNotificationSuccess = createAction(
  ActionTypes.GET_BUSINESS_NOTIFICATION_SUCCESS,
  (response) => response
);
export const getBusinessNotificationError = createAction(
  ActionTypes.GET_BUSINESS_NOTIFICATION_ERROR,
  (error) => error
);

export const getBusinessNotification =
  (page, limit, callback) => async (dispatch) => {
    try {
      dispatch(getBusinessNotificationStart());

      const response = await _getBusinessNotification(page, limit);

      dispatch(getBusinessNotificationSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(getBusinessNotificationError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Update Business Notification*/
export const updateBusinessNotificationStart = createAction(
  ActionTypes.UPDATE_BUSINESS_NOTIFICATION_START
);
export const updateBusinessNotificationSuccess = createAction(
  ActionTypes.UPDATE_BUSINESS_NOTIFICATION_SUCCESS,
  (response) => response
);
export const updateBusinessNotificationError = createAction(
  ActionTypes.UPDATE_BUSINESS_NOTIFICATION_ERROR,
  (error) => error
);

export const updateBusinessNotification = (callback) => async (dispatch) => {
  try {
    dispatch(updateBusinessNotificationStart());

    const response = await _updateBusinessNotification();

    dispatch(updateBusinessNotificationSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(updateBusinessNotificationError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

export const getUserPharmacyPermsStart = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_START
);
export const getUserPharmacyPermsSuccess = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_SUCCESS,
  (response) => response
);
export const getUserPharmacyPermsError = createAction(
  ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_ERROR,
  (error) => error
);

export const getCurrentUserPharmacyPermissions =
  (id, callback) => (dispatch) => {
    dispatch(getUserPharmacyPermsStart());

    return _getCurrentUserPharmacyPermissions(id)
      .then((response) => {
        dispatch(getUserPharmacyPermsSuccess(response));
        callback(response);
      })
      .catch((error) => {
        dispatch(getUserPharmacyPermsError(error));
      });
  };

export const getAllPermsStart = createAction(
  ActionTypes.GET_ALL_PERMISSIONS_START
);
export const getAllPermsSuccess = createAction(
  ActionTypes.GET_ALL_PERMISSIONS_SUCCESS,
  (response) => response
);
export const getAllPermsError = createAction(
  ActionTypes.GET_ALL_PERMISSIONS_ERROR,
  (error) => error
);

export const getAllPermissions = (callback) => (dispatch) => {
  dispatch(getAllPermsStart());

  return _getAllPermissions()
    .then((response) => {
      dispatch(getAllPermsSuccess(response));
      callback(response);
    })
    .catch((error) => {
      dispatch(getAllPermsError(error));
    });
};

/* Pharmacy Login */
export const authLoginStart = createAction(ActionTypes.AUTH_LOGIN_START);
export const authLoginSuccess = createAction(
  ActionTypes.AUTH_LOGIN_SUCCESS,
  (response) => response
);
export const authLoginError = createAction(
  ActionTypes.AUTH_LOGIN_ERROR,
  (error) => error
);

export const authLoginRequest =
  (values, navigate, toast, callback, location, callbackError) =>
  async (dispatch) => {
    values.token = "0077";
    if (values?.token !== "") {
      try {
        dispatch(authLoginStart());
        const response = await _pharmacyLoginDetails(values);
        dispatch(authLoginSuccess(response));

        localStorage.setItem("token", response?.data?.token);
        toast.success("Authenticated Successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        dispatch(authLoginError(error));
        callbackError(error);
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
        if (error?.message === "Your account is under reveiw") {
          navigate("/underReview");
        }
        if (error?.status.length > 0) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

const reducer = handleActions(
  {
    // Update Session#

    [ActionTypes.UPDATE_NOTI_COUNT_START]: (state) => ({
      ...state,
      notiCount: state?.notiCount + 1,
    }),

    ["update-session"]: (state, action) => ({
      ...state,
      isSessionExpired: action.payload,
    }),

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
      authenticated: action.payload.data,
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
    [ActionTypes.UPDATE_BUSINESS_PASSWORD_START]: (state) => ({
      ...state,
      updateBusinessPassword: {
        ...state.updateBusinessPassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PASSWORD_SUCCESS]: (state, action) => ({
      ...state,
      updateBusinessPassword: {
        ...state.updateBusinessPassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PASSWORD_ERROR]: (state, action) => ({
      ...state,
      updateBusinessPassword: {
        ...state.updateBusinessPassword,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PASSWORD_START]: (state) => ({
      ...state,
      updateMemberPassword: {
        ...state.updateMemberPassword,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PASSWORD_SUCCESS]: (state, action) => ({
      ...state,
      updateMemberPassword: {
        ...state.updateMemberPassword,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PASSWORD_ERROR]: (state, action) => ({
      ...state,
      updateMemberPassword: {
        ...state.updateMemberPassword,
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
    [ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_START]: (state) => ({
      ...state,
      updateBusinessProfile: {
        ...state.updateBusinessProfile,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      updateBusinessProfile: {
        ...state.updateBusinessProfile,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_PROFILE_DETAILS_ERROR]: (state, action) => ({
      ...state,
      updateBusinessProfile: {
        ...state.updateBusinessProfile,
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

    [ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_START]: (state) => ({
      ...state,
      pharmacy_permissions: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      pharmacy_permissions: {
        ...state.pharmacy_permissions,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PHARMACY_PERMISSIONS_ERROR]: (
      state,
      action
    ) => ({
      ...state,
      pharmacy_permissions: {
        ...state.pharmacy_permissions,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //GET CURRENT USER PHARMACIES
    [ActionTypes.GET_CURRENT_USER_PHARMACIES_START]: (state) => ({
      ...state,
      allowed_pharmacies: {
        ...state.allowed_pharmacies,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PHARMACIES_SUCCESS]: (state, action) => ({
      ...state,

      allowed_pharmacies: {
        ...state.allowed_pharmacies,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_CURRENT_USER_PHARMACIES_ERROR]: (state) => ({
      ...state,

      allowed_pharmacies: {
        ...state.allowed_pharmacies,
        loading: false,
        hasError: false,
        error: {},
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
    //Get Business Notification
    [ActionTypes.GET_BUSINESS_NOTIFICATION_START]: (state) => ({
      ...state,
      businessNotification: {
        ...state.businessNotification,
        loading: true,
        hasError: false,
        error: {},
        response: null,
      },
    }),
    [ActionTypes.GET_BUSINESS_NOTIFICATION_SUCCESS]: (state, action) => ({
      ...state,

      businessNotification: {
        ...state.businessNotification,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_BUSINESS_NOTIFICATION_ERROR]: (state, action) => ({
      ...state,

      businessNotification: {
        ...state.businessNotification,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //Update Business Notification
    [ActionTypes.UPDATE_BUSINESS_NOTIFICATION_START]: (state) => ({
      ...state,
      updateBusinessNotification: {
        ...state.updateBusinessNotification,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_NOTIFICATION_SUCCESS]: (state, action) => ({
      ...state,

      updateBusinessNotification: {
        ...state.updateBusinessNotification,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.UPDATE_BUSINESS_NOTIFICATION_ERROR]: (state, action) => ({
      ...state,

      updateBusinessNotification: {
        ...state.updateBusinessNotification,
        loading: false,
        hasError: false,
        error: action.payload,
        response: {},
      },
    }),

    [ActionTypes.GET_ALL_PERMISSIONS_START]: (state) => ({
      ...state,
      all_permissions: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_PERMISSIONS_SUCCESS]: (state, action) => ({
      ...state,
      all_permissions: {
        ...state.all_permissions,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_PERMISSIONS_ERROR]: (state, action) => ({
      ...state,
      all_permissions: {
        ...state.all_permissions,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.AUTH_LOGIN_START]: (state) => ({
      ...state,
      authenticated: {},
    }),
    [ActionTypes.AUTH_LOGIN_SUCCESS]: (state, action) => ({
      ...state,
      authenticated: action.payload.data,
    }),
    [ActionTypes.AUTH_LOGIN_ERROR]: (state, action) => ({
      ...state,
      authenticated: {},
    }),
  },

  initialState
);
export default reducer;
