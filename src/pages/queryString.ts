import qs from "qs";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { redirect } from "../redux/actions";
import { useCallback } from "react";

interface QueryStringRedirectParameters {
  pageNr: number;
  pageSize?: number;
}

export const useQueryStringRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const f = useCallback(
    (q: QueryStringRedirectParameters) => {
      const currentLocation = location;
      const currentQs = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });
      const newQs = { ...currentQs, ...q };
      const newLocation = {
        ...currentLocation,
        search: qs.stringify(newQs, { addQueryPrefix: true })
      };

      dispatch(redirect(newLocation.pathname + newLocation.search));
    },
    [location, dispatch]
  );

  return f;
};
