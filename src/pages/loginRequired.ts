import { useEffect } from "react";

import { addNotLoggedInNotification, redirect } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";

const useLoginRequired = () => {
  const loggedInRole = useBeevenueSelector(store => {
    return store.login.loggedInRole;
  });

  const isLoggedIn = useBeevenueSelector(store => {
    return typeof store.login.loggedInUser === "string";
  });

  useEffect(() => {
    if (!isLoggedIn || loggedInRole !== "admin") {
      addNotLoggedInNotification();
      redirect("/", true);
    }
  });
};
export { useLoginRequired };
