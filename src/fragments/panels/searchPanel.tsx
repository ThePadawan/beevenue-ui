import React, { FormEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { redirect, setShouldRefresh } from "../../redux/actions";
import qs from "qs";
import { useBeevenueSelector } from "../../redux/selectors";
import { useLocation } from "react-router-dom";

const SearchPanel = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const initialSearchTerms = useBeevenueSelector(
    store => store.search.searchQuery
  );

  const [searchTerms, setSearchTerms] = useState(initialSearchTerms || "");

  // Note that isn't superfluous. It keeps our state in sync with modifications
  // to the route params.
  useEffect(() => {
    if (initialSearchTerms) setSearchTerms(initialSearchTerms);
  }, [initialSearchTerms]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Redirect to new search results. Keep query parameter "pageSize"
    // if it is set.
    let newQ = "";
    if (location) {
      const query = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });
      const { pageSize } = query;
      newQ = qs.stringify({ pageSize });
    }
    let newPath = `/search/${searchTerms.replace(/ /g, "/")}`;
    if (newQ) {
      newPath = `${newPath}?${newQ}`;
    }

    if (location && location.pathname + location.search === newPath) {
      dispatch(setShouldRefresh(true));
      return;
    }

    dispatch(redirect(newPath));
  };

  const onChange = (newSearchTerms: string) => {
    setSearchTerms(newSearchTerms);
  };

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-content beevenue-search-card-content">
        <div className="content">
          <form onSubmit={e => onSubmit(e)}>
            <input
              className="input"
              type="text"
              placeholder="Search"
              value={searchTerms}
              onChange={e => onChange(e.currentTarget.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export { SearchPanel };
