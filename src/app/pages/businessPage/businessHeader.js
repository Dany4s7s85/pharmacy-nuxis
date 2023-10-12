import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import nxusLogo from "../../assets/images/newLogo.svg";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const darkTheme = createTheme({
    shadows: "none",
    color: "#333",
    palette: {
      primary: {
        main: "#FFFFFF00",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static" sx={{ background: "#f6f6f6" }}>
        <Container maxWidth={false} sx={{ maxWidth: "100%" }}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              width: "100%",
              padding: { xs: "0rem !important", md: "0rem 4rem !important" },
            }}
          >
            <Box className="landingPageheader1">
              <img src={nxusLogo} />
              <Typography href="/marketplace" className="logoText">
                NxusRX
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box className="landingPageheader">
              <img src={nxusLogo} />
              <Typography href="/marketplace" className="logoText">
                NxusRX
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    padding: "6px 16px",
                    color: "#333",
                    display: "block",
                    textTransform: "capitalize",
                    fontSize: "14px",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{
                borderRadius: "6px",
                textTransform: "capitalize",
                fontSize: "14px",
                border: "1px solid #235D5E",
                padding: {
                  xs: "0px 10px !important",
                  sm: "7px 24px !important",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;
