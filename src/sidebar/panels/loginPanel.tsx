import React from "react";
import { Anonymous } from "../../redux/storeTypes";
import { useBeevenueSelector } from "../../redux/selectors";
import { LoggedInPanel } from "./loggedInPanel";
import { LoggedOutPanel } from "./loggedOutPanel";

const LoginPanel = () => {
  const loggedInUser = useBeevenueSelector(store => store.login.loggedInUser);

  if (loggedInUser === Anonymous) {
    return <LoggedOutPanel />;
  } else {
    return <LoggedInPanel />;
  }
};

export { LoginPanel };
