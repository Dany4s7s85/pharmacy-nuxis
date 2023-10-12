import { useContext, useEffect, useMemo, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { Badge, ListItemIcon } from "@mui/material";
import { useLocation } from "react-router-dom";
import userProfile from "../../../assets/images/userProfile.svg";
import { useNavigate } from "react-router-dom";
import sideNavData from "../../../nav";
import bNav from "../../../navadmin";
import nxusLogo from "../../../assets/images/nxuslogo.svg";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../../context/authContext";
import { capitalize } from "../../../helpers/formatting";
import Typography from "@mui/material/Typography";
import {
  connectionWithSocketServer,
  socketServer,
} from "../../../realtimeCommunication/socketConnection";
import { useSelector } from "react-redux";
import { getBusinessLevelCount } from "../../../services/businessDashboard";
import { useDispatch } from "react-redux";

const drawerWidth = 240;

export const SidebarAdmin = ({ setOpen, matches, open }) => {
  const { user } = useSelector((state) => state.auth);
  const [levelCount, setLevelCount] = useState({});
  const location = useLocation();
  const history = useNavigate();
  const { allowedPages } = useContext(AuthContext);
  const dispatch = useDispatch();

  const notiCountResponse = useSelector((state) => state?.auth?.notiCount);

  const businessOrderResponse = useSelector(
    (state) => state?.order?.updateOrderStatus?.response
  );

  useEffect(() => {
    dispatch(
      getBusinessLevelCount(function (res) {
        if (res?.status == "success") {
          let data = res?.data;
          if (data) {
            setLevelCount(data);
          }
        }
      })
    );
  }, [notiCountResponse, businessOrderResponse]);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const sideBarItems = useMemo(
    () =>
      bNav
        .filter(({ file }) => allowedPages.includes(file))
        .map((item, index) => item),
    [bNav, allowedPages]
  );

  const isActive = (value) =>
    location?.pathname?.includes(value) ? "active" : "";

  return (
    <Drawer
      variant={matches ? "persistent" : "temporary"}
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: "1201",
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <IconButton
        onClick={handleDrawerClose}
        sx={{ display: matches ? "none" : "flex", alignSelf: "flex-end" }}
      >
        <CloseIcon sx={{ color: "#ffff" }} />
      </IconButton>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            margin: "10px 10px 10px 20px",
            position: "relative",
          }}
        >
          <img
            src={nxusLogo}
            className="nxusLogo"
            onClick={() => history("/marketplace")}
          />
        </Box>
      </Box>
      <Box sx={{ margin: "0px" }}>
        <List className="sidebarContainer">
          {sideBarItems && sideBarItems.length > 0 ? (
            sideBarItems.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                className={isActive(`${item?.link_to}`)}
                onClick={() => history(`${item?.link_to}`, { replace: true })}
              >
                <ListItemButton
                  className="sidebarText"
                  sx={{ padding: "11px 16px " }}
                >
                  <ListItemIcon className="sidebarIcon">
                    {item?.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                    >
                      {item?.name}
                    </Typography>
                  </ListItemText>
                  {item?.name == "Pre Orders" &&
                  levelCount &&
                  levelCount?.preOrdersCount ? (
                    <Box
                      backgroundColor="#F04438 !important"
                      borderRadius="100%"
                      width="20px"
                      height="20px"
                      padding="12px"
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "12px",
                          textAlign: "center",
                          height: "100%",
                          display: "flex",
                          margin: "auto",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {levelCount?.preOrdersCount > 99
                          ? "99+"
                          : levelCount?.preOrdersCount}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {item?.name == "Purchase Orders" &&
                      levelCount &&
                      levelCount?.purchaseOrdersCount ? (
                        <Box
                          backgroundColor="#F04438 !important"
                          borderRadius="100%"
                          width="20px"
                          height="20px"
                          padding="12px"
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "12px",
                              textAlign: "center",
                              height: "100%",
                              display: "flex",
                              margin: "auto",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {levelCount?.purchaseOrdersCount > 99
                              ? "99+"
                              : levelCount?.purchaseOrdersCount}
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          {item?.name == "Sales Orders" &&
                          levelCount &&
                          levelCount?.saleOrdersCount ? (
                            <Box
                              backgroundColor="#F04438 !important"
                              borderRadius="100%"
                              width="20px"
                              height="20px"
                              padding="12px"
                            >
                              <Typography
                                sx={{
                                  color: "white",
                                  fontSize: "12px",
                                  textAlign: "center",
                                  height: "100%",
                                  display: "flex",
                                  margin: "auto",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {levelCount?.saleOrdersCount > 99
                                  ? "99+"
                                  : levelCount?.saleOrdersCount}
                              </Typography>
                            </Box>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem
              disablePadding
              className={isActive("/profile")}
              onClick={() => history("/dash/dashboard", { replace: true })}
            >
              <ListItemButton>
                <ListItemIcon>
                  <img src={userProfile} />
                </ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarAdmin;
