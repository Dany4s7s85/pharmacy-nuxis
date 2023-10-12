import Header from "../../header";
import { SidebarAdmin } from "../../sidebaradmin";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Footer from "../../footer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";

const LayoutAdmin = (props) => {
  const [open, setOpen] = useState(props.sidebar);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    setOpen(matches);
  }, [matches]);
  return (
    <div>
      <Header setOpen={setOpen} open={open} props={props} />
      {(open ? props.sidebar : !props.sidebar) && (
        <SidebarAdmin setOpen={setOpen} open={open} matches={matches} />
      )}
      <Box
        component="main"
        sx={{
          backgroundColor: "white",
          flexGrow: 1,
          p: 3,
          ...((open ? props.sidebar : !props.sidebar) && {
            ml: matches ? 30 : 0,
          }),
        }}
      >
        <Toolbar />
        {props?.children}
      </Box>
      {!props?.sidebar && <Footer />}
    </div>
  );
};

export default LayoutAdmin;
