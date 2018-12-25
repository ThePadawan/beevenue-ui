import {
  LOGIN,
  LOGIN_ANONYMOUS,
  LOGOUT,
  NEW_SEARCH_RESULTS,
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  NEW_SEARCH_QUERY,
  REDIRECT,
  SET_SFW_SESSION,
  SET_FILE_UPLOADED
} from "./actionTypes";
import {
  BeevenueNotificationId,
  BeevenueNotificationTemplate,
  makeNotificationFromTemplate
} from "../notifications";

interface LoginDetails
{
  id: string;
  sfwSession: boolean;
}

export const login = (loginDetails: LoginDetails) => {
  return {
    type: LOGIN,
    payload: loginDetails
  };
};

export const setSfwSession = (sfw: boolean) => {
  return {
    type: SET_SFW_SESSION,
    payload: sfw
  }
}

export const loginAnonymous = () => {
  return {
    type: LOGIN_ANONYMOUS
  };
};

export const logout = () => ({
  type: LOGOUT,
  payload: {}
});

export const addSearchResults = (searchResults: any[]) => ({
  type: NEW_SEARCH_RESULTS,
  payload: searchResults
});

export const setSearchQuery = (query: string) => ({
  type: NEW_SEARCH_QUERY,
  payload: query
});

export const addNotification = (
  notificationTemplate: BeevenueNotificationTemplate
) => ({
  type: ADD_NOTIFICATION,
  payload: makeNotificationFromTemplate(notificationTemplate)
});

export const addNotLoggedInNotification = () =>
  addNotification({
    level: "error",
    contents: ["You must log in to access this page."]
  });

export const dismissNotification = (id: BeevenueNotificationId) => ({
  type: DISMISS_NOTIFICATION,
  payload: id
});

export const stopRedirecting = () => ({
  type: REDIRECT,
  payload: null
});

export const redirect = (location: string) => ({
  type: REDIRECT,
  payload: location
});

export const setFileUploaded = () => ({
  type: SET_FILE_UPLOADED,
  payload: +new Date()
})