import React, { lazy, useState, useEffect, Suspense, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import pages from "../nav";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
// eslint-disable-next-line no-console
const importView = (file) =>
  lazy(() =>
    import(`./${file}/index.js`).catch((err) =>
      console.log(`Error in importing ${err}`)
    )
  );

export default function Index() {
  const { pharmacyAllowedPages, loading_user } = useContext(AuthContext);
  const history = useNavigate();
  const { user, user_permissions } = useSelector((state) => state.auth);
  const { view } = useParams();
  const location = useLocation();
  const metaViewData = pages;
  const [selectedView, setSelectedView] = useState([]);

  async function loadView(filtered) {
    const promise = filtered.map(async (_view) => {
      const View = await importView(_view.file);

      return <View key={_view.id} selectView={selectView} />;
    });
    Promise.all(promise).then(setSelectedView);
  }

  async function selectView(file) {
    const filtered = metaViewData.filter((elem) => elem.file === file);

    loadView([filtered[0]]);
  }

  useEffect(() => {
    if (user && !user?.store) {
      return history(`/bus/profile`, { replace: true });
    }

    if (
      user &&
      user?.store &&
      user?.is_verified == false &&
      user?.role != "super_admin"
    ) {
      return history(`/bus/profile`, { replace: true });
    }

    let fileToLoad = view;
    if (!pharmacyAllowedPages.includes(fileToLoad)) {
      fileToLoad =
        pharmacyAllowedPages.length > 0
          ? pharmacyAllowedPages[0]
          : "store-profile";
    }
    if (fileToLoad === "null" || fileToLoad === "dash/null") {
      fileToLoad = "store-profile";
    }

    if (
      pharmacyAllowedPages.length === 1 &&
      pharmacyAllowedPages[0] === "no-permissions"
    ) {
      fileToLoad = "no-permissions";
    }

    if (pharmacyAllowedPages.includes(fileToLoad)) {
      fileToLoad =
        pharmacyAllowedPages[pharmacyAllowedPages.indexOf(fileToLoad)];
    }
    if (
      pharmacyAllowedPages.includes(fileToLoad) &&
      !metaViewData.find((elem) => elem.file === view)
    ) {
      fileToLoad = "store-profile";
    }
    history({
      pathname: `/dash/${fileToLoad}`,
      search: location?.search ? location?.search : "",
    });
    selectView(fileToLoad);
  }, [view, pharmacyAllowedPages, loading_user]);

  return loading_user ? (
    <Box
      sx={{
        width: "100%",
        height: "20vh",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <CircularProgress sx={{ color: " #235D5E" }} />
    </Box>
  ) : (
    <>
      <Suspense
        fallback={
          <Box
            sx={{
              width: "100%",
              height: "20vh",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CircularProgress sx={{ color: " #235D5E" }} />
          </Box>
        }
      >
        {selectedView}
      </Suspense>
    </>
  );
}
// PR
