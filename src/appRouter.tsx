import React, { Suspense, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import debounce from "lodash-es/debounce";
import { BeevenueSpinner } from "./fragments/beevenueSpinner";

import { IndexPage, ShowPage } from "./pages";

import history from "./history";
import { Api } from "./api/api";
import { login, loginAnonymous } from "./redux/actions";

const WildcardPage = React.lazy(() => import("./pages/wildcardPage"));
const TagStatisticsPage = React.lazy(() => import("./pages/tagStatisticsPage"));
const TagsPage = React.lazy(() => import("./pages/tagsPage"));
const TagShowPage = React.lazy(() => import("./pages/tagShowPage"));
const RulesPage = React.lazy(() => import("./pages/rulesPage"));
const SearchResultsPage = React.lazy(() => import("./pages/searchResultsPage"));

const AppRouter = () => {
  const [hasUser, setHasUser] = useState(false);

  const dispatch = useDispatch();

  const setHasUserDebounced = () => {
    debounce(() => {
      setHasUser(true);
    }, 20)();
  };

  useEffect(() => {
    Api.amILoggedIn()
      .then(res => {
        if (res.data) {
          dispatch(login(res.data));
        } else {
          dispatch(loginAnonymous());
        }
      })
      .finally(() => {
        setHasUserDebounced();
      });
  }, [dispatch]);

  const fallback = (
    <div className="full-page-spinner">
      <div className="full-page-spinner-inner">
        <BeevenueSpinner />
      </div>
    </div>
  );

  if (!hasUser) {
    return fallback;
  }

  return (
    <Router history={history}>
      <Suspense fallback={fallback}>
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/search/:extra(.+)" component={SearchResultsPage} />
          <Route path="/show/:id" component={ShowPage} />
          <Route path="/tags" component={TagsPage} />
          <Route path="/tagStats" component={TagStatisticsPage} />
          <Route path="/tag/:name" component={TagShowPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/:whatever" component={WildcardPage} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export { AppRouter };
