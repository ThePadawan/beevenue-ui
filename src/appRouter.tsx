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
  const [countdown, setCountdown] = useState<number>(-1);
  const [hasUser, setHasUser] = useState(false);
  const dispatch = useDispatch();

  const tryLoggingIn = () => {
    Api.Session.amILoggedIn()
      .then((res) => {
        if (res.data) {
          dispatch(login(res.data));
        } else {
          dispatch(loginAnonymous());
        }
        setHasUser(true);
      })
      .catch((err) => {
        let count = 10;

        const interval = setInterval(() => {
          if (count > 0) {
            setCountdown(--count);
          } else {
            tryLoggingIn();
            clearInterval(interval);
          }
        }, 1000);
      });
  };

  useEffect(tryLoggingIn, [dispatch]);

  const statusText =
    countdown > 0
      ? `Could not connect to backend. Retrying in ${countdown}s…`
      : "Placeholder text";

  const statusClassName =
    countdown > 0
      ? "full-page-spinner-status-retrying"
      : "full-page-spinner-status-none";

  const fallback = (
    <div className="full-page-spinner">
      <div className="full-page-spinner-inner">
        <div className="full-page-spinner-innermost">
          <BeevenueSpinner />
        </div>
        <div>
          <p className={statusClassName}>{statusText}</p>
        </div>
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
