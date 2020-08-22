import React, { Suspense, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { BeevenueSpinner } from "./beevenueSpinner";

import history from "./beevenueHistory";
import { Api } from "api";
import { login, loginAnonymous } from "./redux/actions";
import { BeevenuePage } from "./routing/beevenuePage";

import { IndexPage } from "./wall/indexPage";
const SearchResultsPage = React.lazy(() => import("./wall/searchResultsPage"));

const TagStatisticsPage = React.lazy(() => import("./tags/tagStatisticsPage"));
const TagsPage = React.lazy(() => import("./tags/tagsPage"));
const TagDetailPage = React.lazy(() => import("./tags/tagShowPage"));

const DetailPage = React.lazy(() => import("./detail/detailPage"));

const RulesPage = React.lazy(() => import("./rules/rulesPage"));
const StatsPage = React.lazy(() => import("./stats/statsPage"));

const WildcardPage = React.lazy(() => import("./routing/wildcardPage"));

const AppRouter = () => {
  const [hasUser, setHasUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    Api.Session.amILoggedIn()
      .then((res) => {
        if (res.data) {
          dispatch(login(res.data));
        } else {
          dispatch(loginAnonymous());
        }
      })
      .finally(() => {
        setHasUser(true);
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
      <BeevenuePage>
        <Suspense fallback={fallback}>
          <Switch>
            <Route path="/" exact component={IndexPage} />
            <Route path="/search/:extra(.+)" component={SearchResultsPage} />
            <Route path="/show/:id" component={DetailPage} />
            <Route path="/tags" component={TagsPage} />
            <Route path="/tagStats" component={TagStatisticsPage} />
            <Route path="/stats" component={StatsPage} />
            <Route path="/tag/:name" component={TagDetailPage} />
            <Route path="/rules" component={RulesPage} />
            <Route path="/:whatever" component={WildcardPage} />
          </Switch>
        </Suspense>
      </BeevenuePage>
    </Router>
  );
};

export { AppRouter };
