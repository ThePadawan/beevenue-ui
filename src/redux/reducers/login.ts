import { LOGIN, LOGOUT, LOGIN_ANONYMOUS, SET_SFW_SESSION } from "../actionTypes";

interface IAnonymous {}
export const Anonymous: IAnonymous = {};
interface IUnknown {}
export const Unknown: IUnknown = {};

export type BeevenueUser = string | number | IAnonymous | IUnknown;

interface BeevenueStore {
  loggedInUser: BeevenueUser;
  loggedInRole: string | null;
  sfwSession: boolean;

  serverVersion: string;
}

const initialState = { loggedInUser: Unknown, loggedInRole: null, sfwSession: true, serverVersion: 'unknown' };

const login = (
  state: BeevenueStore = initialState,
  action: any
): BeevenueStore => {
  switch (action.type) {
    case LOGIN: {
      const result = {
        ...state,
        loggedInUser: action.payload.id,
        loggedInRole: action.payload.role,
        serverVersion: action.payload.version,
        sfwSession: action.payload.sfwSession
      };
      return result;

    }
    case LOGIN_ANONYMOUS: {
      return {
        ...state,
        loggedInUser: Anonymous,
        loggedInRole: null
      };
    }
    case LOGOUT: {
      return {
        ...state,
        loggedInUser: Anonymous,
        loggedInRole: null
      };
    }
    case SET_SFW_SESSION: {
      return {
        ...state,
        sfwSession: action.payload
      }
    }
    default: {
      return state;
    }
  }
};

export const getLoggedInUser = (store: BeevenueStore) => {
  return store.loggedInUser;
};

export const getLoggedInRole = (store: BeevenueStore) => {
  return store.loggedInRole;
};

export const isSessionSfw = (store: BeevenueStore) => {
  return store.sfwSession;
}

export const getServerVersion = (store: BeevenueStore) => {
  return store.serverVersion;
}

export default login;
