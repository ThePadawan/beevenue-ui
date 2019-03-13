import React, { Component } from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import { LoginPanel, SearchPanel, UploadPanel, LinksPanel } from "./panels";

import {
  getLoggedInUser,
  getLoggedInRole,
  BeevenueUser,
} from "../redux/reducers/login";
import { Location } from "history";

interface SidebarProps {
  location: Location;
  loggedInUser: BeevenueUser;
  loggedInRole: string | null;
}

class Sidebar extends Component<SidebarProps, any, any> {
  public constructor(props: SidebarProps) {
    super(props);
  }

  render() {
    let elements: JSX.Element[];
    if (this.props.loggedInRole === 'admin') {
      elements = [
        <SearchPanel {...this.props} />,
        <UploadPanel />,
        <LinksPanel />,
        <LoginPanel />
      ];
    } else {
      elements = [
        <SearchPanel {...this.props} />,
        <LoginPanel />
      ];
    }

    return (
      <div>
        <nav className="level">
          <div className="level-item">
            <h2 className="title">
              <Link to="/">Home</Link>
            </h2>
          </div>
        </nav>
        {elements.map((e, idx) => (
        <nav className="level" key={idx}>
          <div className="level-item">
            {e}
          </div>
        </nav>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { loggedInUser: getLoggedInUser(state.login), loggedInRole: getLoggedInRole(state.login) };
};

const x = connect(
  mapStateToProps,
  null
)(Sidebar);
export { x as Sidebar };
