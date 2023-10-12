import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import AppReducer from "../reducers";
import { persistStore, persistReducer,createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";




/*global KEY */
/*eslint no-undef: "error"*/
const persistConfig = {
  key: JSON.stringify("DATA_PERSISTANT_KEY"),
  storage,
  blacklist: ["chat"],

};

const persistedReducer = persistReducer(persistConfig, AppReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const composeFunction =
  process.env.NODE_ENV == "development" ? composeEnhancers : compose;

function configureStore(initialState) {
  const enhancer = composeFunction(applyMiddleware(thunkMiddleware));
  return createStore(persistedReducer, initialState, enhancer);
}

export const store = configureStore({});
export const persistor = persistStore(store);
