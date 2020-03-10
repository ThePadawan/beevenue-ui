import React, { useState, useEffect } from "react";
import qs from "qs";

import { Api } from "api";
import { useDispatch } from "react-redux";
import { setShouldRefresh } from "../redux/actions";
import { paginationParamsFromQuery } from "./pagination";
import { Anonymous, Unknown } from "../redux/storeTypes";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { useLocation } from "react-router-dom";
import { MediumWallPagination } from "./mediumWallTypes";

const MediumWall = React.lazy(() => import("./mediumWall"));

const IndexPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isSessionSfw = useIsSessionSfw();
  const shouldRefresh = useBeevenueSelector(
    store => store.refresh.shouldRefresh
  );
  const loggedInUser = useBeevenueSelector(store => store.login.loggedInUser);
  const lastFileUploaded = useBeevenueSelector(
    store => store.fileUpload.lastFileUploaded
  );

  const [media, setMedia] = useState<MediumWallPagination | null>(null);

  useEffect(() => {
    if (shouldRefresh) {
      dispatch(setShouldRefresh(false));
    }

    let q = qs.parse(location.search, { ignoreQueryPrefix: true });
    const paginationParams = paginationParamsFromQuery(q);

    setMedia(null);
    Api.Medium.load(paginationParams).then(
      res => {
        setMedia(res.data);
      },
      _ => {}
    );
  }, [
    dispatch,
    location,
    isSessionSfw,
    lastFileUploaded,
    loggedInUser,
    shouldRefresh
  ]);

  useEffect(() => {
    if (loggedInUser === Anonymous || loggedInUser === Unknown) {
      setMedia(null);
    }
  }, [loggedInUser]);

  let inner = null;
  if (loggedInUser !== Anonymous && media) inner = <MediumWall media={media} />;

  return inner;
};

export { IndexPage };
