import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import cart from "../../services/cart";
import { clearCookie } from "../../helpers/common";
import product from "../../services/products";
import order from "../../services/orders";
import members from "../../services/members";
import Auth from "../../services/BAuth";
import pharmacyDashboard from "../../services/pharmacyDashboard";
import { socketServer } from "../../realtimeCommunication/socketConnection";
import businessDashboard from "../../services/businessDashboard";
import chat from "../../services/chat";
import BusinessOrders from "../../services/business-stats";
import Socket from "../../services/socket";

/**
 * all available reducers are wrapped by the combine reducers function
 */

const rootReducer = combineReducers({
  product,
  auth: Auth,
  cart: cart,
  order,
  members,
  pharmacyDashboard,
  businessDashboard,
  chat,
  BusinessOrders,
  socket: Socket,
});

const appReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    const { userSocket, storeSocket, setUserSocketData, setStoreSocketData } =
      action.payload;
    let sockets = state?.auth?.sockets;

    if (userSocket) {
      userSocket.disconnect();
      userSocket.offAny();
      setUserSocketData(null);
    }

    if (storeSocket) {
      storeSocket.disconnect();
      userSocket.offAny();
      setStoreSocketData(null);
    }

    if (sockets.length && socketServer()) {
      socketServer().emit("forceDisconnect", sockets);
    }
    setTimeout(() => {
      storage.removeItem("persist:root");
      storage.removeItem("persist:DATA_PERSISTANT_KEY");
    }, 200);

    if (typeof window !== "undefined") {
      localStorage?.removeItem("products");
    }
    clearCookie("dash_allowed_pages");
    clearCookie("bus_allowed_pages");
    clearCookie("sessionId");
    state = undefined;
  }

  return rootReducer(state, action);
};

export default appReducer;
