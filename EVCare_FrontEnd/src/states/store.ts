import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../states/authSlice";
import uiSlice from "../states/uiSlice";
import errorSlice from "../states/errorSlice";
import appointmentsSlice from "../states/appointmentSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    error: errorSlice,
    appointments: appointmentsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
