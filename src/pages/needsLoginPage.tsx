import React from "react";
import { connect } from "react-redux";

import { addNotLoggedInNotification, redirect } from "../redux/actions";
import { getLoggedInUser, getLoggedInRole } from "../redux/reducers/login";
import { BeevenuePage, BeevenuePageProps } from "./beevenuePage";

interface NeedsLoginPageProps extends BeevenuePageProps {
  addNotLoggedInNotification: typeof addNotLoggedInNotification;
  redirect: typeof redirect;
  IsLoggedIn: boolean;
  loggedInRole: string | null;
}

class NeedsLoginPage<
  P extends Readonly<NeedsLoginPageProps> = Readonly<NeedsLoginPageProps>,
  S extends Readonly<any> = Readonly<any>,
  SS = any
> extends BeevenuePage<P, S, SS> {
  public constructor(props: P) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.IsLoggedIn || this.props.loggedInRole !== "admin") {
      this.props.addNotLoggedInNotification();
      this.props.redirect("/");
    }
  }
}

const mapStateToProps = (state: any): NeedsLoginPageProps => {
  return {
    ...state,
    IsLoggedIn: typeof getLoggedInUser(state.login) === "string",
    loggedInRole: getLoggedInRole(state.login)
  };
};

const x = connect(
  mapStateToProps,
  { addNotLoggedInNotification, redirect }
)(NeedsLoginPage);
export { x as NeedsLoginPage };
