import {
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  DISMISS_ALL_NOTIFICATIONS
} from "../actionTypes";
import { NotificationStore } from "../storeTypes";

const initialState: NotificationStore = {
  notifications: {}
};

const notifications = (
  state: NotificationStore = initialState,
  action: any
): any => {
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
    case DISMISS_ALL_NOTIFICATIONS: {
      return { ...state, notifications: {} };
    }
    default: {
      return state;
    }
  }
};

export default notifications;
