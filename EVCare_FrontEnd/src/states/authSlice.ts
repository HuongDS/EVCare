import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../models/AuthModel/authModel";
import type { User } from "../models/AuthModel/authModel";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutRedux: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutRedux } = authSlice.actions;
export default authSlice.reducer;
