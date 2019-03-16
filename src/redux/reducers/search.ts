import { NEW_SEARCH_RESULTS, NEW_SEARCH_QUERY } from "../actionTypes";

const initialState = { searchResults: null, searchQuery: "" };

const search = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case NEW_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.payload
      };
    }
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

export const getSearchQuery = (store: any) => {
  return store.searchQuery;
};

export const getSearchResults = (store: any) => {
  return store.searchResults;
};

export default search;
