import { useSelector } from "react-redux";

import { RootState } from "./store";

export const useCustomSelector = () => {
  return useSelector((state: RootState) => state);
};
