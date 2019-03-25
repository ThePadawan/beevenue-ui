import {
  SET_SPEED_TAGGING,
  TOGGLE_SPEED_TAGGING_ITEM,
  CLEAR_SPEED_TAGGING_ITEMS
} from "../actionTypes";

const initialState = { isSpeedTagging: false, speedTaggingItems: [] };

const speedTagging = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case SET_SPEED_TAGGING:
      const newIsSpeedTagging = !state.isSpeedTagging;
      const result = { ...state, isSpeedTagging: newIsSpeedTagging };

      if (!newIsSpeedTagging) {
        result.speedTaggingItems = [];
      }

      return result;
    case CLEAR_SPEED_TAGGING_ITEMS:
      return {
        ...state,
        speedTaggingItems: []
      };
    case TOGGLE_SPEED_TAGGING_ITEM: {
      const speedTaggingItems = state.speedTaggingItems;
      const newItem = action.payload;

      const maybeIdx = speedTaggingItems.indexOf(newItem);
      if (maybeIdx > -1) {
        speedTaggingItems.splice(maybeIdx, 1);
      } else {
        speedTaggingItems.push(newItem);
      }

      return {
        ...state,
        speedTaggingItems
      };
    }
    default:
      return state;
  }
};

export const isSpeedTagging = (store: any) => {
  return store.isSpeedTagging;
};

export const getSpeedTaggingItems = (store: any) => {
  return store.speedTaggingItems;
};

export default speedTagging;