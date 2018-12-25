import { ADD_NOTIFICATION, DISMISS_NOTIFICATION } from "../actionTypes";

const initialState = { notifications: [] };

const notifications = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      const newNotifications = {
        ...state.notifications
      };
      newNotifications[action.payload.id] = action.payload;
      return {
        ...state,
        notifications: newNotifications
      };
    }
    case DISMISS_NOTIFICATION: {
      const newNotifications = { ...state.notifications };
      delete newNotifications[action.payload];
      return { ...state, notifications: newNotifications };
    }
    default: {
      return state;
    }
  }
};

export const getNotifications = (store: any) => {
  return store.notifications;
};

export default notifications;
