import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";

export const useCustomDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  return dispatch;
};
