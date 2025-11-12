import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "../models/States/UIStates";

const initialState: UIState = {
  loginFormOpen: false,
  createAppointmentFormOpen: false,
  actionAfterLogin: null,
  messagePopUpOpen: false,
  model3dOpen: false,
  model3dData: null,
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
    openMessagePopUp: (state) => {
      state.messagePopUpOpen = true;
    },
    closeMassagePopUp: (state) => {
      state.messagePopUpOpen = false;
    },
    openModel3d: (state, action: PayloadAction<number>) => {
      state.model3dOpen = true;
      state.model3dData = action.payload;
    },
    closeModel3d: (state) => {
      state.model3dOpen = false;
      state.model3dData = null;
    },
  },
});

export const {
  openLogin,
  openAppointmentForm,
  closeLogin,
  closeAppointmentForm,
  setAction,
  consumeAction,
  openModel3d,
  closeModel3d,
} = uiSlice.actions;
export default uiSlice.reducer;
