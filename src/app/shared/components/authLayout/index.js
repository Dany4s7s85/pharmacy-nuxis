import React from "react";
import "./authLayout.scss";
import { Box, Grid, Hidden, Typography } from "@mui/material";
import main from "../../../assets/images/main.png";
import logo from "../../../assets/images/newLogo.svg";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import nxusLogo from "../../../assets/images/nxusrxlogo2.png";
import { useLocation } from "react-router";
import cardFirstImage from "../../../assets/images/cardFirstImage.svg";
import cardSecondImage from "../../../assets/images/cardSecondImage.svg";
import cardThirdImage from "../../../assets/images/cardThirdImage.svg";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const signUpPage = location?.pathname?.includes("signup");

  return (
    <>
      <Box
        className="auth-container"
        margin="0px auto"
        maxWidth="1200px"
        padding="0px 15px"
        width="100%"
      >
        <Box
          // minHeight="100vh"
          justifyContent="center"
          display="flex"
          alignItems=" center"
        >
          <Grid container spacing={0}>
            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                height="100vh"
                minHeight="100%"
              >
                <Box
                  className={
                    signUpPage && signUpPage
                      ? "logoContainerSignUp"
                      : "logoContainer"
                  }
                >
                  <img src={logo} className="logo" />
                  <Typography className="logoText">NxusRX</Typography>
                </Box>
                {signUpPage ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    {children}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {children}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item md={6} textAlign="right" alignSelf="center">
              <Box>
                <img src={main} className="main" />
              </Box>
              {/* <Box>
                <Box sx={{ backgroundColor: "#235D5E" }}>
                  <Box className="backgroundContainerImg">
                    <Box>
                      <img src={cardFirstImage} className="" />
                      <img src={cardSecondImage} className="" />
                      <img src={cardThirdImage} className="" />
                    </Box>
                  </Box>
                </Box>
              </Box> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AuthLayout;
