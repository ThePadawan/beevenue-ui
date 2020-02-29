import { useDispatch } from "react-redux";
import { useEffect } from "react";
import history from "./history";
import { useBeevenueSelector } from "./redux/selectors";
import { stopRedirecting } from "./redux/actions";

export const useRedirect = () => {
  const dispatch = useDispatch();
  const redirection = useBeevenueSelector(store => store.redirect.redirection);

  useEffect(() => {
    const r = redirection;

    // TODO Check history.location.pathname !== r.target carefully.

    if (r) {
      if (r.doReplace) {
        history.replace(r.target);
      } else {
        history.push(r.target);
      }

      dispatch(stopRedirecting());
    }
  }, [redirection, dispatch]);
};
