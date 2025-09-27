import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
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
    loginSuccess: (
      state,
      action: PayloadAction<User>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } =
  authSlice.actions;
export default authSlice.reducer;
