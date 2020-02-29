import React, { useState, useEffect } from "react";
import { useRouteMatch, useLocation } from "react-router";
import qs from "qs";

import { BeevenuePage } from "./beevenuePage";
import { useDispatch } from "react-redux";

import { setSearchQuery, setShouldRefresh } from "../redux/actions";

import { Api, SearchParameters } from "../api/api";
import { Thumbs, MediumWallPagination } from "../fragments/mediumWallTypes";
import { paginationParamsFromQuery } from "./pagination";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";

const MediumWall = React.lazy(() => import("../fragments/mediumWall"));

interface SearchResultItem {
  id: any;
  aspectRatio: string | null;
  tinyThumbnail: string | null;
  hash: string;
  thumbs: Thumbs;
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

  useEffect(() => {
    if (shouldRefresh) {
      dispatch(setShouldRefresh(false));
    }

    const getSearchTerms = (): string => {
      const joinedTags = match.params.extra;
      if (!joinedTags) return "";
      const tags = joinedTags.split("/").join(" ");
      return tags;
    };

    const getCurrentQueryString = (): any => {
      return qs.parse(location.search, { ignoreQueryPrefix: true });
    };

    const doSearch = (params: SearchParameters) => {
      setResults(null);
      setDoShowSpinner(true);
      Api.search(params).then(
        res => {
          setResults(res.data);
          setDoShowSpinner(false);
        },
        _ => {}
      );
    };

    const tags = getSearchTerms();
    if (tags === "") {
      console.warn("Searching with empty tags!");
      return;
    }

    dispatch(setSearchQuery(tags));

    let q = getCurrentQueryString();
    const paginationParams = paginationParamsFromQuery(q);
    const queryParams = { ...paginationParams, q: tags };
    doSearch(queryParams);
  }, [shouldRefresh, location, match, dispatch, isSessionSfw]);

  let inner = null;
  if (doShowSpinner) {
    inner = <BeevenueSpinner />;
  } else if (!results || !results.items || results.items.length === 0) {
    inner = <h2 className="title is-2">No results found.</h2>;
  } else {
    inner = <MediumWall media={results} />;
  }

  return <BeevenuePage>{inner}</BeevenuePage>;
};

export { SearchResultsPage };
export default SearchResultsPage;
