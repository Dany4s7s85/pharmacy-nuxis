import { createAction, handleActions } from "redux-actions";
import {
  _getPharmacyMembers,
  _addMember,
  _getMemberNotification,
  _updateMemberNotification,
  _getMemberDetail,
  _updateMember,
  _updateMemberProfile,
  _uploadKycDocument,
  _getKycDocument,
  _updateMemberStatus,
  _sentLinkAgainTOAddMember,
} from "../../shared/httpService/api";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";

const initialState = {
  members: { loading: false, response: {}, hasError: false, error: {} },
  addMember: { loading: false },
  sentLinkToaddMember: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateMember: { loading: false },
  memberDetail: { loading: false, response: {}, hasError: false, error: {} },
  memberNotification: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateMemberNotification: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateMemberProfile: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  uploadKycDocument: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  getKycDocument: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateMemberStatus: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
};

// CREATE NEW MEMBER

export const addMemberStart = createAction(ActionTypes.CREATE_PHARMACY_MEMBERS);
export const addMemberSuccess = createAction(
  ActionTypes.CREATE_PHARMACY_MEMBERS_SUCCESS,
  (response) => response
);
export const addMemberError = createAction(
  ActionTypes.CREATE_PHARMACY_MEMBERS_ERROR,
  (error) => error
);

export const addMember = (data, callback) => (dispatch) => {
  dispatch(addMemberStart());
  return _addMember(data)
    .then((response) => {
      dispatch(addMemberSuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(addMemberError(error));
      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        if (
          error.message &&
          error?.message?.includes("Duplicate field value")
        ) {
          toast.error("Member already exists");
        } else if (error?.message) {
          toast.error(error?.message);
        }
      }
    });
};

export const getMembersPharmacyStart = createAction(
  ActionTypes.GET_PHARMACY_MEMBERS
);
export const getMembersPharmacySuccess = createAction(
  ActionTypes.GET_PHARMACY_MEMBERS_SUCCESS,
  (response) => response
);
export const getMembersPharmacyError = createAction(
  ActionTypes.GET_PHARMACY_MEMBERS_ERROR,
  (error) => error
);

export const getPharmacyMembers =
  (search, status, page, limit, callback) => (dispatch) => {
    dispatch(getMembersPharmacyStart());
    return _getPharmacyMembers(search, status, page, limit)
      .then((response) => {
        dispatch(getMembersPharmacySuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getMembersPharmacyError(error));
        if (error && error?.error) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };
/*Member Notification*/
export const getMemberNotificationStart = createAction(
  ActionTypes.GET_MEMBER_NOTIFICATION_START
);
export const getMemberNotificationSuccess = createAction(
  ActionTypes.GET_MEMBER_NOTIFICATION_SUCCESS,
  (response) => response
);
export const getMemberNotificationError = createAction(
  ActionTypes.GET_MEMBER_NOTIFICATION_ERROR,
  (error) => error
);

export const getMemberNotification =
  (page, limit, callback) => async (dispatch) => {
    try {
      dispatch(getMemberNotificationStart());

      const response = await _getMemberNotification(page, limit);

      dispatch(getMemberNotificationSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(getMemberNotificationError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Update Business Notification*/
export const updateMemberNotificationStart = createAction(
  ActionTypes.UPDATE_MEMBER_NOTIFICATION_START
);
export const updateMemberNotificationSuccess = createAction(
  ActionTypes.UPDATE_MEMBER_NOTIFICATION_SUCCESS,
  (response) => response
);
export const updateMemberNotificationError = createAction(
  ActionTypes.UPDATE_MEMBER_NOTIFICATION_ERROR,
  (error) => error
);

export const updateMemberNotification = (callback) => async (dispatch) => {
  try {
    dispatch(updateMemberNotificationStart());

    const response = await _updateMemberNotification();

    dispatch(updateMemberNotificationSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(updateMemberNotificationError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/*Update Business Notification*/
export const updateMemberStart = createAction(
  ActionTypes.UPDATE_PHARMACY_MEMBER
);
export const updateMemberSuccess = createAction(
  ActionTypes.UPDATE_PHARMACY_MEMBER_SUCCESS,
  (response) => response
);
export const updateMemberError = createAction(
  ActionTypes.UPDATE_PHARMACY_MEMBER_ERROR,
  (error) => error
);

export const updateMember = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(updateMemberStart());

    const response = await _updateMember(id, data);

    dispatch(updateMemberSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(updateMemberError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/*Update Member Profile */
export const updateMemberProfileDetailsStart = createAction(
  ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_START
);
export const updateMemberProfileDetailsSuccess = createAction(
  ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_SUCCESS,
  (response) => response
);
export const updateMemberProfileDetailsError = createAction(
  ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_ERROR,
  (error) => error
);

export const updateMemberProfileDetails =
  (values, callback) => async (dispatch) => {
    const data = {
      profile_photo: values,
    };

    try {
      dispatch(updateMemberProfileDetailsStart());
      const response = await _updateMemberProfile(data);
      dispatch(updateMemberProfileDetailsSuccess(response));
      if (response.status === "success") {
        callback(response);
      }
      toast.success(response?.message);
    } catch (error) {
      dispatch(updateMemberProfileDetailsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Upload Kyc Document */
export const uploadKycDocumentStart = createAction(
  ActionTypes.UPLOAD_KYC_DOCUMENT_START
);
export const uploadKycDocumentSuccess = createAction(
  ActionTypes.UPLOAD_KYC_DOCUMENT_SUCCESS,
  (response) => response
);
export const uploadKycDocumentError = createAction(
  ActionTypes.UPLOAD_KYC_DOCUMENT_ERROR,
  (error) => error
);

export const uploadKycDocumentDetails =
  (values, memberId, callback) => async (dispatch) => {
    const data = {
      id_type: values.id_type,
      front_picture: values.front_picture,
      back_picture: values.back_picture,
      member_id: memberId,
    };

    if (values?.signature) {
      data.signature = values.signature;
    }
    if (values?.license_no) {
      data.license_no = values.license_no;
    }
    try {
      dispatch(uploadKycDocumentStart());
      const response = await _uploadKycDocument(data);
      dispatch(uploadKycDocumentSuccess(response));
      if (response.status === "success") {
        callback(response);
      }
      toast.success(response?.message);
    } catch (error) {
      dispatch(uploadKycDocumentError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*Get Kyc Document */
export const getKycDocumentStart = createAction(
  ActionTypes.GET_KYC_DOCUMENT_START
);
export const getKycDocumentSuccess = createAction(
  ActionTypes.GET_KYC_DOCUMENT_SUCCESS,
  (response) => response
);
export const getKycDocumentError = createAction(
  ActionTypes.GET_KYC_DOCUMENT_ERROR,
  (error) => error
);

export const getKycDocumentDetails = (callback) => async (dispatch) => {
  try {
    dispatch(getKycDocumentStart());
    const response = await _getKycDocument();
    dispatch(getKycDocumentSuccess(response));
    if (response?.status === "success") {
      callback(response);
    }
  } catch (error) {
    dispatch(getKycDocumentError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

export const updateMemberStatusStart = createAction(
  ActionTypes.UPDATE_MEMBER_STATUS_START
);
export const updateMemberStatusSuccess = createAction(
  ActionTypes.UPDATE_MEMBER_STATUS_SUCCESS,
  (response) => response
);
export const updateMemberStatusError = createAction(
  ActionTypes.UPDATE_MEMBER_STATUS_ERROR,
  (error) => error
);

export const updateMemberStatus =
  (id, status, callback, callbackError) => async (dispatch) => {
    try {
      const obj = { status };
      dispatch(updateMemberStatusStart());

      const response = await _updateMemberStatus(id, obj);
      if (response) {
        callback(response);
      }

      dispatch(updateMemberStatusSuccess(response));
    } catch (error) {
      callbackError(error);
      dispatch(updateMemberStatusError(error));
      if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// SENT LINK AGAIN TO CREATE NEW MEMBER

export const sentLinkAgainTOAddMemberStart = createAction(
  ActionTypes.SENT_LINK_TO_ADD_MEMBERS_START
);
export const sentLinkAgainTOAddMemberSuccess = createAction(
  ActionTypes.SENT_LINK_TO_ADD_MEMBERS_SUCCESS,
  (response) => response
);
export const sentLinkAgainTOAddMemberError = createAction(
  ActionTypes.SENT_LINK_TO_ADD_MEMBERS_ERROR,
  (error) => error
);

export const sentLinkAgainTOAddMember = (id, callback) => async (dispatch) => {
  try {
    dispatch(sentLinkAgainTOAddMemberStart());

    const response = await _sentLinkAgainTOAddMember(id);

    dispatch(sentLinkAgainTOAddMemberSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(sentLinkAgainTOAddMemberError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

export const getMemberStart = createAction(ActionTypes.GET_PHARMACY_MEMBER);
export const getMemberSuccess = createAction(
  ActionTypes.GET_PHARMACY_MEMBER_SUCCESS,
  (response) => response
);
export const getMemberError = createAction(
  ActionTypes.GET_PHARMACY_MEMBER_ERROR,
  (error) => error
);

export const getMemberDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(getMemberStart());

    const response = await _getMemberDetail(id);

    dispatch(getMemberSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(getMemberError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

const reducer = handleActions(
  {
    //ORDERS
    [ActionTypes.GET_PHARMACY_MEMBERS]: (state) => ({
      ...state,
      members: {
        ...state.members,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_MEMBERS_SUCCESS]: (state, action) => ({
      ...state,

      members: {
        ...state.members,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_PHARMACY_MEMBERS_ERROR]: (state) => ({
      ...state,

      members: {
        ...state.members,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    // CREATE PHARMACY MEMBER

    [ActionTypes.CREATE_PHARMACY_MEMBERS]: (state) => ({
      ...state,
      addMember: {
        loading: true,
      },
    }),
    [ActionTypes.CREATE_PHARMACY_MEMBERS_SUCCESS]: (state, action) => ({
      ...state,
      addMember: {
        loading: false,
      },
    }),
    [ActionTypes.CREATE_PHARMACY_MEMBERS_ERROR]: (state) => ({
      ...state,
      addMember: {
        loading: false,
      },
    }),
    //Get Business Notification
    [ActionTypes.GET_MEMBER_NOTIFICATION_START]: (state) => ({
      ...state,
      memberNotification: {
        ...state.memberNotification,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_MEMBER_NOTIFICATION_SUCCESS]: (state, action) => ({
      ...state,

      memberNotification: {
        ...state.memberNotification,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_MEMBER_NOTIFICATION_ERROR]: (state, action) => ({
      ...state,

      memberNotification: {
        ...state.memberNotification,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //Update Business Notification
    [ActionTypes.UPDATE_MEMBER_NOTIFICATION_START]: (state) => ({
      ...state,
      updateMemberNotification: {
        ...state.updateMemberNotification,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_NOTIFICATION_SUCCESS]: (state, action) => ({
      ...state,

      updateMemberNotification: {
        ...state.updateMemberNotification,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.UPDATE_MEMBER_NOTIFICATION_ERROR]: (state, action) => ({
      ...state,

      updateMemberNotification: {
        ...state.updateMemberNotification,
        loading: false,
        hasError: false,
        error: action.payload,
        response: {},
      },
    }),

    [ActionTypes.GET_PHARMACY_MEMBER]: (state) => ({
      ...state,
      memberDetail: {
        ...state.memberDetail,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_MEMBER_SUCCESS]: (state, action) => ({
      ...state,

      memberDetail: {
        ...state.memberDetail,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_PHARMACY_MEMBER_ERROR]: (state) => ({
      ...state,

      memberDetail: {
        ...state.memberDetail,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    [ActionTypes.UPDATE_PHARMACY_MEMBER]: (state) => ({
      ...state,
      updateMember: {
        loading: true,
      },
    }),
    [ActionTypes.UPDATE_PHARMACY_MEMBER_SUCCESS]: (state, action) => ({
      ...state,
      updateMember: {
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_PHARMACY_MEMBER_ERROR]: (state) => ({
      ...state,
      updateMember: {
        loading: false,
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_START]: (state) => ({
      ...state,
      updateMemberProfile: {
        ...state.updateMemberProfile,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      updateMemberProfile: {
        ...state.updateMemberProfile,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_PROFILE_DETAILS_ERROR]: (state, action) => ({
      ...state,
      updateMemberProfile: {
        ...state.updateMemberProfile,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPLOAD_KYC_DOCUMENT_START]: (state) => ({
      ...state,
      uploadKycDocument: {
        ...state.uploadKycDocument,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_KYC_DOCUMENT_SUCCESS]: (state, action) => ({
      ...state,
      uploadKycDocument: {
        ...state.uploadKycDocument,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_KYC_DOCUMENT_ERROR]: (state, action) => ({
      ...state,
      uploadKycDocument: {
        ...state.uploadKycDocument,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.GET_KYC_DOCUMENT_START]: (state) => ({
      ...state,
      getKycDocument: {
        ...state.getKycDocument,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_KYC_DOCUMENT_SUCCESS]: (state, action) => ({
      ...state,
      getKycDocument: {
        ...state.getKycDocument,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_KYC_DOCUMENT_ERROR]: (state, action) => ({
      ...state,
      getKycDocument: {
        ...state.getKycDocument,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPDATE_MEMBER_STATUS_START]: (state) => ({
      ...state,
      updateMemberStatus: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.UPDATE_MEMBER_STATUS_SUCCESS]: (state, action) => ({
      ...state,
      updateMemberStatus: {
        ...state.updateMemberStatus,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_MEMBER_STATUS_ERROR]: (state, action) => ({
      ...state,
      updateMemberStatus: {
        ...state.updateMemberStatus,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.SENT_LINK_TO_ADD_MEMBERS_START]: (state) => ({
      ...state,
      sentLinkToaddMember: {
        ...state.sentLinkToaddMember,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.SENT_LINK_TO_ADD_MEMBERS_SUCCESS]: (state, action) => ({
      ...state,

      sentLinkToaddMember: {
        ...state.sentLinkToaddMember,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.SENT_LINK_TO_ADD_MEMBERS_ERROR]: (state) => ({
      ...state,

      sentLinkToaddMember: {
        ...state.sentLinkToaddMember,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),
  },
  initialState
);

export default reducer;
