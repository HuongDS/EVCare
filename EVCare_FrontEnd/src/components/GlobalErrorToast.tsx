import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../states/store";
import { useEffect } from "react";
import { message } from "antd";
import { clearGlobalError } from "../states/errorSlice";

const GloabalErrorToast = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errorMessage = useSelector((state: RootState) => state.error.message);
  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
      dispatch(clearGlobalError());
    }
  }, [errorMessage, dispatch]);
  return null;
};

export default GloabalErrorToast;
