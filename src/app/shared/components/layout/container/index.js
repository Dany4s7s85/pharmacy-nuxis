import Header from "../../header";
import { Sidebar } from "../../sidebar";
import { SidebarAdmin } from "../../sidebaradmin";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Footer from "../../footer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/authContext";

const Layout = (props) => {
  const { shouldRenderSidebar, shouldRenderAdminSidebar, shouldRenderHeader } =
    useContext(AuthContext);
  const [open, setOpen] = useState(shouldRenderSidebar);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    setOpen(matches);
  }, [matches]);

  return (
    <div>
      {!shouldRenderHeader && (
        <Header setOpen={setOpen} open={open} props={props} />
      )}

      {(open ? shouldRenderSidebar : !shouldRenderSidebar) && (
        <>
          {!shouldRenderAdminSidebar ? (
            <Sidebar setOpen={setOpen} open={open} matches={matches} />
          ) : (
            <>
              <SidebarAdmin setOpen={setOpen} open={open} matches={matches} />
            </>
          )}
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          ...((open ? props.sidebar : !props.sidebar) && {
            ml: matches ? 30 : 0,
          }),
        }}
      >
        {/* <Toolbar /> */}
        {props?.children}
      </Box>

      <>{!shouldRenderSidebar && !shouldRenderHeader && <Footer />}</>
    </div>
  );
};

export default Layout;
