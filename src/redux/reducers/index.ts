import { combineReducers } from "redux";
import fileUpload from "./fileUpload";
import login from "./login";
import search from "./search";
import notifications from "./notifications";
import redirect from "./redirect";
import speedTagging from "./speedTagging";
import refresh from "./refresh";

const rootStore = {
  fileUpload,
  login,
  search,
  notifications,
  redirect,
  speedTagging,
  refresh
};

export const rootReducer = combineReducers(rootStore);
