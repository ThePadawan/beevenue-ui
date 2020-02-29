import React, { FormEvent, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Api } from "../../api/api";
import { login, logout, redirect } from "../../redux/actions";
import { SfwButton } from "../sfwButton";
import { BeevenueSpinner } from "../beevenueSpinner";

import { commitId } from "../../config.json";
import { Anonymous } from "../../redux/store";
import { useBeevenueSelector } from "../../redux/selectors";

const LoginPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);

  const loggedInUser = useBeevenueSelector(store => store.login.loggedInUser);
  const serverVersion = useBeevenueSelector(store => store.login.serverVersion);

  const dispatch = useDispatch();

  const isMounted = useRef(true);

  const finish = () => {
    if (!isMounted.current) return;
    setLoginInProgress(false);
  };

  const submitLogin = (event: FormEvent) => {
    setLoginInProgress(true);

    Api.login({ username, password })
      .then(res => {
        if (res.status === 200) {
          // The session cookie is set now.
          dispatch(login(res.data));
        }
      })
      .finally(finish);

    event.preventDefault();
  };

  const submitLogout = (event: FormEvent) => {
    event.preventDefault();
    setLoginInProgress(true);

    Api.logout()
      .then(res => {
        if (res.status === 200) {
          // The session cookie is unset now.
          dispatch(logout());
          dispatch(redirect("/"));
        }
      })
      .finally(finish);
  };

  const getUsernameField = () => {
    return (
      <div className="field">
        <input
          className="input"
          type="text"
          name="beevenue-username"
          placeholder="Username"
          onChange={e => setUsername(e.currentTarget.value)}
        />
      </div>
    );
  };

  const getPasswordField = () => {
    return (
      <div className="field">
        <input
          className="input"
          autoComplete="current-password"
          type="password"
          name="beevenue-password"
          placeholder="Password"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </div>
    );
  };

  const getForm = () => {
    return (
      <form onSubmit={e => submitLogin(e)}>
        {getUsernameField()}
        {getPasswordField()}
        <div className="field">
          <button className="button">Login</button>
        </div>
      </form>
    );
  };

  const renderLogin = () => {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Login</p>
        </div>
        <div className="card-content">
          <div className="content">{getForm()}</div>
        </div>
      </div>
    );
  };

  const renderLogout = () => {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Logout</p>
        </div>
        <div className="card-content">
          <div className="content">
            <SfwButton />
            <div>Server version: {serverVersion}</div>
            <div>UI version: {commitId}</div>
            <div>
              <form onSubmit={e => submitLogout(e)}>
                <div className="field">
                  <button className="button">Logout</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loginInProgress) {
    isMounted.current = false;
    return <BeevenueSpinner />;
  }
  isMounted.current = true;

  if (loggedInUser === Anonymous) {
    return renderLogin();
  } else {
    return renderLogout();
  }
};

export { LoginPanel };
