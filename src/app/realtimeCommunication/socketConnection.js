import { io } from "socket.io-client";
import { store } from "../redux/store";
import { toast } from "react-toastify";
import { updateNotiCount } from "../services/BAuth";
import { addSocket } from "../services/socket";
import {
  getOrderDetail,
  getPharmacyOrder,
  getPurchaseOrderDetail,
  getPurchaseOrders,
  getPreOrders,
} from "../services/orders";
import { getMemberNotification } from "../services/members";
import {
  setOnlineUsers,
  setConversations,
  updateConversationCount,
  chatBoxOpen,
  setMessages,
} from "../services/chat";
import { updateDirectChatHistoryIfActive } from "../helpers/chat";
import { getBusinessOrder } from "../services/business-stats";
import { getAllWatchList } from "../services/products";
import { useSound } from "../helpers/common";
import notificationSound from "../assets/notificationSound/notification1.mp3";
import sendingSound from "../assets/notificationSound/sending.mp3";
let socket = null;

export const connectionWithSocketServer = async (userDetails) => {
  // const [notificationSPlay] = useSound(notificationSound);
  // const [sendingSPlay] = useSound(sendingSound);

  const jwtToken = userDetails?.token;
  socket = io(`${process?.env?.REACT_APP_BASE_URL}`, {
    auth: {
      token: jwtToken,
    },
    withCredentials: true,
    // transports:['websocket'],
  });

  socket.on("connect", () => {
    let sockets = store?.getState()?.socket?.sockets || [];

    if (socket.id) {
      sockets.push(socket.id);
    }

    store.dispatch(addSocket(sockets));
  });

  socket.on("disconnect", () => {
    console.log("do");
  });
  socket.on("store_order_notification", (data) => {
    const { notification_for, message } = data;
    let tmpstore = store?.getState()?.auth?.user
      ? store?.getState()?.auth?.user?.store
      : "";

    setTimeout(() => {
      store.dispatch(updateNotiCount());
      if (tmpstore) {
        store.dispatch(getPharmacyOrder("", "", "1", "10", function (res) {}));
      }

      store.dispatch(
        getBusinessOrder("", "", "1", "10", function (res) {
          if (res) {
          }
        })
      );
    }, 1000);
  });

  socket.on("online-users", (data) => {
    const { onlineUsers } = data;
    store.dispatch(setOnlineUsers(onlineUsers));
  });
  socket.on("direct-chat-history", (data) => {
    // updateDirectChatHistoryIfActive(data);

    const chatBox = store?.getState()?.chat?.chatBox;
    const chosenChatDetails = store?.getState()?.chat?.chosenChatDetails;

    if (
      !chatBox &&
      data.message.receiver?._id == store?.getState()?.auth?.user?.store?._id
    ) {
      store.dispatch(updateConversationCount());
      const audio = new Audio(notificationSound);
      audio.play();
    } else if (chatBox && chosenChatDetails) {
      updateDirectChatHistoryIfActive(data);
    } else {
      store.dispatch(updateConversationCount());
      const audio = new Audio(notificationSound);
      audio.play();
    }
  });

  socket.on("direct-conversations", (data) => {
    store.dispatch(setConversations(data?.conversations));
  });
  socket.on("store_orderStatus_notification", (data) => {
    const { notification_for, message, parent, subOrder, purc } = data;

    let tmpstore = store?.getState()?.auth?.user
      ? store?.getState()?.auth?.user?.store
      : "";

    if (tmpstore) {
      if (parent && window?.location?.href?.includes(parent)) {
        window?.location?.reload();
      }

      if (subOrder && window?.location?.href?.includes(subOrder)) {
        store.dispatch(getOrderDetail(subOrder, function (res) {}));
      }
    }

    setTimeout(() => {
      store.dispatch(updateNotiCount());
      store.dispatch(
        getBusinessOrder("", "", "1", "10", function (res) {
          if (res) {
          }
        })
      );
      if (tmpstore) {
        store.dispatch(getPharmacyOrder("", "", "1", "10", function (res) {}));
      }
    }, 1000);
  });
  socket.on("conversation-detail", (data) => {
    const chatBox = store?.getState()?.chat?.chatBox;
    let existingMessages = store?.getState()?.chat?.messages?.messages;
    const chosenChatDetails = store?.getState()?.chat?.chosenChatDetails;
    if (chosenChatDetails && chatBox) {
      const usersInConversation = [data?.receiver, data?.author];
      const result = data?.conversation?.participants.every(function (
        participantId
      ) {
        return usersInConversation.includes(participantId);
      });
      if (
        result &&
        chosenChatDetails?.product?._id == data?.conversation?.product?._id &&
        existingMessages?.length
      ) {
        existingMessages = existingMessages?.map((el, i) => {
          let receiver =
            typeof el?.receiver == "object" ? el?.receiver?._id : el?.receiver;
          return {
            ...el,
            ...(receiver == data?.author && { readby: data?.author }),
          };
        });

        let filterData = existingMessages.filter(
          (item) => item?.receiver?._id == data?.author
        );

        store.dispatch(
          setMessages({
            messages: existingMessages,
            totalCount: data?.totalCount,
          })
        );
      }
    }
  });
  socket.on("seen-message-response", (data) => {
    let existingMessages = store?.getState()?.chat?.messages?.messages;
    let storeId = store?.getState()?.auth?.user?.store?.id;
    const message = data;
    if (message && existingMessages?.length && message?.author?.id == storeId) {
      const conversationIndex = existingMessages.findIndex(
        (item) => item?.uuid == message?.uuid
      );
      if (conversationIndex > -1) {
        existingMessages[conversationIndex] = message;
        existingMessages = existingMessages.map((el) => {
          return { ...el, readby: message?.readby };
        });
        store.dispatch(
          setMessages({
            messages: existingMessages,
            totalCount: message?.totalCount,
          })
        );
      }
    }
  });

  socket.on("watchlist_notification2", (data) => {
    const { notification_for, message, parent, subOrder } = data;

    setTimeout(() => {
      store.dispatch(updateNotiCount());
    }, 1000);
  });

  socket.on("store_pre_order_notification", (data) => {
    const { notification_for, message, parent, subOrder } = data;

    let tmpstore = store?.getState()?.auth?.user
      ? store?.getState()?.auth?.user?.store
      : "";
    setTimeout(() => {
      store.dispatch(updateNotiCount());

      if (tmpstore) {
        store.dispatch(
          getPreOrders("", "", "1", "10", function (res) {
            if (res) {
            }
          })
        );
      }
    }, 1000);
  });

  socket.on("ping", () => {
    console.log("Received pong from server");
  });
  socket.on("watchlist_notification", (data) => {
    const { notification_for, message, parent, subOrder } = data;

    setTimeout(() => {
      store.dispatch(updateNotiCount());
      store.dispatch(
        getAllWatchList("", "", "", function (res) {
          if (res?.status == "success") {
          }
        })
      );
    }, 1000);
  });

  socket.on("member_doc_approval", (data) => {
    const { notification_for, message } = data;

    let id = store?.getState()?.auth?.user
      ? store?.getState()?.auth?.user?._id
      : "";
    if (notification_for.includes(id)) {
      store.dispatch(
        getMemberNotification("1", "10", function (res) {
          if (res) {
            store.dispatch(updateNotiCount());
            toast.success(message, {
              toastId: "success1",
            });
          }
        })
      );
      window?.location?.reload();
    }
  });

  return socket;
};

export const sendDirectMessage = (data) => {
  if (data) {
    socket?.emit("direct-message", data);
  }
};

export const getDirectChatHistory = (data) => {
  if (data) {
    socket?.emit("direct-chat-history", data);
  }
};

export const setSeenMessage = (data) => {
  if (data) {
    socket?.emit("get-seen-message", data);
  }
};

export const getDirectConversationHistory = (data) => {
  if (data) {
    socket?.emit("direct-conversations", data);
  }
};

export const updateChatFriendsUreadMessageCount = (data) => {
  if (data) {
    socket?.emit("update-read-count", data);
  }
};

export const socketServer = () => {
  return socket;
};
