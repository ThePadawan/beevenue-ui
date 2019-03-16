import { combineReducers } from "redux";
import fileUpload from "./fileUpload";
import login from "./login";
import search from "./search";
import notifications from "./notifications";
import redirect from "./redirect";

export default combineReducers({
  fileUpload,
  login,
  search,
  notifications,
  redirect
});
