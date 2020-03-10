import { NEW_SEARCH_QUERY } from "../actionTypes";
import { SearchStore } from "../storeTypes";

const initialState: SearchStore = { searchQuery: "" };

const search = (state: SearchStore = initialState, action: any): any => {
  switch (action.type) {
    case NEW_SEARCH_QUERY: {
      return {
        ...state,
        searchQuery: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default search;
