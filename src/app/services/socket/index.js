import { createAction, handleActions } from "redux-actions";
import { toast } from "react-toastify";

import ActionTypes from "../../shared/constants/actionTypes";

const initialState = {
    userSocket:null,
    storeSocket:null,
    sockets: [],
};

/* Update UseSocket */
export const setUserSocketAction = createAction(
    "SET_USER_SOCKET",
    (response) => response
);

export const setUserSocket = (socket) => async (dispatch) => {
    try {

        dispatch(setUserSocketAction(socket));
    } catch (error) {}
};

/* Update StoreSocket */
export const setStoreSocketAction = createAction(
    "SET_STORE_SOCKET",
    (response) => response
);

export const setStoreSocket = (socket) => async (dispatch) => {
    try {
        dispatch(setStoreSocketAction(socket));
        console.log(socket)
    } catch (error) {}
};

export const addSocketsSuccess = createAction(
    ActionTypes.ADD_SOCKETS_SUCCESS,
    (response) => response
);

export const addSocket = (sockets) => (dispatch) => {

    dispatch(addSocketsSuccess(sockets));
};


const reducer = handleActions(
    {

        ["SET_STORE_SOCKET"]: (state,action) => ({
            ...state,
            storeSocket: action.payload,
        }),

        ["SET_USER_SOCKET"]: (state,action) => ({
            ...state,
            userSocket: action.payload,
        }),
        [ActionTypes.ADD_SOCKETS_SUCCESS]: (state, action) => ({
            ...state,

            sockets: action.payload,
        }),

    },

    initialState
);
export default reducer;
