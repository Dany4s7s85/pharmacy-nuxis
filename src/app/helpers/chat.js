import { store } from "../redux/store";
import { setMessages, setConversations } from "../services/chat";
import {
  setSeenMessage,
  updateChatFriendsUreadMessageCount,
} from "../realtimeCommunication/socketConnection";
import notificationSound from "../assets/notificationSound/notification1.mp3"
import sendingSound from "../assets/notificationSound/sending.mp3"


export const updateDirectChatHistoryIfActive = (data) => {
  const { participants, message, conversation, product, isActive, isResolved,totalCount } =
    data;
  const chosenChatDetails = store?.getState()?.chat?.chosenChatDetails;
  const receiverId = store?.getState()?.chat?.chosenChatDetails?.receiver;
  const storeId = store?.getState()?.auth?.user?.store?._id;
  const userId = store?.getState()?.auth?.user?._id;
  const chatBox = store?.getState()?.chat?.chatBox;
  const userRole = store?.getState()?.auth?.user?.role;
  const chatProduct = store?.getState()?.chat?.chosenChatDetails?.product?._id;

  if (receiverId && storeId) {
    const usersInConversation = [receiverId, storeId];

    updateDirectChatHistoryIfSameConversationActive({
      participants,
      usersInConversation,
      messages: message,
      receiverId: receiverId,
      storeId,
      product,
      chatProduct,
      chosenChatDetails,
      isResolved,
      isActive,
      conversation,
      userRole,
      userId,
      chatBox,
      totalCount,

    });
  }
};

const updateDirectChatHistoryIfSameConversationActive = ({
  participants,
  usersInConversation,
  messages,
  receiverId,
  storeId,
  product,
  chatProduct,
  chosenChatDetails,
  isResolved,
  isActive,
  conversation,
  userRole,
  userId,
  chatBox, totalCount
}) => {
  const result = participants.every(function (participantId) {
    return usersInConversation.includes(participantId);
  });

  if (result && chatProduct.toString() == product?._id?.toString()) {
    let existingMessages = [...store?.getState()?.chat?.messages?.messages];

    if (messages && messages?.isResolved) {
      messages.isResolved = isResolved;
    }
    let messageReciver =
      messages && typeof messages?.receiver == "string"
        ? messages?.receiver
        : messages?.receiver?._id;

    if (storeId == messageReciver) {
      existingMessages = [...existingMessages, messages];
      const audio = new Audio(notificationSound);
      audio.play();
      setSeenMessage({
        conversationId: conversation?.id,
        user: userId,
        receiver: storeId,
        store: messages?.author?._id,
        role: userRole,
        message: messages,
      });
    } else {
      const conversationIndex = existingMessages.findIndex(
        (item) => item?.uuid == messages?.uuid
      );
      if (conversationIndex > -1) {
        existingMessages[conversationIndex] = messages;
      }
      const audio = new Audio(sendingSound);
      audio.play();
    }

    store.dispatch(setMessages({messages:existingMessages,totalCount}));
    // updateChatFriendsUreadMessageCount({
    //   role: chosenChatDetails.role,
    //   user: chosenChatDetails.user,
    //   product: chosenChatDetails?.product,
    //   author: chosenChatDetails?.author,
    //   receiver: chosenChatDetails?.receiver,
    // });

    // updateChatFriendsUreadMessageCount({receiverId,storeId})
  } else if (chatBox) {
    let existingConversation = [...store?.getState()?.chat?.conversations];
    const convIndex = existingConversation?.findIndex(
      (el) => el?.product?._id == conversation?.product?._id
    );
    if (convIndex > -1) {
      let conv = existingConversation[convIndex];
      existingConversation.splice(convIndex, 1);
      conv.unreadCount = conversation.unreadCount;
      existingConversation = [conv, ...existingConversation];
    } else {
      existingConversation = [conversation, ...existingConversation];
    }
    store.dispatch(setConversations(existingConversation));
  }
};
