import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
// eslint-disable-next-line
import "swiper/swiper-bundle.css";
import "./scss/styles.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Router from "./app/router/router";
import { store, persistor } from "./app/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { createBrowserHistory } from "history";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./app/context/authContext";
import { SocketContextProvider } from "./app/context/socketContext";
import { FilterContextProvider } from "./app/context/FilterContext";
export const history = createBrowserHistory();
window.process = {};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HistoryRouter history={history}>
    <ToastContainer />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <SocketContextProvider>
        <AuthContextProvider>

            <FilterContextProvider>
              <Router />
            </FilterContextProvider>

        </AuthContextProvider>
          </SocketContextProvider>
      </PersistGate>
    </Provider>
  </HistoryRouter>
);
