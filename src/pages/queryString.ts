import qs from "qs";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { redirect } from "../redux/actions";

interface QueryStringRedirectParameters {
  pageNr: number;
  pageSize?: number;
}

export const useQueryStringRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const f = (q: QueryStringRedirectParameters) => {
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
  };

  return f;
};
