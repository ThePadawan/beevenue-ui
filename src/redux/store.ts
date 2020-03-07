import { createStore, Store } from "redux";
import { rootReducer } from "./reducers";
import { BeevenueNotificationMap } from "../notifications";

export interface FileUploadStore {
  lastFileUploaded: number;
}

interface IAnonymous {}
export const Anonymous: IAnonymous = {};
interface IUnknown {}
export const Unknown: IUnknown = {};

export type BeevenueUser = string | number | IAnonymous | IUnknown;

export interface LoginStore {
  loggedInUser: BeevenueUser;
  loggedInRole: string | null;
  sfwSession: boolean;

  serverVersion: string;
}

export interface NotificationStore {
  notifications: BeevenueNotificationMap;
}

export interface RedirectInfo {
  target: string;
  doReplace: boolean;
}

export interface RefreshStore {
  shouldRefresh: boolean;
}

export interface SearchStore {
  searchQuery: string;
}

export interface SpeedTaggingStore {
  isSpeedTagging: boolean;
  speedTaggingItems: any[];
}

export interface BeevenueStore extends Store {
  fileUpload: FileUploadStore;
  login: LoginStore;

  search: SearchStore;
  notifications: NotificationStore;
  speedTagging: SpeedTaggingStore;
  refresh: RefreshStore;
}

let preloaded: any = undefined;

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  preloaded =
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__();
}

const rootStore: BeevenueStore = createStore(rootReducer, preloaded);

export default rootStore;
