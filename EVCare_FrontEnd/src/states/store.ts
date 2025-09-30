import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../states/authSlice";
import uiSlice from "../states/uiSlice";
import errorSlice from "../states/errorSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    error: errorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
