import { RootState } from "./store";
import { useSelector } from "react-redux";

export const useCustomSelector = () => {
  return useSelector((state: RootState) => state);
};
