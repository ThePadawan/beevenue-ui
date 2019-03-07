import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { debounce } from "lodash-es";
import { BeevenueSpinner } from "./fragments/beevenueSpinner";

import {
  IndexPage, SearchResultsPage, ShowPage, 
  BatchUploadPage, TagStatisticsPage, TagShowPage,
  WildcardPage 
} from "./pages";
import { Api } from "./api/api";
import { login, loginAnonymous, stopRedirecting } from "./redux/actions";
import { getRedirectionTarget } from "./redux/reducers/redirect";
import history from "./history";

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
    }, 500)();
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
    if (newProps.redirecting) {
      const r = this.props.stopRedirecting;
      if (r) {r()};
    }
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

    if (this.props.redirecting) {
      history.push(this.props.redirecting);
    }

    return (
      <Router history={history}>
          <Switch>
            <Route path="/" exact component={IndexPage} />
            <Route path="/search/:extra(.+)" component={SearchResultsPage} />
            <Route path="/show/:id" component={ShowPage} />
            <Route path="/upload" component={BatchUploadPage} />
            <Route path="/tags" component={TagStatisticsPage} />
            <Route path="/tag/:name" component={TagShowPage} />
            <Route path="/:whatever" component={WildcardPage} />
          </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { redirecting: getRedirectionTarget(state.redirect) }
}

const x = connect(
  mapStateToProps,
  { login, loginAnonymous, stopRedirecting }
)(AppRouter);
export { x as AppRouter };
