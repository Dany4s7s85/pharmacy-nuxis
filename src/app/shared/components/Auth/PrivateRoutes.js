import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isLogin } from "../../utils/utilities";

const PrivateRoutes = () => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    isLogin() ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoutes;
