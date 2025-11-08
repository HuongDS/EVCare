import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../states/authSlice";
import uiSlice from "../states/uiSlice";
import errorSlice from "../states/errorSlice";

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authSlice,
      ui: uiSlice,
      error: errorSlice,
    },
    preloadedState,
  });
}
