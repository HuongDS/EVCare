import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "../models/States/UIStates";

const initialState: UIState = {
  loginFormOpen: false,
  createAppointmentFormOpen: false,
  actionAfterLogin: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLogin: (state) => {
      state.loginFormOpen = true;
    },
    closeLogin: (state) => {
      state.loginFormOpen = false;
    },
    openAppointmentForm: (state) => {
      state.createAppointmentFormOpen = true;
    },
    closeAppointmentForm: (state) => {
      state.createAppointmentFormOpen = false;
    },
    setAction: (state, action: PayloadAction<string>) => {
      state.actionAfterLogin = action.payload;
    },
    consumeAction: (state) => {
      state.actionAfterLogin = null;
    },
  },
});

export const { openLogin, openAppointmentForm, closeLogin, closeAppointmentForm, setAction, consumeAction } =
  uiSlice.actions;
export default uiSlice.reducer;
