/* eslint-disable no-unreachable */
import { useState, createContext, useEffect, useMemo } from "react";
import { getCurrentUserPermissions } from "../services/Aauth";
import { getCurrentUserPharmacyPermissions } from "../services/BAuth";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, matchPath, useNavigate } from "react-router-dom";
import { clearCookie, getCookie, setCookie } from "../helpers/common";
import { ToastContainer, toast } from "react-toastify";
import { pharmacyLoginSuccess } from "../services/BAuth";
import { getInventoryWishLists } from "../services/products";
import Layout from "../shared/components/layout/container";
import { getRoutes } from "../helpers/common";
import { Box } from "@mui/material";
import {
  setChoosenDetail,
  setConversations,
  setRecentConversations,
  setMessages,
  chatBoxOpen,
} from "../services/chat";
const context = {};

export const AuthContext = createContext(context);

export function AuthContextProvider(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistRes = useSelector(
    (state) => state?.product?.getInventoryWishLists?.response
  );
  let location = useLocation();

  const [wishListCount, setWishListCount] = useState(
    Number(wishlistRes?.data?.count) || 0
  );

  const { user, user_permissions, pharmacy_permissions } = useSelector(
    (state) => state.auth
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [allowedPages, setAllowedPages] = useState(
    JSON.parse(getCookie("bus_allowed_pages")) || []
  );
  const [pharmacyAllowedPages, setPharmacyAllowedPages] = useState(
    JSON.parse(getCookie("dash_allowed_pages")) || []
  );
  const [loading_user, setLoadingUser] = useState(false);
  const [isPharmacySelected, setIsPharmacySelected] = useState(false);
  const [count, setCount] = useState(0);
  const [shouldRenderSidebar, setShouldRenderSidebar] = useState(false);
  const [shouldRenderAdminSidebar, setShouldRenderAdminSidebar] =
    useState(false);
  const [shouldRenderHeader, setRenderHeader] = useState(false);

  const getPermissions = () => {
    setLoadingUser(true);
    try {
      dispatch(
        getCurrentUserPermissions(function (res) {
          setAllowedPages([
            ...res?.data?.permissions
              .filter((p) => p?.includes(".nav"))
              .map((p) => p?.split(".")[0]),
          ]);
          setLoadingUser(false);

          setCookie(
            "bus_allowed_pages",
            JSON.stringify([
              ...res?.data?.permissions
                .filter((p) => p?.includes(".nav"))
                .map((p) => p?.split(".")[0]),
            ])
          );
        })
      );
    } catch (err) {
      setCookie("bus_allowed_pages", JSON.stringify(["no-permissions"]));
      setAllowedPages(["no-permissions"]);
      setLoadingUser(false);
      toast(err.message);
    }
  };

  const getPharmacyPermissions = () => {
    setLoadingUser(true);

    try {
      dispatch(
        getCurrentUserPharmacyPermissions(user?.store?._id, function (res) {
          setPharmacyAllowedPages([
            ...res?.data?.permissions
              .filter((p) => p?.includes(".nav"))
              .map((p) => p?.split(".")[0]),
          ]);
          setLoadingUser(false);

          setCookie(
            "dash_allowed_pages",
            JSON.stringify([
              ...res?.data?.permissions
                .filter((p) => p?.includes(".nav"))
                .map((p) => p?.split(".")[0]),
            ])
          );

          if (res?.data?.permissions?.length == 0) {
            toast.warn("You dont have permissions for this pharmacy");

            delete user.store;
            dispatch(pharmacyLoginSuccess({ data: { ...user } }));
            navigate(`/bus/stores`, { replace: true });

            clearCookie("dash_allowed_pages");
          }
        })
      );
    } catch (err) {
      setCookie("dash_allowed_pages", JSON.stringify(["no-permissions"]));
      setPharmacyAllowedPages(["no-permissions"]);
      setLoadingUser(false);
      toast(err.message);
    }
  };

  useEffect(() => {
    if (user && user?.token && user?.email) {
      if (
        user?.store &&
        user?.store?._id &&
        (user?.is_verified || user?.role == "super_admin")
      ) {
        setIsPharmacySelected(true);
        setCount(count + 1);
      }

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setIsPharmacySelected(false);
    }
  }, [user]);
  /**
   * @description - This function is used to fetch the user details from the server
   */
  useEffect(() => {
    if (isLoggedIn) {
      getPermissions();
    }
    // listen to event
    window.addEventListener("FETCH_ADMIN_ROLE", () => {
      getPermissions();
    });
    return () => {
      window.removeEventListener("FETCH_ADMIN_ROLE", () => {
        getPermissions();
      });

      dispatch(chatBoxOpen(false));
      dispatch(setMessages(null));
      dispatch(setConversations([]));
      dispatch(setChoosenDetail(null));
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      user &&
      user?._id &&
      (user?.is_verified || user?.role == "super_admin")
    ) {
      dispatch(
        getInventoryWishLists(function (response) {
          if (response) {
            setWishListCount(response?.data?.count);
          }
        })
      );
    }
  }, [user]);

  useEffect(() => {
    if (isPharmacySelected) {
      getPharmacyPermissions();
    }
    // listen to event
    window.addEventListener("FETCH_PHARMACY_PERMISSIONS", () => {
      getPharmacyPermissions();
    });
    return () => {
      window.removeEventListener("FETCH_PHARMACY_PERMISSIONS", () => {
        getPharmacyPermissions();
      });
    };
  }, [isPharmacySelected, count]);

  useEffect(() => {
    const publicRoutes = [
      "/authenticate",
      "/login",
      "/",
      "/verifyDocument",
      "/qr-scanner",
      "/signup",
      "/addPharmacy",
      "/verifyOtp",
      "/forgotPassword",
      "/underReview",
      "/resetPassword",
      "/createPassword",
    ];
    const currentRoute = getRoutes().find((route) =>
      matchPath(location?.pathname, route?.path)
    );

    const isBusViewRoute = location?.pathname?.includes("/bus/");

    const isDashViewRoute = location?.pathname?.includes("/dash/");

    const shouldRender =
      isDashViewRoute || isBusViewRoute || currentRoute?.hasSidebar
        ? true
        : false;
    const shouldRenderAdmin =
      isBusViewRoute || currentRoute?.hasSidebar ? true : false;
    const shouRenderHea =
      location?.pathname.split("/")?.[1] == "createPassword" ||
      location?.pathname.split("/")?.[1] == "resetPassword" ||
      location?.pathname.split("/")?.[1] == "qr-scanner"
        ? publicRoutes?.some((route) => location?.pathname?.includes(route))
        : publicRoutes?.includes(location?.pathname);

    setRenderHeader(shouRenderHea);
    setShouldRenderSidebar(shouldRender);
    setShouldRenderAdminSidebar(shouldRenderAdmin);
  }, [location?.pathname]);

  const hasPermission = (perm) =>
    pharmacy_permissions?.response?.permissions?.includes(perm);
  const hasPermissionsOfBusiness = (perm) =>
    user_permissions?.response?.permissions?.includes(perm);
  const allContext = useMemo(
    () => ({
      setIsLoggedIn,
      hasPermission,
      allowedPages,
      isLoggedIn,
      user,
      hasPermissionsOfBusiness,
      pharmacyAllowedPages,
      setPharmacyAllowedPages,
      wishListCount,
      setWishListCount,
      shouldRenderSidebar,
      shouldRenderAdminSidebar,
      shouldRenderHeader,
    }),
    [
      isLoggedIn,
      user,
      hasPermission,
      allowedPages,
      loading_user,
      wishListCount,
      setWishListCount,
      shouldRenderSidebar,
      shouldRenderAdminSidebar,
      shouldRenderHeader,
    ]
  );

  return (
    <AuthContext.Provider value={allContext}>
      <Layout
        sidebar={shouldRenderSidebar}
        adminSidbar={shouldRenderAdminSidebar}
      >
        {!shouldRenderHeader ? (
          <Box className="main-margin">{props?.children}</Box>
        ) : (
          props?.children
        )}
      </Layout>
    </AuthContext.Provider>
  );
}
