import React from "react";
import { useDispatch } from "react-redux";

import { redirect, setSearchQuery } from "../redux/actions";

import { LoginPanel, SearchPanel, UploadPanel, LinksPanel } from "./panels";

import { SpeedTaggerPanel } from "./panels/speedTaggerPanel";
import { Anonymous } from "../redux/store";
import { useBeevenueSelector } from "../redux/selectors";

const Sidebar = () => {
  const loggedInUser = useBeevenueSelector(store => store.login.loggedInUser);
  const loggedInRole = useBeevenueSelector(store => store.login.loggedInRole);

  const dispatch = useDispatch();

  const getElements = (): JSX.Element[] => {
    const linksPanel = <LinksPanel isAdmin={loggedInRole === "admin"} />;
    const searchPanel = <SearchPanel />;
    const loginPanel = <LoginPanel />;

    if (loggedInRole === "admin") {
      return [
        searchPanel,
        <UploadPanel />,
        linksPanel,
        loginPanel,
        <SpeedTaggerPanel />
      ];
    } else if (loggedInUser === Anonymous) {
      return [loginPanel];
    } else {
      return [searchPanel, linksPanel, loginPanel];
    }
  };

  const onHomeButtonClicked = (e: any) => {
    e.preventDefault();
    dispatch(setSearchQuery(""));
    dispatch(redirect("/"));
  };

  return (
    <div className="beevenue-sidebar">
      <nav className="level beevenue-home">
        <div className="level-item">
          <h2 className="title">
            <a href="#" onClick={e => onHomeButtonClicked(e)}>
              Home
            </a>
          </h2>
        </div>
      </nav>
      {getElements().map((e, idx) => (
        <nav className="level" key={idx}>
          <div className="level-item">{e}</div>
        </nav>
      ))}
    </div>
  );
};

export { Sidebar };
