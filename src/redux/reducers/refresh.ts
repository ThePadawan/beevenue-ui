import { SET_SHOULD_REFRESH } from "../actionTypes";

const initialState = { shouldRefresh: false };

const refresh = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case SET_SHOULD_REFRESH:
      return {
        ...state,
        shouldRefresh: action.payload
      };
    default:
      return state;
  }
};

export const shouldRefresh = (store: any) => {
  return store.shouldRefresh;
};

export default refresh;
