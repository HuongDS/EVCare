import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../states/authSlice";
import uiReducer from "../states/uiSlice";
import appointmentReducer from "../states/appointmentSlice";
import errorReducer from "../states//errorSlice";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import type { JSX, PropsWithChildren } from "react";
import type { RootState } from "../states/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
}

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      error: errorReducer,
      appointments: appointmentReducer,
    } as any,
    preloadedState,
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
