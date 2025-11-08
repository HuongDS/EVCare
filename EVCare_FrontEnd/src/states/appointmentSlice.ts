import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AppointmentProgressState } from "../models/States/AppointmentState";

const initialState: AppointmentProgressState = {};

const appointmentsSlice = createSlice({
  name: "appoinments",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<{ id: number; step: number }>) {
      state[action.payload.id] = action.payload.step;
    },
  },
});

export const { setStep } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
