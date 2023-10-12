import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  BrowserRouter,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Layout from "../shared/components/layout/container";
import ForgetPassword from "../pages/forgetPassword";
import ResetPassword from "../pages/resetPassword";
import Signup from "../pages/Signup";
import AddPharmacy from "../pages/addStore";
import Signin from "../pages/Signin";
import VerifyOtp from "../pages/verifyOtp";
import NexusLandingPage from "../modules/nexusLandingPage/index";
import VerifyDocument from "../pages/verifyDocument";
import ProductDetail from "../pages/productDetail";
import ViewCart from "../pages/viewCart";
import Checkout from "../pages/checkout";
import Wishlist from "../pages/wishlist";
import UpdatePassword from "../pages/updatePassword";
import { useSelector } from "react-redux";
import CreatePassword from "../pages/members/CreatePassword";
import LayoutAdmin from "../shared/components/layoutAdmin/container";
import QrScan from "../shared/components/qr-scan";
import NexusBusiness from "../pages/businessPage";
import Pages from "../pages";
import Business from "../pages/businessIndex";
import UnderReview from "../pages/Signin/underReview";
import Dashboard from "../pages/dashboard";
import BasicAuth from "../pages/BasicAuth";
import BusinessOrders from "../pages/business-orders";
import BusinessPurchaseOrders from "../pages/business-purchase";
import BusinessProductList from "../pages/business-products";
import ProductListing from "../pages/product-listing";
import Watchlist from "../pages/watchlist";
/**
 * Application main router component
 *
 * contains all the available routes and components in the application
 */

function PublicRoute({ isLoggedIn, redirectTo }) {
  return isLoggedIn ? <Navigate to={redirectTo} /> : <Outlet />;
}

function NotFoundRoute({ isLoggedIn, redirectTo }) {
  return isLoggedIn ? (
    <Navigate to={redirectTo} />
  ) : (
    <Navigate to={redirectTo} />
  );
}

function PrivateRoute({ isLoggedIn, redirectTo }) {
  return isLoggedIn ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectTo} />
  );
}

function BasicPrivateRoute({ isLoggedIn, redirectTo }) {
  return isLoggedIn ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectTo} />
  );
}

function BusinessPrivateRoute({ isLoggedIn, redirectTo }) {
  return isLoggedIn ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectTo} />
  );
}

const Router = () => {
  const { user, authenticated } = useSelector((state) => state.auth);
  const { isLoggedIn, allowedPages } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
  } else {
    return (
      <Routes>
        <Route
          path="/watchlist"
          element={
            <BasicPrivateRoute
              redirectTo="/login"
              isLoggedIn={user && user.token && user.email ? true : false}
            />
          }
        >
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>

        <Route
          exact
          path="/marketplace"
          element={
            <BasicPrivateRoute
              redirectTo="/login"
              isLoggedIn={user && user.token && user.email ? true : false}
            />
          }
        >
          <Route path="/marketplace" element={<NexusLandingPage />} />
        </Route>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/productlisting"
          element={
            <BasicPrivateRoute
              redirectTo="/login"
              isLoggedIn={user && user.token && user.email ? true : false}
            />
          }
        >
          <Route path="/productlisting" element={<ProductListing />} />
        </Route>
        <Route
          path="/bus/:view"
          element={
            <BusinessPrivateRoute
              redirectTo="/authenticate"
              isLoggedIn={user && user.token && user.email ? true : false}
            />
          }
        >
          <Route path="/bus/:view" element={<Business />} />
        </Route>
        <Route
          path="/dash/:view"
          element={
            <PrivateRoute
              redirectTo="/authenticate"
              isLoggedIn={user && user.token && user.email ? true : false}
            />
          }
        >
          <Route path="/dash/:view" element={<Pages />} />
        </Route>
        <Route element={<UpdatePassword />} path="/dash/updatePassword" exact />

        {/*<Route exact path="/subOrder/:id" element={<Layout sidebar={true}><OrderDetail /></Layout>} />*/}
        <Route exact path="/products/:id/:din" element={<ProductDetail />} />
        <Route exact path="/viewcart" element={<ViewCart />} />
        <Route exact path="/checkout" element={<Checkout />} />

        <Route exact path="/authenticate" element={<BasicAuth />} />
        <Route exact path="/login" element={<Signin />} />
        <Route exact path="/" element={<NexusBusiness />} />
        <Route exact path="/verifyDocument" element={<VerifyDocument />} />
        <Route exact path="/verifyDocument/:id" element={<VerifyDocument />} />
        <Route exact path="/qr-scanner/:token" element={<QrScan />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/addPharmacy" element={<AddPharmacy />} />
        <Route exact path="/verifyOtp" element={<VerifyOtp />} />
        <Route exact path="/forgotpassword" element={<ForgetPassword />} />
        <Route exact path="/underReview" element={<UnderReview />} />
        <Route exact path="/resetPassword/:id" element={<ResetPassword />} />
        <Route exact path="/createPassword/:id" element={<CreatePassword />} />

        <Route
          path="*"
          element={
            <NotFoundRoute
              isLoggedIn={isLoggedIn}
              redirectTo={
                authenticated && authenticated?.email
                  ? allowedPages.length > 0
                    ? `/bus/dashboard`
                    : location?.pathname?.includes("bus")
                      ? "/dash/store-dashboard"
                      : "/marketplace"
                  : "/authenticate"
              }
            />
          }
        />
      </Routes>
    );
  }
};

export default Router;
