import { useState, createContext, useEffect, useMemo, useRef } from "react";
import {
  connectionWithSocketServer,
  socketServer,
} from "../realtimeCommunication/socketConnection";
import isDeepEqual from "fast-deep-equal/react";
import { addSocket } from "../services/socket";
import { setShouldReconnectSocket } from "../services/chat";
import { useDispatch, useSelector } from "react-redux";


const context = {};

export const SocketContext = createContext(context);

export function SocketContextProvider(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const { shouldReconnectSocket } = useSelector((state) => state?.chat);
  const { sockets } = useSelector((state) => state?.socket);
  const [socket, setSocket] = useState(null);
  const userStoreIdRef = useRef(user?.store?._id);

  const { store_name, _id, status } = user?.store || {};

  const [userSocket, setUserSocketData] = useState(null);
  const [storeSocket, setStoreSocketData] = useState(null);

  const createStore = (data) => {
    return data;
  };

  const store = useMemo(
    () => createStore({ store_name, _id, status }),
    [store_name, _id, status]
  );

  useEffect(() => {
    const userStoreId = user?.store?._id;
    if (
      (userStoreId != userStoreIdRef?.current || shouldReconnectSocket) &&
      user &&
      user?.email
    ) {
      if (userSocket) {
        userSocket.disconnect();
        userSocket.offAny();
      }

      if (sockets?.length) {
        if (socketServer()) {
          socketServer().emit("forceDisconnect", sockets);
        }

        dispatch(addSocket([]));
      }

      (async () => {
        let newUserSocket = await connectionWithSocketServer(user);

        if (newUserSocket) {
          setUserSocketData(newUserSocket);
        }
      })();

      if (user?.store) {
        setTimeout(() => {
          (async () => {
            let newStoreSocket = await connectionWithSocketServer(user?.store);
            if (newStoreSocket) {
              setStoreSocketData(newStoreSocket);
            }
          })();
        }, 2000);
      }
      userStoreIdRef.current = user?.store?._id;
      dispatch(setShouldReconnectSocket(false));
    } else {
      if (!user?.email) {
        dispatch(addSocket([]));
        setUserSocketData(null);
        setStoreSocketData(null);
        if (sockets?.length && socketServer()) {
          socketServer().emit("forceDisconnect", sockets);
        }
      }
    }
  }, [store]);

  const allContext = useMemo(
    () => ({
      user,
      userSocket,
      storeSocket,
      shouldReconnectSocket,
      setUserSocketData,
      setStoreSocketData,
    }),
    [
      user,
      userSocket,
      storeSocket,
      shouldReconnectSocket,
      setUserSocketData,
      setStoreSocketData,
    ]
  );

  return (
    <SocketContext.Provider value={allContext}>
      {props.children}
    </SocketContext.Provider>
  );
}
