import { BeevenueStore } from "../storeTypes";
import { useSelector, TypedUseSelectorHook } from "react-redux";

export const useBeevenueSelector: TypedUseSelectorHook<BeevenueStore> = useSelector;

export const useIsSessionSfw = () =>
  useBeevenueSelector(store => store.login.sfwSession);
