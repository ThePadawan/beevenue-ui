import { SET_SHOULD_REFRESH } from "../actionTypes";
import { RefreshStore } from "../storeTypes";

const initialState: RefreshStore = { shouldRefresh: false };

const refresh = (state: RefreshStore = initialState, action: any): any => {
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

export default refresh;
