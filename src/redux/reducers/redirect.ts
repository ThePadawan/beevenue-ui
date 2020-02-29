import { REDIRECT } from "../actionTypes";
import { RedirectStore } from "../store";

const initialState: RedirectStore = { redirection: null };

const redirect = (state: RedirectStore = initialState, action: any): any => {
  switch (action.type) {
    case REDIRECT: {
      return {
        ...state,
        redirection: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default redirect;
