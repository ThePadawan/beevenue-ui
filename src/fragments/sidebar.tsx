import React, { Component } from "react";
import { connect } from "react-redux";

import { redirect, setSearchQuery } from "../redux/actions";

import { LoginPanel, SearchPanel, UploadPanel, LinksPanel } from "./panels";

import {
  getLoggedInUser,
  getLoggedInRole,
  BeevenueUser
} from "../redux/reducers/login";
import { Location } from "history";
import { SpeedTaggerPanel } from "./panels/speedTaggerPanel";

interface SidebarProps {
  location: Location;
  loggedInUser: BeevenueUser;
  loggedInRole: string | null;
  redirect: typeof redirect;
  setSearchQuery: typeof setSearchQuery;
}

class Sidebar extends Component<SidebarProps, any, any> {
  public constructor(props: SidebarProps) {
    super(props);
  }

  private get elements(): JSX.Element[] {
    const linksPanel = (
      <LinksPanel isAdmin={this.props.loggedInRole === "admin"} />
    );
    if (this.props.loggedInRole === "admin") {
      return [
        <SearchPanel {...this.props} />,
        <UploadPanel />,
        linksPanel,
        <LoginPanel />,
        <SpeedTaggerPanel />
      ];
    } else {
      return [<SearchPanel {...this.props} />, linksPanel, <LoginPanel />];
    }
  }

  private onHomeButtonClicked = (e: any) => {
    e.preventDefault();
    this.props.setSearchQuery("");
    this.props.redirect("/");
  };

  render() {
    return (
      <div>
        <nav className="level">
          <div className="level-item">
            <h2 className="title">
              <a href="#" onClick={e => this.onHomeButtonClicked(e)}>
                Home
              </a>
            </h2>
          </div>
        </nav>
        {this.elements.map((e, idx) => (
          <nav className="level" key={idx}>
            <div className="level-item">{e}</div>
          </nav>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    loggedInUser: getLoggedInUser(state.login),
    loggedInRole: getLoggedInRole(state.login)
  };
};

const x = connect(mapStateToProps, { redirect, setSearchQuery })(Sidebar);
export { x as Sidebar };
