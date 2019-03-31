import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { debounce } from "lodash-es";
import { BeevenueSpinner } from "./fragments/beevenueSpinner";

import {
  IndexPage,
  SearchResultsPage,
  ShowPage,
  BatchUploadPage,
  TagStatisticsPage,
  TagShowPage,
  WildcardPage,
  InvestigateProblemsPage,
  RulesPage
} from "./pages";
import { Api } from "./api/api";
import { login, loginAnonymous, stopRedirecting } from "./redux/actions";
import { getRedirectionTarget } from "./redux/reducers/redirect";
import history from "./history";
import { RedirectToRandomRulesViolationPage } from "./pages/redirectToRandomRulesViolationPage";

interface AppRouterProps {
  login: typeof login;
  loginAnonymous: typeof loginAnonymous;
  redirecting: string | null;

  stopRedirecting?: typeof stopRedirecting;
}

class AppRouter extends Component<AppRouterProps, any, any> {
  constructor(props: AppRouterProps) {
    super(props);
    this.state = { HasUser: false };
  }

  setHasUserDebounced() {
    debounce(() => {
      this.setState({ HasUser: true });
    }, 100)();
  }

  componentDidMount() {
    Api.amILoggedIn().then(res => {
      if (res.data) {
        this.props.login(res.data);
        this.setHasUserDebounced();
      } else {
        this.props.loginAnonymous();
        this.setHasUserDebounced();
      }
    });
  }

  componentWillUpdate(newProps: AppRouterProps) {
    // To be nice, we clean up after ourselves and remove
    // the last redirection target

    if (this.props.redirecting) {
      history.push(this.props.redirecting);
    }

    if (newProps.redirecting) {
      const r = this.props.stopRedirecting;
      if (r) {
        r();
      }
    }
  }

  private get routes() {
    return (
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/search/:extra(.+)" component={SearchResultsPage} />
        <Route path="/show/:id" component={ShowPage} />
        <Route path="/upload" component={BatchUploadPage} />
        <Route path="/tags" component={TagStatisticsPage} />
        <Route path="/tag/:name" component={TagShowPage} />
        <Route path="/problems" component={InvestigateProblemsPage} />
        <Route
          path="/rules/violations/any"
          component={RedirectToRandomRulesViolationPage}
        />
        <Route path="/rules" component={RulesPage} />
        <Route path="/:whatever" component={WildcardPage} />
      </Switch>
    );
  }

  render() {
    if (!this.state.HasUser) {
      return (
        <div className="full-page-spinner">
          <div className="full-page-spinner-inner">
            <BeevenueSpinner />
          </div>
        </div>
      );
    }

    return <Router history={history}>{this.routes}</Router>;
  }
}

const mapStateToProps = (state: any) => {
  return {
    redirecting: getRedirectionTarget(state.redirect)
  };
};

const x = connect(
  mapStateToProps,
  { login, loginAnonymous, stopRedirecting }
)(AppRouter);
export { x as AppRouter };
