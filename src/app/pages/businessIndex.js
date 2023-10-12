import React, { lazy, useState, useEffect, Suspense, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import pages from "../navadmin";
import CircularProgress from "@mui/material/CircularProgress";
// eslint-disable-next-line no-console
const importView = (file) =>
  lazy(() =>
    import(`./${file}/index.js`).catch((err) =>
      console.log(`Error in importing ${err}`)
    )
  );

export default function Index() {
  const { allowedPages, loading_user } = useContext(AuthContext);
  const history = useNavigate();
  const location = useLocation();

  const { view } = useParams();
  const metaViewData = pages;
  const [selectedView, setSelectedView] = useState([]);

  async function loadView(filtered) {
    const promise = filtered.map(async (_view, i) => {
      const View = await importView(_view.file);

      return <View key={i} selectView={selectView} />;
    });
    Promise.all(promise).then(setSelectedView);
  }

  async function selectView(file) {
    const filtered = metaViewData.filter((elem) => elem.file === file);

    loadView([filtered[0]]);
  }

  useEffect(() => {
    let fileToLoad = view;
    if (!allowedPages.includes(fileToLoad)) {
      fileToLoad = allowedPages.length > 0 ? allowedPages[0] : "profile";
    }
    if (fileToLoad === "null" || fileToLoad === "dash/null") {
      fileToLoad = "profile";
    }

    if (allowedPages.length === 1 && allowedPages[0] === "no-permissions") {
      fileToLoad = "no-permissions";
    }

    if (allowedPages.includes(fileToLoad)) {
      fileToLoad = allowedPages[allowedPages.indexOf(fileToLoad)];
    }
    if (
      allowedPages.includes(fileToLoad) &&
      !metaViewData.find((elem) => elem.file === view)
    ) {
      fileToLoad = "profile";
    }

    history(`/bus/${fileToLoad}`, {
      replace: true,
      state: location?.state ? location?.state : "",
    });
    selectView(fileToLoad);
  }, [view, allowedPages, loading_user]);

  return loading_user ? (
    <CircularProgress sx={{ color: " #235D5E" }} />
  ) : (
    <>
      <Suspense fallback={<CircularProgress sx={{ color: " #235D5E" }} />}>
        {selectedView}
      </Suspense>
    </>
  );
}
