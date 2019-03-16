import { REDIRECT } from "../actionTypes";

const initialState = { target: null };

const redirect = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case REDIRECT: {
      return {
        ...state,
        target: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export const getRedirectionTarget = (store: any) => {
  return store.target;
};

export default redirect;
