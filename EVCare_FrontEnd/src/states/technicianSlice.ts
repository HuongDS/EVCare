import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  techId: 0,
};

const techSlice = createSlice({
  name: "tech",
  initialState,
  reducers: {
    setTechnicianId: (state, action: PayloadAction<number>) => {
      state.techId = action.payload;
    },
  },
});

export const { setTechnicianId } = techSlice.actions;
export default techSlice.reducer;
