import React, { FormEvent, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Api } from "../../api/api";
import { login } from "../../redux/actions";
import { BeevenueSpinner } from "../beevenueSpinner";

const useLoginSubmission = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = (
    event: FormEvent,
    isMounted: boolean,
    username: string,
    password: string
  ) => {
    setLoginInProgress(true);

    Api.login({ username, password })
      .then(res => {
        if (res.status === 200) {
          // The session cookie is set now.
          dispatch(login(res.data));
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setLoginInProgress(false);
      });

    event.preventDefault();
  };
  return { onSubmit, loginInProgress };
};

const getUsernameField = (setUsername: (p: string) => void) => {
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

const getPasswordField = (setPassword: (p: string) => void) => {
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

const useForm = (onSubmit: any, isMounted: boolean) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={e => onSubmit(e, isMounted, username, password)}>
      {getUsernameField(setUsername)}
      {getPasswordField(setPassword)}
      <div className="field">
        <button className="button">Login</button>
      </div>
    </form>
  );
};

const LoggedOutPanel = () => {
  const isMounted = useRef(true);
  const { onSubmit, loginInProgress } = useLoginSubmission();
  const form = useForm(onSubmit, isMounted.current);

  const renderLogin = () => {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Login</p>
        </div>
        <div className="card-content">
          <div className="content">{form}</div>
        </div>
      </div>
    );
  };

  if (loginInProgress) {
    isMounted.current = false;
    return <BeevenueSpinner />;
  }
  isMounted.current = true;
  return renderLogin();
};

export { LoggedOutPanel };
