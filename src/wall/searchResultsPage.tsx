import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useLocation } from "react-router";
import qs from "qs";

import { useDispatch } from "react-redux";

import { setSearchQuery, setShouldRefresh } from "../redux/actions";

import { Api } from "api";
import { MediumWallPagination } from "./mediumWallTypes";
import { paginationParamsFromQuery } from "./pagination";
import { BeevenueSpinner } from "../beevenueSpinner";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";

const MediumWall = React.lazy(() => import("./mediumWall"));

interface SearchResultItem {
  id: any;
  aspectRatio: string | null;
  tinyThumbnail: string | null;
  hash: string;
}

interface SearchResults extends MediumWallPagination {
  items: SearchResultItem[];
}

interface SearchResultsPageParams {
  extra: string;
}

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const shouldRefresh = useBeevenueSelector(
    store => store.refresh.shouldRefresh
  );

  const isSessionSfw = useIsSessionSfw();

  const match = useRouteMatch<SearchResultsPageParams>();

  const [results, setResults] = useState<SearchResults | null>(null);
  const [doShowSpinner, setDoShowSpinner] = useState(false);

  const doSearch = useCallback(
    (s: string) => {
      const q = qs.parse(location.search, { ignoreQueryPrefix: true });
      const paginationParams = paginationParamsFromQuery(q);
      const queryParams = { ...paginationParams, q: s };

      setResults(null);
      setDoShowSpinner(true);
      Api.Medium.search(queryParams).then(
        res => {
          setResults(res.data);
          setDoShowSpinner(false);
        },
        _ => {}
      );
    },
    [location]
  );

  useEffect(() => {
    if (shouldRefresh) {
      dispatch(setShouldRefresh(false));
    }
  }, [dispatch, shouldRefresh]);

  const getSearchTermsFromRoute = useCallback((): string => {
    const joinedTags = match.params.extra;
    if (!joinedTags) return "";
    const tags = joinedTags.split("/").join(" ");
    return tags;
  }, [match.params.extra]);

  // Only do this once (when landing on this page directly)
  // to correctly initialize global state from that URL.
  // Local state is then kept in sync with global state
  // as the source of truth.
  useEffect(() => {
    const tagsFromRoute = getSearchTermsFromRoute();
    dispatch(setSearchQuery(tagsFromRoute));
  }, [dispatch, getSearchTermsFromRoute]);

  useEffect(() => {
    doSearch(getSearchTermsFromRoute());
  }, [
    location.search,
    dispatch,
    doSearch,
    isSessionSfw,
    getSearchTermsFromRoute
  ]);

  let inner = null;
  if (doShowSpinner) {
    inner = () => <BeevenueSpinner />;
  } else if (!results || !results.items || results.items.length === 0) {
    inner = () => <h2 className="title is-2">No results found.</h2>;
  } else {
    inner = () => <MediumWall media={results} />;
  }

  return inner();
};

export { SearchResultsPage };
export default SearchResultsPage;
