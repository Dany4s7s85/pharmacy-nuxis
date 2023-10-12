import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ResponsiveAppBar from "./businessHeader";
import Footer from "../../shared/components/footer";
import { useNavigate, useLocation } from "react-router-dom";
import { redirectPath } from "../../helpers/redirectPath";
import { useSelector } from "react-redux";
import dashboardIcon from "../../assets/images/dashboardIcon.svg";
import bulletsIcon from "../../assets/images/bulletStarIcon.svg";
import "./business.scss";

const NexusBusiness = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    redirectPath(user, navigate);
  }, []);

  const salesAndPurchasesBullets = [
    "Platform that connects Regulated Medical Professionals.",
    "In Some cases the savings for these sales and purchases.",
    "Nxus is a Real Time payment gateway which allows.",
    "Complete the transaction and pay directly between.",
    "Exchange member to use credit on file.",
  ];

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth={false} className="nxusLandingPageContainer">
        <Box sx={{ background: "#f6f6f6" }}>
          <Typography className="mainHeading">
            B2B exclusive exchange platform for medical professionals.
          </Typography>
          <Typography className="mainParagraph">
            NxusRx allows for the secure listing and sale of surplus medical
            equipment and medication may be nearing its expiry date.
          </Typography>
          <Button
            className="contained contained-primary"
            sx={{
              padding: "6px 26px",
              fontSize: "16px",
              borderRadius: "6px",
              textTransform: "capitalize",
              display: "flex",
              margin: "2rem auto",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          <Box>
            <img src={dashboardIcon} className="dashboardImage" />
          </Box>
        </Box>

        <Box mt={5} mb={8} className="secondSection">
          <Typography className="mainHeading">B2B Platform</Typography>
          <Box className="userDashboard">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Button
                  className="contained contained-primary"
                  sx={{
                    borderRadius: "6px",
                    textTransform: "capitalize",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  User Friendly Dashboard
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Button
                  className="contained contained-primary"
                  sx={{
                    color: "black !important",
                    backgroundColor: "white !important",
                    border: "1px solid #efefef ",
                    borderRadius: "6px",
                    textTransform: "capitalize",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  User Friendly Dashboard
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Button
                  className="contained contained-primary"
                  sx={{
                    color: "black !important",
                    backgroundColor: "white !important",
                    border: "1px solid #efefef ",
                    borderRadius: "6px",
                    textTransform: "capitalize",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  User Friendly Dashboard
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ padding: { xs: "0rem 3rem", sm: "0rem 6rem" } }}>
            <Box className="seconCardDetail">
              <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                  <Typography className="B2B-DetailHeading">
                    NxusRx is a B2B exclusive exchange
                  </Typography>
                  <Typography className="B2B-Detail">
                    Platform that connects Regulated Medical Professionals.
                    NxusPay is a Real Time payment gateway which allows the
                    exchange member to use credit on file to complete the
                    transaction and pay directly between buyer and seller.
                  </Typography>
                  <Button
                    className="contained contained-primary"
                    sx={{
                      color: "#235d5e !important",
                      backgroundColor: "white !important",
                      border: "1px solid #235d5e ",
                      borderRadius: "6px",
                      textTransform: "capitalize",
                      display: "flex",
                      margin: "30px 0px",
                    }}
                  >
                    Learn More
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="landingPageBackground"></Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        <Box mt={5} mb={5}>
          <Box className="thirdSection">
            <Typography className="mainHeading" sx={{ color: "#ffff" }}>
              Medical professionals
            </Typography>
            <Box sx={{ padding: { xs: "3rem", sm: "3rem 6rem" } }}>
              <Grid container spacing={4} mb={5}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={0} className="cardInfo">
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                      <Typography
                        className="cardHeading"
                        sx={{ color: "#ffff" }}
                      >
                        Platform that connects Regulated Medical
                      </Typography>
                      <Typography
                        className="cardDetail"
                        sx={{ color: "#ffff" }}
                      >
                        NxusPay is a Real Time payment gateway which allows the
                        exchange member to use credit on file
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{ display: { xs: "none", lg: "block" } }}
                    >
                      <Box className="thirdCardBackground"></Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={0} className="cardInfo">
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                      <Typography
                        className="cardHeading"
                        sx={{ color: "#ffff" }}
                      >
                        Platform that connects Regulated Medical
                      </Typography>
                      <Typography
                        className="cardDetail"
                        sx={{ color: "#ffff" }}
                      >
                        NxusPay is a Real Time payment gateway which allows the
                        exchange member to use credit on file
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{ display: { xs: "none", lg: "block" } }}
                    >
                      <Box className="thirdCardBackground"></Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box mt={2} className="secondCardInfo">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Typography className="cardHeading" sx={{ color: "#ffff" }}>
                      Platform that connects Regulated Medical
                    </Typography>
                    <Typography className="cardDetail" sx={{ color: "#ffff" }}>
                      NxusPay is a Real Time payment gateway which allows the
                      exchange member to use credit on file
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{ display: { xs: "none", lg: "block" } }}
                  >
                    <Box className="thirdCardBackground"></Box>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Typography className="cardDetail" sx={{ color: "#ffff" }}>
                      NxusPay is a Real Time payment gateway which allows the
                      exchange member to use credit on file
                    </Typography>
                    <Button
                      className="contained contained-primary"
                      sx={{
                        color: "#235d5e !important",
                        backgroundColor: "white !important",
                        border: "1px solid #235d5e ",
                        borderRadius: "6px",
                        textTransform: "capitalize",
                        display: "flex",
                        margin: "20px 0px",
                      }}
                    >
                      Learn More
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box mt={5} mb={1} className="forthSection">
          <Typography className="forthSectionHeading">
            Exclusive Exchange Platform
          </Typography>

          <Box
            sx={{ padding: { xs: "2rem", sm: "3rem 6rem" } }}
            position="relative"
          >
            <Box className="forthSectionDetail">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography className="forthSectionDetailHeading">
                    In Some cases the savings for these sales and purchases
                  </Typography>

                  <Box>
                    {salesAndPurchasesBullets?.map((el) => (
                      <Box display="flex" mb={2}>
                        <img src={bulletsIcon} />
                        <Box ml={1}>{el}</Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  <Box className="forthCardBackground"></Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};
export default NexusBusiness;
