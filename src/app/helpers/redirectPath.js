import { store } from "../redux/store";
import { setChoosenDetail, setRecentConversations } from "../services/chat";

export const redirectPath = (user, history) => {
  if (user && user?.email) {
    store.dispatch(setChoosenDetail(null));
    store.dispatch(setRecentConversations([]));
    history("/marketplace");
  }
};
