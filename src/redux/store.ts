import { createStore } from "redux";
import { rootReducer } from "./reducers";
import { BeevenueStore } from "./storeTypes";

let preloaded: any = undefined;

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  preloaded =
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__();
}

const rootStore: BeevenueStore = createStore(rootReducer, preloaded);
export default rootStore;
