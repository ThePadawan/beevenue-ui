import qs from "qs";
import { Location } from "history";

interface AddToQsContext {
  location: Location;
  redirect: (s: string) => void;
}

export const addToQs = (context: AddToQsContext, q: object): void => {
  const currentLocation = context.location;
  const currentQs = qs.parse(context.location.search, {
    ignoreQueryPrefix: true
  });
  const newQs = { ...currentQs, ...q };
  const newLocation = {
    ...currentLocation,
    search: qs.stringify(newQs, { addQueryPrefix: true })
  };

  context.redirect(newLocation.pathname + newLocation.search);
};
