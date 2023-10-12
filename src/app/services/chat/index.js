import { createAction, handleActions } from "redux-actions";
import ActionTypes from "../../shared/constants/actionTypes";
import {
  _getConversations,
  _getConversationById,
} from "../../shared/httpService/api";
import { toast } from "react-toastify";

const initialState = {
  chatBox: false,
  chatBoxCount: 0,
    shouldReconnectSocket:true,
  conversationCount: 0,
  chosenChatDetails: null,
  copyChosenChatDetails: null,
  chatType: null,
  messages: null,

  onlineUsers: [],
  conversations: [],
  recent_conversations: [],
};

/* Reconnect Socket */
export const setShouldReconnectSocketAction = createAction(
    "SET_RECONNECT_SOCKET",
    (response) => response
);

export const setShouldReconnectSocket = (bool) => async (dispatch) => {
    try {
        dispatch(setShouldReconnectSocketAction(bool));
    } catch (error) {}
};


//Conversations
export const setActiveConversations = createAction(
  ActionTypes.SET_CONVERSATIONS,
  (response) => response
);

export const setConversations = (conversions) => async (dispatch) => {
  dispatch(setActiveConversations(conversions));
};

//RecentConversations
export const setActiveRecentConversations = createAction(
  ActionTypes.SET_RECENT_CONVERSATIONS,
  (response) => response
);

export const setRecentConversations = (conversions) => async (dispatch) => {
  dispatch(setActiveRecentConversations(conversions));
};
//Messages
export const setActiveMessages = createAction(
  ActionTypes.SET_MESSAGES,
  (response) => response
);

export const setMessages = (messages) => async (dispatch) => {
  dispatch(setActiveMessages(messages));
};

//Online Users
export const setActiveOnlineUsers = createAction(
  ActionTypes.SET_ONLINE_USERS,
  (response) => response
);

export const setOnlineUsers = (users) => async (dispatch) => {
  dispatch(setActiveOnlineUsers(users));
};

//Choosen Chat
export const setActiveChoosenChat = createAction(
  ActionTypes.SET_CHOOSEN_DETAILS,
  (response) => response
);
export const setChoosenDetail = (chosenChatDetails) => async (dispatch) => {
  dispatch(setActiveChoosenChat(chosenChatDetails));
};

//Copy Choosen Chat

export const setActiveCopyChoosenChat = createAction(
  ActionTypes.SET_CHOOSEN_DETAILS_COPY,
  (response) => response
);
export const setCopyChoosenDetail = (chosenChatDetails) => async (dispatch) => {
  dispatch(setActiveCopyChoosenChat(chosenChatDetails));
};
/* Update conversationCount */
export const updateConversationCountaAction = createAction(
  ActionTypes.UPDATE_CONVRSATION_COUNT_START
);

export const updateConversationCount = () => async (dispatch) => {
  try {
    dispatch(updateConversationCountaAction());
  } catch (error) {}
};
//Get All Conversations
export const getConversationsStart = createAction(
  ActionTypes.GET_CONVERSATIONS_START
);
export const getConversationsSuccess = createAction(
  ActionTypes.GET_CONVERSATIONS_SUCCESS,
  (response) => response
);
export const getConversationsError = createAction(
  ActionTypes.GET_CONVERSATIONS_ERROR,
  (error) => error
);
export const getAllConversations = (id, callback) => async (dispatch) => {
  try {
    dispatch(getConversationsStart());

    const response = await _getConversations(id);

    dispatch(getConversationsSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(getConversationsError(error));
    if (error?.status?.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
//Conversations By Id

export const getConversationStart = createAction(
  ActionTypes.GET_CONVERSATION_START
);
export const getConversationSuccess = createAction(
  ActionTypes.GET_CONVERSATION_SUCCESS,
  (response) => response
);
export const getConversationError = createAction(
  ActionTypes.GET_CONVERSATION_ERROR,
  (error) => error
);
export const getConversation =
  (page, convId, storeId, detail, callback) => async (dispatch) => {
    try {
      dispatch(getConversationStart());
      const response = await _getConversationById(
        page,
        convId,
        storeId,
        detail
      );
      if (response) {
        callback(response);
      }
      dispatch(getConversationSuccess(response));
    } catch (error) {
      dispatch(getConversationError(error));
      if (error?.status?.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
//open chat box
export const chatOpenSuccess = createAction(
  ActionTypes.CHAT_OPEN_SUCCESS,
  (response) => response
);
export const chatBoxOpen = (bool) => (dispatch) => {
  dispatch(chatOpenSuccess(bool));
};
const reducer = handleActions(
  {
    // Conversations
      ["SET_RECONNECT_SOCKET"]: (state,action) => ({
          ...state,
          shouldReconnectSocket: action.payload,
      }),

    [ActionTypes.SET_CONVERSATIONS]: (state, action) => ({
      ...state,
      conversations: action.payload,
    }),
    //Conversation Count
    [ActionTypes.UPDATE_CONVRSATION_COUNT_START]: (state) => ({
      ...state,
      conversationCount: state?.conversationCount + 1,
    }),
    // Recent Conversations

    [ActionTypes.SET_RECENT_CONVERSATIONS]: (state, action) => ({
      ...state,
      recent_conversations: action.payload,
    }),

    // Messages

    [ActionTypes.SET_MESSAGES]: (state, action) => ({
      ...state,
      messages: action.payload,
    }),

    // Online Users

    [ActionTypes.SET_ONLINE_USERS]: (state, action) => ({
      ...state,
      onlineUsers: action.payload,
    }),
    //Open Chat
    [ActionTypes.CHAT_OPEN_SUCCESS]: (state, action) => ({
      ...state,
      chatBox: action.payload,
      chatBoxCount: state.chatBoxCount + 1,
    }),
    // Choosen Chat

    [ActionTypes.SET_CHOOSEN_DETAILS]: (state, action) => ({
      ...state,
      chosenChatDetails: action.payload,
      messages: [],
    }),
    //Get Conversation
    [ActionTypes.GET_CONVERSATIONS_START]: (state) => ({
      ...state,
      // conversations: {
      //   ...state.conversations,
      //   loading: true,
      //   hasError: false,
      //   error: {},
      //   response: null,
      // },
    }),
    [ActionTypes.GET_CONVERSATIONS_SUCCESS]: (state, action) => ({
      ...state,

      // conversations: {
      //   ...state.conversations,
      //   loading: false,
      //   hasError: false,
      //   error: {},
      //   response: action.payload?.data,
      // },
    }),
    [ActionTypes.GET_CONVERSATIONS_ERROR]: (state, action) => ({
      ...state,

      // conversations: {
      //   ...state.conversations,
      //   error: action.payload,
      //   loading: false,
      //   hasError: true,
      //   response: {},
      // },
    }),
    //Get Conversation By Id
    [ActionTypes.GET_CONVERSATION_START]: (state) => ({
      ...state,
      // conversations: {
      //   ...state.conversations,
      //   loading: true,
      //   hasError: false,
      //   error: {},
      //   response: null,
      // },
    }),
    [ActionTypes.GET_CONVERSATION_SUCCESS]: (state, action) => ({
      ...state,

      // conversations: {
      //   ...state.conversations,
      //   loading: false,
      //   hasError: false,
      //   error: {},
      //   response: action.payload?.data,
      // },
    }),
    [ActionTypes.GET_CONVERSATION_ERROR]: (state, action) => ({
      ...state,

      // conversations: {
      //   ...state.conversations,
      //   error: action.payload,
      //   loading: false,
      //   hasError: true,
      //   response: {},
      // },
    }),
    // Copy Choosen Chat

    [ActionTypes.SET_CHOOSEN_DETAILS_COPY]: (state, action) => ({
      ...state,
      copyChosenChatDetails: action.payload,
    }),
  },

  initialState
);
export default reducer;
