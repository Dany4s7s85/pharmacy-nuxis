import React from "react";
import "./footer.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ListSubheader from "@mui/material/ListSubheader";
import EastIcon from "@mui/icons-material/East";
import BottomNavigation from "@mui/material/BottomNavigation";
import Typography from "@mui/material/Typography";
import logo from "../../../assets/images/newLogo.svg";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <BottomNavigation
        sx={{
          padding: { xs: "0rem 2rem", sm: "0rem 3rem" },
          height: "auto",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box className="newsletter">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box className="newsletter-image" />
            </Grid>
            <Grid item xs={12} md={8} className="newsletter-section">
              <Typography className="newsletter-heading">
                Subscribe to Our NewsLetter
              </Typography>

              <TextField
                id="outlined-basic"
                placeholder="Enter Your email..."
                className="newsletter-input "
                variant="outlined"
                inputProps={{
                  style: {
                    color: "#FFFF",
                  },
                }}
                sx={{
                  marginRight: "10px",
                  flex: "1",
                  color: "#285D5E",
                  ".MuiOutlinedInput-root .MuiOutlinedInput-input": {
                    color: "#ffff !important",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3) !important",
                  },
                  marginTop: "10px",
                }}
              />
              <Button
                className="outlined-white"
                variant="outlined"
                endIcon={<EastIcon />}
                sx={{
                  marginTop: "10px",
                  height: "40px",
                }}
              >
                <Typography className="text-hide">Subscribe</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          <Grid item md={4} sm={6} xs={12} lg={3}>
            <Box mb={3}>
              <Box
                className="headerLogoContainer"
                onClick={() => navigate("/marketplace")}
              >
                <img src={logo} className="logo" />
                <Typography className="logoText">NxusRX</Typography>
              </Box>
            </Box>
            <Typography component="div">
              NxusRx is a B2B exclusive exchange <br /> platform that connects
              Regulated <br /> Medical Professionals through a highly
              <br /> screened and secure platform.
            </Typography>
          </Grid>
          <Grid item md={2} sm={6} xs={12} lg={2}>
            <List
              component="nav"
              subheader={
                <ListSubheader component="div" className="nav-heading">
                  Quick Links
                </ListSubheader>
              }
            >
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="About Us"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Contact"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Privacy Policy"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Terms of Service"
                  className="footer-sub-heading"
                />
              </ListItemButton>
            </List>
          </Grid>
          <Grid item md={2} sm={6} xs={12} lg={2}>
            <List
              component="nav"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="nav-heading"
                >
                  Company
                </ListSubheader>
              }
            >
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Our Approach"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Testimonial"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Privacy Policy"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText primary="Why us" className="footer-sub-heading" />
              </ListItemButton>
            </List>
          </Grid>
          <Grid item md={2} sm={6} xs={12} lg={2}>
            <List
              component="nav"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="nav-heading"
                >
                  Learn
                </ListSubheader>
              }
            >
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Articles"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Press & Media"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText primary="Shows" className="footer-sub-heading" />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText primary="FAQ" className="footer-sub-heading" />
              </ListItemButton>
            </List>
          </Grid>
          <Grid item md={2} sm={6} xs={12} lg={2}>
            <List
              component="nav"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="nav-heading"
                >
                  Follow us
                </ListSubheader>
              }
            >
              <ListItemButton
                sx={{ paddingTop: "0px" }}
                onClick={() => window.open("http://facebook.com")}
              >
                <ListItemText
                  primary="Facebook"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Instagram"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton
                sx={{ paddingTop: "0px" }}
                onClick={() => window.open("http://twitter.com")}
              >
                <ListItemText
                  primary="Twitter"
                  className="footer-sub-heading"
                />
              </ListItemButton>
              <ListItemButton sx={{ paddingTop: "0px" }}>
                <ListItemText
                  primary="Linkedin"
                  className="footer-sub-heading"
                />
              </ListItemButton>
            </List>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <hr className="footer-line" />
            <Box component="div">
              <Typography variant="caption" className="footer-sub-heading">
                NxusRx © 2023 All Rights Reserved
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </BottomNavigation>
    </>
  );
};

export default Footer;
