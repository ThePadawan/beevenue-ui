import React, { Component, FormEvent } from "react";
import { connect } from "react-redux";

import { Api } from "../../api/api";
import { login, logout, redirect } from "../../redux/actions";
import { getLoggedInUser, Anonymous, getServerVersion } from "../../redux/reducers/login";
import { SfwButton } from "../sfwButton";
import { BeevenueSpinner } from "../beevenueSpinner";

import { commitId } from "../../config.json"

interface LoginPanelState {
  username: string;
  password: string;

  loginInProgress: boolean;
}

interface LoginPanelProps
{
  login: typeof login;
  logout: typeof logout;
  redirect: typeof redirect;
  loggedInUser: string;

  serverVersion: string;
}


class LoginPanel extends Component<LoginPanelProps, LoginPanelState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { username: "", password: "", loginInProgress: false };
  }

  public submitLogin(event: FormEvent) {
    this.setState({ ...this.state, loginInProgress: true });

    Api.login(this.state).then(
      res => {
        if (res.status == 200) {
          // The session cookie is set now.
          this.props.login(res.data);
        }

        this.setState({ ...this.state, loginInProgress: false });
      },
      err => {
        this.setState({ ...this.state, loginInProgress: false });
      }
    );

    event.preventDefault();
  }

  public submitLogout(event: FormEvent) {
    event.preventDefault();
    this.setState({ ...this.state, loginInProgress: true });

    Api.logout().then(res => {
      if (res.status == 200) {
        // The session cookie is unset now.
        this.props.logout();
        this.props.redirect("/");
      }
        this.setState({ ...this.state, loginInProgress: false });
    }, err => {
      this.setState({ ...this.state, loginInProgress: false });
    });
  }

  public handlePasswordChange(event: FormEvent<HTMLInputElement>) {
    this.setState({
      ...this.state,
      password: event.currentTarget.value
    });
  }

  public handleUsernameChange(event: FormEvent<HTMLInputElement>) {
    this.setState({
      ...this.state,
      username: event.currentTarget.value
    });
  }

  private renderLogin() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Login</p>
        </div>
        <div className="card-content">
        <div className="content">
          <form onSubmit={e => this.submitLogin(e)}>
            <div className="field">
              <input
                className="input"
                type="text"
                name="username"
                placeholder="Username"
                onChange={e => this.handleUsernameChange(e)}
              />
            </div>
            <div className="field">
              <input
                className="input"
                autoComplete="current-password"
                type="password"
                name="password"
                placeholder="Password"
                onChange={e => this.handlePasswordChange(e)}
              />
            </div>
            <div className="field">
              <button className="button">Login</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  private renderLogout() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Logout</p>
        </div>
        <div className="card-content">
        <div className="content">
          <SfwButton />
          <div>
            Server version: {this.props.serverVersion}
          </div>
          <div>
            UI version: {commitId}
          </div>
          <div>
            <form onSubmit={e => this.submitLogout(e)}>
              <div className="field">
                <button className="button">Logout</button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.loginInProgress) {
      return <BeevenueSpinner />;
    }
    if (this.props.loggedInUser == Anonymous) {
      return this.renderLogin();
    } else {
      return this.renderLogout();
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    loggedInUser: getLoggedInUser(state.login),
    serverVersion: getServerVersion(state.login)
  };
};

const x = connect(
  mapStateToProps,
  { login, logout, redirect }
)(LoginPanel);
export { x as LoginPanel };
