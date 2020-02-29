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
    if (r && history.location.pathname !== r.target) {
      if (r.doReplace) {
        history.replace(r.target);
      } else {
        history.push(r.target);
      }
      dispatch(stopRedirecting());
    }
  }, [redirection, dispatch]);
};
